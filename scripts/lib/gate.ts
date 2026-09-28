// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The phase gate, as a function. `scripts/gate.ts` is its CLI and
 * `scripts/build-index.ts` stamps the result into `index.json`.
 *
 * A subject advances through four gates, in order, and may not hold an artifact of
 * a phase it has not reached:
 *
 *   book  ->  structure  ->  twin  ->  assessment
 *
 * `pnpm validate` says a file is well formed. This says the subject was allowed to
 * have that file at all. The chain is bound to bytes, not to prose: the book gate
 * compares `structure.json`'s recorded `verification.pdfSha256` against
 * `assets.lock.json`, so re-locking a replaced PDF invalidates the verdict and
 * every gate below it.
 *
 * The twin gate deliberately ignores `textbook.md`'s `quality` letter: the retired
 * OCR grader scored coverage, so a 47 %-complete twin could read "A". Only a vision
 * transcription with a real two-read `agreement` passes.
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

import type { Structure } from "../../schema/index.ts"
import { REPO, contentDirs } from "./tree.ts"
import { gradeOrder } from "./vocab.ts"

/** engine.json -> textbook.thresholds.B, the floor a twin must clear. */
export const AGREEMENT_FLOOR = 0.9
/** The headline sample must be a sample, not one page. */
export const AGREEMENT_SAMPLE_MIN = 12

export const GATES = ["book", "structure", "twin", "assessment"] as const
export type Gate = (typeof GATES)[number]

const lock: Record<string, { sha256: string; bytes: number }> = JSON.parse(
  readFileSync(join(REPO, "assets.lock.json"), "utf8")
).assets
const read = <T>(p: string): T => JSON.parse(readFileSync(p, "utf8")) as T
const dirs = (p: string) =>
  readdirSync(p).filter((n) => !n.startsWith(".") && statSync(join(p, n)).isDirectory())

const today = () => new Date().toISOString().slice(0, 10)

/** The subset of `textbook.md`'s YAML front matter the twin gate needs. */
export function frontMatter(file: string): Record<string, string> {
  if (!existsSync(file)) return {}
  const out: Record<string, string> = {}
  const lines = readFileSync(file, "utf8").split("\n", 80)
  if (lines[0]?.trim() !== "---") return out
  for (const line of lines.slice(1)) {
    if (line.trim() === "---") break
    const m = /^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/.exec(line)
    if (m) out[m[1]!] = m[2]!.trim().replace(/^"(.*)"$/, "$1")
  }
  return out
}

export type Report = {
  id: string
  curriculum: string
  grade: string
  subject: string
  gates: Record<Gate, boolean>
  /** Why a gate failed — one line each, in gate order. */
  reasons: string[]
  /** Artifacts present that the subject has not earned. */
  violations: string[]
}

export function inspect(cur: string, grade: string, subject: string): Report {
  const dir = join(REPO, cur, grade, subject)
  const base = `catalog/${cur}/${grade}/${subject}`
  const s = read<Structure>(join(dir, "structure.json"))
  const reasons: string[] = []
  const violations: string[] = []
  const gates: Record<Gate, boolean> = {
    book: false,
    structure: false,
    twin: false,
    assessment: false,
  }

  const pageRenders = Object.keys(lock).filter((k) => k.startsWith(`${base}/pages/`)).length
  const pagesMd = existsSync(join(dir, "pages-md"))
    ? readdirSync(join(dir, "pages-md")).filter((f) => /^\d+\.md$/.test(f)).length
    : 0
  const chapterDirs = dirs(dir).filter((n) => /^c[1-9]\d*$/.test(n))
  const lessonDirs = chapterDirs.flatMap((c) =>
    dirs(join(dir, c))
      .filter((n) => /^l[1-9]\d*$/.test(n))
      .map((l) => join(c, l))
  )
  const assessmentFiles = [dir, ...chapterDirs.map((c) => join(dir, c)), ...lessonDirs.map((l) => join(dir, l))]
    .flatMap((d) => ["qbank.json", "exams.json"].filter((f) => existsSync(join(d, f))).map((f) => join(d, f)))
    .map((p) => p.slice(REPO.length + 1))

  // ---------------------------------------------------------------- book
  const v = s.verification
  const lockedPdf = lock[`${base}/textbook.pdf`]
  if (!v) reasons.push("book: no verification block in structure.json")
  else if (v.book !== "verified") reasons.push(`book: verification.book = ${v.book}`)
  else if (!lockedPdf) reasons.push("book: textbook.pdf is not in assets.lock.json")
  else if (lockedPdf.sha256 !== v.pdfSha256)
    reasons.push(
      `book: pdfSha256 ${v.pdfSha256.slice(0, 12)}… does not match the locked PDF ${lockedPdf.sha256.slice(0, 12)}…`
    )
  else if (pageRenders !== v.pages)
    reasons.push(`book: verification.pages ${v.pages} but ${pageRenders} page renders are locked`)
  else if (v.recheckAfter && v.recheckAfter <= today())
    reasons.push(`book: recheckAfter ${v.recheckAfter} has passed`)
  else gates.book = true

  // ---------------------------------------------------------------- structure
  const emptyChapters = s.chapters.filter((c) => c.lessons.length === 0).map((c) => c.slug)
  if (!gates.book) reasons.push("structure: blocked by book")
  else if (s.chapters.length === 0) reasons.push("structure: no chapters")
  else if (emptyChapters.length)
    reasons.push(`structure: ${emptyChapters.length} chapters with no lessons (${emptyChapters.slice(0, 4).join(", ")}…)`)
  else gates.structure = true

  // ---------------------------------------------------------------- twin
  const fm = frontMatter(join(dir, "textbook.md"))
  const agreement = Number(fm.agreement)
  const sample = Number(fm.agreementSample)
  if (!gates.structure) reasons.push("twin: blocked by structure")
  else if (!existsSync(join(dir, "textbook.md"))) reasons.push("twin: no textbook.md")
  else if (fm.extraction !== "vision")
    reasons.push(`twin: extraction is "${fm.extraction ?? "unknown"}", not vision — the OCR grade is not trusted`)
  else if (!Number.isFinite(agreement) || agreement < AGREEMENT_FLOOR)
    reasons.push(`twin: agreement ${fm.agreement ?? "absent"} is below ${AGREEMENT_FLOOR}`)
  else if (!Number.isFinite(sample) || sample < AGREEMENT_SAMPLE_MIN)
    reasons.push(`twin: agreementSample ${fm.agreementSample ?? "absent"} is below ${AGREEMENT_SAMPLE_MIN}`)
  else if (pagesMd !== v!.pages) reasons.push(`twin: ${pagesMd} of ${v!.pages} pages transcribed`)
  else if (Number(fm.sourcePages) !== v!.pages)
    reasons.push(`twin: front-matter sourcePages ${fm.sourcePages} ≠ ${v!.pages}`)
  else if (!/^[a-f0-9]{32}$/.test(fm.sourceMd5 ?? "")) reasons.push("twin: no sourceMd5 in front matter")
  else gates.twin = true

  // ---------------------------------------------------------------- assessment
  const missing: string[] = []
  for (const l of lessonDirs)
    for (const f of ["qbank.json", "exams.json"]) if (!existsSync(join(dir, l, f))) missing.push(join(l, f))
  for (const c of chapterDirs)
    for (const f of ["qbank.json", "exams.json"]) if (!existsSync(join(dir, c, f))) missing.push(join(c, f))
  for (const f of ["qbank.json", "exams.json"]) if (!existsSync(join(dir, f))) missing.push(f)

  if (!gates.twin) reasons.push("assessment: blocked by twin")
  else if (lessonDirs.length === 0) reasons.push("assessment: no lesson folders")
  else if (missing.length)
    reasons.push(`assessment: ${missing.length} missing files (${missing.slice(0, 3).join(", ")}…)`)
  else gates.assessment = true

  // ---------------------------------------------------------------- violations
  // An artifact whose phase the subject has not reached. This is the enforcement.
  if (!gates.book && (chapterDirs.length || pagesMd || assessmentFiles.length))
    violations.push(`book gate fails but ${chapterDirs.length} chapter dirs, ${pagesMd} page twins and ${assessmentFiles.length} assessment files exist`)
  else {
    if (!gates.structure && (pagesMd || assessmentFiles.length))
      violations.push(`structure gate fails but ${pagesMd} page twins and ${assessmentFiles.length} assessment files exist`)
    else if (!gates.twin && assessmentFiles.length)
      violations.push(`twin gate fails but ${assessmentFiles.length} assessment files exist`)
  }

  return { id: s.id, curriculum: cur, grade, subject, gates, reasons, violations }
}

/** Every subject with a `structure.json`, optionally filtered. */
export function gateReports(opts: { curricula?: string[]; grade?: string } = {}): Report[] {
  const out: Report[] = []
  for (const cur of contentDirs(REPO)) {
    if (opts.curricula?.length && !opts.curricula.includes(cur)) continue
    for (const grade of dirs(join(REPO, cur)).sort((a, b) => gradeOrder(a) - gradeOrder(b))) {
      if (opts.grade && grade !== opts.grade) continue
      for (const subject of dirs(join(REPO, cur, grade)).sort())
        if (existsSync(join(REPO, cur, grade, subject, "structure.json")))
          out.push(inspect(cur, grade, subject))
    }
  }
  return out
}
