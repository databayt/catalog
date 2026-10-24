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

const get = async (url: string) => {
  const res = await fetch(encodeURI(decodeURI(url)), { headers: UA, redirect: "follow" })
  return res.ok ? res.text() : ""
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

/** Difference hash of one page: 17x16 grey render (pdftoppm), 256 bits, cached per file+page. */
const hashCache = new Map<string, boolean[] | null>()
function pageHash(file: string, page: number): boolean[] | null {
  const k = `${file}#${page}`
  if (hashCache.has(k)) return hashCache.get(k)!
  let bits: boolean[] | null = null
  try {
    const root = join(outDir, ".hash", createHash("md5").update(k).digest("hex"))
    mkdirSync(join(outDir, ".hash"), { recursive: true })
    execFileSync(
      "pdftoppm",
      [
        "-f",
        String(page),
        "-l",
        String(page),
        "-gray",
        "-scale-to-x",
        "17",
        "-scale-to-y",
        "16",
        "-singlefile",
        file,
        root,
      ],
      { stdio: "ignore" }
    )
    const buf = readFileSync(`${root}.pgm`)
    // P5\n17 16\n255\n<272 bytes>
    let off = 0,
      fields = 0
    while (fields < 4) {
      while (buf[off] === 0x20 || buf[off] === 0x0a) off++
      while (buf[off] !== 0x20 && buf[off] !== 0x0a) off++
      fields++
    }
    const px = buf.subarray(off + 1)
    bits = []
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) bits.push(px[y * 17 + x]! > px[y * 17 + x + 1]!)
  } catch {}
  hashCache.set(k, bits)
  return bits
}

/**
 * Visual similarity of two PDFs (0..1): five content pages of ours against theirs at offsets
 * -1..+2 — circulating copies add a promo leaf (almualm: ours + 1 page, consistently).
 * The same edition re-saved scores ~0.95+; a different edition of the subject scores far lower.
 */
function similarity(ours: string, oursPages: number, theirs: string, theirPages: number) {
  const probes = [0.1, 0.3, 0.5, 0.7, 0.9].map((f) => Math.max(3, Math.round(oursPages * f)))
  let best = { score: 0, offset: 0 }
  for (const offset of [0, 1, -1, 2]) {
    const scores: number[] = []
    for (const p of probes) {
      const q = p + offset
      if (q < 1 || q > theirPages) continue
      const a = pageHash(ours, p),
        b = pageHash(theirs, q)
      if (a && b) scores.push(a.filter((v, i) => v === b[i]).length / a.length)
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
          const res = await fetch(b.url, { headers: UA, redirect: "follow" })
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
      const SAME = 0.9
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
