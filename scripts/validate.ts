// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The gate. Walks every curriculum folder at the repo root and fails on anything that is not the catalog
 * shape: an unknown folder, a file outside the allow-list, a JSON file that
 * does not parse against its schema, a scope that disagrees with its path, a
 * curriculum.json that disagrees with the folders, or a binary that is not in
 * assets.lock.json.
 *
 *   pnpm validate               # all curricula
 *   pnpm validate sd            # one curriculum
 *   pnpm validate --examples 20 # show more examples per rule
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

import type { z } from "zod"

import { SCHEMAS, type Structure } from "../schema/index.ts"
import {
  BINARY_EXT,
  BINARY_FILES,
  SUBJECT_DIRS,
  TEXT_FILES,
  pathToKey,
  subjectId,
} from "../src/paths.ts"
import { REPO, contentDirs } from "./lib/tree.ts"
import { CURRICULA, GRADES, PUBLISHERS, parseSubject } from "./lib/vocab.ts"

const ROOT = REPO

const args = process.argv.slice(2)
const exIdx = args.indexOf("--examples")
const EXAMPLES = exIdx >= 0 ? Number(args[exIdx + 1]) : 5
const only = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--examples")

const lock: Record<string, unknown> = existsSync(join(REPO, "assets.lock.json"))
  ? (JSON.parse(readFileSync(join(REPO, "assets.lock.json"), "utf8")).assets ?? {})
  : {}

const problems = new Map<string, string[]>()
function fail(rule: string, where: string, detail = "") {
  const list = problems.get(rule) ?? []
  list.push(detail ? `${where} — ${detail}` : where)
  problems.set(rule, list)
}

const rel = (p: string) => relative(REPO, p)
const ls = (p: string) => readdirSync(p).filter((n) => n !== ".DS_Store")
const isDir = (p: string) => statSync(p).isDirectory()

function parse<K extends keyof typeof SCHEMAS>(
  kind: K,
  file: string
): z.infer<(typeof SCHEMAS)[K]> | null {
  let raw: unknown
  try {
    raw = JSON.parse(readFileSync(file, "utf8"))
  } catch (e) {
    fail("json.syntax", rel(file), String(e))
    return null
  }
  const r = SCHEMAS[kind].safeParse(raw)
  if (!r.success) {
    const issue = r.error.issues[0]!
    fail(`schema.${kind}`, rel(file), `${issue.path.join(".") || "(root)"}: ${issue.message}`)
    return null
  }
  return r.data as z.infer<(typeof SCHEMAS)[K]>
}

function checkBinary(file: string) {
  const key = pathToKey(rel(file))
  if (!(key in lock)) fail("assets.unlocked", rel(file), "binary not in assets.lock.json")
}

function checkAssessments(dir: string, scope: Record<string, string>) {
  let ids = new Set<string>()
  const qb = join(dir, "qbank.json")
  if (existsSync(qb)) {
    const q = parse("qbank", qb)
    if (q) {
      if (JSON.stringify(q.scope) !== JSON.stringify(scope))
        fail("scope.mismatch", rel(qb), `scope ${JSON.stringify(q.scope)} ≠ path`)
      ids = new Set(q.questions.map((x) => x.id))
      if (ids.size !== q.questions.length) fail("qbank.duplicate-id", rel(qb))
    }
  }
  const ex = join(dir, "exams.json")
  if (existsSync(ex)) {
    const e = parse("exams", ex)
    if (e) {
      if (JSON.stringify(e.scope) !== JSON.stringify(scope))
        fail("scope.mismatch", rel(ex), `scope ${JSON.stringify(e.scope)} ≠ path`)
      for (const exam of e.exams)
        for (const qid of exam.questionIds ?? [])
          if (!ids.has(qid)) fail("exams.dangling-question", rel(ex), `${exam.id} → ${qid}`)
    }
  }
}

function checkSubject(dir: string, cur: string, grade: string, subject: string) {
  if (!parseSubject(subject))
    fail("name.subject", rel(dir), `"${subject}" is not in vocab/subjects.json`)

  const structFile = join(dir, "structure.json")
  if (!existsSync(structFile)) {
    fail("structure.missing", rel(dir))
    return
  }
  const s = parse("structure", structFile) as Structure | null
  const scope = { curriculum: cur, grade, subject }
  if (s) {
    for (const [k, v] of Object.entries(scope))
      if ((s as Record<string, unknown>)[k] !== v)
        fail(
          "structure.identity",
          rel(structFile),
          `${k}=${(s as Record<string, unknown>)[k]} but folder says ${v}`
        )
    if (s.id !== subjectId(cur, grade, subject))
      fail("structure.identity", rel(structFile), `id=${s.id}`)
    if (!PUBLISHERS.has(s.source.publisher))
      fail("vocab.publisher", rel(structFile), s.source.publisher)
    for (const c of s.contributors)
      if (!PUBLISHERS.has(c)) fail("vocab.publisher", rel(structFile), c)
    // Positional ids: the i-th chapter is c<i>, the i-th lesson in it is l<i>.
    s.chapters.forEach((ch, ci) => {
      if (ch.slug !== `c${ci + 1}`)
        fail(
          "structure.position",
          rel(structFile),
          `chapter ${ci + 1} is "${ch.slug}", expected c${ci + 1}`
        )
      ch.lessons.forEach((l, li) => {
        if (l.slug !== `l${li + 1}`)
          fail(
            "structure.position",
            rel(structFile),
            `${ch.slug} lesson ${li + 1} is "${l.slug}", expected l${li + 1}`
          )
      })
    })
    const chSlugs = new Set<string>()
    for (const ch of s.chapters) {
      if (chSlugs.has(ch.slug)) fail("structure.duplicate-slug", rel(structFile), ch.slug)
      chSlugs.add(ch.slug)
      const lSlugs = new Set<string>()
      for (const l of ch.lessons) {
        if (lSlugs.has(l.slug))
          fail("structure.duplicate-slug", rel(structFile), `${ch.slug}/${l.slug}`)
        lSlugs.add(l.slug)
      }
    }
  }
  checkAssessments(dir, scope)

  const chapters = new Map(
    (s?.chapters ?? []).map((c) => [c.slug, new Set(c.lessons.map((l) => l.slug))])
  )
  for (const name of ls(dir)) {
    const p = join(dir, name)
    if (isDir(p)) {
      if (name in SUBJECT_DIRS) {
        const re = SUBJECT_DIRS[name as keyof typeof SUBJECT_DIRS]
        for (const f of ls(p)) {
          if (!re.test(f)) fail("file.unexpected", rel(join(p, f)))
          else if (BINARY_EXT.test(f)) checkBinary(join(p, f))
        }
        continue
      }
      if (!chapters.has(name)) {
        fail("tree.unknown-dir", rel(p), "not a chapter in structure.json")
        continue
      }
      checkAssessments(p, { ...scope, chapter: name })
      for (const lname of ls(p)) {
        const lp = join(p, lname)
        if (!isDir(lp)) {
          if (!(TEXT_FILES.chapter as readonly string[]).includes(lname))
            fail("file.unexpected", rel(lp))
          continue
        }
        if (!chapters.get(name)!.has(lname)) {
          fail("tree.unknown-dir", rel(lp), "not a lesson in structure.json")
          continue
        }
        const files = ls(lp)
        if (files.length === 0) fail("tree.empty-dir", rel(lp))
        for (const f of files)
          if (!(TEXT_FILES.lesson as readonly string[]).includes(f))
            fail("file.unexpected", rel(join(lp, f)))
        checkAssessments(lp, { ...scope, chapter: name, lesson: lname })
      }
      continue
    }
    if ((TEXT_FILES.subject as readonly string[]).includes(name)) continue
    if ((BINARY_FILES as readonly string[]).includes(name)) {
      checkBinary(p)
      continue
    }
    fail("file.unexpected", rel(p))
  }
}

function checkCurriculum(cur: string) {
  const dir = join(ROOT, cur)
  if (!CURRICULA.has(cur)) fail("name.curriculum", rel(dir), "not in vocab/curricula.json")
  const cfile = join(dir, "curriculum.json")
  const c = existsSync(cfile)
    ? parse("curriculum", cfile)
    : (fail("curriculum.missing", rel(dir)), null)
  if (c && c.id !== cur) fail("curriculum.identity", rel(cfile), `id=${c.id}`)

  const onDisk: Record<string, string[]> = {}
  for (const g of ls(dir)) {
    const gp = join(dir, g)
    if (!isDir(gp)) {
      if (g !== "curriculum.json") fail("file.unexpected", rel(gp))
      continue
    }
    if (!GRADES.has(g)) {
      fail("name.grade", rel(gp))
      continue
    }
    onDisk[g] = []
    for (const s of ls(gp)) {
      const sp = join(gp, s)
      if (!isDir(sp)) {
        fail("file.unexpected", rel(sp))
        continue
      }
      onDisk[g].push(s)
      checkSubject(sp, cur, g, s)
    }
  }
  if (c) {
    for (const g of new Set([...Object.keys(onDisk), ...Object.keys(c.grades)])) {
      const a = [...(onDisk[g] ?? [])].sort().join(",")
      const b = [...(c.grades[g] ?? [])].sort().join(",")
      if (a !== b)
        fail("curriculum.grades-drift", `${rel(cfile)} ${g}`, `disk [${a}] ≠ declared [${b}]`)
    }
    const staged = c.stages.flatMap((s) => s.grades)
    for (const g of Object.keys(onDisk))
      if (!staged.includes(g)) fail("curriculum.stage-missing", rel(cfile), g)
  }
}

for (const name of contentDirs(ROOT)) {
  if (only.length && !only.includes(name)) continue
  checkCurriculum(name)
}
for (const key of Object.keys(lock)) if (!key.startsWith("catalog/")) fail("assets.bad-key", key)

let total = 0
for (const [rule, list] of [...problems].sort()) {
  total += list.length
  console.log(`✗ ${rule}  (${list.length})`)
  for (const x of list.slice(0, EXAMPLES)) console.log(`    ${x}`)
  if (list.length > EXAMPLES) console.log(`    … ${list.length - EXAMPLES} more`)
}
console.log(total ? `\n${total} problem(s)` : "✓ catalog is valid")
process.exit(total ? 1 : 0)
