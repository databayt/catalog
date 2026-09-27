# Transcription contract — sd/g12/physics

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: الفيزياء — Physics (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 4 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

المجال التثاقلي والحركة الدائرية وحركة الكواكب والأقمار الاصطناعية · الموجات والضوء · المجالات المغنطيسية والكهربية · الذرة والاتصالات

Numbered section headings inside a chapter get `### `. The 16 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- **Two-part reference numbers are CHAPTER-FIRST. Settled physically, 2026-09-21, from a native-density crop of p82 (`crops/82.tile2.webp`, zoom 4.98).** The caption there is drawn with `8` on the LEFT and `2` on the RIGHT: `الشكل (8-2)`. The page is in chapter 2 (sound), so `2` is the chapter and `8` the figure. Arabic reads right to left, so the reader meets the chapter first and the label means **figure 8 of chapter 2 — transcribe `الشكل (2-8)`**. The same holds for three-part section numbers (`(2-5-3)`, not `(3-5-2)`) and for equation and example refs. Do NOT settle this from the glyph order on a 1000 px page render: p82 is 1700 px native painted at 1270 (`zoomHelps: true`), and at render resolution the order is a coin flip — several transcribers read it both ways in the same book.
- **Resolve reference order by HIERARCHY, not by glyph order.** The printed appearance varies across
- A bold, underlined line of the form `N/ <title> :` (e.g. `1/ الزمن الدوري :`, `3/ السرعة الزاوية :`) is a list item under the parenthesised section heading, not a heading — write it plain; only `(1-2-3)`-style section numbers take `###`.
- Arabic-letter equations that carry their reference number on the same line (`س = ع × ن (1-22)`) are settled as a plain line with the printed `×` and the reference after spaces (pages 29–31); only the fragments that need LaTeX (`$2\pi$`, `$10^6$`, `$ع_أ$`) go inside `$…$`. Never put a reference number or an Arabic gloss such as `(بالراديان)` inside a `$$` block.
- This book writes the per-unit separator as a BACKSLASH, not a solidus: `1026م\ث`, `1 كم\ث`, `86646 كم\اليوم` (settled on p36 from the 2400 px crop `crops/36.tile1.webp`). The solidus is not bidi-mirrored, so the printed shape is the character — transcribe `\` and never normalise it to `/`.
- A boxed or centred identity is stored in LOGICAL order, so the RIGHTMOST printed phrase comes FIRST in the Markdown line. On p36 the box is transcribed `قوة التثاقل = قوة الجذب المركزية للأجرام السماوية والأقمار الإصطناعية`; the bold run sits against the right rule, and writing the line in the order the eye scans it left-to-right renders the box reversed.
- Arabic symbols in this book's formulas carry subscripts drawn smaller and below the baseline (`ك_ق`, `ك_أ`, i.e. كق and كا) — keep them as `_` subscripts; flattening them to كق / كأ drops printed content.
- A display equation with a side note (p36, `حيث نق هنا هي نصف قطر المسار الدائري للقمر .`) is set EQUATION FIRST — the equation stands to the right of the note — and its fractions carry the printed right-to-left order: `$\frac{ج ك_ق ك_أ}{نق^2} = \frac{ك_ق ع^2}{نق}$`. Both p36 reads put the note first and inverted the fractions, so the page still carries that shared error: a defect both transcribers share cannot be corrected at adjudication.
- The unit separator in م$^3$/ث$^2$ is drawn in this book as a near-vertical, back-leaning stroke that looks like a backslash (or even an alef) at page resolution. It is a division solidus — transcribe `/`, never `\` or `\backslash`.
- The Kepler constant for the Earth is printed as ك with a subscript أ — transcribe `$ك_أ$`, not a plain two-letter word كأ.
- Chapter-opener pages in this book carry only two bold centred lines inside a decorative scroll/curl frame: الباب <ordinal> : on one line and the chapter title on the next. Both lines are headings — mark each with ## — and the scroll frame itself is page decoration, not a figure: emit no image reference, no شكل alt text and no label list for it.
- Chapter titles on these opener pages are set with decorative kashida stretching (المـوجــــات والضـوء). That is display letter-spacing, not spelling: transcribe the plain form (الموجات والضوء), exactly as the contract's tatweel rule already requires for justified body lines.
- The caption of الشكل (2-31) is printed مسارالشعاع with no space between مسار and الشعاع — keep it closed up; do not insert the space.
- In the lens ray diagrams (figures 2-31 and 2-32) the concave lens's centre label is drawn but unreadable even at native density, its strokes merging with the lens outline and the centre line: write [غير مقروء] there and never fill it in by analogy with the convex lens's م.
- Numbered items on p115 are printed as a Latin digit and a closing parenthesis (2), 3)) — keep the parenthesis, do not turn it into a period.
- On p123 the الفصل opener is drawn with its reference parenthetical at the RIGHT of the title words, on the same side as the (2-6-1) section heading below it — so the reading order is reference-first: `(2-6) الفصل السادس`, not `الفصل السادس (2-6)`.
- An `الفصل N` opener line and the lesson title under it were both marked `###` on p123: `##` is reserved for the book's 4 chapter titles, and a numbered `الفصل` was treated as one of the 16 lesson titles.
- Figure label bullets follow the page's reading order — right to left, then top to bottom. A label run that marches left to right is a defect even when every individual label is right.
- A small figure-label `س` in this book's line drawings reads as `ك` at page-render density — two independent reads made that error on p123's optical-system figure. Read small single-letter labels from the native-density crop, and cross-check against the letters the body text uses for the same quantity.
- A unit word printed at the end of a display-equation line (`= 40 أمبير .`) belongs inside that line's `$$` block as `\text{}` — never break it onto its own paragraph.
- Chapter-opener pages print a 'الباب <ordinal> :' label on its own line above the chapter title, both inside a decorative scroll frame. Only the chapter title takes '## '; the 'الباب ... :' label stays a plain line — no '#', no '**'. The scroll frame itself is decoration and is not transcribed.
- This book spaces the energy unit inconsistently within one line — p185 prints إ. ف after 13.6 but إ .ف after 3.4 and 1.5 in the same sentence. Keep each occurrence exactly as drawn; do not make them uniform.
- The run-in label الحل is printed both as الحل : (space after the colon) and الحل :طاقة (no space) on the same page. Reproduce whichever the line shows.
- Energy-level symbols are printed as ط with a small subscript digit (ط₁ ط₂ ط₃ ط₄). Transcribe them with the Unicode subscript, never as `$ط_2$`: an Arabic letter is never placed inside a math run in this book, and the Unicode form is what every neighbouring page already uses.
- Only the chapter title on a chapter-opener page takes `## `; the `الباب <ordinal> :` label is a plain line. The earlier observed entry marking both opener lines `##` is wrong and should be removed.
<!-- observed:end -->
