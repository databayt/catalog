// Copyright (c) 2025-present databayt
// Licensed under MIT -- see LICENSE for details

/**
 * The catalog schema — the single source of truth for every JSON file in the
 * curriculum folders. `pnpm validate` parses the whole tree against it and
 * `pnpm schema:json` emits JSON Schema for editors and other languages.
 *
 * Four file kinds exist, and nothing else is allowed:
 *
 *   <cur>/curriculum.json                      Curriculum
 *   <cur>/<grade>/<subject>/structure.json     Structure
 *   …/<subject>[/<chapter>[/<lesson>]]/qbank.json        QBank   (question pool)
 *   …/<subject>[/<chapter>[/<lesson>]]/exams.json        Exams   (assembled assessments)
 */

import { z } from "zod"

import { CONCEPTS } from "../src/concepts.ts"

// ---------------------------------------------------------------- primitives

/** A path segment: ASCII lowercase kebab-case. Arabic lives in titles, never in paths. */
export const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/
/**
 * Chapter and lesson folders are positional, like grades: `c1`, `c2` … and,
 * within a chapter, `l1`, `l2` … The number is the order in the book; the
 * words live in `title`. So `sd/g6/math/c1/l3` is "grade 6 math, chapter 1,
 * lesson 3" — buildable from numbers alone.
 */
export const CHAPTER_SLUG = /^c[1-9]\d*$/
export const LESSON_SLUG = /^l[1-9]\d*$/
export const GRADE = /^(kg[1-2]|g([1-9]|1[0-2]))$/
export const MAX_SLUG = 64

export const Slug = z.string().max(MAX_SLUG).regex(SLUG, "kebab-case ASCII")
export const ChapterSlug = z.string().regex(CHAPTER_SLUG, "c<N>")
export const LessonSlug = z.string().regex(LESSON_SLUG, "l<N>")
export const GradeId = z.string().regex(GRADE, "g1–g12 or kg1–kg2")
export const Lang = z.enum(["ar", "en", "fr"])
export const Concept = z.enum(CONCEPTS)
export const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD")

/** One multilingual label. At least one language, and it must be non-empty. */
export const Title = z
  .strictObject({
    ar: z.string().min(1).optional(),
    en: z.string().min(1).optional(),
    fr: z.string().min(1).optional(),
  })
  .refine((t) => Boolean(t.ar || t.en || t.fr), "title needs at least one language")

export const Status = z.enum([
  /** Outline only — chapters and lessons, no authored body. */
  "outline",
  /** Authored by a contributor from a public framework (no official textbook). */
  "authored",
  /** Taken from an official textbook's table of contents. */
  "official",
])

export const Link = z.strictObject({ title: z.string().min(1), url: z.url() })

// ---------------------------------------------------------------- curriculum

export const Curriculum = z.strictObject({
  $schema: z.string().optional(),
  id: Slug,
  title: Title,
  /** ISO 3166-1 alpha-2, or omitted for a transnational board (IB, Cambridge). */
  country: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional(),
  lang: Lang,
  /** "6+3+3" etc. */
  structure: z.string().optional(),
  reformYear: z.number().int().optional(),
  reference: z.url().optional(),
  operator: z.string().optional(),
  accreditation: z.string().optional(),
  basis: z.string().optional(),
  notes: z.string().optional(),
  /** Stages in order, each owning a contiguous grade range. */
  stages: z
    .array(
      z.strictObject({
        id: Slug,
        title: Title,
        grades: z.array(GradeId).min(1),
        /** Local grade label, e.g. "Year 7" or "Grade 1". */
        localNames: z.record(GradeId, z.string()).optional(),
      })
    )
    .min(1),
  /** Subjects offered per grade — must equal the folders on disk. */
  grades: z.record(GradeId, z.array(Slug)),
})
export type Curriculum = z.infer<typeof Curriculum>

// ---------------------------------------------------------------- structure

export const Lesson = z.strictObject({
  slug: LessonSlug,
  title: Title,
  page: z.number().int().positive().optional(),
  image: z.string().optional(),
  concept: Concept.optional(),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  durationMinutes: z.number().int().positive().optional(),
})

export const Chapter = z.strictObject({
  slug: ChapterSlug,
  title: Title,
  concept: Concept.optional(),
  /** A CDN key (e.g. `clickview/high-…-cover.jpg`), never a URL. */
  image: z.string().optional(),
  page: z.number().int().positive().optional(),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  /** True when the lessons are a generic breakdown, not the book's own. */
  lessonsGeneric: z.boolean().optional(),
  lessons: z.array(Lesson),
})

export const Source = z.strictObject({
  /** An id from vocab/publishers.json. */
  publisher: Slug,
  /** What the outline was taken from, e.g. "official-toc-2026-08". */
  basis: z.string().optional(),
  title: z.string().optional(),
  edition: z.string().optional(),
  url: z.url().optional(),
  /** SPDX id, or LicenseRef-Publisher when the publisher keeps its own terms. */
  license: z.string().min(1),
  standards: z.string().optional(),
  standardsBody: z.string().optional(),
  examBoard: z.string().optional(),
  note: z.string().optional(),
})

export const Structure = z.strictObject({
  $schema: z.string().optional(),
  /** `<curriculum>-<grade>-<subject>` — the stable id every app keys on. */
  id: z.string(),
  curriculum: Slug,
  grade: GradeId,
  subject: Slug,
  title: Title,
  lang: Lang,
  status: Status,
  concept: Concept.optional(),
  about: z
    .strictObject({
      description: z.string().optional(),
      objectives: z.array(z.string()).optional(),
      prerequisites: z.string().optional(),
      audience: z.string().optional(),
    })
    .optional(),
  source: Source,
  textbook: z
    .strictObject({
      /** Whether `page` fields count printed book pages or PDF pages. */
      pageNumbers: z.enum(["book", "pdf"]).optional(),
      /** PDF page = book page + pageOffset. */
      pageOffset: z.number().int().optional(),
      note: z.string().optional(),
      coverNote: z.string().optional(),
    })
    .optional(),
  resources: z.array(Link).optional(),
  history: z
    .strictObject({
      authoredOn: IsoDate.optional(),
      appliedOn: IsoDate.optional(),
      supersedes: z.string().optional(),
    })
    .optional(),
  contributors: z.array(Slug).min(1),
  chapters: z.array(Chapter),
})
export type Structure = z.infer<typeof Structure>

// ---------------------------------------------------------------- assessment

export const QuestionType = z.enum(["mcq", "true_false", "fill_blank", "short_answer"])

export const Question = z.strictObject({
  id: z.string().min(1),
  type: QuestionType,
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  answer: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  explanation: z.string().optional(),
})
export type Question = z.infer<typeof Question>

/** Where a pool or assessment sits. Must equal the file's own path. */
export const Scope = z.strictObject({
  curriculum: Slug,
  grade: GradeId,
  subject: Slug,
  chapter: ChapterSlug.optional(),
  lesson: LessonSlug.optional(),
})

export const QBank = z.strictObject({
  $schema: z.string().optional(),
  scope: Scope,
  questions: z.array(Question).min(1),
})
export type QBank = z.infer<typeof QBank>

export const Exam = z
  .strictObject({
    id: z.string().min(1),
    title: z.string().min(1),
    kind: z.enum(["quiz", "test", "exam"]).optional(),
    description: z.string().optional(),
    durationMinutes: z.number().int().positive().optional(),
    totalMarks: z.number().positive().optional(),
    passingMarks: z.number().nonnegative().optional(),
    /** Inline questions … */
    questions: z.array(Question).optional(),
    /** … or references into the qbank.json at the same level. */
    questionIds: z.array(z.string()).optional(),
  })
  .refine(
    (e) => (e.questions?.length ?? 0) + (e.questionIds?.length ?? 0) > 0,
    "an exam needs questions or questionIds"
  )

export const Exams = z.strictObject({
  $schema: z.string().optional(),
  scope: Scope,
  exams: z.array(Exam).min(1),
})
export type Exams = z.infer<typeof Exams>

export const SCHEMAS = {
  curriculum: Curriculum,
  structure: Structure,
  qbank: QBank,
  exams: Exams,
} as const
