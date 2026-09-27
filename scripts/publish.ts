// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * Publish the text half of the catalog to the CDN: every JSON and Markdown
 * file under curricula/ (at its key), the index at catalog/index.json, and the
 * JSON Schemas at catalog/schema/. Binaries are `pnpm assets push`'s job.
 *
 * Only changed objects are uploaded (MD5 vs the bucket's ETag), and the
 * CloudFront paths that changed are invalidated — collapsed to one wildcard
 * per subject so a big publish stays a handful of invalidation paths.
 * Nothing is ever deleted: a renamed path leaves its old key live.
 *
 *   pnpm publish:cdn                        dry run: list what would change
 *   pnpm publish:cdn --apply                upload new keys + invalidate
 *   pnpm publish:cdn --apply --overwrite    also replace live keys that differ
 */

import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { createHash } from "node:crypto"
import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

import { CONTENT_ROOT, pathToKey } from "../src/paths.ts"
import { BUCKET, DISTRIBUTION, REGION, contentType, listPrefix, pool, s3 } from "./lib/s3.ts"

const REPO = join(import.meta.dirname, "..")
const apply = process.argv.includes("--apply")

function* walk(dir: string): Generator<string> {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n)
    if (statSync(p).isDirectory()) yield* walk(p)
    else if (/\.(json|md)$/.test(n)) yield p
  }
}

const files: { key: string; file: string }[] = []
for (const f of walk(join(REPO, CONTENT_ROOT)))
  files.push({ key: pathToKey(relative(REPO, f)), file: f })
for (const n of readdirSync(join(REPO, "schema", "json")))
  files.push({ key: `catalog/schema/${n}`, file: join(REPO, "schema", "json", n) })

const remote = await listPrefix("catalog/")
const overwrite = process.argv.includes("--overwrite")
const fresh = files.filter(({ key }) => !remote.has(key))
const stale = files.filter(({ key, file }) => {
  const r = remote.get(key)
  return r && r.etag !== createHash("md5").update(readFileSync(file)).digest("hex")
})
// Replacing a live key is opt-in: apps may still read the old shape there
// (hogwarts reads structure.json + textbook.md at these keys until it cuts over).
const changed = overwrite ? [...fresh, ...stale] : fresh

console.log(
  `${files.length} text files · ${fresh.length} new · ${stale.length} live keys differ${overwrite ? "" : " (kept — pass --overwrite to replace)"}${apply ? "" : " — dry run, pass --apply"}`
)
if (!apply) {
  for (const c of changed.slice(0, 30)) console.log(`  ${c.key}`)
  if (changed.length > 30) console.log(`  … ${changed.length - 30} more`)
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

// Collapse to subject-level wildcards (or the file itself above subject level).
const paths = new Set<string>()
for (const { key } of changed) {
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
