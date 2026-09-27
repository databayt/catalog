# Transcription contract — sd/g12/math

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: الرياضيات الأساسية — Basic Mathematics (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 6 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

الدوال الحقيقية والنهايات · التفاضل · التكامل · الإحصاء · الاحتمالات · المصفوفات

Numbered section headings inside a chapter get `### `. The 39 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- **Matrices are printed RIGHT-TO-LEFT in this book — the reversal is CORRECT, never undo it.** Settled against the scan on p153: the printed matrices ب and ج differ only at row 2, visually `٠ ٣` and `١ ٣`. Read left-to-right both give b22 = c22 = ٣, which contradicts the page's own line `ب ≠ ج لأن ب٢٢ ≠ ج٢٢`. Read right-to-left they give ٠ and ١, which matches. So the rightmost printed column is column 1 for matrices exactly as it is for tables, and the LaTeX `pmatrix` must carry the reversed order. An identity, symmetric or transpose matrix CANNOT test this — it is invariant under the reversal; use a page where the text asserts an inequality between specific entries.
- **p137 item (٢): the print carries a DOUBLED plus — `٠,٥ + + ٠,٥ ٠,٣`.** A transcriber regularized it to `٠,٥ + ٠,٥ + ٠,٣` and reported the change. Transcribe the doubled operator exactly as printed; it is the book's typo, not ours to fix.
- **p154 مثال (٣): row-2 entries ٤ and ٥ differ between two matrices the text states are equal.** Printed as such — transcribe, do not reconcile.
- **p143 item (٢) prints `٣/١٠ = ٥/٥`; p137 item (٢) prints `= ٠,٩` for `٠,٥ + ٠,٥ + ٠,٣`; p138 (ج) prints `–` before both fractions.** All are arithmetic errors in the print. Leave them.
- `##` is reserved for the book's six chapter titles. A front-matter display title that is not one of them — المقدمة on p7 — stays a bold line (`**المقدمة**`), not a heading; same for a unit line such as `**الوحدة الأولي**` printed above a chapter title.
- p20 prints a LATIN digit 1 in the piecewise branch `س ≤ 1` while every other digit on the page is Arabic-Indic (the line above prints `س > ١`). Keep the Latin 1 exactly as printed — do not normalise it to ١.
- p20 piecewise: the printed inequality glyphs, read as standard math, give س < ١ → س + ١ and س ≥ ١ → ٢س + ٥, which agrees with the page's own statement that the right-hand limit is ٧ via ٢س + ٥. The RTL rendering direction of `>` and `≤` in this book is unsettled — do not 'fix' the ٧, the branches, or the inequality signs.
- In this book the limit operator نها is NOT always given its `س ← أ` subscript: on p20 two occurrences print bare نها while three print the subscript. Transcribe each occurrence as drawn; do not supply a missing subscript from context.
- In this book paragraph openers are indented from the right margin and continuation lines are flush to it — decide paragraph breaks from the margin, not from the line gap. A gap of ~1.3 line-heights is ordinary leading around a display-height element, not a break.
- p26 مثال (٢) prints الحل : AFTER the sentence بالقسمة على أعلى قوة للمتغير س وهي س٣ نحصل على :, on the equation row rather than heading the sentence — transcribe that printed top-to-bottom order; do not move الحل : up to make the sentence read as a solution lead-in.
- Run-in labels such as مثال (ن) : and الحل : are set in a heavier face in this book; the contract asks for no emphasis markup, so transcribe them as plain text — do not add ** and do not promote them to headings.
- The book sets مثال (ن) : and الحل : in a heavier weight than the body. They are run-in labels, not headings: transcribe them plain, with no ** and no ###, the way pages 26–28 already do.
- Justified lines in this book stretch words with kashida (وفــي هــذه، النــاتج). Tatweel U+0640 is justification typography — drop it and write the plain spelling.
- A cancelled factor (a diagonal stroke drawn through a bracketed factor when a fraction is reduced, e.g. p27 مثال (٤)) is printed notation: write it \cancel{...} in LaTeX rather than dropping the stroke.
- Negative limit points are written in the byte order ١– (digit, then minus) — as نها$_{س ← ١–}$ on pp27–28. Do not reorder it to –١.
- The radical sign in this scan is a slash plus an overbar drawn immediately to the RIGHT of the radicand (the start of the span, RTL). When a radicand ends in ١ the digit collides with that stroke: on p39 the radicand of `د(٣,٢١) – د(٣)` cannot be separated into ٣,٢ + radical versus ٣,٢١ + radical. Mark such a span [غير مقروء]; never recover the digit from the arithmetic on a neighbouring line.
- The exercise-set title تمرين ( ن – م ) is printed bold, CENTRED and larger than the body text (verified on pages/40.webp and pages/44.webp) — mark it `### تمرين ( ن – م )`, at least as high as a numbered section heading. A bold label printed at body size and right-aligned (الحل :، مثال (١) :، متوسط معدل التغير :) stays `**...**`. Note that pages-md/40.md currently carries `**تمرين ( ٢ – ١ )**` and should be brought into line.
- Limits are printed with the arrowhead pointing LEFT, toward the ٠, because the formula is set right-to-left. Transcribe them as `نها_{Δ س → ٠}` with `→`: LaTeX math renders left-to-right regardless of page direction, so `→` reproduces the printed meaning and `←` would invert it. Every other page in this book does the same (pp. 41, 47, 48).
- Multi-line derivations that the book stacks as centred display equations are transcribed as `$$ ... $$` blocks, one per printed line, with the leading `=` inside the block — not as inline `$...$` fragments with the `=` left as plain text.
- This book prints fractions stacked (numerator over a horizontal rule), including the derivative operator د over د س — transcribe them as $\frac{...}{...}$, not as an inline solidus such as ٣/٢ or د / د س.
- Where the print draws tall parentheses around a stacked fraction, keep them as $\left( ... \right)$.
- Stacked fractions in this book's tables are printed as real two-level fractions with a horizontal rule — transcribe them as $\frac{...}{...}$, never as an inline solidus, and never add parentheses the print does not carry (settled on p70, جدول ( ٣ – ١ )).
- p70 جدول ( ٣ – ١ ): the جا س row prints جتا س + ث with no minus sign, although the جا أ س row in the same table prints – ١/أ جتا أ س + ث. Transcribe the missing minus as printed.
- the unit-four opener (p73) prints الاحصاء with a bare alif, not الإحصاء — keep the printed form; a transcriber must not normalise it to the chapter-title list spelling.
- because of that, the `## الاحصاء` heading on the unit-four opener will not string-match the contract's chapter title الإحصاء; the mismatch is expected, not a transcription defect.
- unit-opener pages in this book are a title inside a decorative purple arch with no caption and no teaching labels — transcribe the two title lines only and drop the arch; both independent reads did so on p73.
- This book frequently omits the hamza on alif — الاحصاء، الاسلام، الادارية، باجراء، فان، الانجليزية all appear bare in the print. Transcribe the hamza-less form exactly as printed; never add إ / أ / ئ where the scan shows a plain ا or ى.
- Wide horizontal gaps around a displayed fraction or an overlined symbol (e.g. the space before $\overline{س}$ under the table on p81) are typographic spacing, not content — never insert `&nbsp;` or other padding to reproduce them; a single ordinary space is the transcription.
- In summation notation the printed spaces around the `=` in the lower limit are kept — write `\sum_{ر\ =\ ١}^{ن}`, not `\sum_{ر=١}^{ن}`.
- The multiplication cross stays the literal printed `×`; never convert it to `\times`, inside math or out.
- When a comma-separated list wraps, the separator comma can render on the wrapped line — count the comma glyphs against the number of values before adding a trailing comma (p84 item (١): 10 values, 9 commas).
- Equations are read like prose in this book: right to left. The LaTeX source must carry the PRINTED order, not the left-to-right mathematical convention — the same rule already fixed for matrices. p86 prints the fraction rightmost and س̄ leftmost, so it is transcribed `\frac{\sum ...}{\sum ...} \;=\; \overline{س}`, never `\overline{س} = \frac{...}`; p87 prints س̄ rightmost and so is transcribed س̄-first. KaTeX renders the result mirrored relative to the page — that is expected, do not reorder to fix it.
- Display equations set off on their own line use `$$...$$` and `\frac`; inline formulas inside a sentence use `$...$`. Do not switch a display equation to inline `$...$` or `\dfrac`.
- Whitespace inside `$...$` is discarded by the math renderer, so `م_١ك_١` and `م_١ ك_١` are the same output. Follow the printed spacing (tight where the book sets it tight, spaced where it sets it spaced) and do not treat such a difference as a defect.
- Negative numbers in this book's tables are printed with the same long dash as the text's م – و — transcribe them with – (U+2013) before the digits, never an ASCII hyphen -.
- p88's frequency table heads its last column ح × م although the surrounding text and the arithmetic both make it ح × ك — keep ح × م as printed.
- This book's dash is an en dash (–, U+2013), not an ASCII hyphen: the same long mid-height glyph sets the exercise-number heading (تمرين ( ٤ – ٤ )), the negative numbers (–١, –٢) and the open class bounds in frequency tables (٢٦–). Settled on p105 by comparing the table dash with the heading dash at native density. Use – everywhere the print shows that glyph, never -.
- Open class bounds in frequency tables are printed tight against the digits (٢٦–, ٢٥–) with the dash following the number in logical order, so it renders to the left in RTL. Do not insert a space before the dash.
- A table header that the print wraps over two lines because the cell is narrow (العمر / بالاسبوع, عدد / المصابيح) is one cell of running words: write العمر بالاسبوع, never a <br>.
- p106 prints its enumerated item labels with inconsistent spacing — `( أ )` and `( د )` carry a space inside each parenthesis while `(ب)` and `(ج)` do not, and the section heading is `( ٤ – ٦ )` with spaces. Reproduce the spacing of each label as printed; do not regularize them to one style.
- Open class intervals in the frequency tables print the dash to the LEFT of the numeral (`٢٥` with a dash on its left), which in logical RTL order is numeral-then-dash — write `٢٥-`, never `-٢٥`.
- Unit-opener pages print two centred bold lines — أهداف الوحدة <N> then the chapter title — as one display block; both lines take `## `, never `### ` for the first.
- p163 item (د): the second matrix prints visually anti-diagonal (١ at the right end of the top row, ١ at the left end of the bottom row). Under this book's RTL matrix rule that IS the identity — transcribe `١ & ٠ & ٠ \\ ٠ & ١ & ٠ \\ ٠ & ٠ & ١`. Copying the visual left-to-right order yields the anti-diagonal and is wrong.
- A negative term prints with its minus sign at the RIGHT of the term, because the minus is logically first in an RTL line: the printed glyph run `ب ٢ –` is `- ٢ ب`, while `ب - ٢` would print as `٢ – ب`. Read the minus by its position, not by left-to-right habit. Likewise `٢ب` prints as `ب ٢`.
- ## is reserved for the book's six chapter titles. A front-matter display title that is not one of them — المقدمة on p7 — stays a bold line (**المقدمة**), not a heading; same for a unit line such as **الوحدة الأولي** printed above a chapter title.
- p20 prints a LATIN digit 1 in the piecewise branch س ≤ 1 while every other digit on the page is Arabic-Indic (the line above prints س > ١). Keep the Latin 1 exactly as printed — do not normalise it to ١.
- p20 piecewise: the printed inequality glyphs, read as standard math, give س < ١ → س + ١ and س ≥ ١ → ٢س + ٥, which agrees with the page's own statement that the right-hand limit is ٧ via ٢س + ٥. The RTL rendering direction of > and ≤ in this book is unsettled — do not 'fix' the ٧, the branches, or the inequality signs.
- In this book the limit operator نها is NOT always given its س ← أ subscript: on p20 two occurrences print bare نها while three print the subscript. Transcribe each occurrence as drawn; do not supply a missing subscript from context.
- In this scan the radical sign is a slash plus an overbar drawn immediately to the RIGHT of the radicand (the start of the span, RTL). When a radicand ends in ١ the digit collides with that stroke: on p39 the radicand of د(٣,٢١) – د(٣) cannot be separated into ٣,٢ + radical versus ٣,٢١ + radical. Mark such a span [غير مقروء]; never recover the digit from the arithmetic on a neighbouring line.
- The exercise-set title تمرين ( ن – م ) is printed bold, CENTRED and larger than the body text (verified on pages/40.webp and pages/44.webp) — mark it ### تمرين ( ن – م ), at least as high as a numbered section heading. A bold label printed at body size and right-aligned (الحل :، مثال (١) :، متوسط معدل التغير :) stays **...**. Note that pages-md/40.md currently carries **تمرين ( ٢ – ١ )** and should be brought into line.
- Limits are printed with the arrowhead pointing LEFT, toward the ٠, because the formula is set right-to-left. Transcribe them as نها_{Δ س → ٠} with →: LaTeX math renders left-to-right regardless of page direction, so → reproduces the printed meaning and ← would invert it. Every other page in this book does the same (pp. 41, 47, 48).
- Multi-line derivations that the book stacks as centred display equations are transcribed as $$ ... $$ blocks, one per printed line, with the leading = inside the block — not as inline $...$ fragments with the = left as plain text.
- This book prints fractions stacked (numerator over a horizontal rule), including the derivative operator د over د س — transcribe them as \frac{...}{...}, not as an inline solidus such as ٣/٢ or د / د س.
- Where the print draws tall parentheses around a stacked fraction, keep them as \left( ... \right).
- Stacked fractions in this book's tables are printed as real two-level fractions with a horizontal rule — transcribe them as \frac{...}{...}, never as an inline solidus, and never add parentheses the print does not carry (settled on p70, جدول ( ٣ – ١ )).
- because of that, the ## الاحصاء heading on the unit-four opener will not string-match the contract's chapter title الإحصاء; the mismatch is expected, not a transcription defect.
- Wide horizontal gaps around a displayed fraction or an overlined symbol (e.g. the space before $\overline{س}$ under the table on p81) are typographic spacing, not content — never insert &nbsp; or other padding to reproduce them; a single ordinary space is the transcription.
- In summation notation the printed spaces around the = in the lower limit are kept — write \sum_{ر\ =\ ١}^{ن}, not \sum_{ر=١}^{ن}.
- The multiplication cross stays the literal printed ×; never convert it to \times, inside math or out.
- Equations are read like prose in this book: right to left. The LaTeX source must carry the PRINTED order, not the left-to-right mathematical convention — the same rule already fixed for matrices. p86 prints the fraction rightmost and س̄ leftmost, so it is transcribed \frac{\sum ...}{\sum ...} \;=\; \overline{س}, never \overline{س} = \frac{...}; p87 prints س̄ rightmost and so is transcribed س̄-first. KaTeX renders the result mirrored relative to the page — that is expected, do not reorder to fix it.
- Display equations set off on their own line use $$...$$ and \frac; inline formulas inside a sentence use $...$. Do not switch a display equation to inline $...$ or \dfrac.
- Whitespace inside $...$ is discarded by the math renderer, so م_١ك_١ and م_١ ك_١ are the same output. Follow the printed spacing (tight where the book sets it tight, spaced where it sets it spaced) and do not treat such a difference as a defect.
- p106 prints its enumerated item labels with inconsistent spacing — ( أ ) and ( د ) carry a space inside each parenthesis while (ب) and (ج) do not, and the section heading is ( ٤ – ٦ ) with spaces. Reproduce the spacing of each label as printed; do not regularize them to one style.
- Open class intervals in the frequency tables print the dash to the LEFT of the numeral (٢٥ with a dash on its left), which in logical RTL order is numeral-then-dash — write ٢٥-, never -٢٥.
- Unit-opener pages print two centred bold lines — أهداف الوحدة <N> then the chapter title — as one display block; both lines take ## , never ### for the first.
- p163 item (د): the second matrix prints visually anti-diagonal (١ at the right end of the top row, ١ at the left end of the bottom row). Under this book's RTL matrix rule that IS the identity — transcribe ١ & ٠ & ٠ \\ ٠ & ١ & ٠ \\ ٠ & ٠ & ١. Copying the visual left-to-right order yields the anti-diagonal and is wrong.
- A negative term prints with its minus sign at the RIGHT of the term, because the minus is logically first in an RTL line: the printed glyph run ب ٢ – is - ٢ ب, while ب - ٢ would print as ٢ – ب. Read the minus by its position, not by left-to-right habit. Likewise ٢ب prints as ب ٢.
- A kashida drawn on a PREFIX letter — the elongated lam in p70's table header تكاملها بالنسبة لـــ س — is not justification (the cell has slack at its left edge), but the same rule applies: drop the stretch. Write تكاملها بالنسبة لـ س with exactly ONE U+0640, the connector that keeps the lam in the initial form the print shows; zero tatweel would render an isolated ل, a different letter form from the print, which is why this case does not take the zero-tatweel treatment of the mid-word examples وفي / هذه / الناتج.
- A stretch stroke is continuous in the print, so its length is not a character count: two reads that differ only in the number of U+0640 are not a real disagreement and must never be adjudicated by counting glyphs.
- p75 repeats the unit-four title as two centred bold display lines in the body text (الوحدة الرابعة then الإحصاء) and prints الإحصاء WITH the hamza, while the p73 arch opener prints الاحصاء bare — transcribe each page as its own print shows it; do not harmonise the two spellings in either direction.
- p75 mixes both spellings within one page: the body prints لعلم الاحصاء bare in the first line and علم الإحصاء with hamza two lines later. Read the hamza per occurrence rather than applying one spelling to the whole page.
- p84 item (٤) prints من tight against the numeral — من١٦٠ with no space — while the rest of that justified line is stretched wide; transcribe it without a space and do not insert the missing one.
- A summation and its operand are one printed symbol group: write $\sum ح × ك$, never $\sum$ ح × ك with the operand left outside the math span — settled on p88 lines 1 and 7.
- The exercise-set title on p105 prints as تمرين (٤ – ٤) with the parentheses TIGHT against the numerals, while p40/p44 print تمرين ( ٢ – ١ ) with spaces inside. Settled against crops/105.tile0.webp by comparing the title's parentheses with the ( أ ) item label three lines below on the same crop: the label shows a clear space inside each paren, the title shows none. Reproduce the spacing of each exercise title exactly as that page prints it; the spacing is not uniform across the book.
<!-- observed:end -->
