# Sudanese Curriculum Textbook Audit

**Latest pass:** 2026-09-06 (grade 12 original-page images + the in-app textbook reader) on top of 2026-09-05 (grade 11 structures + twins; grade 12 gaps + twins) on top of 2026-09-04 (web verification, all 12 grades, **applied the same day — see APPLIED below**) — supersedes the 2026-04-03 / 2026-07-15 sections below, which are kept as history.
**Auditor:** Claude (for Abdout)
**Method (2026-09-04):** every `curriculum/sd/g*/*/textbook.pdf` hashed (md5), paged, and page-1 rendered to a per-grade contact sheet and inspected visually; then cross-checked against the book lists of mdl.edu.sd (مكتبة الميزاب الرقمية — a non-profit library, NOT the ministry), alktab24.com, afedne.com, al-amgaad.com, almualm.com, almasarplus.com (Google-Drive folders) and the British Council SMILE pages; 90 candidate PDFs downloaded (1.4 GB, scratchpad) and md5-compared to the local tree; covers of every candidate rendered and read. Curriculum-status statements come from the Khartoum-state ministry (Oct 2025, May 2026) and NCCER-produced first editions dated 2025.

---

## 2026-09-20 — Nine designed covers, as shared CONCEPTS (published, live)

Second Figma batch (`~/Downloads/Frame 13–23`, 2669×3691, textless art on the lower half, same
board as biology's 2026-09-07 cover). Mapped to **concepts**, not subjects — one drawing serves
every subject and grade resolving to it:

| Frame | Concept | g12 dirs given `cover.jpg` |
| --- | --- | --- |
| 13 | `languages` | arabic-grammar, arabic-rhetoric, arabic-literature, arabic-specialized, literary-studies, french |
| 14 (PNG) | `religion` | islamic, islamic-studies-optional, christian-education |
| 15 | `english` | english |
| 16 | `math` | math, math-specialized |
| 17 | `geography` | geography |
| 19 | `earth-science` | — (no g12 subject) |
| 21 | `arts` | art |
| 22 | `computer-science` | computer-science |
| 23 | `science` | — (no g12 subject) |

`Frame 20` = byte-identical re-export of biology's cover, skipped. `Frame 18` (node `652_41`)
never exported. Soft sources, upscaled 1.4–1.7×: `languages` 736×414, `science` 626×468,
`math` 597×900.

Rendered by `scripts/catalog/render-cover.mjs` (Chromium 2x → sharp lanczos3 → 1000×1383 JPEG
q82 4:4:4); reproduces biology's hand-made cover to 257,424 vs 257,085 B.

**Published:** 15 g12 subjects × `catalog/sd/g12/<dir>/cover.jpg` + the legacy
`catalog/textbooks/<slug>/cover.jpg` mirror, and 9 × `catalog/concepts/<concept>/cover`
(extension-less key, `image/jpeg`) — both buckets. The concept key had **no object at all**
before, so 113 subjects across all grades went from a flat colour to art. CloudFront
invalidations `IC0HMVCOPA9YYYO9TLB4EBSJXF` (30 paths) and `I7OI75GUY4DEZM0HF2GDG08RWH`
(9 paths), both Completed; every key verified by content-length.

No DB or seed change — all 25 g12 rows already pointed at the hierarchical key. Outgoing covers
archived to `<dir>/_old/2026-09-20-pre-designed-cover/`.

**Concept slugs simplified the same day** (see ISSUE.md 2026-09-20 (b)): 15 renamed to one
generic word each, `nature` added as a 24th concept distinct from `science`, so the tree moved to
`catalog/concepts/nature/cover` and `science` has no cover again. The CDN concept keys are now
`art, computer, earth, english, geography, language, math, faith, nature`; the old-named objects
were deleted and invalidated. DB migration: `scripts/catalog/rename-concepts.sql` (idempotent, 11,544 rows locally) —
**owed against prod at deploy time, behind a Neon restore point.**

**231 authored `concept` values in 29 `curriculum/sd/g12/**/structure.json` were renamed too** —
gitignored, so no repo grep shows them, and `sd.ts` drops an unknown concept with only a warning:
left stale, the hand-authored concept/image map from 2026-09-05 would have silently degraded to
pool rotation on the next seed. The 18 published ones were re-uploaded to both buckets and
invalidated (`I48IJ7P79HIH8J2N4WMH6D2DT5`). All 346 authored values validated against `CONCEPTS`:
0 invalid.

---

## 2026-09-04 — APPLIED (local tree + local DB) and DEPLOYED the same evening (CDN + production DB)

**DEPLOYED 2026-09-04 (evening):** `scripts/upload-textbooks-all.ts --force --only=<22 slugs>` to BOTH buckets (`databayt-cdn` = the cdn.databayt.org origin, and the app bucket): 65 objects each, 0 failed; CloudFront invalidation `I15BJE3K7178O8NCRCOBE7RB1D` on `/catalog/textbooks/<slug>/*` for the 12 replaced slugs, Completed; HTTPS HEAD now returns the new sizes (biology 18,239,333 bytes, was 3,450,848) and 200 on the new slugs. Production Neon (`ep-little-credit-ad4uobus`): `db:seed:single sd` → Matched 120 / Created 10, 850 chapters + 4,065 lessons; then `sd-content` → 87 subjects with real content, 2,608 questions (2,424 chapter-mapped, 2,183 lesson-mapped), 87 exams — **the first time SD real content exists on production** (it had 0 SD questions/exams before). Verified: 130 / 855 / 4,090; the three superseded rows still PUBLISHED; `sd-g10-arabic.cover` = concept key; chapter-less tagged questions = the 184 unmapped-by-design only; all 32 grade-10 school selections intact. Restore point: CSV export of the seven catalog tables taken before seeding (`scratchpad/prod-backup/`, 2026-09-04T14:4xZ). `main` pushed to `aada4fb72`. **Not done: the Vercel app build** (`scripts/deploy-hobby.sh` builds the working tree, which carries another session's uncommitted work) — only the docs page waits on it. Browser caveat: objects are `immutable, max-age=1y`, so anyone who opened an old PDF keeps it until their cache expires (the URL builder has no version parameter).

**Convention:** a replaced edition is never deleted — it moves to `<subject>/_old/<label>/` (textbook.pdf, structure.json, cover.jpg, qbank.json, exams.json, qbank_data/, plus a `chapters-tree.json` snapshot of the old folder tree). `thumbnail.jpg`/`banner.jpg` are subject art and stay in place. `_old/`, `_incoming/` and `_notes/` are inert: the seed and the uploader walk `g1..g12` only. Every rebuilt `structure.json` carries `source: official-toc-2026-09`, the verified edition line, whether `page` numbers are printed-book or PDF pages, and `supersedes`.

| Grade | Applied (chapters/lessons) |
| --- | --- |
| g3 | **science** REPLACED — old rowad scan → العلوم (2020 series, 59pp), 3/21. **english** — PDF swapped (SMILE Book 1 *activity* book → *pupil's* book) and cover re-rendered; the 12×8 structure already matched the TOC so it was kept, but its 96 lesson folders had never been created (DB had 0 lessons) — materialised now; `lang` set to `en`. |
| g4 | **math** — textbook added (2nd ed 2021; the dir had no PDF), structure rebuilt 6/38. **science** NEW subject → `sd-g4-science`, 4/12. |
| g6 | **art** NEW → `sd-g6-arts` (g6 `art→arts` override added to `sd.ts`), 4/9. **science** NEW → `sd-g6-science`, 8/27. |
| g8 | **geography** REPLACED — 4-page ad file → الجغرافيا 1st ed 2022 (review-watermarked copy, the only one online), 3/19. **national-education** NEW → `sd-g8-national-education`, 4/13. |
| g10 | **New-curriculum set.** NEW dirs: `national-education` 6/19, `entrepreneurship` 6/28, `physics` 6/27 (g10 never had physics), `arabic` (unified book) 3/53. REPLACED in place: `biology` 6/64, `chemistry` 6/24, `history` 4/28, `islamic-studies` → التربية الإسلامية 7/52, `engineering` 5/30, `math` (3rd ed 2025) 7/60, `art` → التربية الفنية 4/12 (was الفنون والتصميم — same DB row `sd-g10-art`), `computer-science` → تكنولوجيا المعلومات والاتصالات 5/29 (was علوم الحاسوب — same DB row). MOVED OUT of the inventory: `arabic-literature`, `arabic-rhetoric`, `arabic-specialized` → `curriculum/sd/_old/2026-09-04/g10/` (with the correct old-curriculum rhetoric/grammar/physics PDFs and a README). Untouched (old curriculum, no new edition online): quran, english, french, geography, home-economics, military-science. |
| g12 | **english** NEW (SPINE 6, `lang: en`) → `sd-g12-english`, 10 units × 4 sections. **math-specialized** NEW → `sd-g12-math-specialized`, the two official volumes merged into one `textbook.pdf` (vol 1 = 180pp, vol 2 = 207pp; structure pages for vol 2 are offset by 180), 12/72. **The staged files were misnamed** (the 207-page file is printed «الكتاب الثاني») — renamed `vol1-180pp` / `vol2-207pp` in `_incoming/`. |

**Structures:** all from the books themselves (TOC renders + text layer; the 2025 NCCER PDFs carry garbled font encodings, decoded with the glyph map in the audit scratchpad; g10 maths sections parsed from «(u–n)» headings, which mix Arabic-Indic and Latin digits). Chapters are the books' units except physics, which has فصول and no unit layer. English `titleEn` and the kebab slugs were authored for every chapter/lesson (folder name === slug, validated).

**Local DB after `pnpm db:seed:single sd` + `sd-content`:** 10 subjects created, 130 updated, 850 chapters + 4,065 lessons across SD; 87 subjects with real content (2,608 questions). `curriculum.json`: 11 new entries + renames (g10 islamic-studies / art / computer-science / engineering → العلوم الهندسية, g3 science → العلوم). `concepts-data.ts`: `national-education→civics`, `entrepreneurship→economics`. `tsc` clean.

**Consequences to know about:**

1. The superseded DB rows `sd-g10-literature`, `sd-g10-rhetoric`, `sd-g10-arabic-advanced` stay PUBLISHED with their old chapters — archiving/deleting them is a decision (SubjectSelection/Enrollment cascade).
2. The replaced subjects keep their **old-curriculum questions at subject scope, chapter-less** (their qbank/exams moved to `_old/`, so `sd-content` skipped them without deleting; the chapter rebuild SetNull'ed the FKs): g3 science 9, g4 math 9, g8 geography 30, g10 art 4 · biology 4 · chemistry 8 · ICT 4 · engineering 2 · history 3 · islamic 4 · math 4. Re-author qbank/exams against the new books.
3. `g10/arabic` has **no cover**: the scan starts at the preface and ends with the aggregator splash, and no printed cover is online. Its DB `cover` points at the concept art (`catalog/concepts/languages/cover`); `_notes/page-1-render-not-a-cover.jpg` keeps the render.
4. DONE the same evening (see DEPLOYED above): CDN objects swapped + invalidated, production seeded `sd` then `sd-content`, `sd-g10-arabic.cover` verified on the concept key.

**Web re-check (same day, on request):** the 2026/27 school year opened in Khartoum in September 2026 (state calendar; Northern State schools opened earlier); every grade-11 "الطبعة الجديدة 2026" list on the aggregators (Dec 2025 posts) is the OLD taxonomy (المطالعة والأدب، البلاغة، النحو، علوم الحاسوب…), the mdl.edu.sd library's newest upload is Sept 2024, and one Sudanese report states the grade-11 new syllabus is issued "next year" — i.e. no new grade-11 book exists online as of today. The federal ministry's only 2026 announcements found are the "Year of TVET" partnership (UNESCO, Apr 2026); the curriculum overhaul itself was announced May 2024 (Dabanga).

---

## 2026-09-06 — Grade 12 original-page images + the in-app textbook reader (local tree + CDN; nothing deploy-gated)

## 2026-09-11 — the twin is now verified by a harness, not a number (kun engine work; nothing uploaded)

The `textbook` keyword became a harness with iteration loops (`~/kun/.claude/workflows/textbook.js`):
blind second read of a random + risk sample → six-axis agreement with a failure class per page →
adjudication of every disagreement against the scan and native-density crops (new `adjudicate` agent)
→ mirrored tables reversed from crop truth → the contract learns each named case → re-lint → persist.
Structure is scored on the reader's own grammar (`md-structure.py`). A benchmark corpus of 30 biology
pages with objective assertions (`~/kun/.claude/evals/textbook/manifest.json`, gold frozen
`sha1:5d1064d23eac`) measures the pipeline itself: the shipped 2026-09-09 twin scores **96.2 %**
(482/501 assertions), failing on p196 (interpreted labels, dropped أنثى), p146/p150 (diagram rendered
as a table), p144 (invented header العمود الأيمن), p60 (6 illegible marks; the figure is 1237 px native
and painted at ~420 px — `textbook-crop.py zoom` recovers it), p136 (composed caption). Re-scored the
2026-09-09 audit with the new grader: seq 94.8 % (unchanged), bow 97.8 %, struct 0.90; classes
structure 11 · clean 6 · omission 3 · numeric 1; repair queue 15 pages. Measured record:
`~/kun/.claude/memory/textbook-scores.json`. **The CDN twin is unchanged** — run the harness in
`verify` mode, then upload, to make repairs live.

## 2026-09-09 — biology re-transcribed by vision; the OCR grades are not trustworthy

`sd/g12/biology/textbook.md` was regenerated by **reading the 253 page images
with a vision model** instead of tesseract. Old file kept as `textbook.ocr.md`.
**Local only — not uploaded to either bucket, so the reader still serves the OCR
twin from the CDN.**

| metric | tesseract | vision |
|---|---:|---:|
| Arabic characters | 143,153 | 180,323 |
| Latin (scientific terms) | 0 | 7,324 |
| table rows | 6 | 276 |
| figures with captions | 0 | 144 |
| pages yielding no text | 3 | 0 |

Graded **B, agreement 94.8 %** — 21 of 253 pages (8 %) independently
re-transcribed by a fresh agent and diffed. Every sub-90 % page was diagram-label
ordering or figure completeness, not content error; no fabricated prose in the
sample. The grade is deliberately not tuned upward.

**This invalidates the A/B/C column below for the other 24 g12 books.** Line 99
already conceded the grade "measures character cleanliness and volume, not OCR
correctness" — but the front matter still shipped `quality: A` at `coverage: 47`
for biology, and A at 28 % for specialised maths. Treat every `extraction: ocr`
row as ungraded until it is re-read. Page 112 is the case in point: a full-page
spermatogenesis flowchart where tesseract produced **zero characters** and vision
read all nine labels.

**SHIPPED.** Uploaded to both buckets; CloudFront `E3PHDXTDSBCQSJ` invalidated
(`I8T0K9PM8OCVQJVP67WRFKIORX`). `cdn.databayt.org` serves the vision twin
(441,667 bytes), verified over HTTPS.

Table column order was measured against the scans on all 34 pages carrying
tables, before shipping. It was **not** systematic: 23 tables were already
correct, 8 were mirrored (pages 5, 42, 153, 169, 171, 172, 174, 178) and were
reversed. A blanket swap would have corrupted the 23. Method: crop the right 45 %
of each page and read only the crop — asked to judge direction on a full page,
transcribers get it backwards, which is the same confusion that causes the bug.
Pages 146 and 150 render a printed cross DIAGRAM as a Markdown table, so
direction does not apply there; left as transcribed.

Note on the Latin row: tesseract's apparent 1,060 Latin characters were entirely
the word "page" in HTML page markers. With `-l ara` it recovered **no** Latin
letters, so every scientific term and binomial in the book was lost.

Method, measured costs and the config now live in the `textbook` and `md` kun
skills and `kun/.claude/plans/2026-09-09-textbook-vision-biology.md`.

**Page images (25/25 g12 subjects, 4,954 pages, 258 MB local):** every `textbook.pdf` rendered to `<subject>/pages/<N>.webp` (PyMuPDF, 1000 px wide, quality 70, ~55 KB/page; 1-based page numbers matching the OCR twins' `<!-- page N -->` markers) by the kun skill's new `textbook-pages.py` (keyword `textbook`; the script skips pages that already exist unless `--force`). Uploaded under `catalog/textbooks/<slug>/pages/` to BOTH buckets — 24 slugs synced twice (48 syncs) plus biology, which went up first as the pilot. Verified afterwards: page 1 of all 25 slugs returns 200 on `cdn.databayt.org` AND on the app origin `d1dlwtcfl0db67.cloudfront.net`. These are **new** keys, so nothing was overwritten and no invalidation was needed — and nothing here is deploy-gated: the objects already sit on both buckets and the reader reads them straight from the CDN.

**Reader:** the `textbook` tile in the subject page no longer opens the raw PDF in a browser tab; it opens `/[lang]/subjects/[slug]/textbook`, which renders the Markdown twin as native, resizable, searchable Arabic text (`src/components/school-dashboard/listings/subjects/textbook/`). It is generic across curricula: the route reads `Subject.pdf`, derives the sibling `textbook.md` and `pages/<N>.webp` keys, and takes language/direction, quality/coverage and the page-marker mode from the twin's own front matter — no per-book configuration. Over 2026-09-07/08 it was rebuilt from a scrolling article into a paginated book (cover screen → contents → one screen per page, running head, Arabic-Indic folios, reading menu with contents/search/settings, four themes, two fonts, three leadings, an original-pages facsimile toggle, bookmarks and a saved reading position).

**Where the page numbers come from:** the 18 OCR twins carry `<!-- page N -->` markers, so their pages anchor exactly and the facsimile toggle can show the scan next to the text. The 7 text-layer twins (engineering, geography, agriculture, art, French, history, family sciences) have no markers — they read as continuous text and the facsimile toggle stays hidden for them until the kun skill learns to stamp markers on that path.

**Key scheme kept as-is:** the assets stay at `catalog/textbooks/<slug>/{textbook.pdf,textbook.md,pages/<N>.webp}` rather than moving up to `catalog/<slug>/`. `catalog/` already hosts four unrelated asset families, and the rename would mean ~1,100 objects × 2 buckets plus every SD row's stored keys, the seed and the uploader.

---

## 2026-09-05 — Grade 11: structures rebuilt from the books + Markdown twins (local tree + local DB + CDN; production DB deploy-gated)

**Scope:** the 19 `curriculum/sd/g11/*` subjects. Chemistry already carried `official-toc-2026-08`; the other 18 had legacy pdftotext structures (generic «wahed-01» / «الوحدة الأولى» units, 0 lessons in most, physics listing a «البرمجة» unit the book does not have, specialised Arabic no structure at all). All 18 were rebuilt from the books' own tables of contents (`scratchpad sd-apply/specs_g11.py`; every `structure.json` now carries `source: official-toc-2026-09`, the verified edition line, `pageNumbers: book` (SPINE 5: `pdf`), `appliedOn: 2026-09-05`, `supersedes: _old/2026-09-05-legacy-pdftotext`). Where a TOC lists units only, the lessons are the books' own section headings: biology from the text layer's heading font, physics from its numbered «(١-١-٢)» sections plus two page sheets for units 2–3, computer science from the OCR twin, SPINE 5 from its chapter + five-section headings in the OCR twin (the book has no contents page; the two chapters after «Modern Technology» carry no printed heading in this scan and are named after their reading texts). Textbooks, covers and subject art were not touched — the only new CDN objects are the `textbook.md` twins.

| Subject (dir → DB slug) | Book, as printed on the title page / imprint | Printed year | PDF file date | Structure before → after | Question bank |
| --- | --- | --- | --- | --- | --- |
| arabic-grammar → `sd-g11-grammar` | قواعد اللغة العربية للصف الثاني الثانوي (cover: قواعد النحو) | undated | 2010-03 | 10 generic / 0 → 6 أبواب / 20 | archived (generic units) |
| arabic-literature → `sd-g11-literature` | المطالعة والأدب للصف الثاني الثانوي | undated | 2011-02 | 3 / 35 → 4 / 37 (opening سورة لقمان + 3 أبواب) | kept (order tracked; file is template junk — ingest skips it) |
| arabic-rhetoric → `sd-g11-rhetoric` | البلاغة والتعبير للصف الثاني الثانوي | undated | 2006-12 | 8 generic / 0 → 3 أقسام / 19 | archived |
| arabic-specialized → `sd-g11-arabic-advanced` | اللغة العربية الخاصة — الصف الثاني الثانوي | **الطبعة الأولى رجب ١٤٢٨هـ / يوليو ٢٠٠٧م** | — | none → 25 دروس / 25 | none existed; DB name fixed to اللغة العربية الخاصة via `curriculum.json` |
| islamic-studies → `sd-g11-islamic-studies` | الدراسات الإسلامية — الصف الثاني الثانوي | undated | 2014-10 | 4 wrong units / 0 → 6 أبواب / 33 | archived |
| quran → `sd-g11-quran-studies` | القرآن الكريم وعلومه — الصف الثاني الثانوي | **الطبعة الثانية المنقحة ٢٠١٠م** | 2015-10 | 2 / 33 → 4 / 28 | kept (template junk — skipped) |
| biology → `sd-g11-biology` | علم الأحياء — الصف الثاني (لجنة إعداد وتطوير) | undated (revised) | 2014-10 | 5 generic / 0 → 5 / 29 | kept (50 q, 100 % lesson-mapped) |
| chemistry → `sd-g11-chemistry` | الكيمياء — الصف الثاني | not re-read (structure official since 2026-08) | 2016-01 | 6 / 22 (unchanged) | kept (60 q) |
| physics → `sd-g11-physics` | الفيزياء للصف الثاني الثانوي | **الطبعة الثانية** (year not printed) | 2012-11 | 4 wrong units / 0 → 5 / 33 | archived |
| math → `sd-g11-math` | الرياضيات للصف الثاني الثانوي | undated | 2010-01 | 6 generic / 0 → 8 / 42 | kept (60 q) |
| geography → `sd-g11-geography` | الجغرافيا والدراسات البيئية — الصف الثاني الثانوي | **الطبعة المنقحة ٢٠١٢م** | 2015-11 | 4 / 0 → 4 / 17 | kept (40 q) |
| computer-science → `sd-g11-computer-science` | مقدمة في نظم معالجة البيانات والبرمجة — الصف الثاني الثانوي | **الطبعة الثانية ٢٠٠٨م** (ISBN 978-99942-53-26-5) | — | 4 / 0 → 4 / 20 | kept (9 q survive the ingest gate) |
| engineering → `sd-g11-engineering` | أساسيات العلوم الهندسية — الصف الثاني الثانوي | **رقم الإيداع ٧٦٤/٢٠٠٨** | — | 3 / 0 → 4 أبواب / 23 | kept (template junk — skipped) |
| commercial-studies → `sd-g11-commerce` | مقدمة في العلوم التجارية (محاسبة مالية، اقتصاد عام، رياضة مالية) | **رقم الإيداع ٧٦٨/٢٠٠٨** | 2009-04 | 3 / 21 → 3 / 20 | kept (94 q) |
| home-economics → `sd-g11-family-sciences` | العلوم الأسرية للصفين الأول والثاني | **الطبعة المنقحة ٢٠١٠م** | 2010-03 | 6 wrong units / 0 → 6 / 20 | archived |
| art → `sd-g11-arts-design` | الفنون والتصميم للصفين الأول والثاني | undated (ISBN 978-99942-53-46-3) | — | 4 / 23 → 4 / 23 (same units, official titles + pages) | kept (template junk — skipped) |
| military-science → `sd-g11-military-sciences` | العلوم العسكرية — الصف الثاني الثانوي | **الطبعة الثانية ٢٠٠٨م** (ISBN 978-99942-53-23-4) | — | 1 / 4 → 7 / 2 | kept (template junk — skipped) |
| english → `sd-g11-english` | SPINE 5 — Pupil's Book (Sudan Practical Integrated National English) | **first published 1996; 2009 printing** (ISBN 978-99942-919-9-6) | — | 1 / 0 → 12 chapters × 5 sections / 60 | kept (9 q) |
| french → `sd-g11-french` | Méthode de Français 2 «Allons-y !» — Livre de l'élève (Bakht er Ruda / CNMRP) | undated | 2015-08 | 8 (module rows) / 36 → 6 unités / 38 | archived (module rows shifted positions) |

Two books are two-grade books («للصفين الأول والثاني»: الفنون والتصميم, العلوم الأسرية) — the grade-10 dirs now carry the new-curriculum replacements, so these stay grade-11 only. Nothing newer exists online for any grade-11 subject (see the web re-check above).

**Markdown twins (kun keyword `textbook`, 2026-09-05):** 19/19 — **15 A + 4 B**; 14 via tesseract OCR (300 dpi, psm 3), 5 from the text layer (literature, biology, chemistry, geography = B; French = A). Coverage 28–74 %. Uploaded to BOTH buckets (`catalog/textbooks/<slug>/textbook.md`), CloudFront invalidated (`I82FCANHEM1EXJMG0B6CY6AJWB`, then `IDBQC69RABF62IJL1LHHCABLG` after the H1 re-stamp), HTTPS serves `text/markdown` with the refreshed front matter. **Engine bug found and fixed here:** SPINE 5 (a scan) and the French method book sat in dirs whose legacy `structure.json` had no `lang`; the script defaulted to Arabic, OCR'd them with the `ara` model and graded the noise "A". The script now resolves the language override → `structure.json` → sniff (text-layer script ratio, else a 3-page `ara+eng` OCR sample + stop-word vote), records `langSource`, and has `--front-matter-only` to re-stamp title/dbSlug/lang/edition after a structure rebuild (used on all 19 twins after the apply). Cosmetic: the 19 g11 twins were run through Prettier's Markdown formatter by a hogwarts hook (`npx prettier --write "$CLAUDE_FILE_PATH"` with the variable unset formats the *current directory*; the shell happened to sit in `curriculum/sd/g11`) — bullets `*`→`-`, `*`/`_` escaped, the YAML `stats` map expanded; semantically identical Markdown. The hook is now guarded.

**Local DB after `db:seed:single sd` then `sd-content`:** 135 subjects / 888 chapters / 4,501 lessons across SD (g11 = 19 / 122 / 511; g12 unchanged at 25 / 192 / 870). `sd-content`: 82 subjects with real content, 2,370 questions; grade-11 real questions ingested = biology 50, chemistry 60, commerce 94, geography 40, math 60, computer science 9, English 9 (all chapter- and lesson-mapped). The 5 template-junk files (literature, art, engineering, military, Quran) were already skipped by the ingest gate before this pass, so "kept" there changes nothing.

**Deploy-gated (say "deploy"):** production `db:seed:single sd` then `sd-content` — the structure rebuild for g11 (and the 5 new g12 subjects + 13 g12 rebuilds still waiting from 2026-09-05). No PDF/cover upload is needed for g11.

---

## 2026-09-20 — Grades 1–11 chapter and lesson art authored (local tree + local DB; deploy-gated)

Every chapter of the 110 g1–g11 `structure.json` files now carries `concept` + `image`; a lesson carries its
own `image` only where its topic clearly diverges from its chapter, otherwise it inherits.

- 620 chapters, 3,274 lessons (646 with their own image, 2,628 inheriting), 407 distinct covers, all on
  `cdn.databayt.org`. Concepts use the generic names adopted the same day (`faith`, `language`, `civic`, …).
- Applied by positional splice, not a re-dump: 18 of the 110 files are hand-formatted with one-line lesson
  objects. Verified per file by parsing; nothing but the authored fields differs from the backup.
- Originals: `_old/2026-09-20-pre-art-authoring/g<N>/<subject>/structure.json` (110 files). The authored maps,
  the SQL that was run and the rollback of previous DB values: `_old/2026-09-20-pre-art-authoring/_authoring/`.
- Tooling and the vetted palette are in the repo: `scripts/catalog/art-authoring/` (README has the method).
- Local DB updated in place (no delete/recreate): g1–g6 and g11 are 100 % on topic covers; g7–g10 stop at
  59/67 · 58/66 · 61/106 · 95/122 chapters because the DB still holds 88 chapters / 470 lessons of superseded
  editions with no structure file behind them.
- Covers were chosen from topic names by agents, then **every chosen cover was viewed**. Names proved an
  unreliable guide to the artwork in both directions, so the faith subjects (islamic g1–g9, islamic-studies
  and quran g10–g11) were authored by hand from a palette of covers that had been looked at.

Open: grade 12 was out of scope and its 2026-09-05 map has the same kind of misfits — run the validator over
g12. g3 geography and g3 math have 9 chapters with 0 lessons in the DB though their structure files list 65
(the seed builds lessons from lesson directories, which these two subjects lack). Production receives all of
this through the next `sd` → `sd-content` run with this tree present; the published `structure.json` objects
on the CDN are stale until re-published.

## 2026-09-05 — Grade 12 Markdown twins (MarkItDown), local + CDN

Every `g12/<subject>/textbook.pdf` now has a `textbook.md` beside it (25 files, 4 MB), generated with **Microsoft MarkItDown 0.1.7** (`uvx --from 'markitdown[pdf]' markitdown`, pdfminer.six engine) and post-processed by `scratchpad/sd-apply/md_post.py`: presentation-form glyphs normalised to standard letters (ligature expansions pre-flipped), visual-order Arabic lines reversed back to logical order (common-word vote per line), `(cid:NN)` glyph-id noise stripped, YAML front matter with title/dbSlug/edition/source md5 and a **measured quality grade**. Uploaded to BOTH buckets under `catalog/textbooks/<slug>/textbook.md` (`text/markdown; charset=utf-8`; no Subject field points at it — the key mirrors the PDF's). The five new subjects' PDFs and covers are on the CDN too (their production DB rows still wait for the deploy-gated prod seed).

**Outcome after the OCR fallback (same day, `textbook-md.py --ocr auto --dpi 300 --psm 3`, tesseract 5.5.3 `ara`/`eng`/`fra`, ~7 s/book of text layer, ~45 s/book of OCR):**

| Grade | Engine | Subjects |
| --- | --- | --- |
| A (21) | MarkItDown text layer (3) | agriculture 87 %, engineering 51 %, French 54 % |
| A | tesseract OCR (18) | grammar 47 %, literature 70 %, rhetoric 58 %, specialised Arabic 39 %, biology 47 %, chemistry 44 %, Christian education 52 %, commercial 52 %, computer science 42 %, SPINE 6 58 %, Islamic elective 61 %, Islamic education 66 %, literary studies 64 %, specialised maths 28 %, basic maths 32 %, military 83 %, physical education 44 %, physics 52 % |
| B (4) | MarkItDown text layer | art 58 %, geography 64 %, history 85 %, family sciences 65 % (3–5 % letters the font never mapped) |

Percentages are coverage (extracted characters per page against ~1,200 of prose). The grade measures character cleanliness and volume, not OCR correctness: a spot check (chemistry p60, specialised maths p100) shows **prose reliable, chemical formulas / equations / tables / diagram labels as noise** — the low coverage of the two maths books is exactly that. Before OCR the picture was 10 usable / 15 EMPTY (5 scans, 10 fonts without a Unicode map); OCR also beat the text layer on the three former C books.

The 25 twins were re-uploaded to both buckets (`--force`) and the 25 keys invalidated on CloudFront (`I69CT7AZO8FGKZYPFTAL236SKE`); HTTPS serves the OCR versions. Tooling now lives in the kun engine: keyword `textbook` (`~/kun/.claude/skills/textbook/`, installed in `~/.claude/skills/`), tesseract in `onboarding-mac.sh`, handoff `~/kun/.claude/handoff/2026-09-05-sd-textbook-markdown-ocr.md`.

--- | --- | --- |
| A | agriculture (coverage 87 %), engineering (51 %), French (54 %) | clean text layer; residual ligature swaps possible |
| B | art (58 %), geography (64 %), history (85 %), family sciences (65 %) | readable; 3–5 % of letters unmapped by the font (shown as U+FFFD) |
| C | biology (53 %, 15 % unmapped letters), computer science (4 % coverage), Islamic studies elective (14 %) | fragments only |
| EMPTY | grammar, rhetoric, SPINE 6, physics, literary studies (scans, no text layer); literature, specialised Arabic, chemistry, Christian education, commercial, Islamic education, basic maths, specialised maths, military, physical education (fonts without a Unicode map → glyph ids only) | no usable text; the .md carries the front matter and a one-line note |

So 10 of 25 have usable Markdown from the text layer; **15 need OCR** — either MarkItDown with Azure Document Intelligence (`markitdown -d -e <endpoint>`) or a local `tesseract` with Arabic data on rendered pages. Coverage < 100 % on the usable ones is tables/figures/scan pages the text layer does not carry. Known residual defect: fonts that expose ligatures through their Unicode map (lam-meem, some teh-reh pairs) may still appear swapped in a minority of words ("املركز"); the presentation-form case is fixed.

---

## 2026-09-05 — Grade 12 gaps fixed (local tree + local DB; deploy-gated)

**Structures rebuilt from the books' own tables of contents (13, `source: official-toc-2026-09`, legacy pdftotext trees archived under `<subject>/_old/2026-09-05-legacy-pdftotext/`):** agriculture 3/27 (was 2/27), specialised Arabic 24/37 (was 2/4 — the book has no units, 24 دروس), commercial 3/40 (was 2/39), computer science 5/52 (was 6/18), engineering 4/81 (was 5/15), French 6/38 (`lang: fr`, unités → skill sections), geography 3/53 (was 5/15), history 4/41 (was 5/15), family sciences 6/14 (was 4/11), Islamic education 6/42 (was 6/18), basic maths 6/39 (was 2/5), military sciences 13/0 (فصول, no lessons), physics 4/16 (أبواب → فصول as lessons; was 8/24). Chapters are the books' top division throughout; exercise/objective rows dropped.

**Question banks — decided per subject by whether the legacy unit order tracked the book (ids are unit-positional, e.g. `g12-geo-u01-q001`):** kept in place for agriculture, commercial, engineering, French, family sciences, military (the first units match); archived to `_old/…/` for specialised Arabic, computer science, geography, history, Islamic, basic maths, physics (legacy chapter 1 was e.g. "التاريخ القديم" / "الجغرافيا الطبيعية" — content these books do not contain). Archived banks stay in the DB at subject scope, chapter-less, until re-authored.

**Subjects added (5):**

| dir | DB slug | Book | Year | Structure |
| --- | --- | --- | --- | --- |
| `g12/art` | `sd-g12-arts-design` (override, g11 convention) | الفنون والتصميم | **الطبعة المنقحة ٢٠٠٧م** | 5/34 (incl. the appendix of world paintings) |
| `g12/literary-studies` | `sd-g12-literary-studies` | دراسات أدبية ولغوية | undated (same NCCER team as the 2006–08 Arabic books) | 4/19 |
| `g12/physical-education` | `sd-g12-physical-education` | التربية الرياضية | deposit ٧٩٣/٢٠٠٨ | 10/0 |
| `g12/christian-education` | `sd-g12-christian-education` | التربية المسيحية | deposit ٧٨٣/٢٠٠٨ | 9/30 (2 flat أقسام + 7 وحدات) |
| `g12/islamic-studies-optional` | `sd-g12-islamic-studies-optional` | الدراسات الإسلامية (اختياري) | **الطبعة الثانية المنقحة ٢٠٠٩م** (al-amgaad Drive; ISBN 978-99942-53-21-0) | 4/10 (أبواب → فصول) |

`curriculum.json` g12: the five entries + renames `math` → الرياضيات الأساسية and `computer-science` → علوم الحاسوب (the DB rows said الرياضيات / الحاسوب). `sd.ts`: g12 `art → arts-design`. `concepts-data.ts`: `christian-education → religion`, `literary-studies → languages`.

**Still unobtainable:** التربية الإسلامية الخاصة (arts-stream Islamic education) — its only link anywhere is rowadaltamayoz.com, whose host no longer resolves; every other aggregator lists the general التربية الإسلامية only.

---

## 2026-09-04 — Grade 12 verification: complete set, editions dated, nothing newer online

**Scope:** every `curriculum/sd/g12/*/textbook.pdf` (20 subjects) — imprint page and back matter rendered and read; text layers scanned for edition/deposit tokens; PDF creation dates recorded; every copy on afedne (24 files, Google Drive) and mdl.edu.sd (7 files, incl. the Oct-2022 re-uploads) downloaded and md5-compared. Grade 12 is on the **old** national curriculum by ministry decision (2025/26); the new-curriculum cohort reaches g12 in 2027/28, so no newer official g12 books exist yet.

**Verdict:** 20/20 subjects have a textbook, all are the editions in circulation (byte-identical to the aggregator/library copies, or the same edition behind a splash page / a different scan) — **no newer edition of any grade-12 book is online**. Years of writing/printing below (printed editions in bold; the rest inferred from ISBN block, legal-deposit numbers and PDF dates, marked ≈).

| dir | Book (as printed) | Edition / year | Evidence | Pages | Structure |
| --- | --- | --- | --- | --- | --- |
| agriculture | مبادئ الإنتاج الزراعي والحيواني | **الطبعة الثانية المنقحة ٢٠٠٩م** | imprint p2 | 149 | legacy 2/27 |
| arabic-grammar | قواعد اللغة العربية | ≈2006–2008 (no printed edition) | ISBN 978-99942-53-11-1 (NCCER 2008–11 block); PDF created 2006-12-21 | 144 | official-toc 10/38 |
| arabic-literature | المطالعة والأدب | ≈2006–2008 (no printed edition; preface undated) | same authoring team/series as the dated g12 Arabic books | 196 | official-toc 6/26 |
| arabic-rhetoric | البلاغة والتعبير | ≈2006 (no printed edition) | PDF created 2006-12-21 | 102 | official-toc 4/24 |
| arabic-specialized | اللغة العربية الخاصة | **الطبعة الأولى ١٤٢٩هـ / ٢٠٠٨م** | imprint p3 | 209 | legacy 2/4 |
| biology | علم الأحياء | revised edition, year not printed (≈2010s) | "لجنة إعداد الكتاب وتطويره"; scan created 2014-10-12 | 253 | official-toc 22/51 |
| chemistry | الكيمياء | **2008** (legal deposit 785/2008) | last page; ISBN 978-99942-53-10-4; library file created 2010-04-21 | 409 | official-toc 9/46 |
| commercial-studies | العلوم التجارية (التبادل التجاري – المحاسبة المالية – الأسواق المالية) | **الطبعة الثانية المنقحة ٢٠١١م** | imprint p2; ISBN 978-99942-53-06-7 | 157 | legacy 2/39 |
| computer-science | علوم الحاسوب | **الطبعة المنقحة ٢٠١٠م** | imprint p3 | 186 | legacy 6/18 |
| engineering | العلوم الهندسية | ≈2008 (no printed edition) | ISBN 978-99942-53-15-9; library file created 2008-08-13 | 227 | legacy 5/15 |
| english | SPINE 6 (Sudan Practical Integrated National English, Pupil's Book 6) | **2009** (legal deposit ٢٣٣/٢٠٠٩) | last page; ISBN 978-99942-919-8-9; PDF created 2009-05-16 | 177 | official-toc 10/40 |
| french | Méthode de Français 3 «Allons-y !» (Bakht er Ruda / CNMRP, relecture GREF) | **2015** | 2015 francophonie map p91; PDF created 2015-08-11 | 186 | legacy 6/38 |
| geography | الجغرافيا والدراسات البيئية | **الطبعة المنقحة ٢٠٠٩م** | imprint p3 | 230 | legacy 5/15 |
| history | التاريخ | **الطبعة المنقحة ٢٠٠٩م** | imprint p3 | 276 | legacy 5/15 |
| home-economics | العلوم الأسرية | **2009** | National Library cataloguing card p4; ISBN 978-99942-53-05-0 | 168 | legacy 4/11 |
| islamic | التربية الإسلامية | **طبعة منقحة ١٤٢٩هـ / ٢٠٠٨م** | imprint p2 | 180 | legacy 6/18 |
| math | الرياضيات الأساسية | **أكتوبر ٢٠٠٩م** | imprint p3 | 164 | legacy 2/5 |
| math-specialized | الرياضيات المتخصصة، الكتاب الأول + الثاني (merged) | ≈2010 (no printed edition) | ISBN 978-99942-53-18-0; files created 2010-01-25/27 | 387 | official-toc 12/72 |
| military-science | العلوم العسكرية | **الطبعة الثانية ٢٠٠٨م** | imprint p3 | 174 | legacy 12/14 |
| physics | الفيزياء | **الطبعة الثانية ٢٠٠٥م** | imprint p3 | 218 | legacy 8/24 |

**Cross-check results:** identical md5 with afedne for grammar, specialized Arabic, basic maths, biology, geography, chemistry, literature, military, physics, engineering, computer, family sciences, French, history, commercial; identical with mdl for SPINE 6 and Islamic; same edition behind a rowad splash page for Islamic (181 vs 180 pp) and SPINE 6 (178 vs 177 pp); rhetoric = same book, different scan (21.8 MB vs 10.3 MB); commercial and chemistry on mdl = same source files (same PDF creation dates), heavier scans; engineering on mdl = 226 pp (ours 227 with the splash). mdl's specialised-maths file NAMES are swapped (its "الكتاب الثاني" is the 180-page Book 1) — the covers, not the file names, are authoritative, and our merge follows the covers.

**Gaps in the grade-12 set (official subjects we do not hold):**

| Book | Status |
| --- | --- |
| الفنون والتصميم (arts stream) — **الطبعة المنقحة ٢٠٠٧م**, 161 pp | staged `_incoming/2026-09-04/g12-gaps/g12-arts-design.pdf` (138 MB scan) — add as `g12/art` → `sd-g12-arts-design`-style slug (decide dir/slug: g11 uses `art → arts-design`) |
| دراسات أدبية ولغوية (arts stream) — undated, 139 pp | staged `_incoming/2026-09-04/g12-gaps/g12-literary-linguistic-studies.pdf` — new subject (no dir yet) |
| التربية الإسلامية الخاصة (arts stream) | only link is rowadaltamayoz.com, whose host no longer resolves — not obtainable today |
| الدراسات الإسلامية (اختياري) | same dead host |
| التربية الرياضية، التربية المسيحية (optional) | staged under `_incoming/2026-09-04/optional/` since the morning pass |

**Structure completeness:** DONE 2026-09-05 (see the section above). At verification time 7 subjects carried official-TOC structures and **13 still carried legacy pdftotext trees**, several plainly thin (basic maths 2 ch / 5 lessons, specialised Arabic 2/4, agriculture 2/27, commercial 2/39, engineering 5/15, geography 5/15, history 5/15). Rebuild those 12 from the books' own tables of contents (the g10 method), then add the two staged gap subjects and re-seed.

---

## 2026-09-04 — Verdict

**Ladder:** 6+3+3 (ابتدائي g1–6 · متوسط g7–9 · ثانوي g10–12) — confirmed current.

**Which curriculum each grade is taught on (2025/26 school year, per Khartoum-state ministry, Oct 2025 and May 2026):**

| Grades | Curriculum in force | Our tree |
| --- | --- | --- |
| g1–g6 | 2020 primary series (NCCER 2020–2021 editions), taught in full, no deletions | Current, with the gaps listed below |
| g7–g9 | 2020 middle-stage series (2020–2024 editions; g9 set finalised Feb 2024) | Current |
| g10 | **NEW national curriculum** — NCCER first editions dated **2025** ("الطبعة الأولى ٢٠٢٥م") | **Updated 2026-09-04** — the 12 new-curriculum books applied; the old (2009–2015) set archived under `_old/` |
| g11–g12 | **OLD national curriculum** (explicitly, "تدرس وفق المنهج القومي القديم") | Current for the old curriculum |

Expected but **unconfirmed**: the new-curriculum cohort reaches g11 in 2026/27 (this month). No new g11 books are online yet — every "2026"-labelled g11 file on afedne is md5-identical to our old books. Watch item.

### Per-grade verdict (local tree vs. official set)

| Grade | Verdict | Details |
| --- | --- | --- |
| g1 | ✅ current (4/4) | Arabic, Islamic, Math (2020 primary series) + SMILE Starter 1 (2nd ed 2020). mdl re-uploaded Arabic/Islamic on 2025-08-31 — byte-identical to ours. |
| g2 | ✅ current (4/4) | Same series; SMILE Starter 2. |
| g3 | ⚠️ 2 fixes | Arabic/Islamic/Math ✅. **science = OLD** rowad scan ("مرحلة الأساس", 100pp) → new-series **العلوم الصف الثالث** (2021, 59pp) staged. **english = ACTIVITY BOOK** (SMILE Book 1 activity) → pupil's book needed: prefer **SMILE Starter 3** (2nd ed 2020, same series as g1/g2; British Council PDF — blocked from this network, manual download), fallback SMILE Book 1 pupil's staged. geography = old rowad scan, no newer edition found anywhere (keep, flag). |
| g4 | ⚠️ 1 gap + 1 new subject | Arabic/Art(2021)/English(SMILE Book 2)/ICT/Islamic(2021) ✅; history = old rowad scan (no newer found). **math had NO PDF** → الرياضيات الصف الرابع (2nd ed 2021) staged. **science is an official g4 subject** (العلوم الصف الرابع, 1st ed 2021; on mdl + afedne) — not in curriculum.json → staged as new subject. |
| g5 | ⚠️ 2 duplicate dirs | 12 real books ✅ (incl. ملبسنا / المورد / الأرض بيئة الحياة / SMILE Book 3). `g5/home-economics` is the SAME file as `g5/clothing` (md5 26abb435e1) and `g5/technology` is the SAME file as `g5/ict` (md5 4ad20d5d77) — curriculum.json lists them as separate subjects. **Decision needed** (dirs map to distinct DB slugs; SubjectSelection/Enrollment cascade on subject delete). |
| g6 | ⚠️ 1 wrong + 2 new subjects | Arabic/Geography/History/ICT/Islamic/Math ✅. **english = WRONG** ("Anna and the Fighter", Macmillan reader, 18pp — alktab24 lists this reader under **grade 8** English literature). The official grade-6 book is **SMILE Book 4 (Grade 6)** — **NOT FOUND online** (afedne/almasarplus "Book 6" links are the grade-5 Book 3; mdl has only the Grade-6 teacher's book). New official subjects found: **التربية الفنية الصف السادس** (1st ed 2021, mdl) and **العلوم الصف السادس** (scan, afedne/almasarplus) — both staged. Leftover `pages/`, `toc_pages/` dirs in g6/* are pipeline debris. |
| g7 | ✅ current (9/9) | Incl. SMILE Book 7 (2nd ed 2024), geography (1st ed 2021). (mdl's "English Grade 7" is a mislabelled Starter 1 — ignore.) |
| g8 | ⚠️ 1 junk + 1 missing + 1 new subject | Arabic/English(SMILE Book 8)/History/Islamic/Math/Science/Technology ✅. **geography/textbook.pdf is a 4-page almualm.com ad** → official الجغرافيا الصف الثاني (1st ed 2022, 126pp, review-watermarked copy from almasarplus) staged. **art still MISSING** (alktab24's "التربية الفنية الثاني المتوسط" is actually the tech-ed book we already have). New official subject: **التربية الوطنية الصف الثاني** (1st ed 2022, 53pp, mdl) — staged. |
| g9 | ✅ current (9/9) | All 2024 finals (metadata "FINAL 15/18-2-2024"), SMILE Book 9; mdl's 2024 copies match. |
| g10 | ❌ superseded | See "Grade 10 — new curriculum" below. Also two local errors: `g10/arabic-rhetoric` is the **g12** book (cover "الصف الثالث"); `g10/arabic-specialized` is the **g11** book (md5-identical to `g11/arabic-specialized`). Physics and grammar were missing even for the old curriculum. |
| g11 | ✅ current (old curriculum) | 19/19 present; matches every aggregator byte-for-byte. Watch for new 2026/27 editions. |
| g12 | ⚠️ 3 gaps (old curriculum) | 18 ✅. Missing official books: **English SPINE 6** (177pp), **الرياضيات المتخصصة كتاب 1 + 2** (science stream) — all three staged from mdl. Optional: التربية الرياضية, التربية المسيحية (staged under optional/). |

### Grade 10 — new curriculum (first cohort 2025/26)

Verified NCCER first editions, cover text "المرحلة الثانوية – الصف الأول – الطبعة الأولى ٢٠٢٥م" (al-amgaad Google Drive / almualm.com; page 1 of those copies is an aggregator splash, cover is page 2 — stripped in staging):

| New g10 book | Pages | Status vs. local |
| --- | --- | --- |
| التربية الوطنية | 68 | NEW subject (also confirmed by the NCCER g10 syllabus doc on Scribd: "إضافة مواد جديدة مثل التربية الوطنية") |
| ريادة الأعمال | 120 | NEW subject |
| التربية الفنية | 111 | NEW subject (distinct from الفنون والتصميم) |
| تكنولوجيا المعلومات والاتصالات | 234 | NEW subject |
| الفيزياء | 163 | subject was MISSING locally |
| الأحياء | 196 | replaces old (2009) |
| الكيمياء (2025 edition) | 166 | replaces old |
| التاريخ | 152 | replaces old |
| التربية الإسلامية | 215 | replaces old "الدراسات الإسلامية" (renamed) |
| العلوم الهندسية | 154 | replaces old |
| الرياضيات — الطبعة الثالثة 2025 | 282 | replaces old |
| اللغة العربية (unified) | 245 | preface: "يشمل — لأول مرة — كل فروع اللغة العربية في مؤلف واحد" (نحو + تعبير وبلاغة + أدب ومطالعة) → supersedes the three old Arabic sub-books for g10 |

Still circulating **only as old editions** on every aggregator (new edition either not issued or not yet online): القرآن الكريم وعلومه, المطالعة والأدب, البلاغة والتعبير, قواعد النحو, English (SPINE 4), الفرنسية, علوم الحاسوب, الفنون والتصميم, العلوم الأسرية (shared g10–g11 book), العلوم العسكرية, التربية المسيحية. The new g10 taxonomy therefore does NOT map 1:1 onto the current `g10/*` dirs — treat it as a new subject set, not a per-dir swap.

### Staged files

`curriculum/sd/_incoming/2026-09-04/` (29 PDFs, ~430 MB, gitignored, inert to the seed/upload scripts which enumerate `g1..g12` only) with `MANIFEST.md` (target dir · action · verified title · source · md5). **Nothing under `g*/` was modified.** Applying a staged book is a content job: it invalidates that subject's `structure.json` / `chapters/` / `cover.jpg` / `qbank.json` / `exams.json` and needs the Aug-2026 TOC-vision pipeline, a cover re-render, qbank re-authoring, then `pnpm db:seed:single sd` + `sd-content` and `scripts/upload-textbooks-all.ts`.

### Blocked / not found online (2026-09-04)

- **g3 SMILE Starter 3 pupil's book** — hosted at sudan.britishcouncil.org / africa.teachingenglish.org.uk; both hosts time out from this network (WebFetch refuses the domain too). Manual download.
- **g6 SMILE Book 4 (Grade 6) pupil's book** — not on any aggregator (all serve the grade-5 book under the g6 label).
- **g8 التربية الفنية** — not online anywhere.
- **New-curriculum g10 books** for the 11 subjects listed above; **new g11 books** (2026/27) — not online yet.
- NCCER's own bulletin "نشرة تنظيم مناهج التعليم الثانوي 2025–2026" exists only as Facebook/Instagram posts (not fetchable); manahgsudan.edu.sd (منصة منت) returns HTTP 522.

### Data-quality items (decide, then apply)

1. Delete `g8/geography/textbook.pdf` (ad splash) when the staged book is applied.
2. `g10/arabic-rhetoric` (g12 book) and `g10/arabic-specialized` (g11 book): both are wrong for g10; under the new curriculum g10 Arabic is one unified book.
3. `g5/home-economics` ≡ `g5/clothing`, `g5/technology` ≡ `g5/ict` (byte-identical PDFs, separate DB slugs `sd-g5-home-economics` / `sd-g5-technology`).
4. `curriculum.json` lacks: g4 science, g6 art, g6 science, g8 national-education, g10 physics/ict/national-education/entrepreneurship/art-education/arabic (unified), g12 english/math-specialized.
5. `g6/*/pages`, `g6/*/toc_pages` — pipeline debris.
6. "Anna and the Fighter" is a g8 supplementary reader per alktab24 — can be kept as g8 material, not a g6 textbook.

### Sources (2026-09-04)

- Khartoum ministry: grade-by-grade curriculum ruling — https://nabdwatan.com/14476 ; no deletions 2025/26 — https://ultrasudan.ultrasawt.com/ (article "الخرطوم تنفي حذف أي أجزاء من المناهج الدراسية") ; 2025/26 calendar — https://www.sudanakhbar.com/1710284
- mdl.edu.sd book list — https://mdl.edu.sd/SudaneseCurriculum
- alktab24 — https://www.alktab24.com/المنهج-السوداني/ ; afedne (basic) — https://afedne.com/تحميل-منهج-السودان-كاملاً-لمرحلتي-الأ/ ; afedne g10 — https://afedne.com/تحميل-كتب-الأول-الثانوي-لمناهج-ال/ ; afedne g11 — https://afedne.com/كتب-الصف-الثاني-الثانوي/
- al-amgaad g10 (new-curriculum Drive links) — https://www.al-amgaad.com/2022/04/first-high-school.html ; almualm g10 — https://www.almualm.com/2025/10/تحميل-جميع-كتب-الصف-الاول-الثانوي-السو.html
- almasarplus Drive folders — https://www.almasarplus.com/2025/12/pdf.html
- NCCER g10 syllabus (new subjects) — https://www.scribd.com/document/916834864/
- British Council SMILE Starter series — https://sudan.britishcouncil.org/en/programmes/english-programmes/english-education/smile-starter-series ; Starter 3 PDF — https://sudan.britishcouncil.org/sites/default/files/smile_starter_3_-_grade_3_-_pupils_book.pdf

---

## History — 2026-07-15 (Grade 1 optimization pass)

The "Still Missing ❌" g1 rows in the 2026-04-03 section are **STALE**. All four g1 textbook PDFs are the correct official 2020 **primary-stage** books (المرحلة الابتدائية / الصف الأول), md5-distinct from the g7 middle-school books:

- `g1/math/textbook.pdf` — الرياضيات، الصف الأول، المرحلة الابتدائية ✅
- `g1/arabic/textbook.pdf` — اللغة العربية، الصف الأول، المرحلة الابتدائية ✅
- `g1/islamic/textbook.pdf` — التربية الإسلامية، الصف الأول، المرحلة الابتدائية ✅
- `g1/english/textbook.pdf` — SMILE Starter 1, Grade 1 ✅

Chapter/lesson structure rebuilt (`scripts/sudan-data/rebuild-g1.mjs`) from the verified TOCs (`scripts/sudan-data/toc/sd-g1-*.json`): math 5ch/47le · arabic 1ch/55le · english 5ch/40le · islamic 6ch/31le. Covers rendered (`cover.jpg`), qbank/exams wired via `prisma/seeds/catalog/sd-content.ts`.

## History — 2026-04-03 (first cover-page audit)

Method: PyMuPDF text extraction + visual PDF review vs mdl.edu.sd, alktab24.com, al-amgaad.com.

Fixed then: g1 arabic/math/islamic were the g7 books (moved to g7); g7 art/science/history/geography/ict, g9 technology, g10 art/english/quran, g11 home-economics, g12 arabic/arabic-rhetoric downloaded from mdl.edu.sd; g8 math from al-amgaad; g2/science deleted (not a g2 subject); g4/technology ≡ g4/computer duplicate resolved to `g4/ict`.

Left open then and resolved later: g7/english (SMILE Book 7 swapped in Aug 2026), g9/ict, g5 clothing/earth-environment/science, g11/arabic-specialized (Aug 2026 finalization pass); g6/technology + g12/arabic dirs removed (dup PDFs → same DB slug).

Root cause noted then and still valid: Arabic grade labels are ambiguous — "الصف الأول" is the first grade of ANY stage; always read the stage line (الابتدائية / المتوسطة / الثانوية) on the cover.
