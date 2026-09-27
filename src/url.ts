// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

import { encodeCatalogKey } from "./key.ts"

export const CATALOG_CDN = "https://cdn.databayt.org"

/** Public URL for a catalog key. Pass your own origin to point at a mirror. */
export function catalogUrl(key: string, origin: string = CATALOG_CDN): string {
  return `${origin.replace(/\/+$/, "")}/${encodeCatalogKey(key)}`
}

/** The published index of every curriculum, grade and subject. */
export function catalogIndexUrl(origin: string = CATALOG_CDN): string {
  return catalogUrl("catalog/index.json", origin)
}
