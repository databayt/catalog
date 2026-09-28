// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront"
import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"

/** The CDN origin. Private; read through CloudFront at cdn.databayt.org. */
export const BUCKET = process.env.CATALOG_BUCKET ?? "databayt-cdn"
export const REGION = process.env.AWS_REGION ?? "us-east-1"
export const CDN = process.env.CATALOG_CDN ?? "https://cdn.databayt.org"
export const DISTRIBUTION = process.env.CATALOG_DISTRIBUTION_ID ?? "E3PHDXTDSBCQSJ"

export const s3 = new S3Client({ region: REGION })

export const CONTENT_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  svg: "image/svg+xml",
  json: "application/json; charset=utf-8",
  md: "text/markdown; charset=utf-8",
}
export const contentType = (key: string) =>
  CONTENT_TYPES[key.split(".").pop()!.toLowerCase()] ?? "application/octet-stream"

/**
 * Objects written before this instant predate the catalog repo: other apps
 * wrote them and may still read their old shape (hogwarts reads structure.json
 * and textbook.md at these keys until it cuts over). The catalog updates its
 * own objects freely; replacing a foreign one takes an explicit --overwrite.
 */
export const CATALOG_EPOCH = new Date("2026-09-27T05:30:00Z")

/** Every object under a prefix: key -> { size, etag, foreign }. */
export async function listPrefix(prefix: string) {
  const out = new Map<string, { size: number; etag: string; foreign: boolean }>()
  let token: string | undefined
  do {
    const r = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: token })
    )
    for (const o of r.Contents ?? [])
      out.set(o.Key!, {
        size: o.Size ?? 0,
        etag: (o.ETag ?? "").replaceAll('"', ""),
        foreign: (o.LastModified ?? new Date(0)) < CATALOG_EPOCH,
      })
    token = r.IsTruncated ? r.NextContinuationToken : undefined
  } while (token)
  return out
}

/** Run `fn` over `items` with at most `n` in flight. */
export async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) await fn(items[i++]!)
    })
  )
}

/**
 * Invalidate the edge for a set of keys. Collapsed to subject-level wildcards (or the
 * file itself above subject level), and to `/catalog/*` past 300 paths.
 *
 * Every replaced object needs this, binaries most of all: they are served
 * `immutable, max-age=1y`, so without an invalidation a new upload keeps serving the
 * old bytes from the edge for a year and the fix only looks done.
 */
export async function invalidate(keys: string[]): Promise<string | undefined> {
  const paths = new Set<string>()
  for (const key of keys) {
    const parts = key.split("/")
    paths.add(parts.length > 5 ? `/${parts.slice(0, 4).join("/")}/*` : `/${key}`)
  }
  if (!paths.size) return
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
  return r.Invalidation?.Id
}
