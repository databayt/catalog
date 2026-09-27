// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The one rule that ties the repository to the CDN: the repo mirrors it.
 *
 *   <repo>/sd/g6/math/exams.json  <->  cdn.databayt.org/catalog/sd/g6/math/exams.json
 *
 * The repository root IS `catalog/`. A file's path in the repo, prefixed with
 * `catalog/`, is its CDN key. There are no override tables, no per-curriculum
 * exceptions and no slug<->folder maps: the subject id is
 * `<curriculum>-<grade>-<subject>`, derived from the same three segments.
 */

import { CATALOG_ROOT } from "./key.ts"

/**
 * Top-level repo entries that are tooling, not content. They can never be
 * curriculum ids. Everything else at the root must be a curriculum folder, or
 * one of the published root files (index.json, schema/*.schema.json).
 */
export const RESERVED = [
  "src",
  "schema",
  "scripts",
  "vocab",
  "docs",
  "node_modules",
  "dist",
] as const

/** `sd/g6/math/exams.json` -> `catalog/sd/g6/math/exams.json` */
export function pathToKey(repoPath: string): string {
  const p = repoPath.replace(/^\.?\/+/, "")
  if (!p || p.startsWith("../") || p.startsWith("/"))
    throw new Error(`pathToKey: ${JSON.stringify(repoPath)} is not a repo-relative path`)
  return `${CATALOG_ROOT}/${p}`
}

/** `catalog/sd/g6/math/exams.json` -> `sd/g6/math/exams.json` */
export function keyToPath(key: string): string {
  if (!key.startsWith(`${CATALOG_ROOT}/`))
    throw new Error(`keyToPath: ${JSON.stringify(key)} is outside ${CATALOG_ROOT}/`)
  return key.slice(CATALOG_ROOT.length + 1)
}

/** The stable subject id every consuming app keys on. */
export function subjectId(curriculum: string, grade: string, subject: string): string {
  return `${curriculum}-${grade}-${subject}`
}

/** Text files a subject, chapter or lesson folder may hold. */
export const TEXT_FILES = {
  subject: ["structure.json", "qbank.json", "exams.json", "textbook.md"],
  chapter: ["qbank.json", "exams.json"],
  lesson: ["qbank.json", "exams.json"],
} as const

/** Binary files a subject folder may hold. They live on the CDN, not in git. */
export const BINARY_FILES = ["textbook.pdf", "cover.jpg", "thumbnail.jpg", "banner.jpg"] as const

/** Sub-folders a subject may hold besides its chapters. */
export const SUBJECT_DIRS = {
  /** `pages/<N>.webp` — one rendered image per PDF page (binary). */
  pages: /^[1-9]\d*\.webp$/,
  /** `pages-md/<N>.md` — the per-page Markdown twin, plus its transcription contract. */
  "pages-md": /^([1-9]\d*|_CONTRACT)\.md$/,
} as const

export const BINARY_EXT = /\.(pdf|jpe?g|png|webp|svg|gif|mp4|mp3)$/i
