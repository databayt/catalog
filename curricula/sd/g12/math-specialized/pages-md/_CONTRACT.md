# Transcription contract — sd/g12/math-specialized

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: الرياضيات المتخصصة — Specialised Mathematics (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 12 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

الاستنتاج الرياضي، التباديل والتوافيق ونظرية ذات الحدين · المصفوفات · الكسور الجزئية · الاحتمالات · الإحصاء · الدوال الحقيقية والنهايات · التفاضل · تطبيقات على التفاضل · التكامل · التكامل المحدد وتطبيقاته · الدائرة · مجموعة الأعداد المركبة

Numbered section headings inside a chapter get `### `. The 72 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- (none recorded yet — the adjudicate phase appends named cases here)
<!-- observed:end -->
