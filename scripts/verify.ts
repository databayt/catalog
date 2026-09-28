// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The book gate's evidence pass — how a `verification` block gets written.
 *
 * Verification is a judgement about a scanned book, so a person or a vision agent has
 * to read its imprint page. This script does everything around that: it measures what
 * can be measured, hands out a worksheet, re-checks the circulating copies over HTTP,
 * and writes the result back. It never decides an edition itself.
 *
 *   pnpm verify plan sd g12                  worksheet -> .work/verify/<cur>-<grade>.json
 *   pnpm verify sources .work/verify/sd-g12.json [--apply]   HEAD each comparedWith url
 *   pnpm verify apply   .work/verify/sd-g12.json [--apply]   write the verification blocks
 *
 * The worksheet is scratch (`.work/` is gitignored). `structure.json` is the record.
 * Method and provenance: `docs/verification.md`.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import { Structure } from "../schema/index.ts"
import { REPO } from "./lib/tree.ts"

const [cmd, ...rest] = process.argv.slice(2)
const apply = rest.includes("--apply")
const args = rest.filter((a) => !a.startsWith("--"))

const lock: Record<string, { sha256: string; bytes: number }> = JSON.parse(
  readFileSync(join(REPO, "assets.lock.json"), "utf8")
).assets
const read = <T>(p: string): T => JSON.parse(readFileSync(p, "utf8")) as T
const dirs = (p: string) =>
  readdirSync(p).filter((n) => !n.startsWith(".") && statSync(join(p, n)).isDirectory())
const today = new Date().toISOString().slice(0, 10)

type Sheet = {
  $comment: string
  curriculum: string
  grade: string
  /** Stamped into every block this sheet applies. */
  verifiedOn: string
  recheckAfter?: string
  subjects: Record<
    string,
    {
      /** Measured — do not edit. */
      pdfSha256: string
      pages: number
      pdfBytes: number
      /** Page images to open, in the order the imprint is usually printed. */
      readPages: number[]
      /** Filled in by a reader. */
      book: "unverified" | "verified" | "superseded"
      edition?: string
      editionBasis: "printed" | "inferred"
      evidence: string
      note?: string
      comparedWith?: { url: string; bytes?: number; md5?: string; identical?: boolean }[]
    }
  >
}

function subjectDirs(cur: string, grade: string): string[] {
  const root = join(REPO, cur, grade)
  if (!existsSync(root)) throw new Error(`no such grade: ${cur}/${grade}`)
  return dirs(root)
    .filter((s) => existsSync(join(root, s, "structure.json")))
    .sort()
}

if (cmd === "plan") {
  const [cur, grade] = args
  if (!cur || !grade) throw new Error("usage: pnpm verify plan <curriculum> <grade>")
  const out = join(REPO, ".work", "verify", `${cur}-${grade}.json`)
  const prior: Sheet | null = existsSync(out) ? read<Sheet>(out) : null

  const sheet: Sheet = {
    $comment:
      "Worksheet for `pnpm verify apply`. Measured fields are authoritative — do not edit them. Fill book/edition/editionBasis/evidence from the book's own imprint page; never from a catalogue listing.",
    curriculum: cur,
    grade,
    verifiedOn: today,
    recheckAfter: prior?.recheckAfter,
    subjects: {},
  }

  for (const subject of subjectDirs(cur, grade)) {
    const dir = join(REPO, cur, grade, subject)
    const base = `catalog/${cur}/${grade}/${subject}`
    const pdf = lock[`${base}/textbook.pdf`]
    if (!pdf) throw new Error(`${subject}: textbook.pdf is not in assets.lock.json`)
    const pages = Object.keys(lock).filter((k) => k.startsWith(`${base}/pages/`)).length
    const s = read<Structure>(join(dir, "structure.json"))
    const was = prior?.subjects[subject]
    sheet.subjects[subject] = {
      pdfSha256: pdf.sha256,
      pages,
      pdfBytes: pdf.bytes,
      // Sudanese NCERD books print the imprint on p2–p4; the legal-deposit card is
      // sometimes on the last leaf instead. Read the front first, then the back.
      readPages: [1, 2, 3, 4, pages - 1, pages].filter((n) => n >= 1 && n <= pages),
      book: was?.book ?? "unverified",
      edition: was?.edition ?? s.source.edition,
      editionBasis: was?.editionBasis ?? "printed",
      evidence: was?.evidence ?? "",
      note: was?.note,
      comparedWith: was?.comparedWith,
    }
  }

  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, JSON.stringify(sheet, null, 2) + "\n")
  console.log(`${out}\n${Object.keys(sheet.subjects).length} subjects — fill book/edition/evidence, then \`pnpm verify apply\``)
}

if (cmd === "sources") {
  const [file] = args
  if (!file) throw new Error("usage: pnpm verify sources <sheet> [--apply]")
  const sheet = read<Sheet>(file)
  let checked = 0
  for (const [subject, v] of Object.entries(sheet.subjects)) {
    for (const c of v.comparedWith ?? []) {
      let bytes: number | undefined
      let status = 0
      try {
        const res = await fetch(c.url, { method: "HEAD", redirect: "follow" })
        status = res.status
        const len = res.headers.get("content-length")
        if (len) bytes = Number(len)
      } catch (e) {
        console.log(`  ! ${subject} ${c.url} — ${String(e)}`)
        continue
      }
      checked++
      if (bytes !== undefined) c.bytes = bytes
      c.identical = bytes !== undefined && bytes === v.pdfBytes
      console.log(
        `  ${c.identical ? "=" : "≠"} ${subject.padEnd(26)} ${status} ${bytes ?? "?"} vs ours ${v.pdfBytes}`
      )
    }
  }
  if (apply) {
    writeFileSync(file, JSON.stringify(sheet, null, 2) + "\n")
    console.log(`\n${checked} urls checked — sheet updated`)
  } else console.log(`\n${checked} urls checked — dry run, pass --apply to record`)
}

if (cmd === "apply") {
  const [file] = args
  if (!file) throw new Error("usage: pnpm verify apply <sheet> [--apply]")
  const sheet = read<Sheet>(file)
  const { curriculum: cur, grade } = sheet
  let written = 0
  const skipped: string[] = []

  for (const [subject, v] of Object.entries(sheet.subjects)) {
    if (v.book === "unverified" || !v.evidence) {
      skipped.push(`${subject} (${v.book === "unverified" ? "not verified" : "no evidence"})`)
      continue
    }
    const path = join(REPO, cur, grade, subject, "structure.json")
    const raw = read<Record<string, unknown>>(path)
    const verification = {
      book: v.book,
      ...(v.edition ? { edition: v.edition } : {}),
      editionBasis: v.editionBasis,
      evidence: v.evidence,
      pdfSha256: v.pdfSha256,
      pages: v.pages,
      ...(v.comparedWith?.length
        ? {
            comparedWith: v.comparedWith.map((c) => ({
              url: c.url,
              bytes: c.bytes!,
              ...(c.md5 ? { md5: c.md5 } : {}),
              identical: c.identical!,
            })),
          }
        : {}),
      verifiedOn: sheet.verifiedOn,
      ...(sheet.recheckAfter ? { recheckAfter: sheet.recheckAfter } : {}),
      ...(v.note ? { note: v.note } : {}),
    }

    // Rebuild the object so `verification` sits directly after `source`, and keep the
    // recorded edition in `source` too — that is what a consumer reads.
    const next: Record<string, unknown> = {}
    for (const [k, val] of Object.entries(raw)) {
      next[k] = val
      if (k === "source") {
        // `verification.edition` is the precise line off the imprint page. `source.edition`
        // is the consumer-facing label — backfilled when absent, never overwritten.
        const src = next[k] as Record<string, unknown>
        if (v.edition && !src.edition) src.edition = v.edition
        next.verification = verification
      }
    }
    const parsed = Structure.safeParse(next)
    if (!parsed.success) {
      const issue = parsed.error.issues[0]!
      throw new Error(`${subject}: ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    }
    if (apply) writeFileSync(path, JSON.stringify(next, null, 2) + "\n")
    written++
  }

  console.log(
    `${written} verification blocks ${apply ? "written" : "would be written (dry run, pass --apply)"}`
  )
  if (skipped.length) console.log(`skipped: ${skipped.join(", ")}`)
}

if (!["plan", "sources", "apply"].includes(cmd ?? "")) {
  console.error("usage: pnpm verify plan <cur> <grade> | sources <sheet> | apply <sheet>")
  process.exit(2)
}
