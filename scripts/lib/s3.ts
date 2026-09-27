// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

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

/** Every object under a prefix: key -> { size, etag }. */
export async function listPrefix(prefix: string) {
  const out = new Map<string, { size: number; etag: string }>()
  let token: string | undefined
  do {
    const r = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix, ContinuationToken: token })
    )
    for (const o of r.Contents ?? [])
      out.set(o.Key!, { size: o.Size ?? 0, etag: (o.ETag ?? "").replaceAll('"', "") })
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
