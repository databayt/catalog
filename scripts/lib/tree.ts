// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

import { readdirSync, statSync } from "node:fs"
import { join } from "node:path"

import { RESERVED } from "../../src/paths.ts"

/** The repo root — which is also `catalog/` on the CDN. */
export const REPO = join(import.meta.dirname, "..", "..")

/**
 * Top-level folders that hold content: everything that is not hidden and not
 * tooling. Whether each one is a KNOWN curriculum is the validator's call.
 */
export function contentDirs(root: string = REPO): string[] {
  return readdirSync(root)
    .filter(
      (n) =>
        !n.startsWith(".") &&
        !n.startsWith("_") &&
        !(RESERVED as readonly string[]).includes(n) &&
        statSync(join(root, n)).isDirectory()
    )
    .sort()
}
