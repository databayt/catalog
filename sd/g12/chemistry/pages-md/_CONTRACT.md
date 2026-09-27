# Transcription contract — sd/g12/chemistry

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: الكيمياء — Chemistry (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 9 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

الكيمياء العضوية - المشتقات الهيدروكربونية وتطبيقاتها · الأحماض والقواعد · التحليل الكيميائي الكيفي · التحليل الكيميائي الحجمي · الطاقة في التفاعلات الكيميائية · سرعة وآلية التفاعلات الكيميائية · مبادئ الاتزان الكيميائي · الكيمياء الكهربية · الكيمياء النووية

Numbered section headings inside a chapter get `### `. The 46 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

**Tables** become real Markdown tables, with the columns in printed order (rightmost printed column = leftmost Markdown column, so the rendered RTL table matches the book). Never flatten a table into prose. Numbers inside tables are the highest-value content — read them carefully. **A table is a ruled or shaded grid only.** A cross, a flow chart, a genetics diagram, a labelled drawing or any arrangement of labels joined by arrows is a FIGURE, not a table: transcribe its labels as a list (below), never as a Markdown table. Every table row must have the same number of cells.

**Figures and diagrams.** Emit the image reference with the PRINTED caption as its alt text, then the caption as a bold line, then every label inside the figure as a bullet list, in reading order:

```
![<printed caption>](pages/<N>.webp)

**<printed caption>**

- <label exactly as printed>
- <label exactly as printed>
```

Labels are reproduced verbatim — the printed words only. Do not describe what a label points at, do not group labels under headings you composed, do not add words that are not printed. A printed arrow chain may be written on one bullet with `←` / `→` between its labels. When the print has NO caption, the alt text is the single word `شكل` (or `figure` for a non-Arabic book) and no bold caption line follows — never compose a description. Labels inside diagrams are real teaching content: a page that is nothing but a diagram still yields a full label list.

**Terms in another script** stay inline exactly as printed, in place (a binomial, a chemical symbol, an English gloss after the term).

**Notation** uses LaTeX where the print uses super/subscripts or symbols (`$I^A I^B$`, `$H_2O$`, `$x^2$`). Crosses, ratios and formulas keep their printed form (`AB x A`, `1 : 2 : 1`).

**Page furniture is dropped.** Do not transcribe running headers/footers, the page-number mark, or decorative rules.

**Do not write a `<!-- page N -->` marker.** The assembler adds those.

**Blank or purely decorative page**: write the single line `<!-- blank -->`.

## Independence

When your caller says the read is independent (an audit read, a benchmark run, or an adjudication), you must not open any earlier transcription of the page — not `pages-md/<N>.md`, not `pages-md-audit/`, not `gold/`, not `textbook.md`. Reading them turns a measurement into a copy. The image and this contract are your only inputs.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <page list or "none">, printed-errors: <page: what, or "none">`. Do not paste any transcribed text back. It all lives in the files.

**Right-to-left notation carries the PRINTED order.** The rule above is not only about ruled tables. Matrices, equations and any horizontal arrangement of terms are set right-to-left in these books, so the LaTeX source must reproduce the printed order, not the left-to-right mathematical convention: the rightmost printed matrix column is the FIRST LaTeX column, and an equation printed with its fraction rightmost is transcribed fraction-first. The renderer draws the result mirrored relative to the page — that is expected; never reorder to 'fix' it. An identity, symmetric or transpose matrix CANNOT be used to check this, because it is unchanged by the reversal: settle direction on a spot where the text asserts a relation between named entries (e.g. a line claiming two matrices differ at a specific element), or from a right-edge crop.

**Mirrored glyphs are transcribed by MEANING, not by shape.** The comparison and bracket glyphs (`<` `>` `≤` `≥` `⊂` `⊃`, parentheses, braces) are bidi-mirrored by the renderer, so a shape-faithful read inverts them. Resolve each one against the page's own arithmetic — if the line concludes a value is less than 1, the operator is `<` whichever way the glyph leans. Arrows are NOT bidi-mirrored: a limit whose arrowhead points left toward its target is still `\to` in LaTeX. Disagreement over these is the single largest source of false defects in this corpus; settle it on the page, do not flag it.

**Arabic typography, transcribed as printed.** Justified lines are stretched with kashida/tatweel (U+0640) — that is justification, not spelling: write the plain form. These books frequently omit the hamza (`الاحصاء`, `فان`, `باجراء`) and use a dotless final ya (`التى`) — keep both exactly as drawn; never normalise a bare ا to إ/أ or restore a dot, even when the same word is spelled differently elsewhere on the page. A heading may therefore not string-match the contents list; that mismatch is expected, not a defect. Latin digits appearing among Arabic-Indic ones (`س ≤ 1`) are printed that way — keep them.

**Math is set the way the book draws it.** Stacked fractions (numerator over a rule) are `\frac{}{}`, never an inline solidus; tall parentheses drawn around one are `\left( \right)`; a factor struck through when a fraction is reduced is printed notation, `\cancel{}`. Display equations on their own line use `$$...$$`, one block per printed line with any leading `=` inside the block; formulas inside a sentence use `$...$`. Negative numbers set with the book's long dash keep `–`, not an ASCII hyphen. Whitespace inside math is discarded by the renderer, so spacing differences there are never a defect.

**Run-in labels stay plain.** A bold-faced label printed at body size and running into its line (`الحل :`, `مثال (١) :`) is a label, not a heading: no `#`, and no `**` unless the contract's heading rules say otherwise. A title printed bold, CENTRED and larger than the body is a heading. Decide paragraph breaks from the margin (openers indent, continuations sit flush), not from the line gap: a gap around a display-height element is ordinary leading.

**A centred or boxed identity is stored in LOGICAL order** — the RIGHTMOST printed phrase comes FIRST in the Markdown line. Writing such a line in the order the eye scans it left-to-right renders the box reversed. The same holds for a display equation that carries a side note: the equation is set to the RIGHT of the note, so the equation is written first.

**Figure label bullets follow the page's reading order — right to left, then top to bottom.** A label run that marches left to right is a defect even when every individual label is correct.

**Chapter-opener pages** carry only a couple of bold centred lines inside a decorative frame: an `الباب <ordinal> :`-style label and the chapter title. **Only the chapter title takes `## `**; the ordinal label stays a plain line, with no heading mark and no `**`. The decorative frame is page decoration, NOT a figure — emit no image reference, no alt text and no label list for it. Display titles on these pages are set with decorative kashida stretching; transcribe the plain spelling.

**Arabic letters are never placed inside a math run in these books.** Write an Arabic symbol's subscript with the Unicode subscript character (ط₁ ط₂), not as `$ط_1$`, and keep a reference number or an Arabic gloss OUTSIDE any `$$` block. A unit word ending a display-equation line belongs inside that line's block as `\text{}`, never broken onto its own paragraph.

**Small single-letter figure labels must be read from a native-density crop**, not from the page render — at render density letters such as س and ك are routinely confused, and two independent reads can make the SAME error. Cross-check against the letter the body text uses for that quantity; if it stays ambiguous, mark it illegible rather than choosing.

**Do not make the book consistent.** Where one line spaces a unit, a label or a run-in colon one way and the next line spaces it another, reproduce each occurrence exactly as drawn. Numbered items printed as `N)` keep the parenthesis — never turn it into `N.`.

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- **This book writes decimals with a COMMA and NO leading zero — `,5`, `,6`, `,005`, `,025`.** That is
- **Arithmetic in this book's worked tables is frequently wrong** (p198 table 8 heads its denominator
- In the structural formulas of this book a hanging-substituent row may carry a printed dash that makes no chemical sense (p14 draws `H – H` under the two middle carbons of a butane chain). Reproduce the dash exactly; never replace it with alignment spacing and never delete it as a scan artefact.
- Bond dashes between atoms in a structural formula inside `$...$` (`R - X`, `CH_3 - CH_2 - Br`) are one printed long dash; either ASCII `-` or `–` renders as that mark. The choice is notation, never a disagreement — do not flag or convert it. This does not touch the negative-number rule (negatives keep `–`).
- This book sets bond dashes and locant dashes as the long dash – (U+2013), including inside math runs: write $CH_3 – Cl$ and 2– كلورو بروبان, never an ASCII hyphen. The same dash is used in numbered section headings such as (1–1–1).
- Table and figure caption lines printed bold above the grid keep their ** (they are captions), but a bold label that runs into its own sentence — تدريب : ، الحل : ، مثال (١) : — stays plain.
- In table (1 – 3) on p15 the structural formula of iodopropane ends in a digit 1 where iodine I is meant. Transcribe the 1; do not repair it to I.
- **p40 prints the ester general formula as `CnH₂nO₂` — the digits are subscripted, both n glyphs are full size on the baseline.** Transcribe `$CnH_2nO_2$` as printed; do not promote a letter index to a subscript to make a formula conventional.
- **A prime after a radical letter is real print, not a scan scratch.** p40 draws `R – C – OR′` (thin slanted cap-height stroke after OR), corroborated by the cell's own line `جذران متشابهان أو مختلفان`. Keep the prime; both independent reads dropped it.
- A lesson opener is three separate centred bold blue lines — `الدرس <ordinal>`, the numbered lesson title, and its English title — and each of the three takes `### `. `## ` is reserved for the book's 9 chapter titles, so a lesson opener never takes `## ` and the ordinal line is never left as a plain bold run.
- Latin and digit runs embedded in Arabic lines are printed in VISUAL order by the source's bidi engine, so the glyph order on the page is not the order to type: the page draws `( 7- 1 )` for logical `(1 -7 )` and `(OH–)` for logical `(–OH)`. Always store the logical string that reproduces the printed glyph order, never the glyph order itself.
- The book spells the English name of the carboxylic-acids lesson `Carboxilic Acids` — keep the printed spelling.
- Section, example, figure and experiment numbers are Latin digits in CHAPTER-FIRST order: (1-8-2) is chapter 1, lesson 8, section 2; مثال (1 – 30) is chapter 1, example 30; likewise شكل (3 – 1) and التجربة (3-14) in chapter 3. A read that puts the item number first ((2-8-1), (30 -1)) has reversed the run — transcribe chapter-first, and check the run against the lesson ordinal printed on the page (الدرس الثامن → middle digit 8).
- An English gloss printed on its own centred line under a lesson title — (Esters) under الخواص الفيزيائية والكيميائية للإسترات — stays inline at the end of that ### heading. It is not a heading of its own.
- A lesson opener (الدرس الثامن, الدرس الثالث …) is ###, never ##. Only the book's 9 chapter titles take ##.
- Section and example numbers in this book are chapter-first — (1-9), (1-9-1), مثال (1-33). A two-part number is drawn as `( 9-1)` and `(33 -1)` because the print's dash resolves as a neutral in the RTL line; transcribe the logical order, chapter digit first, and never store the order the eye scans.
- Structural formulae and reaction equations are not tables — write them as `$$…$$` LaTeX arrays with `\mid` for the drawn vertical bonds; never a Markdown table or an ASCII pipe drawing.
- This book writes يعتر for يعتبر (p85) — transcribe the printed form, never restore the ب.
- The same paragraph on p85 spells the same word باحدى once and باحدي the next line; reproduce each occurrence as drawn rather than picking one form.
- The book prints بنتج (single dot, initial ba) where ينتج is meant, in an exercise stem — keep the single-dot form exactly as drawn; do not restore the ya.
- Chemical formulae whose subscripts are printed as true subscripts (CH₃CH₂CH₂OH) are transcribed as LaTeX — $CH_3CH_2CH_2OH$ — never with Unicode subscript digits.
- **A multiplication is printed with its SECOND factor leftmost.** p215 proves it with words: the percentage formula prints `100 × الكتلة النقية` with the Arabic phrase rightmost, so the logical order is `الكتلة النقية × 100`. Store the RIGHTMOST printed factor FIRST — `0.2 × 45`, `0.45 × 100` — even though the page shows `45 × 0.2` and `100 × 0.45`.
- **A hyphenated digit pair is NOT mirrored.** `مثال (4-27)`, `مثال (4-28)`: the pair is a single left-to-right number run, so transcribe the digits in the order they appear left to right (chapter first). Do not reverse it the way a × expression must be reversed.
- **Decimal notation is mixed inside a single page.** p215 carries `0.009`, `0.045`, `0.45`, `0.5` (dot, leading zero) alongside `,009` and `,45` (comma, no leading zero) for the same quantities. Reproduce each occurrence exactly as drawn — never normalise in either direction, and do not read the earlier comma observation as a rule that the book always uses commas.
- **The percent sign prints to the LEFT of its number** (`٪` then `90` left to right), so it is written after the number with a space: `90 ٪`. An unspaced `90%` renders on the wrong side of the digits.
- A worked example's stated ΔH and the number it then divides do not always agree — p244 states `ΔH = - 184.7 KJ` and the solution divides `– 185` to reach `– 92.5`. Transcribe each figure as drawn; never reconcile the solution against the statement.
- This book prints its section and figure numbers with the CHAPTER DIGIT LAST — the thermochemistry chapter heads a subsection `(3-3-5)` and its figure `شكل (3-5)`. Transcribe the printed order with ASCII hyphens and never reorder it to chapter-first.
- A hyphenated section or figure number is ONE identifier: store it exactly as it reads left to right on the page (`(3-5)`, `(3-3-5)`). Operands around an `X` or an `=` are SEPARATE terms on a right-to-left line: store them rightmost-printed-first, like every other token on the line (`س = 30 X 462.3 = 13869.0`). Confusing the two is the one place two independent reads of this book mirror each other.
- **Decimal separators switch inside a single worked example.** p263 prints `4.6` with a period two lines above `2,16` with a comma. Keep each occurrence as drawn; do not unify them.
- **The multiplication sign is sometimes a capital Latin `X`.** p263 prints `2,16 X 10⁻⁶` and `4.6×10⁻⁶` on the same page. Transcribe the glyph actually drawn — never turn the `X` into `×` or `\times`.
- **Unit exponents are typed inconsistently.** The same unit appears as `مول/دسم³` with a true superscript and as `مول/دسم3` with a baseline 3, sometimes within one equation line (p263). Reproduce each occurrence as drawn; decide superscript-vs-baseline by comparing the digit with the ordinary digits beside it in the same numerator, on a native-density crop.
- **A minute-to-second denominator carries the printed order, even though the product is unchanged.** p263 sets the elapsed time rightmost, transcribed `180 × 60` and `(1440 - 360) × 60 ثانية`. Read the order off the page rather than assuming the conversion factor comes first.
- Figure and example numbers in this book are set in Latin digits with the chapter component printed LEFTMOST — the page shows شكل (8-10) and مثال (8-12) in chapter 8. A hyphen-joined digit pair is a single left-to-right bidi run, so transcribe it in the printed pixel order; never reverse it to (10-8) / (12-8) to 'match' Arabic reading order.
- Apparatus diagrams in chapter 8 carry small single-letter tube labels (ا، ب) set much smaller than the Arabic labels around them — they are easy to miss at page density but are real printed labels and belong in the label list in reading order.
- Exercise sub-items in this book's end-of-chapter questions are numbered with Latin roman numerals followed by a closing parenthesis (i) ii) iii)) — keep the parenthesis on every one, including the first, which is easy to lose at page-render density.
- p40 prints the ester general formula as `CnH₂nO₂` — the digits are subscripted, both n glyphs are full size on the baseline. Transcribe `$CnH_2nO_2$` as printed; do not promote a letter index to a subscript to make a formula conventional.
- A prime after a radical letter is real print, not a scan scratch. p40 draws `R – C – OR′` (thin slanted cap-height stroke after OR), corroborated by the cell's own line `جذران متشابهان أو مختلفان`. Keep the prime; both independent reads dropped it.
- A multiplication is printed with its SECOND factor leftmost. p215 proves it with words: the percentage formula prints `100 × الكتلة النقية` with the Arabic phrase rightmost, so the logical order is `الكتلة النقية × 100`. Store the RIGHTMOST printed factor FIRST — `0.2 × 45`, `0.45 × 100` — even though the page shows `45 × 0.2` and `100 × 0.45`.
- A hyphenated digit pair is NOT mirrored. `مثال (4-27)`, `مثال (4-28)`: the pair is a single left-to-right number run, so transcribe the digits in the order they appear left to right (chapter first). Do not reverse it the way a × expression must be reversed.
- Decimal notation is mixed inside a single page. p215 carries `0.009`, `0.045`, `0.45`, `0.5` (dot, leading zero) alongside `,009` and `,45` (comma, no leading zero) for the same quantities. Reproduce each occurrence exactly as drawn — never normalise in either direction, and do not read the earlier comma observation as a rule that the book always uses commas.
- The percent sign prints to the LEFT of its number (`٪` then `90` left to right), so it is written after the number with a space: `90 ٪`. An unspaced `90%` renders on the wrong side of the digits.
- Decimal separators switch inside a single worked example. p263 prints `4.6` with a period two lines above `2,16` with a comma. Keep each occurrence as drawn; do not unify them.
- The multiplication sign is sometimes a capital Latin `X`. p263 prints `2,16 X 10⁻⁶` and `4.6×10⁻⁶` on the same page. Transcribe the glyph actually drawn — never turn the `X` into `×` or `\times`.
- Unit exponents are typed inconsistently. The same unit appears as `مول/دسم³` with a true superscript and as `مول/دسم3` with a baseline 3, sometimes within one equation line (p263). Reproduce each occurrence as drawn; decide superscript-vs-baseline by comparing the digit with the ordinary digits beside it in the same numerator, on a native-density crop.
- A minute-to-second denominator carries the printed order, even though the product is unchanged. p263 sets the elapsed time rightmost, transcribed `180 × 60` and `(1440 - 360) × 60 ثانية`. Read the order off the page rather than assuming the conversion factor comes first.
- p14 prints (بروميد الايثيل) with a bare alef — no hamza — in the common-naming example column; both independent reads restored the hamza to الأيثيل. Transcribe the bare alef as drawn.
- A structural formula that sits INSIDE a ruled table cell cannot be a $$…$$ array, because a display block cannot live in a Markdown cell. Draw it with <br> line breaks and escaped \| for the vertical bonds, and use &nbsp; runs for the horizontal offsets — literal spaces collapse inside a cell and slide the substituents onto the wrong carbons. The contract's no-pipe-drawing rule applies to free-standing formulas, not to ones trapped in a grid.
- In table (1 – 3) on p15 every substituted row draws the vertical bond as a short stroke under its carbon, with the substituent (Cl, Br, H) on the line below. The stroke is real print — a read that drops it and lets the substituent sit directly under the chain has lost printed notation. Inside a ruled grid cell the bond is still written as \mid in the math run, per the structural-formula rule above.
- Never put a pipe glyph of any kind inside a ruled table's cells. The vertical bond strokes drawn in a structural formula inside a cell are written with the Unicode bar characters — a single bond as ∣ (U+2223) and a C=O double bond as ‖ (U+2016) — never as `\|` or `\|\|`. An escaped pipe still counts as a cell separator when the two reads are compared, so a table that is identical in both reads reports a bogus column-count defect (p40: 7 cells vs 19 cells for the same five printed columns).
- On p244's last worked line the fraction's minus is drawn to the RIGHT of the bar and the single '=' sits immediately left of the numerator: the line is ∴ –185/2 = –92.5 كيلو جول / مول with ONE equals sign. A read that also puts an '=' directly after ∴ has counted the same glyph twice.
<!-- observed:end -->
