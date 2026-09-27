// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * @databayt/catalog — the consumer surface. Pure functions and constants, no
 * I/O: build a CDN key, turn it into a URL, map a repo path to a key, and the
 * shared concept/clickview art vocabulary.
 *
 *   import { catalogKey, catalogUrl } from "@databayt/catalog"
 *   catalogUrl(catalogKey({ curriculum: "sd", grade: "g12", subjectDir: "biology" }, "textbook.pdf"))
 *     -> "https://cdn.databayt.org/catalog/sd/g12/biology/textbook.pdf"
 *
 * Types for every catalog file live in "@databayt/catalog/schema".
 */

export * from "./key.ts"
export * from "./paths.ts"
export * from "./url.ts"
export * from "./clickview.ts"
export * from "./concepts.ts"
