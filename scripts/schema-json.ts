// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * Emit JSON Schema from the zod source so editors validate as you type and
 * non-TypeScript consumers get the same contract. Output: schema/*.schema.json,
 * published at catalog/schema/*.schema.json (the repo mirrors the CDN).
 *   pnpm schema:json           write
 *   pnpm schema:json --check   fail if stale (CI)
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { z } from "zod"

import { SCHEMAS } from "../schema/index.ts"

const OUT = join(import.meta.dirname, "..", "schema")
const check = process.argv.includes("--check")
let stale = 0

mkdirSync(OUT, { recursive: true })
for (const [name, schema] of Object.entries(SCHEMAS)) {
  const json = z.toJSONSchema(schema, { io: "input", unrepresentable: "any" })
  const text =
    JSON.stringify(
      { ...json, $id: `https://cdn.databayt.org/catalog/schema/${name}.schema.json`, title: name },
      null,
      2
    ) + "\n"
  const file = join(OUT, `${name}.schema.json`)
  if (check) {
    if (!existsSync(file) || readFileSync(file, "utf8") !== text) {
      console.error(`stale: schema/${name}.schema.json`)
      stale++
    }
  } else writeFileSync(file, text)
}
if (stale) process.exit(1)
console.log(check ? "✓ JSON Schema is current" : `wrote ${Object.keys(SCHEMAS).length} schemas`)
