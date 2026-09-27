# catalog — agent instructions

This is the standalone curriculum repository. Apps (hogwarts first) consume it through `cdn.databayt.org/catalog/…` and the `@databayt/catalog` package.

## Invariants — never break these

1. **The repo mirrors the CDN.** The repo root is `catalog/`: `sd/g6/math/exams.json` ↔ `cdn.databayt.org/catalog/sd/g6/math/exams.json`, and the subject id is `<curriculum>-<grade>-<subject>`. Never introduce an override table, alias folder or slug map.
2. **Only the allowed shape exists in the curriculum folders**: see `src/paths.ts` (`TEXT_FILES`, `BINARY_FILES`, `SUBJECT_DIRS`) and `scripts/validate.ts`. Scratch goes in `.work/`, and old material in `.archive/` (both gitignored).
3. **Top-level names**: a curriculum id (from `vocab/curricula.json`) or tooling (`src schema scripts vocab docs`). Nothing else.
4. **ASCII kebab-case paths.** Arabic lives in `title.ar`. Chapters and lessons are `NN-topic`.
5. **Subjects come from `vocab/subjects.json`.** Add an alias rather than a synonym folder.
6. **Binaries are never committed.** Put them in place, run `pnpm assets lock` and commit the lockfile. Uploading is `pnpm assets push --apply`.
7. **Replacing a pre-catalog CDN key is opt-in** (`--overwrite` on `assets push` and `publish:cdn`). Keys written before `CATALOG_EPOCH` (`scripts/lib/s3.ts`) belong to other apps, and hogwarts still reads the old `structure.json`/`textbook.md` there until its cutover. Keys the catalog wrote itself update freely.

## Commands

| Command                                        | Does                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| `pnpm validate`                                | the gate: schema, naming, vocabulary, tree, lockfile |
| `pnpm index` / `--check`                       | regenerate / check `index.json`                      |
| `pnpm schema:json` / `--check`                 | regenerate / check `schema/*.schema.json`            |
| `pnpm assets lock\|status\|push\|pull\|verify` | binaries vs the CDN                                  |
| `pnpm publish:cdn [--apply] [--overwrite]`     | text → CDN, then a CloudFront invalidation           |
| `pnpm typecheck`                               | tsc                                                  |

After any content change, run `pnpm validate && pnpm index` and commit the index.

## Infra

- Bucket `databayt-cdn` (private, OAC) is served by CloudFront `E3PHDXTDSBCQSJ` at `cdn.databayt.org`. A missing key returns **403**, not 404.
- Binaries are cached `immutable` for a year, so replacing one needs an invalidation. Text is cached for an hour with stale-while-revalidate.
- `hogwarts-databayt` is a different (public) bucket, the hogwarts upload bucket. It is not the catalog origin.

## History

- `scripts/migrate/` holds the one-off 2026-09-27 restructure from `hogwarts/curriculum/`. `renames.json` has every old→new path, slug and DB slug, and drives the consumer cutover. `report.md` records what was kept, renamed, archived and dropped.
- `docs/history/` holds the build and textbook audit logs from before the move. Paths in them are pre-migration.

Git: work on `main`, use conventional commits, and never force-push.
