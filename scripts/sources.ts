// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * Circulating copies of our textbooks, found and measured — the corroboration half of the
 * book gate (`docs/verification.md`). It never decides an edition: the imprint page does.
 *
 *   pnpm sources almualm sd <grade|all> [--fetch]
 *
 * almualm.com (موقع المعلم) is an aggregator that hosts nothing; its chain is
 * grade page -> subject page («مادة …») -> book post («كتاب …») -> Google Drive files, and a
 * post that carries two files labels them «الكتاب الجديد» / «الكتاب القديم». Its titles say
 * "2027 / 1448" — marketing, not an edition statement.
 *
 * Writes `.work/verify/sources/almualm-<cur>-<grade>.json`: per catalog subject, every Drive file
 * found with its label, bytes and filename (HEAD). With --fetch each file is downloaded beside it,
 * and md5 + page count are compared with our locked PDF:
 *   same-new   our PDF is the copy almualm calls new (md5 equal, or same page count)
 *   same-old   our PDF matches the copy almualm calls OLD — superseded candidate, read the imprint
 *   differs    no copy matches — read both imprints
 * Page count needs `pdfinfo` (poppler).
 */

import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

import { REPO } from "./lib/tree.ts"

const [site, cur, gradeArg] = process.argv.slice(2).filter((a) => !a.startsWith("--"))
const FETCH = process.argv.includes("--fetch")
if (site !== "almualm" || cur !== "sd" || !gradeArg) {
  console.error("usage: pnpm sources almualm sd <g1..g12|all> [--fetch]")
  process.exit(2)
}

const BASE = "https://www.almualm.com/الرئيسية/المنهج-السوداني/"
// almualm's grade slugs (its grade index, 2026-10-24); s12 splits into two streams.
const GRADES: Record<string, string[]> = {
  g1: ["s1"],
  g2: ["s2"],
  g3: ["s3"],
  g4: ["s4"],
  g5: ["الصف-الخامس-الاساسي"],
  g6: ["s6"],
  g7: ["الاول-المتوسط"],
  g8: ["s8"],
  g9: ["الثالث-المتوسط"],
  g10: ["s10"],
  g11: ["s11"],
  g12: ["s12/الثالث-الثانوي-القسم-العلمي", "s12/الثالث-الثانوي-القسم-الادبي"],
}
const UA = { "user-agent": "Mozilla/5.0 (databayt catalog verify)" }
const lock: Record<string, { sha256: string; bytes: number }> = JSON.parse(
  readFileSync(join(REPO, "assets.lock.json"), "utf8")
).assets

const get = async (url: string): Promise<string> => {
  // almualm times out now and then (2026-10-24: one connect timeout killed an all-grades crawl)
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(encodeURI(decodeURI(url)), { headers: UA, redirect: "follow", signal: AbortSignal.timeout(30_000) })
      return res.ok ? res.text() : ""
    } catch (e) {
      if (attempt === 3) { console.log(`  ! ${decodeURI(url).slice(-60)} — ${String(e).slice(0, 80)}`); return "" }
      await new Promise((r) => setTimeout(r, 2000 * attempt))
    }
  }
  return ""
}
const hrefs = (html: string, re: RegExp) => [...new Set([...html.matchAll(re)].map((m) => m[1]!))]
const slugText = (url: string) =>
  decodeURIComponent(url.replace(/\/$/, "").split("/").pop() ?? "").replace(/\.html$/, "")

/** Arabic name -> comparable key: no «مادة», no article, unified hamza/ya/ta-marbuta. */
// almualm subject names that differ from our structure.json titles
const ALIASES: Record<string, string> = {
  "العلوم الاسرية": "home-economics",
  "الدراسات الاسلامية": "islamic-studies",
  الاسلامية: "islamic-studies",
  "التربية الاسلامية": "islamic-studies",
  "علوم الحاسوب": "computer-science",
  الانجليزي: "english",
  "اللغة الانجليزية": "english",
}
const norm = (s: string) =>
  s
    .replace(/[-_]/g, " ")
    .replace(/مادة|كتاب/g, " ")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .split(/\s+/)
    .map((w) => w.replace(/^ال/, ""))
    .filter((w) => w && !/^(الصف|صف|السودان|pdf|\d+)$/.test(w))
    .join(" ")

type Found = {
  label: "new" | "old" | "only"
  post: string
  title: string
  driveId: string
  url: string
  bytes?: number
  filename?: string
  md5?: string
  pages?: number
  similarity?: number
  offset?: number
}

async function drivesIn(post: string): Promise<Found[]> {
  const raw = await get(post)
  const html = raw.replace(/<!--[\s\S]*?-->/g, " ") // older ids survive in comments
  const title = slugText(post).replace(/-/g, " ")
  const ids: { id: string; at: number; url: string }[] = []
  for (const m of html.matchAll(
    /(?:drive\.usercontent\.google\.com\/[^"'\s]*?[?&]id=|drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?[^"'\s]*?id=))([A-Za-z0-9_-]{20,})/g
  ))
    if (!ids.some((x) => x.id === m[1]))
      ids.push({
        id: m[1]!,
        at: m.index!,
        url: `https://drive.usercontent.google.com/download?id=${m[1]}&export=download`,
      })
  // some posts host the file on almualm itself (and embed it in a pdf.js viewer: ?file=<same url>)
  for (const m of html.matchAll(
    /(https:\/\/www\.almualm\.com\/wp-content\/uploads\/[^"'\s<>?]+\.pdf)/g
  )) {
    const url = decodeURI(m[1]!)
    const id = createHash("md5").update(url).digest("hex").slice(0, 16)
    if (!ids.some((x) => x.id === id)) ids.push({ id, at: m.index!, url })
  }
  return ids.map(({ id, at, url }) => {
    const before = html.slice(Math.max(0, at - 1500), at).replace(/<[^>]+>/g, " ") + " " + url
    const iNew = before.lastIndexOf("الجديد"),
      iOld = before.lastIndexOf("القديم")
    const label: Found["label"] =
      ids.length === 1 ? "only" : iOld > iNew ? "old" : iNew >= 0 ? "new" : "only"
    return {
      label,
      post,
      title,
      driveId: id,
      url: encodeURI(url),
    }
  })
}

async function head(f: Found) {
  try {
    const res = await fetch(f.url, { method: "HEAD", headers: UA, redirect: "follow" })
    const len = res.headers.get("content-length")
    if (len) f.bytes = Number(len)
    const cd = res.headers.get("content-disposition") ?? ""
    const m = /filename\*?=(?:UTF-8'')?"?([^";]+)/i.exec(cd)
    if (m) f.filename = decodeURIComponent(m[1]!)
  } catch {}
}

function pdfPages(file: string): number | undefined {
  try {
    const out = execFileSync("pdfinfo", [file], { encoding: "utf8" })
    return Number(/^Pages:\s+(\d+)/m.exec(out)?.[1]) || undefined
  } catch {
    return undefined
  }
}

/**
 * Line-layout profile of one page's PRINTED CONTENT: the page is rendered ~560 px (long side), cropped to the
 * bounding box of its ink, and summarised as ink-per-row and ink-per-column, each resampled to 96
 * bins. Cropping + profiles survive what separates two scans of one edition — page size, margins,
 * scan quality (sd-g12-chemistry: identical p100, a 16x16 hash scored it 0.79-0.83).
 */
const profCache = new Map<string, number[] | null>()
function pageProfile(file: string, page: number): number[] | null {
  const k = `${file}#${page}`
  if (profCache.has(k)) return profCache.get(k)!
  let out: number[] | null = null
  try {
    const root = join(outDir, ".prof", createHash("md5").update(k).digest("hex"))
    mkdirSync(join(outDir, ".prof"), { recursive: true })
    const pgm = `${root}.pgm`
    if (!existsSync(pgm))
      execFileSync("pdftoppm", ["-f", String(page), "-l", String(page), "-gray", "-scale-to", "560", "-singlefile", file, root], { stdio: "ignore" })
    const buf = readFileSync(pgm)
    const head: number[] = []
    let off = 2
    while (head.length < 3) {
      while (buf[off] === 0x20 || buf[off] === 0x0a || buf[off] === 0x0d) off++
      let n = 0
      while (buf[off]! >= 0x30 && buf[off]! <= 0x39) n = n * 10 + buf[off++]! - 0x30
      head.push(n)
    }
    const [w, h] = head as [number, number]
    const px = buf.subarray(off + 1)
    const ink = (x: number, y: number) => px[y * w + x]! < 160
    let x0 = w, y0 = h, x1 = -1, y1 = -1
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++)
        if (ink(x, y)) {
          if (x < x0) x0 = x
          if (x > x1) x1 = x
          if (y < y0) y0 = y
          if (y > y1) y1 = y
        }
    if (x1 > x0 + 10 && y1 > y0 + 10) {
      const rows = new Array(y1 - y0 + 1).fill(0), cols = new Array(x1 - x0 + 1).fill(0)
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (ink(x, y)) { rows[y - y0]++; cols[x - x0]++ }
      const resample = (v: number[], bins = 96) => {
        const max = Math.max(...v, 1)
        return Array.from({ length: bins }, (_, i) => {
          const t = (i * (v.length - 1)) / (bins - 1), lo = Math.floor(t), hi = Math.min(lo + 1, v.length - 1)
          return (v[lo]! + (v[hi]! - v[lo]!) * (t - lo)) / max
        })
      }
      out = [...resample(rows), ...resample(cols)]
    }
  } catch {}
  profCache.set(k, out)
  return out
}

function pearson(a: number[], b: number[]) {
  const n = a.length, ma = a.reduce((x, y) => x + y) / n, mb = b.reduce((x, y) => x + y) / n
  let sab = 0, saa = 0, sbb = 0
  for (let i = 0; i < n; i++) { const da = a[i]! - ma, db = b[i]! - mb; sab += da * db; saa += da * da; sbb += db * db }
  return saa && sbb ? sab / Math.sqrt(saa * sbb) : 0
}

/**
 * Visual similarity of two PDFs (Pearson of the layout profiles, 0..1): five content pages of ours
 * against theirs at offsets -1..+2 — circulating copies add a promo leaf (almualm: ours + 1 page).
 * Measured 2026-10-24: byte-identical 1.0 · same edition, another scan 0.90-0.95 · another edition
 * of the subject 0.34-0.54 (g10 history's OLD edition has OUR page count and still scores 0.54).
 */
function similarity(ours: string, oursPages: number, theirs: string, theirPages: number) {
  const probes = [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => Math.max(3, Math.round(oursPages * f)))
  let best = { score: 0, offset: 0 }
  for (const offset of [0, 1, -1, 2]) {
    const scores: number[] = []
    for (const p of probes) {
      const q = p + offset
      if (q < 1 || q > theirPages) continue
      const a = pageProfile(ours, p), b = pageProfile(theirs, q)
      if (a && b) scores.push(pearson(a, b))
    }
    const s = scores.length ? scores.reduce((x, y) => x + y) / scores.length : 0
    if (s > best.score) best = { score: Math.round(s * 1000) / 1000, offset }
  }
  return best
}

const md5 = (file: string) => createHash("md5").update(readFileSync(file)).digest("hex")
const grades = gradeArg === "all" ? Object.keys(GRADES) : [gradeArg]
const outDir = join(REPO, ".work", "verify", "sources")
mkdirSync(outDir, { recursive: true })

for (const grade of grades) {
  const ours = readdirSync(join(REPO, cur, grade), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(REPO, cur, grade, d.name, "structure.json")))
    .map((d) => {
      const s = JSON.parse(readFileSync(join(REPO, cur, grade, d.name, "structure.json"), "utf8"))
      const key = `catalog/${cur}/${grade}/${d.name}/textbook.pdf`
      const local = join(REPO, cur, grade, d.name, "textbook.pdf")
      return {
        subject: d.name,
        title: String(s.title?.ar ?? ""),
        bytes: lock[key]?.bytes,
        local: existsSync(local) ? local : null,
      }
    })

  const subjectPages: string[] = []
  for (const g of GRADES[grade]!) {
    const html = await get(BASE + g + "/")
    subjectPages.push(
      ...hrefs(
        html,
        /href="(https:\/\/www\.almualm\.com\/[^"]*?\/(?:%d9%85%d8%a7%d8%af%d8%a9|مادة)[^"]*)"/gi
      )
    )
  }

  const rows: Record<string, { almualm: string; books: Found[] }> = {}
  const unmatched: string[] = []
  for (const sp of [...new Set(subjectPages)]) {
    const name = slugText(sp)
    const key = norm(name)
    const alias = Object.entries(ALIASES).find(([k]) => norm(k) === key)?.[1]
    const hit = alias
      ? ours.find((o) => o.subject === alias)
      : ours.find((o) => {
          const t = norm(o.title)
          return t && (t === key || t.includes(key) || key.includes(t))
        })
    const posts = hrefs(
      await get(sp),
      /href="(https:\/\/www\.almualm\.com\/20\d\d\/\d\d\/[^"]+\.html)"/g
    ).filter((p) => /^كتاب/.test(slugText(p)))
    const books: Found[] = []
    for (const p of posts) books.push(...(await drivesIn(p)))
    for (const b of books) await head(b)
    if (!hit) {
      unmatched.push(`${name} (${books.length} files)`)
      continue
    }
    rows[hit.subject] = { almualm: name, books: [...(rows[hit.subject]?.books ?? []), ...books] }
  }

  console.log(`\n${cur}-${grade} — almualm`)
  for (const o of ours) {
    const r = rows[o.subject]
    if (!r) {
      console.log(`  ·  ${o.subject.padEnd(24)} not on almualm`)
      continue
    }
    let verdict = ""
    if (FETCH && o.local) {
      const mine = { md5: md5(o.local), pages: pdfPages(o.local) }
      for (const b of r.books) {
        const file = join(outDir, `${cur}-${grade}-${o.subject}-${b.driveId}.pdf`)
        if (!existsSync(file)) {
          const res = await fetch(b.url, { headers: UA, redirect: "follow" }).catch(() => null)
          if (!res) continue
          if (!res.ok || (res.headers.get("content-type") ?? "").includes("html")) continue // a Drive confirm page, not a file
          writeFileSync(file, Buffer.from(await res.arrayBuffer()))
        }
        b.md5 = md5(file)
        b.pages = pdfPages(file)
        if (mine.pages && b.pages) {
          const sim = similarity(o.local, mine.pages, file, b.pages)
          b.similarity = sim.score
          b.offset = sim.offset
        }
      }
      // byte-identical, else the visually closest copy at >= 0.9 (page counts alone mislead: +1 promo leaf)
      const SAME = 0.8
      const match =
        r.books.find((b) => b.md5 === mine.md5) ??
        [...r.books].filter((b) => (b.similarity ?? 0) >= SAME).sort((x, y) => (y.similarity ?? 0) - (x.similarity ?? 0))[0]
      verdict = !match
        ? "differs — read both imprints"
        : match.label === "old"
          ? "same-old — SUPERSEDED candidate"
          : "same-new"
      verdict += ` (ours ${mine.pages ?? "?"}p)`
    }
    const files = r.books
      .map((b) => `${b.label}:${b.bytes ?? "?"}B${b.pages ? `/${b.pages}p` : ""}${b.similarity !== undefined ? `~${b.similarity}` : ""}`)
      .join(" ")
    console.log(
      `  ${verdict.startsWith("same-new") ? "=" : verdict ? "≠" : "?"}  ${o.subject.padEnd(24)} ours ${o.bytes ?? "?"}B · ${files || "no book post"}${verdict ? ` · ${verdict}` : ""}`
    )
  }
  if (unmatched.length) console.log(`  unmatched almualm subjects: ${unmatched.join(", ")}`)
  const out = join(outDir, `almualm-${cur}-${grade}.json`)
  writeFileSync(
    out,
    JSON.stringify(
      {
        site: "almualm.com",
        crawledOn: new Date().toISOString().slice(0, 10),
        grade,
        subjects: rows,
        unmatched,
      },
      null,
      1
    ) + "\n"
  )
  console.log(`  → ${out}`)
}
