// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * Publish the text half of the catalog to the CDN: every JSON and Markdown
 * file in the curriculum folders (at its key), the root index.json at
 * catalog/index.json, and schema/*.schema.json at catalog/schema/. Binaries are `pnpm assets push`'s job.
 *
 * Only changed objects are uploaded (MD5 vs the bucket's ETag), and the
 * CloudFront paths that changed are invalidated — collapsed to one wildcard
 * per subject so a big publish stays a handful of invalidation paths.
 * Nothing is deleted unless --prune is passed, and then only text keys the
 * catalog itself wrote. Pre-catalog keys are never deleted.
 *
 *   pnpm publish:cdn                        dry run: list what would change
 *   pnpm publish:cdn --apply                upload new + changed catalog keys, invalidate
 *   pnpm publish:cdn --apply --overwrite    also replace pre-catalog keys (see CATALOG_EPOCH)
 *   pnpm publish:cdn --apply --prune        also delete catalog-owned text keys the repo no longer has
 *   pnpm publish:cdn --apply sd gb          limit to some curricula
 */

import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3"
import { createHash } from "node:crypto"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

import { pathToKey } from "../src/paths.ts"
import { BUCKET, DISTRIBUTION, REGION, contentType, listPrefix, pool, s3 } from "./lib/s3.ts"
import { REPO, contentDirs } from "./lib/tree.ts"

const apply = process.argv.includes("--apply")

function* walk(dir: string): Generator<string> {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (/\.(json|md)$/.test(n)) yield p
  }
}

// Optional curriculum filter: `pnpm publish:cdn --apply --overwrite gb us`
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"))

const files: { key: string; file: string }[] = []
const published = [
  ...contentDirs().flatMap((d) => [...walk(join(REPO, d))]),
  join(REPO, "index.json"),
  ...readdirSync(join(REPO, "schema"))
    .filter((n) => n.endsWith(".schema.json"))
    .map((n) => join(REPO, "schema", n)),
]
for (const f of published) files.push({ key: pathToKey(relative(REPO, f)), file: f })

if (only.length)
  files.splice(
    0,
    files.length,
    ...files.filter(
      ({ key }) =>
        // the index and schemas describe every curriculum, so they always go
        key === "catalog/index.json" ||
        key.startsWith("catalog/schema/") ||
        only.some((c) => key.startsWith(`catalog/${c}/`))
    )
  )

const remote = await listPrefix("catalog/")
const overwrite = process.argv.includes("--overwrite")
const differs = (key: string, file: string) =>
  remote.get(key)!.etag !== createHash("md5").update(readFileSync(file)).digest("hex")
const fresh = files.filter(({ key }) => !remote.has(key))
// Catalog-owned keys (written since CATALOG_EPOCH) update freely.
const owned = files.filter(
  ({ key, file }) => remote.has(key) && !remote.get(key)!.foreign && differs(key, file)
)
// Foreign keys predate the repo; apps may still read their old shape there.
const foreign = files.filter(({ key, file }) => remote.get(key)?.foreign && differs(key, file))
const changed = [...fresh, ...owned, ...(overwrite ? foreign : [])]

// --prune: catalog-owned text keys the repo no longer has (a renamed folder's
// old copy). Pre-catalog keys and binaries are never pruned.
const prune = process.argv.includes("--prune")
const current = new Set(files.map((f) => f.key))
const orphans = prune
  ? [...remote]
      .filter(([key, o]) => !o.foreign && /\.(json|md)$/.test(key) && !current.has(key))
      .filter(([key]) => !only.length || only.some((c) => key.startsWith(`catalog/${c}/`)))
      .map(([key]) => key)
  : []

console.log(
  `${files.length} text files · ${fresh.length} new · ${owned.length} updated · ${foreign.length} pre-catalog keys differ${overwrite ? " (replacing)" : " (kept — pass --overwrite to replace)"}${prune ? ` · ${orphans.length} orphans to delete` : ""}${apply ? "" : " — dry run, pass --apply"}`
)
if (!apply) {
  for (const c of changed.slice(0, 30)) console.log(`  ${c.key}`)
  if (changed.length > 30) console.log(`  … ${changed.length - 30} more`)
  for (const k of orphans.slice(0, 10)) console.log(`  delete ${k}`)
  if (orphans.length > 10) console.log(`  … ${orphans.length - 10} more to delete`)
  process.exit(0)
}

let done = 0
await pool(changed, 16, async ({ key, file }) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: readFileSync(file),
      ContentType: contentType(key),
      // Text changes as the catalog evolves: short edge cache, invalidated on publish.
      CacheControl: "public, max-age=3600, stale-while-revalidate=86400",
    })
  )
  if (++done % 500 === 0) console.log(`  ${done}/${changed.length}`)
})
console.log(`uploaded ${done}`)

for (let i = 0; i < orphans.length; i += 1000) {
  const batch = orphans.slice(i, i + 1000)
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: batch.map((Key) => ({ Key })), Quiet: true },
    })
  )
}
if (orphans.length) console.log(`deleted ${orphans.length} orphan(s)`)

// Collapse to subject-level wildcards (or the file itself above subject level).
const paths = new Set<string>()
for (const key of [...changed.map((c) => c.key), ...orphans]) {
  const parts = key.split("/")
  paths.add(parts.length > 5 ? `/${parts.slice(0, 4).join("/")}/*` : `/${key}`)
}
if (paths.size) {
  const list = paths.size > 300 ? ["/catalog/*"] : [...paths]
  const cf = new CloudFrontClient({ region: REGION })
  const r = await cf.send(
    new CreateInvalidationCommand({
      DistributionId: DISTRIBUTION,
      InvalidationBatch: {
        CallerReference: `catalog-${Date.now()}`,
        Paths: { Quantity: list.length, Items: list },
      },
    })
  )
  console.log(`invalidation ${r.Invalidation?.Id}: ${list.length} path(s)`)
}
