// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The textbook URL contract, checked. Every subject serves exactly two textbook
 * files, at keys derived from its id and nothing else:
 *
 *   https://cdn.databayt.org/catalog/<curriculum>/<grade>/<subject>/textbook.pdf
 *   https://cdn.databayt.org/catalog/<curriculum>/<grade>/<subject>/textbook.md
 *
 * This prints, per subject, both URLs, whether each file exists, how the twin was
 * made (extraction, agreement) and the twin gate verdict. It is the textbook
 * loop's sensor: kun's `textbook` loop reads `.work/twins/<cur>-<grade>.json` to
 * pick the next book.
 *
 *   pnpm twins sd --grade g12           offline: lockfile + repo (what CI runs)
 *   pnpm twins sd --grade g12 --cdn     also HEAD both URLs; .md ETag vs local md5
 *   pnpm twins sd --grade g12 --json    machine-readable, also written to .work/twins/
 *
 * Exit 1 when a PDF is not locked or a textbook.md is missing — and, with --cdn,
 * when either URL is not 200 or the published .md differs from the repo's.
 * A twin below the gate is reported, not failed: that is the loop's work queue.
 */

import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { catalogKey } from "../src/key.ts"
import { catalogUrl } from "../src/url.ts"
import { frontMatter, gateReports } from "./lib/gate.ts"
import { CDN } from "./lib/s3.ts"
import { REPO } from "./lib/tree.ts"

const argv = process.argv.slice(2)
const flag = (name: string): string | undefined => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}
const grade = flag("grade")
const asJson = argv.includes("--json")
const cdn = argv.includes("--cdn")
const curricula = argv.filter((a) => !a.startsWith("--") && a !== grade)

const lock: Record<string, { sha256: string; bytes: number }> = JSON.parse(
  readFileSync(join(REPO, "assets.lock.json"), "utf8")
).assets
const md5 = (file: string) => createHash("md5").update(readFileSync(file)).digest("hex")

type Remote = { status: number; etag?: string; bytes?: number }
async function head(url: string): Promise<Remote> {
  for (let attempt = 0; ; attempt++) {
    try {
      const r = await fetch(url, { method: "HEAD" })
      return {
        status: r.status,
        etag: r.headers.get("etag")?.replaceAll('"', ""),
        bytes: Number(r.headers.get("content-length") ?? NaN),
      }
    } catch (e) {
      if (attempt >= 2) return { status: 0 }
    }
  }
}

export type Twin = {
  id: string
  curriculum: string
  grade: string
  subject: string
  pdfUrl: string
  mdUrl: string
  pdf: { locked: boolean; local: boolean; status?: number; bytesMatch?: boolean }
  md: { exists: boolean; status?: number; published?: boolean }
  extraction: string
  agreement: number | null
  agreementSample: number | null
  quality: string
  pages: number | null
  pagesMd: number
  /** `sourceMd5` vs the local PDF; null when the PDF is not on disk (CI). */
  sourceMatches: boolean | null
  twinGate: boolean
  twinReason: string
  problems: string[]
}

const reports = gateReports({ curricula, grade })
const twins: Twin[] = []

for (const r of reports) {
  const scope = { curriculum: r.curriculum, grade: r.grade, subjectDir: r.subject }
  const pdfKey = catalogKey(scope, "textbook.pdf")
  const mdKey = catalogKey(scope, "textbook.md")
  const dir = join(REPO, r.curriculum, r.grade, r.subject)
  const pdfFile = join(dir, "textbook.pdf")
  const mdFile = join(dir, "textbook.md")
  const fm = frontMatter(mdFile)
  const structure = JSON.parse(readFileSync(join(dir, "structure.json"), "utf8"))
  const pagesMdDir = join(dir, "pages-md")
  const num = (v: string | undefined) =>
    v !== undefined && v !== "" && Number.isFinite(Number(v)) ? Number(v) : null

  const t: Twin = {
    id: r.id,
    curriculum: r.curriculum,
    grade: r.grade,
    subject: r.subject,
    pdfUrl: catalogUrl(pdfKey, CDN),
    mdUrl: catalogUrl(mdKey, CDN),
    pdf: { locked: Boolean(lock[pdfKey]), local: existsSync(pdfFile) },
    md: { exists: existsSync(mdFile) },
    extraction:
      fm.extraction ??
      (fm.generator?.includes("tesseract") ? "ocr" : fm.generator ? "text-layer" : "none"),
    agreement: num(fm.agreement),
    agreementSample: num(fm.agreementSample),
    quality: fm.quality ?? "",
    pages: structure.verification?.pages ?? null,
    pagesMd: existsSync(pagesMdDir)
      ? readdirSync(pagesMdDir).filter((f) => /^\d+\.md$/.test(f)).length
      : 0,
    sourceMatches: existsSync(pdfFile) && fm.sourceMd5 ? fm.sourceMd5 === md5(pdfFile) : null,
    twinGate: r.gates.twin,
    twinReason: r.gates.twin ? "" : (r.reasons.find((x) => x.startsWith("twin:")) ?? ""),
    problems: [],
  }
  if (!t.pdf.locked) t.problems.push("textbook.pdf is not in assets.lock.json")
  if (!t.md.exists) t.problems.push("textbook.md is missing")
  if (t.sourceMatches === false)
    t.problems.push("textbook.md sourceMd5 does not match textbook.pdf")
  twins.push(t)
}

if (cdn) {
  await Promise.all(
    twins.map(async (t) => {
      const [p, m] = await Promise.all([head(t.pdfUrl), head(t.mdUrl)])
      const locked =
        lock[
          catalogKey(
            { curriculum: t.curriculum, grade: t.grade, subjectDir: t.subject },
            "textbook.pdf"
          )
        ]
      t.pdf.status = p.status
      t.pdf.bytesMatch = locked ? p.bytes === locked.bytes : undefined
      t.md.status = m.status
      if (t.md.exists)
        t.md.published = m.etag === md5(join(REPO, t.curriculum, t.grade, t.subject, "textbook.md"))
      if (p.status !== 200) t.problems.push(`PDF URL answers ${p.status}`)
      else if (t.pdf.bytesMatch === false)
        t.problems.push("CDN PDF size differs from the locked PDF")
      if (m.status !== 200) t.problems.push(`Markdown URL answers ${m.status}`)
      else if (t.md.published === false)
        t.problems.push("CDN textbook.md differs from the repo (run pnpm publish:cdn)")
    })
  )
}

const summary = {
  subjects: twins.length,
  pdf: twins.filter((t) => t.pdf.locked).length,
  md: twins.filter((t) => t.md.exists).length,
  vision: twins.filter((t) => t.extraction === "vision").length,
  twinGate: twins.filter((t) => t.twinGate).length,
  ...(cdn
    ? {
        pdfLive: twins.filter((t) => t.pdf.status === 200).length,
        mdLive: twins.filter((t) => t.md.status === 200).length,
        mdDrift: twins.filter((t) => t.md.published === false).length,
      }
    : {}),
  problems: twins.reduce((n, t) => n + t.problems.length, 0),
}

const scopeName = `${curricula.join("-") || "all"}${grade ? `-${grade}` : ""}`
const out = { generatedAt: new Date().toISOString(), scope: scopeName, cdn, summary, twins }
if (existsSync(join(REPO, ".work")) || !process.env.CI) {
  mkdirSync(join(REPO, ".work", "twins"), { recursive: true })
  writeFileSync(
    join(REPO, ".work", "twins", `${scopeName}.json`),
    JSON.stringify(out, null, 1) + "\n"
  )
}

if (asJson) console.log(JSON.stringify(out, null, 1))
else {
  const w = Math.max(28, ...twins.map((t) => t.id.length))
  const yes = (b: boolean | undefined) => (b === undefined ? "  " : b ? "✅" : "❌")
  console.log(
    `${"subject".padEnd(w)}  pdf md  ${cdn ? "live  sync " : ""}extraction  agree   pages-md  twin`
  )
  for (const t of twins)
    console.log(
      [
        t.id.padEnd(w),
        ` ${yes(t.pdf.locked)} ${yes(t.md.exists)}`,
        cdn ? ` ${yes(t.pdf.status === 200 && t.md.status === 200)}  ${yes(t.md.published)} ` : "",
        ` ${t.extraction.padEnd(10)}`,
        ` ${t.agreement === null ? "  —  " : t.agreement.toFixed(3)}`,
        ` ${String(t.pagesMd).padStart(4)}/${String(t.pages ?? "?").padEnd(4)}`,
        ` ${yes(t.twinGate)}`,
      ].join("")
    )
  console.log(
    `\n${summary.subjects} subjects — pdf ${summary.pdf} · md ${summary.md} · vision ${summary.vision} · twin gate ${summary.twinGate}` +
      (cdn ? ` · live ${summary.pdfLive}/${summary.mdLive} · md drift ${summary.mdDrift}` : "")
  )
  console.log(`URLs: ${CDN}/catalog/<curriculum>/<grade>/<subject>/textbook.{pdf,md}`)
  const bad = twins.filter((t) => t.problems.length)
  if (bad.length) {
    console.log(`\nproblems:`)
    for (const t of bad) for (const p of t.problems) console.log(`  ✗ ${t.id}: ${p}`)
  }
}

if (summary.problems) process.exit(1)
