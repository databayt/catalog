// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * Binaries (PDFs, covers, page renders) are not in git. They live on the CDN
 * and `assets.lock.json` pins each one by sha256, so the repo still says
 * exactly which bytes belong to which path.
 *
 *   pnpm assets lock              hash every local binary -> assets.lock.json
 *   pnpm assets status            lockfile vs the bucket: what is missing or differs
 *   pnpm assets push [prefix] [--apply] [--overwrite]
 *                                 upload locked binaries the bucket lacks (dry run by default);
 *                                 --overwrite also replaces live objects that differ;
 *                                 a prefix narrows the blast radius (e.g. sd/g12)
 *   pnpm assets pull [prefix]     download locked binaries missing locally (public CDN, no creds)
 *   pnpm assets verify            re-hash local binaries against the lockfile
 *
 * `push` and `status` need AWS credentials with read/write on the bucket;
 * `pull` needs none.
 */

import { PutObjectCommand } from "@aws-sdk/client-s3"
import { createHash } from "node:crypto"
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { dirname, join, relative } from "node:path"

import { BINARY_EXT, keyToPath, pathToKey } from "../src/paths.ts"
import { BUCKET, CDN, contentType, invalidate, listPrefix, pool, s3 } from "./lib/s3.ts"
import { REPO, contentDirs } from "./lib/tree.ts"

const LOCK = join(REPO, "assets.lock.json")

type Entry = { sha256: string; bytes: number }
type Lock = { $comment: string; bucket: string; cdn: string; assets: Record<string, Entry> }

const readLock = (): Lock =>
  existsSync(LOCK)
    ? JSON.parse(readFileSync(LOCK, "utf8"))
    : { $comment: "", bucket: BUCKET, cdn: CDN, assets: {} }

function writeLock(assets: Record<string, Entry>) {
  const sorted = Object.fromEntries(Object.entries(assets).sort(([a], [b]) => a.localeCompare(b)))
  const lock: Lock = {
    $comment:
      "Binaries that belong to the catalog but live on the CDN, not in git. Key = CDN key = 'catalog/' + repo path (the repo mirrors the CDN). Maintained by `pnpm assets lock`.",
    bucket: BUCKET,
    cdn: CDN,
    assets: sorted,
  }
  writeFileSync(LOCK, JSON.stringify(lock, null, 1) + "\n")
}

function* walk(dir: string): Generator<string> {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (BINARY_EXT.test(n)) yield p
  }
}

const sha256 = (file: string) =>
  new Promise<string>((res, rej) => {
    const h = createHash("sha256")
    createReadStream(file)
      .on("data", (d) => h.update(d))
      .on("end", () => res(h.digest("hex")))
      .on("error", rej)
  })

const md5 = (file: string) => createHash("md5").update(readFileSync(file)).digest("hex")

async function lock() {
  const prev = readLock().assets
  const files = contentDirs().flatMap((d) => [...walk(join(REPO, d))])
  const next: Record<string, Entry> = {}
  let hashed = 0
  await pool(files, 16, async (f) => {
    const key = pathToKey(relative(REPO, f))
    const bytes = statSync(f).size
    // Re-hash only what changed size (cheap) — a same-size edit needs `verify`.
    next[key] = prev[key]?.bytes === bytes ? prev[key]! : { sha256: await sha256(f), bytes }
    if (!prev[key] || prev[key].bytes !== bytes) hashed++
  })
  // Entries whose file is absent locally (never pulled) are kept, not dropped.
  for (const [k, v] of Object.entries(prev))
    if (!next[k] && !existsSync(join(REPO, keyToPath(k)))) next[k] = v
  writeLock(next)
  console.log(`locked ${Object.keys(next).length} binaries (${hashed} hashed)`)
}

async function remoteState(prefix = "") {
  const { assets } = readLock()
  const remote = await listPrefix("catalog/")
  const missing: string[] = []
  const differs: string[] = []
  const scope = `catalog/${prefix}`
  for (const [key, e] of Object.entries(assets)) {
    if (!key.startsWith(scope)) continue
    const r = remote.get(key)
    if (!r) missing.push(key)
    else if (r.size !== e.bytes) differs.push(key)
  }
  return { assets, remote, missing, differs }
}

async function status(prefix: string) {
  const { missing, differs } = await remoteState(prefix)
  const { assets } = readLock()
  const inScope = Object.keys(assets).filter((k) => k.startsWith(`catalog/${prefix}`)).length
  console.log(
    `${inScope} locked${prefix ? ` under ${prefix}` : ""} · ${missing.length} missing on ${BUCKET} · ${differs.length} differ in size`
  )
  for (const k of missing.slice(0, 20)) console.log(`  missing  ${k}`)
  if (missing.length > 20) console.log(`  … ${missing.length - 20} more`)
  for (const k of differs.slice(0, 20)) console.log(`  differs  ${k}`)
  if (differs.length > 20) console.log(`  … ${differs.length - 20} more`)
}

async function push(apply: boolean, overwrite: boolean, prefix: string) {
  const { missing, differs } = await remoteState(prefix)
  // Replacing a live object is opt-in: it changes what every app serves, and the
  // CDN caches catalog keys as immutable, so it also needs an invalidation.
  const wanted = overwrite ? [...missing, ...differs] : missing
  if (differs.length && !overwrite)
    console.log(
      `${differs.length} live object(s) differ from the lockfile — pass --overwrite to replace them` +
        (prefix ? "" : " (narrow the blast radius with a prefix: `pnpm assets push sd/g12 --overwrite`)")
    )
  const todo = wanted.filter((k) => existsSync(join(REPO, keyToPath(k))))
  const absent = wanted.length - todo.length
  console.log(
    `${todo.length} to upload${absent ? ` (${absent} not present locally — pull or re-render them)` : ""}${apply ? "" : " — dry run, pass --apply"}`
  )
  if (!apply) {
    for (const k of todo.slice(0, 30)) console.log(`  ${k}`)
    return
  }
  let done = 0
  await pool(todo, 8, async (key) => {
    const file = join(REPO, keyToPath(key))
    const body = readFileSync(file)
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType(key),
        ContentMD5: Buffer.from(md5(file), "hex").toString("base64"),
        CacheControl: "public, max-age=31536000, immutable",
      })
    )
    if (++done % 100 === 0) console.log(`  ${done}/${todo.length}`)
  })
  console.log(`uploaded ${done}`)
  // A replaced binary is cached `immutable` for a year — without this the edge keeps
  // serving the old bytes. A brand-new key has nothing cached, so only replacements matter.
  const replaced = todo.filter((k) => differs.includes(k))
  if (replaced.length) await invalidate(replaced)
}

async function pull(prefix: string) {
  const { assets } = readLock()
  const todo = Object.keys(assets).filter(
    (k) => k.startsWith(`catalog/${prefix}`) && !existsSync(join(REPO, keyToPath(k)))
  )
  console.log(`${todo.length} to download from ${CDN}`)
  let bad = 0
  await pool(todo, 16, async (key) => {
    const res = await fetch(`${CDN}/${key.split("/").map(encodeURIComponent).join("/")}`)
    if (!res.ok) {
      console.log(`  ${res.status} ${key}`)
      bad++
      return
    }
    const buf = Buffer.from(await res.arrayBuffer())
    if (createHash("sha256").update(buf).digest("hex") !== assets[key]!.sha256) {
      console.log(`  hash mismatch ${key}`)
      bad++
      return
    }
    const file = join(REPO, keyToPath(key))
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, buf)
  })
  if (bad) process.exit(1)
}

async function verify() {
  const { assets } = readLock()
  let bad = 0
  let checked = 0
  await pool(Object.entries(assets), 16, async ([key, e]) => {
    const file = join(REPO, keyToPath(key))
    if (!existsSync(file)) return
    checked++
    if ((await sha256(file)) !== e.sha256) {
      console.log(`  changed ${key}`)
      bad++
    }
  })
  console.log(`${checked} checked · ${bad} changed`)
  if (bad) process.exit(1)
}

const [cmd, arg] = process.argv.slice(2)
const apply = process.argv.includes("--apply")
switch (cmd) {
  case "lock":
    await lock()
    break
  case "status":
    await status(arg && !arg.startsWith("--") ? arg : "")
    break
  case "push":
    await push(apply, process.argv.includes("--overwrite"), arg && !arg.startsWith("--") ? arg : "")
    break
  case "pull":
    await pull(arg && !arg.startsWith("--") ? arg : "")
    break
  case "verify":
    await verify()
    break
  default:
    console.log(
      "usage: pnpm assets <lock|status [prefix]|push [prefix] [--apply] [--overwrite]|pull [prefix]|verify>"
    )
    process.exit(1)
}
