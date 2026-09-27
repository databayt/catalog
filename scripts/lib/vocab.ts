// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

import { readFileSync } from "node:fs"
import { join } from "node:path"

const ROOT = join(import.meta.dirname, "..", "..")

function load<T>(name: string): T {
  return JSON.parse(readFileSync(join(ROOT, "vocab", name), "utf8")) as T
}

type Title = { ar?: string; en?: string }

export interface SubjectEntry {
  id: string
  title: Title
  concept: string
  aliases: string[]
}

const subjectsFile = load<{
  qualifiers: Record<string, Title>
  subjects: SubjectEntry[]
}>("subjects.json")

export const SUBJECTS = new Map(subjectsFile.subjects.map((s) => [s.id, s]))
export const QUALIFIERS = subjectsFile.qualifiers

/** alias -> canonical id (identity for canonical ids). */
export const SUBJECT_ALIAS = new Map<string, string>()
for (const s of subjectsFile.subjects) {
  SUBJECT_ALIAS.set(s.id, s.id)
  for (const a of s.aliases) SUBJECT_ALIAS.set(a, s.id)
}

/** Split a subject folder into its base id and optional qualifier. */
export function parseSubject(folder: string): { base: string; qualifier?: string } | null {
  if (SUBJECTS.has(folder)) return { base: folder }
  for (const q of Object.keys(QUALIFIERS)) {
    const suffix = `-${q}`
    if (folder.endsWith(suffix) && SUBJECTS.has(folder.slice(0, -suffix.length)))
      return { base: folder.slice(0, -suffix.length), qualifier: q }
  }
  return null
}

/** Title for a subject folder, qualifier included. */
export function subjectTitle(folder: string): Title | null {
  const p = parseSubject(folder)
  if (!p) return null
  const base = SUBJECTS.get(p.base)!.title
  if (!p.qualifier) return { ...base }
  const q = QUALIFIERS[p.qualifier]!
  return { ar: `${base.ar} (${q.ar})`, en: `${base.en} (${q.en})` }
}

export const CURRICULA = new Map(
  load<{
    curricula: {
      id: string
      code: string
      country?: string
      title: Title
      lang: string
      maintainer: string
      aliases?: string[]
    }[]
  }>("curricula.json").curricula.map((c) => [c.id, c])
)

export const GRADES = new Map(
  load<{ grades: { id: string; order: number; title: Title }[] }>("grades.json").grades.map((g) => [
    g.id,
    g,
  ])
)

export const PUBLISHERS = new Map(
  load<{ publishers: { id: string; license: string }[] }>("publishers.json").publishers.map((p) => [
    p.id,
    p,
  ])
)

export function gradeOrder(id: string): number {
  return GRADES.get(id)?.order ?? Number.POSITIVE_INFINITY
}
