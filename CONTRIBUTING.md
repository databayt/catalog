# Contributing to catalog

This catalog is shared by several brands and apps. Everyone writes the same shape, so every consumer can read everyone's content. The validator enforces that shape. If `pnpm validate` passes, your change fits.

## Join as a contributor

1. Add your organisation to [`vocab/publishers.json`](vocab/publishers.json) with an `id`, a `title: { ar, en }`, a `kind` (`contributor`, `publisher` or `framework`) and the `license` you release your work under.
2. Add your id to `contributors` in every `structure.json` you author or substantially edit.
3. If you maintain a whole curriculum, add yourself to [`CODEOWNERS`](CODEOWNERS) for `/<id>/`.

## Add a curriculum

1. Add it to [`vocab/curricula.json`](vocab/curricula.json). Its `id` is the lowercased DB code, e.g. `eg`, `sa`, `ae`, or `<board>-<programme>` for a board.
2. Create `<id>/curriculum.json` at the repo root (the repo mirrors `cdn.databayt.org/catalog/`) with its `stages` and `grades`. The `grades` map must list exactly the subject folders on disk.
3. Add the subjects.

## Add a subject

```
<curriculum>/<grade>/<subject>/structure.json
```

- `<subject>` must be an id in [`vocab/subjects.json`](vocab/subjects.json), optionally followed by a qualifier (`-specialized`, `-optional`). If the subject is genuinely new, add it to the vocabulary in the same PR, with `title: { ar, en }`, a `concept` and any `aliases`. Don't add a synonym of an existing id; add an alias instead.
- `structure.json` identity must match its path: `id` = `<curriculum>-<grade>-<subject>`.
- Chapters are `c1`, `c2` … in book order, and lessons are `l1`, `l2` … within each chapter. Each has a `title` in at least one language. Give both `ar` and `en` whenever you can. Inserting a chapter renumbers the ones after it, so do that only for a new edition.
- `source` says where the outline came from: the publisher, edition, url and license.
- `status` is `official` (from an official textbook), `authored` (written against a public framework) or `outline`.

## Add questions and exams

Put a `qbank.json` (a pool) and/or an `exams.json` (assembled assessments) at the subject, chapter or lesson level:

```jsonc
// sd/g6/math/c1/l3/qbank.json  →  cdn.databayt.org/catalog/sd/g6/math/c1/l3/qbank.json
{
  "scope": {
    "curriculum": "sd",
    "grade": "g6",
    "subject": "math",
    "chapter": "c1",
    "lesson": "l3",
  },
  "questions": [
    {
      "id": "sd-g6-math-c1-l3-q1",
      "type": "mcq",
      "question": "…",
      "options": ["…", "…"],
      "answer": "…",
      "explanation": "…",
    },
  ],
}
```

- `scope` must equal the folder the file sits in.
- `type` is one of `mcq`, `true_false` (answer is a boolean), `fill_blank` and `short_answer`.
- Question ids are unique within a file. An exam either inlines `questions` or references the same-level qbank by `questionIds`.
- No placeholder content. The migration removed 3,194 generated "Question N about …" stubs, and they should not come back.

## Add a textbook

Binaries don't go in git.

1. Put the PDF at `<cur>/<grade>/<subject>/textbook.pdf`, with `cover.jpg`, `thumbnail.jpg` and `banner.jpg` beside it if you have them.
2. Run `pnpm assets lock` and commit the `assets.lock.json` change.
3. A maintainer runs `pnpm assets push --apply` to upload the bytes.
4. The Markdown twin (`textbook.md`, `pages-md/`) is produced by the transcription pipeline. Put its scratch (crops, audits) under `.work/`, never in a curriculum folder.

Only add a textbook you have the right to redistribute, and record its license in `structure.json` → `source.license`.

## Before you open the PR

```bash
pnpm validate && pnpm index && pnpm schema:json && pnpm typecheck
```

Commit the regenerated `index.json` with your change. CI runs the same checks.
