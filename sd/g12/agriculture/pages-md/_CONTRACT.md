# Transcription contract — sd/g12/agriculture

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: الإنتاج الزراعي والحيواني — Agricultural and Animal Production (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 3 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

الإنتاج الزراعي · الإنتاج الحيواني · القطاع الزراعي والحيواني وآفاق المستقبل

Numbered section headings inside a chapter get `### `. The 27 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

**Tables** become real Markdown tables, with the columns in printed order (rightmost printed column = leftmost Markdown column, so the rendered RTL table matches the book). Never flatten a table into prose. Numbers inside tables are the highest-value content — read them carefully. **A table is a ruled or shaded grid only.** A cross, a flow chart, a genetics diagram, a labelled drawing or any arrangement of labels joined by arrows is a FIGURE, not a table: transcribe its labels as a list (below), never as a Markdown table. Every table row must have the same number of cells.

**`[غير مقروء]` means ink you cannot read — NOT "nothing is printed".** The two are different findings. If the page prints nothing where a symbol is expected — a limit under an operator, an exponent, an integral sign — transcribe nothing and REPORT a print omission. A false illegible marker is worse than none: it sends adjudication hunting for glyphs that do not exist, and it hides a real defect in the book behind a transcription caveat.

**Do not restore what the page omits.** These books routinely drop an integral sign, an exponent, a minus, a closing bracket or the constant factor their own substitution introduced. The arithmetic "obviously" demanding the missing symbol is exactly the trap: transcribe what is drawn and report it. Equally, never reconcile a worked solution against the expression it restates, a figure caption against the body reference that points at it, or one cell of a table against its neighbours.

**A negative sign sits on OPPOSITE sides inside and outside a math run.** Arabic prose draws it digit-then-dash (`٢–`) and that is what to write in text. Inside `$...$` the run renders left-to-right, so the same value is written dash-first (`– ٢`); writing `٢–` there puts the sign on the wrong side of the number. The two forms are the SAME value — a blind re-read choosing the other one is not a disagreement worth adjudicating.

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
- Bold numbered lines of the form «١ / …» / «٢ / …» that enumerate the methods announced by the sentence above them are list items, not headings: keep them as bold lines (**…**), exactly as the adjacent «الخطوات :» label is kept. Only the book's own parenthesised numbering — ( ١-٤-٤ ) and the like, printed in red — marks a `###` section heading.
- In this book a numbered subsection line such as «١- التجفيف :» is printed bold on a line of its own, above its paragraph — transcribe it as a '### ' heading, not as a bold run-in label. Run-in labels in this book keep body text on the same line.
- Landscape tables in this book are printed rotated 90 degrees on a portrait page: restore them by rotating counter-clockwise, which is the direction that puts the start of the Arabic caption (جدول رقم) at the right and the caption above its table. After that rotation the physically bottom header band becomes the RIGHTMOST column, so it is Markdown column 1, and the years run across the header row.
- Never mark a whole rotated table [غير مقروء]: the digits are readable in the native-density tile crops and in tables-audit/<N>.right.webp even when the full-page render blurs them. A blanket illegible over a grid is a transcription failure, not a finding.
- Decimals with Arabic-Indic digits use the Arabic decimal separator ٫ (U+066B), not a Latin comma — e.g. ٣٫٥ ، ٥٫٥ in the fat-percentage rows.
- The dash inside table/figure references ( ٢–٣ ) and before question numbers (١– ، ٢–) is an en dash – , not a hyphen; spacing around it follows the print and varies line to line.
- The book prints الآنتاج (with madda) inside table headers where the body text prints الانتاج — transcribe each as printed, do not unify them.
- Decimal marks between Arabic-Indic digits are printed as the Arabic decimal separator: write ٫ (U+066B), never an ASCII comma ',' and never the Arabic comma '،' (e.g. ٧٤٫٥، ١٫٦٥).
- In table ( ٢-٥ ) on page 114 the fat row prints ٠٣ with no decimal mark where the column would suggest ٣٫٠ — transcribe ٠٣ as printed.
<!-- observed:end -->
