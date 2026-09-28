# Verification — how a book earns its gate

A subject may not have a Markdown twin, and may not have questions, until its
`textbook.pdf` has been **verified as the latest official edition**. This file is the
method. The record is each subject's `structure.json` → `verification`, and the
enforcement is `pnpm gate`.

Before this existed, the verdict lived in prose. `docs/history/sd-textbook-audit.md`
carries a thorough grade-12 pass from 2026-09-04 — and it was unusable as a gate: it
named 20 of the 25 subjects that exist today, its paths predate the migration, and
nothing tied it to the PDFs, so replacing a book would have silently kept the claim.

## What "verified" means

Three things, and the first is the only one that decides:

1. **The book says so.** Someone read the scan's own imprint page and recorded, verbatim,
   what is printed there — publisher, edition line, hijri and gregorian years, ISBN, legal
   deposit. `evidence` names where it was read (`imprint p3`, `legal deposit 785/2008`,
   `National Library cataloguing card p4`).

   `editionBasis: "printed"` means the book prints an **edition statement**
   (`الطبعة …`) and `edition` reproduces it verbatim. `"inferred"` means it prints none —
   half of the grade-12 books do not — and the recorded value comes from a printed date, a
   legal-deposit number, an ISBN block or the PDF's own metadata, which `evidence` must
   name. Thirteen of grade 12's twenty-five are `inferred`; that is a property of the
   books, not a weakness in the pass.
2. **Nothing newer is in circulation.** The copies on the circulating libraries and
   aggregators were fetched and measured. `comparedWith` records each URL, its byte
   length, and whether it is identical to ours.
3. **The verdict is bound to the bytes.** `pdfSha256` must equal the `assets.lock.json`
   entry for that `textbook.pdf`, and `pages` must equal the `pages/*.webp` count. Replace
   the PDF, re-run `pnpm assets lock`, and the book gate fails — along with every gate
   below it. A verdict cannot outlive the file it was about.

**A byte difference is not an edition difference.** Most of our grade-12 scans differ in
size from the library's copy of the same book: different scan, different compression, or a
two-volume book bound into one file. `comparedWith[].identical` is corroboration, never the
verdict. Only the imprint page decides.

## The run

```bash
pnpm verify plan sd g12                                  # worksheet -> .work/verify/sd-g12.json
#   read each book's imprint pages (p2, p3, last leaf) and fill
#   book / edition / editionBasis / evidence
pnpm verify sources .work/verify/sd-g12.json --apply     # HEAD every comparedWith url
pnpm verify apply   .work/verify/sd-g12.json --apply     # write the verification blocks
pnpm validate && pnpm index && pnpm gate sd --grade g12
```

The worksheet is scratch under `.work/` (gitignored); `structure.json` is the record. The
measured fields in the worksheet come from the lockfile and the page renders — they are not
to be edited. `pnpm verify apply` refuses any subject still marked `unverified` or missing
`evidence`, and re-parses the whole `structure.json` against the schema before writing.

Imprint pages are read with the `transcribe` agent from the already-rendered
`pages/<N>.webp` — nothing is re-rendered, and the agent is forbidden to complete a
partially legible year or deposit number. A `[غير مقروء]` in a transcription is a result,
not a failure.

## Sources

| Source | What it is | Use |
| --- | --- | --- |
| the scan's own imprint page | the book | the verdict |
| `mdl.edu.sd` (مكتبة الميزاب الرقمية) | a non-profit digital library on the `.edu.sd` domain — **not** the ministry | primary corroboration; has a grade-12 shelf, and 5 of our 25 files are byte-identical to its copies |
| afedne.com, alktab24.com, al-amgaad.com, almualm.com, almasarplus.com | aggregators, mostly Google Drive folders | secondary; their "الطبعة الجديدة 2026" labels are marketing on old books and prove nothing |
| the Khartoum-state ministry's own statements | curriculum status, not files | why a book is or is not superseded |

## When to look again

Sudan's curriculum reform rolls upward by cohort. As of 2026 grade 10 carries the
new-curriculum set and the middle stage's books are dated 2024, while **grade 12 remains on
the old curriculum by ministry decision** — the new-curriculum cohort reaches it in
2027/28. That is why grade 12's `recheckAfter` is `2027-06-01`: it is not a suspicion about
the current books, it is the date the answer is expected to change. When `recheckAfter`
passes, `pnpm gate` fails the book gate until someone re-runs this method.

A book found to be superseded is marked `book: "superseded"` with a `note` naming the newer
edition. It keeps failing the gate — deliberately — until the new PDF is staged, locked and
re-verified.
