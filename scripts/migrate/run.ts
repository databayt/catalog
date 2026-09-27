// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * One-off restructure: legacy `hogwarts/curriculum/` tree -> the canonical tree
 * at the repo root (which mirrors catalog/ on the CDN).
 *
 * Idempotent: it rebuilds the curriculum folders (and `.work/`) from the untouched legacy
 * tree on every run, so it can be re-run after any rule changes. Binaries are
 * APFS-cloned (copy-on-write: instant, no extra disk, independent of the source).
 *
 *   pnpm migrate --from /Users/abdout/hogwarts/curriculum           # dry run: report only
 *   pnpm migrate --from /Users/abdout/hogwarts/curriculum --write   # rebuild the curriculum folders
 *
 * Outputs (with --write):
 *   <cur>/**                             the canonical tree
 *   .work/<cur>/<grade>/<subject>/**     textbook-pipeline scratch (gitignored)
 *   scripts/migrate/renames.json         every old -> new path, slug and DB slug
 *   scripts/migrate/report.md            what was kept, renamed, archived and dropped
 */

import {
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, relative } from "node:path"

import { SCHEMAS } from "../../schema/index.ts"
import { subjectId } from "../../src/paths.ts"
import {
  CURRICULA,
  SUBJECT_ALIAS,
  gradeOrder,
  parseSubject,
  subjectTitle,
  SUBJECTS,
} from "../lib/vocab.ts"

// ---------------------------------------------------------------- cli

const args = process.argv.slice(2)
const flag = (n: string) => args.includes(n)
const opt = (n: string) => {
  const i = args.indexOf(n)
  return i >= 0 ? args[i + 1] : undefined
}
const FROM = opt("--from") ?? "/Users/abdout/hogwarts/curriculum"
const WRITE = flag("--write")
const REPO = join(import.meta.dirname, "..", "..")
/** The repo root mirrors catalog/ on the CDN: each curriculum is a top-level folder. */
const OUT = REPO
const WORK = join(REPO, ".work")
const DATA = join(import.meta.dirname, "data")

// ---------------------------------------------------------------- maps

/** Legacy tree dir -> curriculum id, plus the DB slug prefix hogwarts seeded it under. */
const CURRICULUM_DIRS: Record<string, { id: string; dbPrefix: string; publisher: string }> = {
  sd: { id: "sd", dbPrefix: "sd", publisher: "sd-ncerd" },
  uk: { id: "gb", dbPrefix: "gb", publisher: "aldar" },
  us: { id: "us", dbPrefix: "us", publisher: "aldar" },
  in: { id: "cbse", dbPrefix: "cbse", publisher: "ncert" },
  ib: { id: "ib-dp", dbPrefix: "ib", publisher: "ibo" },
  "caie-igcse": { id: "caie-igcse", dbPrefix: "caie", publisher: "cambridge" },
}

/** Per-folder renames that an alias cannot express (the id is right elsewhere). */
const FOLDER_OVERRIDES: Record<string, string> = {
  // "Fundamentals of Technical Education" — g5 `technology` is a different book.
  "sd/g8/technology": "technical-education",
}

/** Scratch the textbook pipeline leaves inside a subject: moved to .work/. */
const SCRATCH = new Set([
  "crops",
  "pages-md-verify",
  "pages-md-audit",
  "tables-audit",
  "textbook.ocr.md",
])

const BINARIES = ["textbook.pdf", "cover.jpg", "thumbnail.jpg", "banner.jpg"]

/** sd DB slugs, from the manifest hogwarts committed (dir -> slug is not invertible by rule). */
const SD_DB_SLUGS = new Map<string, string>()
{
  const f = "/Users/abdout/hogwarts/prisma/seeds/catalog/sd-subject-dirs.json"
  if (existsSync(f))
    for (const e of JSON.parse(readFileSync(f, "utf8")) as {
      slug: string
      grade: string
      subjectDir: string
    }[])
      SD_DB_SLUGS.set(`${e.grade}/${e.subjectDir}`, e.slug)
}

/** Title fixes: English titles for Arabic-only chapters/lessons, repaired Arabic (data/titles.json). */
const TITLES: Record<string, { ar?: string; en?: string }> = JSON.parse(
  readFileSync(join(DATA, "titles.json"), "utf8")
)

// ---------------------------------------------------------------- report

const report = {
  subjects: 0,
  chapters: 0,
  lessons: 0,
  questions: 0,
  exams: 0,
  binaries: 0,
  pagesMd: 0,
  textbookMd: 0,
  scratch: 0,
  droppedQuestions: [] as string[],
  placeholderQuestions: 0,
  placed: { subject: 0, chapter: 0, lesson: 0 },
  duplicates: 0,
  archived: [] as string[],
  errors: [] as string[],
}
const renames = {
  curricula: {} as Record<string, string>,
  subjects: [] as {
    from: string
    to: string
    dbSlugFrom?: string
    dbSlugTo: string
  }[],
  chapters: [] as { subject: string; from: string; to: string }[],
  lessons: [] as {
    subject: string
    chapter: string
    from: string
    to: string
  }[],
}

// ---------------------------------------------------------------- helpers

const ls = (p: string) => (existsSync(p) ? readdirSync(p).filter((n) => n !== ".DS_Store") : [])
const isDir = (p: string) => existsSync(p) && statSync(p).isDirectory()
const readJson = (p: string) => JSON.parse(readFileSync(p, "utf8"))
const ARABIC = /[؀-ۿ]/

function writeJson(p: string, data: unknown) {
  if (!WRITE) return
  mkdirSync(dirname(p), { recursive: true })
  writeFileSync(p, JSON.stringify(data, null, 2) + "\n")
}
function clone(src: string, dst: string) {
  if (!WRITE) return
  mkdirSync(dirname(dst), { recursive: true })
  copyFileSync(src, dst, constants.COPYFILE_FICLONE)
}
function cloneTree(src: string, dst: string) {
  for (const n of ls(src)) {
    const s = join(src, n)
    if (isDir(s)) cloneTree(s, join(dst, n))
    else clone(s, join(dst, n))
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
/** Dot leaders and trailing colons copied out of a printed table of contents. */
const cleanTitle = (v: unknown) =>
  typeof v === "string"
    ? v
        .replace(/\s*\.{3,}\s*/g, " ")
        .replace(/[\s:：]+$/, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    : ""

function titleOf(
  raw: Record<string, unknown>,
  lang: string,
  key: string
): { ar?: string; en?: string; fr?: string } {
  const out: { ar?: string; en?: string; fr?: string } = {}
  const fix = TITLES[key]
  const t = fix?.ar ?? cleanTitle(raw.title)
  const te = fix?.en ?? cleanTitle(raw.titleEn)
  if (t) {
    if (ARABIC.test(t)) out.ar = t
    else if (lang === "fr") out.fr = t
    else out.en = t
  }
  if (te && (fix?.en || !out.en)) out.en = te
  return out
}

/**
 * Position is identity: the i-th chapter is `c<i>`, the i-th lesson WITHIN its
 * chapter is `l<i>` (1-based, the order of the book). Titles carry the words.
 */
const positional = (i: number, kind: "c" | "l") => `${kind}${i}`

function langOf(
  legacyDir: string,
  subject: string,
  raw: Record<string, unknown>,
  titles: string[]
): "ar" | "en" | "fr" {
  if (raw.lang === "ar" || raw.lang === "en" || raw.lang === "fr") return raw.lang
  if (subject.startsWith("french")) return "fr"
  if (subject.startsWith("english")) return "en"
  const arabic = titles.filter((t) => ARABIC.test(t)).length
  if (legacyDir === "sd") return arabic > 0 || titles.length === 0 ? "ar" : "en"
  return arabic > titles.length / 2 ? "ar" : "en"
}

const isoDate = (v: unknown) =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined
const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined)
const url = (v: unknown) => {
  const s = str(v)
  const m = s?.match(/https?:\/\/\S+/)
  return m ? m[0].replace(/[).,]+$/, "") : undefined
}
const int = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" ? parseInt(v, 10) : NaN
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined
}
function compact<T extends Record<string, unknown>>(o: T): T {
  for (const k of Object.keys(o)) {
    const v = o[k]
    if (v === undefined || v === null || (Array.isArray(v) && v.length === 0)) delete o[k]
    else if (typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0)
      delete o[k]
  }
  return o
}

// ---------------------------------------------------------------- questions

const TRUE = new Set(["true", "t", "yes", "صح", "صحيح", "صواب", "نعم", "vrai"])
const FALSE = new Set(["false", "f", "no", "خطأ", "خطا", "خاطئ", "خاطئة", "لا", "faux"])

type Q = {
  id: string
  type: string
  question: string
  options?: string[]
  answer: unknown
  explanation?: string
}

/**
 * Template filler: "Question 2 about <unit>" + "Generic explanation", and the
 * family hogwarts' sd-content gate caught ("Which concept is most important in
 * unit-01?", options "A) Concept 1", "Based on the curriculum…").
 */
function isPlaceholder(question: string, q: Record<string, unknown>): boolean {
  const explanation = String(q.explanation ?? "")
  const options = Array.isArray(q.options) ? q.options.map(String) : []
  return (
    /^Question \d+ about /.test(question) ||
    explanation === "Generic explanation" ||
    (/unit-?\d+/i.test(question) && /concept/i.test(question)) ||
    /Important concepts from unit/i.test(question) ||
    /^Explain the main topics covered in/i.test(question) ||
    options.some((o) => /^[A-D]\)\s*(Concept|Option)\s*\d/i.test(o)) ||
    /^Based on the curriculum/i.test(explanation)
  )
}

function normQuestions(raw: unknown, where: string): Q[] {
  if (!Array.isArray(raw)) return []
  const out: Q[] = []
  const ids = new Set<string>()
  for (const q of raw as Record<string, unknown>[]) {
    const question = str(q.question)
    const options = Array.isArray(q.options)
      ? (q.options as unknown[]).map((o) => String(o).trim()).filter(Boolean)
      : []
    let type =
      str(q.type) ??
      (options.length ? "mcq" : typeof q.answer === "boolean" ? "true_false" : "short_answer")
    if (type === "multiple_choice") type = "mcq"
    if (type === "true-false" || type === "truefalse") type = "true_false"
    let answer = q.answer
    if (type === "true_false") {
      if (typeof answer === "string") {
        const a = answer.trim().toLowerCase().replace(/[.!]$/, "")
        if (TRUE.has(a)) answer = true
        else if (FALSE.has(a)) answer = false
      }
      if (typeof answer !== "boolean") answer = undefined
    }
    if (typeof answer === "string") answer = answer.trim()
    // Scaffolding from two early generators — never real content.
    if (question && isPlaceholder(question, q)) {
      report.placeholderQuestions++
      continue
    }
    if (!question || answer === undefined || answer === null || answer === "") {
      report.droppedQuestions.push(`${where}#${q.id ?? "?"}`)
      continue
    }
    let id = String(q.id ?? `q${out.length + 1}`)
    for (let n = 2; ids.has(id); n++) id = `${q.id}-${n}`
    ids.add(id)
    out.push(
      compact({
        id,
        type,
        question,
        options: type === "mcq" || options.length ? options : undefined,
        answer,
        explanation: str(q.explanation),
      }) as Q
    )
  }
  return out
}

// ---------------------------------------------------------------- assessments

type Scope = {
  curriculum: string
  grade: string
  subject: string
  chapter?: string
  lesson?: string
}

const pending: {
  qbank: Map<string, { scope: Scope; questions: Q[] }>
  exams: Map<string, { scope: Scope; exams: unknown[] }>
} = {
  qbank: new Map(),
  exams: new Map(),
}

function scopeId(s: Scope) {
  return [s.curriculum, s.grade, s.subject, s.chapter, s.lesson].filter(Boolean).join("/")
}

function addQbank(dir: string, scope: Scope, file: string) {
  const d = readJson(file)
  addQuestions(dir, scope, normQuestions(d.questions, relative(FROM, file)))
}

function addQuestions(dir: string, scope: Scope, qs: Q[]) {
  if (!qs.length) return
  const key = join(dir, "qbank.json")
  const cur = pending.qbank.get(key) ?? { scope, questions: [] }
  const ids = new Set(cur.questions.map((q) => q.id))
  for (const q of qs) {
    let id = q.id
    for (let n = 2; ids.has(id); n++) id = `${q.id}-${n}`
    ids.add(id)
    cur.questions.push({ ...q, id })
  }
  pending.qbank.set(key, cur)
}

/** Hogwarts' exam vocabulary (Exam.examType). */
const EXAM_TYPES = new Set(["final", "midterm", "chapter_test", "practice", "quiz", "diagnostic"])

/**
 * Route a subject-level exam that names a `unit` to that chapter's folder;
 * everything else stays where its file was.
 */
type ExamRoute = (unit: number) => { dir: string; scope: Scope } | null

function addExams(
  dir: string,
  scope: Scope,
  file: string,
  lang: string,
  bank: Map<string, Q> = new Map(),
  route?: ExamRoute
) {
  const d = readJson(file)
  const where = relative(FROM, file)
  const label = lang === "ar" ? "اختبار" : lang === "fr" ? "Évaluation" : "Test"
  const raw: Record<string, unknown>[] = []
  if (Array.isArray(d.exams)) {
    const exams = d.exams as Record<string, unknown>[]
    // Hybrid shape (g12 biology/chemistry): one meta-only exam + top-level questions.
    if (exams.length === 1 && !Array.isArray(exams[0]!.questions) && Array.isArray(d.questions))
      raw.push({ ...exams[0], questions: d.questions })
    else raw.push(...exams)
  } else if (d.quiz && typeof d.quiz === "object") raw.push({ ...d.quiz, type: "quiz" })
  else if (Array.isArray(d.questions))
    raw.push({
      title: d.lesson_title ?? d.chapter_title,
      type: d.type,
      duration: d.duration ?? d.duration_minutes,
      questions: d.questions,
    })

  raw.forEach((e, i) => {
    let target = { dir, scope }
    if (!scope.chapter && route && typeof e.unit === "number" && e.unit >= 1)
      target = route(e.unit) ?? target
    const base = scopeId(target.scope).replace(/\//g, "-")
    // Inline everything: an exam that pointed into the qbank by id carries the
    // questions itself, so moving qbank questions to their chapters never
    // leaves it dangling.
    const referenced = Array.isArray(e.question_ids)
      ? (e.question_ids as unknown[]).map((id) => bank.get(String(id))).filter((q): q is Q => !!q)
      : []
    const questions = [
      ...(e.questions ? normQuestions(e.questions, `${where}:${i}`) : []),
      ...referenced,
    ]
    if (!questions.length) return
    const key = join(target.dir, "exams.json")
    const cur = pending.exams.get(key) ?? {
      scope: target.scope,
      exams: [] as Record<string, unknown>[],
    }
    const ids = new Set((cur.exams as { id: string }[]).map((x) => x.id))
    let id = String(e.id ?? `${base}-${i + 1}`)
    for (let n = 2; ids.has(id); n++) id = `${e.id ?? base}-${n}`
    const rawType = str(e.type) ?? str(e.kind)
    const type =
      rawType && EXAM_TYPES.has(rawType)
        ? rawType
        : rawType && /quiz/.test(rawType)
          ? "quiz"
          : target.scope.lesson
            ? "quiz"
            : target.scope.chapter
              ? "chapter_test"
              : "final"
    cur.exams.push(
      compact({
        id,
        title: str(e.title) ?? label,
        type,
        description: str(e.description),
        durationMinutes: int(e.duration ?? e.duration_minutes),
        totalMarks:
          typeof e.total_marks === "number" && e.total_marks > 0 ? e.total_marks : undefined,
        passingMarks: typeof e.passing_marks === "number" ? e.passing_marks : undefined,
        questions,
      })
    )
    pending.exams.set(key, cur)
    report.exams++
  })
}

// ---------------------------------------------------------------- placement

/**
 * Where an sd subject-level question belongs, read from its authored id —
 * ported from hogwarts `prisma/seeds/catalog/sd-content.ts`, whose rules put
 * 94 % of production's SD questions on a chapter. The catalog now stores each
 * question in its chapter/lesson folder, so no consumer ever parses ids again.
 *
 *   g1–g4 sd-…-u03-q012 · g7/g8 …-unit01-q001 · g12 military …-chap12-q001   → unit
 *   g5/g9/g10 …-unit-01-02-<slug>-q01 · g6 ict …-unit-1-<ch>-02-<l>-q01       → unit + lesson
 *   g10 …-chapter-1-lesson-1-q01 · …-module-1-unit-1-q01 · …-introduction-lesson-1-q01
 *   g11/g12 …-u01-l01-q001                                                    → unit + lesson
 *
 * A boundary-safe slug scan over the id runs first; then unit → chapter by
 * position (a single-chapter subject absorbs everything); lesson by slug, then
 * position. Unresolvable questions stay at subject level — never mis-filed.
 */
interface ParsedId {
  unit?: number
  lessonNum?: number
  lessonSlug?: string
  unitName?: string
}

function parseQuestionId(id: string): ParsedId {
  let m: RegExpMatchArray | null
  if ((m = id.match(/-u0*(\d{1,2})-l0*(\d{1,2})-l?q\d+$/)))
    return { unit: +m[1]!, lessonNum: +m[2]! }
  if ((m = id.match(/-chapter-0*(\d{1,2})-lesson-0*(\d{1,2})-l?q\d+$/)))
    return { unit: +m[1]!, lessonNum: +m[2]! }
  if ((m = id.match(/-chapter-0*(\d{1,2})-0*(\d{1,2})-(.+?)-l?q\d+$/)))
    return { unit: +m[1]!, lessonNum: +m[2]!, lessonSlug: m[3] }
  if ((m = id.match(/-module-0*(\d{1,2})-unit-0*(\d{1,2})-l?q\d+$/)))
    return { unit: +m[1]!, lessonNum: +m[2]! }
  if ((m = id.match(/-unit-0*(\d{1,2})-0*(\d{1,2})-(.+?)-l?q\d+$/)))
    return { unit: +m[1]!, lessonNum: +m[2]!, lessonSlug: m[3] }
  if ((m = id.match(/-unit-0*(\d{1,2})-.+?-0*(\d{1,2})-(.+?)-l?q\d+$/)))
    return { unit: +m[1]!, lessonNum: +m[2]!, lessonSlug: m[3] }
  if ((m = id.match(/-chap0*(\d{1,2})-l?q\d+$/))) return { unit: +m[1]! }
  if ((m = id.match(/-u(?:nit)?-?0*(\d{1,2})[a-z]{0,3}(?:\b|-)/))) return { unit: +m[1]! }
  if ((m = id.match(/-unit([a-z][a-z-]*?)-l?q\d+$/))) return { unitName: m[1] }
  if ((m = id.match(/-([a-z][a-z0-9-]*?)-lesson-0*(\d{1,2})-l?q\d+$/)))
    return { unitName: m[1], lessonNum: +m[2]! }
  return {}
}

/** g1 files predate the g1 rebuild: unit (1-based) -> chapter index (0-based), hand-verified. */
const G1_UNIT_TO_CHAPTER: Record<string, Record<number, number>> = {
  math: { 1: 0, 2: 1, 3: 2, 4: 3, 5: 3, 6: 3, 7: 4, 8: 4 },
  islamic: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 3, 6: 5, 7: 4, 8: 2 },
}

const stripSeq = (slug: string) => slug.replace(/^\d+-/, "")
const idContainsSlug = (id: string, slug: string) => `-${id}-`.includes(`-${slug}-`)

function placeQuestion(
  id: string,
  grade: string,
  legacyFolder: string,
  chapters: { slug: string; lessons: { slug: string }[] }[]
): { chapter?: number; lesson?: number } {
  const parsed = parseQuestionId(id)
  let unit = parsed.unit
  if (grade === "g1" && unit != null) {
    const mapped = G1_UNIT_TO_CHAPTER[legacyFolder]?.[unit]
    if (mapped != null) unit = mapped + 1
  }
  let ci: number | null = null
  let best = 0
  chapters.forEach((c, i) => {
    const slug = stripSeq(c.slug)
    if (slug.length > best && idContainsSlug(id, slug)) {
      ci = i
      best = slug.length
    }
  })
  if (ci == null) {
    if (chapters.length === 1) ci = 0
    else if (unit != null && unit - 1 < chapters.length) ci = unit - 1
    else if (parsed.unitName) {
      const wanted = parsed.unitName.replace(/-/g, "")
      const found = chapters.findIndex((c) => {
        const have = stripSeq(c.slug).replace(/-/g, "")
        return have.includes(wanted) || wanted.includes(have)
      })
      ci = found >= 0 ? found : null
    }
  }
  if (ci == null) return {}
  const lessons = chapters[ci]!.lessons
  let li: number | null = null
  let bestL = 0
  lessons.forEach((l, i) => {
    const slug = stripSeq(l.slug)
    if (slug.length > bestL && idContainsSlug(id, slug)) {
      li = i
      bestL = slug.length
    }
  })
  if (li == null && parsed.lessonSlug) {
    const found = lessons.findIndex((l) => stripSeq(l.slug) === parsed.lessonSlug)
    li = found >= 0 ? found : null
  }
  if (li == null && parsed.lessonNum != null && parsed.lessonNum - 1 < lessons.length)
    li = parsed.lessonNum - 1
  return { chapter: ci, lesson: li ?? undefined }
}

// ---------------------------------------------------------------- subject

type LegacyChapter = Record<string, unknown> & {
  slug: string
  lessons?: (Record<string, unknown> & { slug: string })[]
}

function migrateSubject(legacyDir: string, grade: string, folder: string) {
  const cur = CURRICULUM_DIRS[legacyDir]!
  const src = join(FROM, legacyDir, grade, folder)
  const override = FOLDER_OVERRIDES[`${legacyDir}/${grade}/${folder}`]
  const parsed = parseSubject(folder)
  const aliased = SUBJECT_ALIAS.get(folder)
  const subject = override ?? (parsed ? folder : aliased)
  if (!subject || !parseSubject(subject)) {
    report.errors.push(`no vocab id for ${legacyDir}/${grade}/${folder}`)
    return null
  }
  const id = subjectId(cur.id, grade, subject)
  const dst = join(OUT, cur.id, grade, subject)
  const dbSlugFrom =
    legacyDir === "sd"
      ? SD_DB_SLUGS.get(`${grade}/${folder}`)
      : `${cur.dbPrefix}-${grade}-${folder}`
  if (`${legacyDir}/${folder}` !== `${cur.id}/${subject}` || dbSlugFrom !== id)
    renames.subjects.push({
      from: `${legacyDir}/${grade}/${folder}`,
      to: `${cur.id}/${grade}/${subject}`,
      dbSlugFrom,
      dbSlugTo: id,
    })

  const structFile = join(src, "structure.json")
  if (!existsSync(structFile)) {
    report.errors.push(`no structure.json in ${legacyDir}/${grade}/${folder}`)
    return null
  }
  const raw = readJson(structFile) as Record<string, unknown>
  const meta = existsSync(join(src, "meta.json"))
    ? (readJson(join(src, "meta.json")) as Record<string, unknown>)
    : {}
  const rawChapters = (raw.chapters as LegacyChapter[]) ?? []
  const allTitles = rawChapters
    .flatMap((c) => [String(c.title ?? ""), ...(c.lessons ?? []).map((l) => String(l.title ?? ""))])
    .filter(Boolean)
  const lang = langOf(legacyDir, subject, raw, allTitles)

  // chapters + lessons, with old -> new slug maps
  const chMap = new Map<string, string>()
  const lsMap = new Map<string, Map<string, string>>()
  const chTaken = new Set<string>()
  const chapters = rawChapters.map((c, ci) => {
    const title = titleOf(c, lang, `${id}/${c.slug}`)
    const slug = positional(ci + 1, "c")
    chMap.set(c.slug, slug)
    if (slug !== c.slug) renames.chapters.push({ subject: id, from: c.slug, to: slug })
    const lTaken = new Set<string>()
    const lm = new Map<string, string>()
    const lessons = (c.lessons ?? [])
      .filter((l) => l && typeof l === "object")
      .map((l, li) => {
        const lt = titleOf(l, lang, `${id}/${c.slug}/${l.slug}`)
        const ls = positional(li + 1, "l")
        lm.set(l.slug, ls)
        if (ls !== l.slug)
          renames.lessons.push({
            subject: id,
            chapter: slug,
            from: l.slug,
            to: ls,
          })
        report.lessons++
        return compact({
          slug: ls,
          title: Object.keys(lt).length ? lt : { [lang]: l.slug },
          page: int(l.page),
          image: str(l.image),
          concept: str(l.concept),
          description: str(l.description),
          objectives: Array.isArray(l.objectives) ? (l.objectives as string[]) : undefined,
          durationMinutes: int(l.durationMinutes),
        })
      })
    lsMap.set(c.slug, lm)
    report.chapters++
    // `lessons` is required even when empty, so it is set after compact().
    return {
      ...compact({
        slug,
        title: Object.keys(title).length ? title : { [lang]: c.slug },
        concept: str(c.concept),
        image: str(c.image),
        page: int(c.page),
        description: str(c.description),
        objectives: Array.isArray(c.objectives) ? (c.objectives as string[]) : undefined,
        lessonsGeneric: typeof c.lessons_generic === "boolean" ? c.lessons_generic : undefined,
      }),
      lessons,
    }
  })

  // source + provenance
  const textbookMeta = (meta.textbook ?? {}) as Record<string, unknown>
  const legacySource = str(raw.source) ?? str(meta.source)
  const status =
    legacyDir === "sd"
      ? legacySource?.startsWith("official") || existsSync(join(src, "textbook.pdf"))
        ? "official"
        : "outline"
      : (raw.content_status ?? meta.content_status) === "authored"
        ? "authored"
        : existsSync(join(src, "textbook.pdf"))
          ? "official"
          : "outline"
  const vocabTitle = subjectTitle(subject)!
  const rawTitle: { ar?: string; en?: string } = {}
  if (str(raw.subjectAr)) rawTitle.ar = str(raw.subjectAr)
  if (str(raw.subjectEn)) rawTitle.en = str(raw.subjectEn)
  const sn = str(raw.subject_name)
  // "Arabic Language / اللغة العربية", "Science / विज्ञान": one part per script.
  if (sn)
    for (const part of sn.split(" / ").map((x) => x.trim())) {
      if (ARABIC.test(part)) rawTitle.ar ??= part
      else if (/^[\x20-\x7E]+$/.test(part)) rawTitle.en ??= part
    }
  const structure = compact({
    $schema: "../../../schema/structure.schema.json",
    id,
    curriculum: cur.id,
    grade,
    subject,
    title: {
      ar: rawTitle.ar ?? vocabTitle.ar,
      en: rawTitle.en ?? vocabTitle.en,
    },
    lang,
    status,
    concept: str(raw.concept) ?? SUBJECTS.get(parseSubject(subject)!.base)?.concept,
    about: compact({
      description: str(raw.description),
      objectives: Array.isArray(raw.objectives) ? (raw.objectives as string[]) : undefined,
      prerequisites: str(raw.prerequisites),
      audience: str(raw.targetAudience),
    }),
    source: compact({
      publisher: cur.publisher,
      basis: legacySource && !url(legacySource) ? legacySource : undefined,
      title: str(textbookMeta.title),
      edition: str(raw.edition),
      url: url(textbookMeta.source) ?? url(legacySource),
      license: "LicenseRef-Publisher",
      standards: str(meta.standards),
      standardsBody: str(meta.standards_body),
      examBoard: str(meta.exam_board),
      note: str(meta.textbook_note),
    }),
    textbook: compact({
      pageNumbers:
        raw.pageNumbers === "book" || raw.pageNumbers === "pdf" ? raw.pageNumbers : undefined,
      pageOffset: typeof raw.pageOffset === "number" ? raw.pageOffset : undefined,
      note: str(raw.pageNumbersNote),
      coverNote: str(raw.coverNote),
    }),
    resources: Array.isArray(meta.free_resources)
      ? (meta.free_resources as { title: string; url: string }[])
          .filter((r) => r.title && url(r.url))
          .map((r) => ({ title: r.title, url: url(r.url)! }))
      : undefined,
    history: compact({
      authoredOn: isoDate(raw.contentAuthoredOn),
      appliedOn: isoDate(raw.appliedOn),
      supersedes: str(raw.supersedes),
    }),
    contributors: ["databayt"],
    chapters,
  })
  const parsedStructure = SCHEMAS.structure.safeParse(structure)
  if (!parsedStructure.success)
    report.errors.push(
      `${id}: ${parsedStructure.error.issues
        .slice(0, 2)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    )
  writeJson(join(dst, "structure.json"), structure)
  report.subjects++

  // assessments: subject level
  const scope: Scope = { curriculum: cur.id, grade, subject }
  const bankRaw = existsSync(join(src, "qbank.json")) ? readJson(join(src, "qbank.json")) : null
  const bankQs = bankRaw
    ? normQuestions(bankRaw.questions, relative(FROM, join(src, "qbank.json")))
    : []
  const bank = new Map(bankQs.map((q) => [q.id, q]))
  const legacyTree = rawChapters.map((c) => ({
    slug: c.slug,
    lessons: (c.lessons ?? []).filter((l) => l && typeof l === "object"),
  }))
  const at = (ci?: number, li?: number): { dir: string; scope: Scope } => {
    if (ci == null) return { dir: dst, scope }
    const ch = `c${ci + 1}`
    if (li == null) return { dir: join(dst, ch), scope: { ...scope, chapter: ch } }
    const l = `l${li + 1}`
    return { dir: join(dst, ch, l), scope: { ...scope, chapter: ch, lesson: l } }
  }
  if (legacyDir === "sd") {
    // Place each subject-level question in its chapter/lesson (see placeQuestion).
    for (const q of bankQs) {
      const p = placeQuestion(q.id, grade, folder, legacyTree)
      const t = at(p.chapter, p.lesson)
      addQuestions(t.dir, t.scope, [q])
      report.placed[p.lesson != null ? "lesson" : p.chapter != null ? "chapter" : "subject"]++
    }
  } else addQuestions(dst, scope, bankQs)
  if (existsSync(join(src, "exams.json")))
    addExams(dst, scope, join(src, "exams.json"), lang, bank, (unit) =>
      unit - 1 < rawChapters.length ? at(unit - 1) : null
    )

  // chapter/lesson dirs live under chapters/<slug> or directly under the subject
  const byNumber = new Map<number, string>()
  for (const c of rawChapters) {
    const m = c.slug.match(/^(?:unit|chapter|module)-0*(\d+)/)
    if (m) byNumber.set(Number(m[1]), c.slug)
  }
  const resolveChapter = (dirName: string): string | undefined => {
    if (chMap.has(dirName)) return dirName
    const m = dirName.match(/^(?:unit|chapter|module)-0*(\d+)/)
    return m ? byNumber.get(Number(m[1])) : undefined
  }
  const chapterDirs: [string, string][] = []
  for (const n of ls(join(src, "chapters")))
    if (isDir(join(src, "chapters", n))) chapterDirs.push([n, join(src, "chapters", n)])
  for (const n of ls(src))
    if (isDir(join(src, n)) && chMap.has(n)) chapterDirs.push([n, join(src, n)])

  for (const [dirName, cdir] of chapterDirs) {
    const oldCh = resolveChapter(dirName)
    if (!oldCh) {
      report.archived.push(`${relative(FROM, cdir)} (no matching chapter)`)
      continue
    }
    const ch = chMap.get(oldCh)!
    const cScope = { ...scope, chapter: ch }
    const cdst = join(dst, ch)
    if (existsSync(join(cdir, "qbank.json"))) addQbank(cdst, cScope, join(cdir, "qbank.json"))
    if (existsSync(join(cdir, "exams.json"))) addExams(cdst, cScope, join(cdir, "exams.json"), lang)
    const lessonRoot = isDir(join(cdir, "lessons")) ? join(cdir, "lessons") : cdir
    const lm = lsMap.get(oldCh)!
    for (const ln of ls(lessonRoot)) {
      const ldir = join(lessonRoot, ln)
      if (!isDir(ldir) || ln === "lessons") continue
      const l = lm.get(ln)
      if (!l) {
        if (ls(ldir).length) report.archived.push(`${relative(FROM, ldir)} (no matching lesson)`)
        continue
      }
      const lScope = { ...cScope, lesson: l }
      const ldst = join(cdst, l)
      if (existsSync(join(ldir, "qbank.json"))) addQbank(ldst, lScope, join(ldir, "qbank.json"))
      if (existsSync(join(ldir, "exams.json")))
        addExams(ldst, lScope, join(ldir, "exams.json"), lang)
      if (existsSync(join(ldir, "quiz.json"))) addExams(ldst, lScope, join(ldir, "quiz.json"), lang)
    }
  }

  // text twins
  if (existsSync(join(src, "textbook.md"))) {
    let md = readFileSync(join(src, "textbook.md"), "utf8")
    md = md
      .replace(/^curriculum: .*$/m, `curriculum: "${cur.id}"`)
      .replace(/^subject: .*$/m, `subject: "${subject}"`)
      .replace(/^dbSlug: .*$/m, `id: "${id}"`)
    if (WRITE) {
      mkdirSync(dst, { recursive: true })
      writeFileSync(join(dst, "textbook.md"), md)
    }
    report.textbookMd++
  }
  for (const f of ls(join(src, "pages-md")))
    if (/^([1-9]\d*|_CONTRACT)\.md$/.test(f)) {
      clone(join(src, "pages-md", f), join(dst, "pages-md", f))
      report.pagesMd++
    } else report.archived.push(relative(FROM, join(src, "pages-md", f)))

  // binaries
  for (const b of BINARIES)
    if (existsSync(join(src, b))) {
      clone(join(src, b), join(dst, b))
      report.binaries++
    }
  const pages = ls(join(src, "pages"))
  if (pages.every((p) => /^[1-9]\d*\.webp$/.test(p)))
    for (const p of pages) {
      clone(join(src, "pages", p), join(dst, "pages", p))
      report.binaries++
    }
  else if (pages.length)
    report.archived.push(`${relative(FROM, join(src, "pages"))} (not N.webp renders)`)

  // scratch -> .work/
  for (const n of ls(src))
    if (SCRATCH.has(n)) {
      const s = join(src, n)
      const w = join(WORK, cur.id, grade, subject, n)
      if (isDir(s)) cloneTree(s, w)
      else clone(s, w)
      report.scratch++
    }

  // everything else in the subject is archived (listed, not copied)
  const handled = new Set([
    "structure.json",
    "meta.json",
    "qbank.json",
    "exams.json",
    "textbook.md",
    "pages-md",
    "pages",
    "chapters",
    ...BINARIES,
    ...SCRATCH,
  ])
  for (const n of ls(src))
    if (!handled.has(n) && !chMap.has(n)) report.archived.push(relative(FROM, join(src, n)))

  return { id, subject }
}

// ---------------------------------------------------------------- curriculum

function stagesFrom(legacy: Record<string, unknown>) {
  const levels = (legacy.levels ?? {}) as Record<
    string,
    { ar?: string; en?: string; grades: string }
  >
  const localMap = (legacy.grade_year_map ?? legacy.grade_grade_map) as
    Record<string, string> | undefined
  return Object.entries(levels).map(([id, l]) => {
    const [a, b = a] = l.grades.split("-").map((g) => Number(g.replace("g", "")))
    const grades = Array.from({ length: b! - a! + 1 }, (_, i) => `g${a! + i}`)
    const localNames = localMap
      ? Object.fromEntries(grades.filter((g) => localMap[g]).map((g) => [g, localMap[g]!]))
      : undefined
    return compact({
      id: slugify(id),
      title: compact({ ar: l.ar, en: l.en ?? id }),
      grades,
      localNames,
    })
  })
}

const DEFAULT_STAGES: Record<
  string,
  { id: string; title: { ar?: string; en: string }; grades: string[] }[]
> = {
  cbse: [
    {
      id: "secondary",
      title: { ar: "الثانوية", en: "Secondary" },
      grades: ["g9", "g10"],
    },
  ],
  "ib-dp": [
    {
      id: "diploma",
      title: { ar: "برنامج الدبلوم", en: "Diploma Programme" },
      grades: ["g11", "g12"],
    },
  ],
  "caie-igcse": [{ id: "igcse", title: { ar: "IGCSE", en: "IGCSE" }, grades: ["g9", "g10"] }],
}
const DEFAULT_EN: Record<string, string> = {
  primary: "Primary",
  middle: "Middle",
  secondary: "Secondary",
}

function migrateCurriculum(legacyDir: string) {
  const cur = CURRICULUM_DIRS[legacyDir]!
  const v = CURRICULA.get(cur.id)!
  renames.curricula[legacyDir] = cur.id
  const legacyFile = join(FROM, legacyDir, "curriculum.json")
  const legacy = existsSync(legacyFile) ? (readJson(legacyFile) as Record<string, unknown>) : {}
  const grades: Record<string, string[]> = {}
  for (const g of ls(join(FROM, legacyDir))
    .filter((g) => /^g\d+$/.test(g))
    .sort((a, b) => gradeOrder(a) - gradeOrder(b))) {
    for (const folder of ls(join(FROM, legacyDir, g)).sort()) {
      if (!isDir(join(FROM, legacyDir, g, folder))) continue
      // cbse: only the real NCERT subjects (with a structure); the rest of in/ is an image scaffold
      if (!existsSync(join(FROM, legacyDir, g, folder, "structure.json"))) {
        report.archived.push(`${legacyDir}/${g}/${folder} (no structure.json)`)
        continue
      }
      const r = migrateSubject(legacyDir, g, folder)
      if (!r) continue
      grades[g] ??= []
      if (grades[g].includes(r.subject))
        report.errors.push(`collision: ${cur.id}/${g}/${r.subject}`)
      grades[g].push(r.subject)
    }
  }
  for (const g of Object.keys(grades)) grades[g]!.sort()
  let stages = Object.keys(legacy.levels ?? {}).length
    ? stagesFrom(legacy)
    : (DEFAULT_STAGES[cur.id] ?? [])
  stages = stages.map((s) => ({
    ...s,
    title: {
      ...s.title,
      en: s.title.en === s.id ? (DEFAULT_EN[s.id] ?? s.title.en) : s.title.en,
    },
  }))
  const curriculum = compact({
    $schema: "../schema/curriculum.schema.json",
    id: cur.id,
    title: compact({
      ar: str(legacy.name_ar) ?? v.title.ar,
      en: str(legacy.name) ?? v.title.en,
    }),
    country: v.country,
    lang: v.lang as "ar" | "en",
    structure: str(legacy.structure),
    reformYear: typeof legacy.reform_year === "number" ? legacy.reform_year : undefined,
    reference: url(legacy.reference) ? encodeURI(decodeURI(url(legacy.reference)!)) : undefined,
    operator: str(legacy.operator),
    accreditation: str(legacy.accreditation),
    basis: str(legacy.basis),
    notes: str(legacy.notes),
    stages,
    grades,
  })
  const p = SCHEMAS.curriculum.safeParse(curriculum)
  if (!p.success)
    report.errors.push(
      `${cur.id}/curriculum.json: ${p.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`
    )
  writeJson(join(OUT, cur.id, "curriculum.json"), curriculum)
}

// ---------------------------------------------------------------- run

if (!existsSync(FROM)) throw new Error(`--from ${FROM} does not exist`)
if (WRITE) {
  // Only the curriculum folders this script owns — OUT is the repo root.
  for (const { id } of Object.values(CURRICULUM_DIRS))
    rmSync(join(OUT, id), { recursive: true, force: true })
  rmSync(WORK, { recursive: true, force: true })
}
for (const legacyDir of Object.keys(CURRICULUM_DIRS)) migrateCurriculum(legacyDir)

// One question, one home: within a subject a question text lives once, at its
// deepest scope (lesson > chapter > subject). The generated gb/us trees carried
// every lesson question again in its chapter and subject files; those rollups
// are consumer views, not content.
{
  const depth = (sc: Scope) => (sc.lesson ? 2 : sc.chapter ? 1 : 0)
  const bySubject = new Map<string, [string, { scope: Scope; questions: Q[] }][]>()
  for (const entry of pending.qbank) {
    const sc = entry[1].scope
    const k = `${sc.curriculum}/${sc.grade}/${sc.subject}`
    bySubject.set(k, [...(bySubject.get(k) ?? []), entry])
  }
  for (const entries of bySubject.values()) {
    const seen = new Set<string>()
    for (const [, v] of [...entries].sort((a, b) => depth(b[1].scope) - depth(a[1].scope))) {
      const before = v.questions.length
      v.questions = v.questions.filter((q) => {
        const t = q.question.replace(/\s+/g, " ").trim()
        if (seen.has(t)) return false
        seen.add(t)
        return true
      })
      report.duplicates += before - v.questions.length
    }
  }
}

for (const [file, { scope, questions }] of pending.qbank) {
  if (!questions.length) continue
  writeJson(file, { scope, questions })
  report.questions += questions.length
}
for (const [file, { scope, exams }] of pending.exams) writeJson(file, { scope, exams })

for (const top of ls(FROM))
  if (!(top in CURRICULUM_DIRS)) report.archived.push(`${top} (top level)`)

const summary = [
  `# Migration report`,
  ``,
  `From \`${FROM}\` → the repo root (= catalog/ on the CDN)${WRITE ? "" : " (dry run)"}.`,
  ``,
  `| | count |`,
  `|---|---:|`,
  `| subjects | ${report.subjects} |`,
  `| chapters | ${report.chapters} |`,
  `| lessons | ${report.lessons} |`,
  `| questions (in qbank.json) | ${report.questions} |`,
  `| exams | ${report.exams} |`,
  `| textbook.md twins | ${report.textbookMd} |`,
  `| pages-md files | ${report.pagesMd} |`,
  `| binaries | ${report.binaries} |`,
  `| scratch dirs → .work/ | ${report.scratch} |`,
  `| subject renames | ${renames.subjects.length} |`,
  `| chapter renames | ${renames.chapters.length} |`,
  `| lesson renames | ${renames.lessons.length} |`,
  `| placeholder questions dropped | ${report.placeholderQuestions} |`,
  `| duplicate questions removed (kept at deepest scope) | ${report.duplicates} |`,
  `| sd subject-level questions placed → lesson / chapter / subject | ${report.placed.lesson} / ${report.placed.chapter} / ${report.placed.subject} |`,
  `| questions dropped (no question or answer) | ${report.droppedQuestions.length} |`,
  `| errors | ${report.errors.length} |`,
  ``,
  `## Errors`,
  ...report.errors.map((e) => `- ${e}`),
  ``,
  `## Archived (left in the legacy tree, not migrated)`,
  ...report.archived.map((a) => `- ${a}`),
  ``,
  `## Dropped questions`,
  ...report.droppedQuestions.map((a) => `- ${a}`),
  ``,
].join("\n")

if (WRITE) {
  writeFileSync(join(import.meta.dirname, "report.md"), summary)
  writeFileSync(join(import.meta.dirname, "renames.json"), JSON.stringify(renames, null, 2) + "\n")
}
console.log(summary.split("## Archived")[0])
console.log(`archived: ${report.archived.length}  (see report.md)`)
