// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The phase gate's CLI. The gates themselves live in `scripts/lib/gate.ts`.
 *
 *   pnpm gate                          every curriculum, report + enforce `book`
 *   pnpm gate sd --grade g12           one grade
 *   pnpm gate --enforce all            enforce every gate (exit 1 on any violation)
 *   pnpm gate --enforce none           report only
 *   pnpm gate --json                   machine-readable
 *
 * `--enforce` names the deepest gate that is a hard failure. It rises as the grade
 * advances: `book` while twins are still being produced, `all` once they are.
 */

import { GATES, type Gate, gateReports } from "./lib/gate.ts"

const ENFORCE_LEVELS = ["none", "book", "structure", "twin", "all"] as const
type EnforceLevel = (typeof ENFORCE_LEVELS)[number]

const argv = process.argv.slice(2)
const flag = (name: string): string | undefined => {
  const i = argv.indexOf(`--${name}`)
  return i >= 0 ? argv[i + 1] : undefined
}

const asJson = argv.includes("--json")
const grade = flag("grade")
const enforce = (flag("enforce") ?? "book") as EnforceLevel
if (!ENFORCE_LEVELS.includes(enforce)) {
  console.error(`--enforce must be one of ${ENFORCE_LEVELS.join(" | ")}`)
  process.exit(2)
}
const curricula = argv.filter((a) => !a.startsWith("--") && a !== grade && a !== enforce)

const reports = gateReports({ curricula, grade })
const enforced: Gate[] =
  enforce === "none"
    ? []
    : enforce === "all"
      ? [...GATES]
      : GATES.slice(0, GATES.indexOf(enforce as Gate) + 1)
const offenders = reports.filter((r) => r.violations.length && enforced.some((g) => !r.gates[g]))

if (asJson) {
  console.log(JSON.stringify({ enforce, enforced, reports }, null, 1))
} else {
  const mark = (ok: boolean) => (ok ? "\u2705" : "\u274c")
  const w = Math.max(24, ...reports.map((r) => r.id.length))
  console.log(`${"subject".padEnd(w)}  book  str   twin  asmt`)
  for (const r of reports)
    console.log(
      `${r.id.padEnd(w)}  ${mark(r.gates.book)}    ${mark(r.gates.structure)}    ${mark(r.gates.twin)}    ${mark(r.gates.assessment)}`
    )
  const tally = (g: Gate) => reports.filter((r) => r.gates[g]).length
  console.log(
    `\n${reports.length} subjects — book ${tally("book")} · structure ${tally("structure")} · twin ${tally("twin")} · assessment ${tally("assessment")}`
  )
  const blocked = reports.filter((r) => !r.gates.assessment)
  if (blocked.length) {
    console.log(`\nfirst blocking reason per subject:`)
    for (const r of blocked) console.log(`  ${r.id}: ${r.reasons[0]}`)
  }
  if (offenders.length) {
    console.log(`\nviolations (enforcing: ${enforced.join(", ") || "nothing"}):`)
    for (const r of offenders) for (const v of r.violations) console.log(`  \u2717 ${r.id}: ${v}`)
  }
}

if (offenders.length) {
  if (!asJson) console.error(`\n${offenders.length} subjects hold artifacts they have not earned`)
  process.exit(1)
}
