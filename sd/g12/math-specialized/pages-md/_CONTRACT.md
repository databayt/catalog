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
- **Arabic in math runs — the precise rule for THIS book (settled 2026-09-29).** The general ban
- **This book routinely prints an integral WITHOUT its ∫ sign, and drops constant factors in worked
- **Definite-integral limits here are usually Arabic LETTERS (أ ، ب), not digits**, set very small.
- **`[غير مقروء]` means "ink is there and I cannot read it" — NOT "nothing is printed".** The two are
- **A negative sign sits on OPPOSITE sides inside and outside a math run.** Arabic body text draws a
- The contents pages print a small □ bullet at the head of every entry. It is a decorative list marker, not content: drop it (pp. 4, 5 and 6 are all transcribed without it).
- Only the FIRST contents page (p. 4) prints the الموضـــوع / الصفحة header row. The continuation contents pages (5, 6) have no header: leave the Markdown header cells empty rather than repeating or composing one.
- On the contents pages the unit rows (الوحدة الثالثة : الكسور الجزئية, الوحدة الرابعة : الاحتمالات) are printed bold and are transcribed with **...** inside the table cell; ordinary lesson entries stay plain.
- Contents pages (4–7) print a two-column ruled table whose RIGHTMOST printed column is the topic column — confirmed on tables-audit/6.right.webp — so the topic is Markdown column 1 and the page number column 2.
- The header row الموضـــوع / الصفحة is printed ONLY on the first contents page (p. 4). The continuation contents pages (5, 6, 7) print no header: use an empty Markdown header row, never a composed | الموضوع | الصفحة |.
- Every contents row carries a small decorative square bullet (□) at the right edge of its topic cell. It is repeated ornament, not content — drop it, as pages 4 and 5 already do.
- Unit rows in the contents table (الوحدة الأولى …، الوحدة الخامسة : الإحصاء) are printed in heavy bold: keep them as **...** inside the table cell and do not promote them to a ## heading.
- Unit-opener objective pages (e.g. p9) print a bold centred ordinal line الوحدة الأولى / الوحدة الثانية …: this is an ORDINAL LABEL, not a chapter title — transcribe it as a plain line with no ## and no **, exactly as on the framed chapter-opener pages.
- On those pages the bold body-size lines الأهداف :– and يتوقع بعد دراسة هذه الوحدة … على أن : are labels, not headings: no # and no **.
- A parenthesised binomial with an Arabic-letter exponent is written as one math run, $(س + أ)^ن$ — not as text plus a bare superscript run (س + أ)$^{ن}$.
- A bold line printed at BODY size and flush to the right margin, ending in a colon and standing on its own line (e.g. الحد الأوسط والحدان الأوسطان : on p43), is a run-in label, NOT a heading: plain text, no ### and no **. Only a bold line that is also CENTRED and larger than the body is a heading, and a sub-title absent from the contents list on pp4–8 is never one of the 72 lesson titles.
- Super- and subscript runs built from Arabic symbols are wrapped in a math run — الحد الأول $ح_{١} = {}^{ن}ق_{٠} س^{ن} أ^{٠}$ — with the Arabic phrase kept outside it; the ⁿقᵣ combination notation is written {}^{ن}ق_{ر}. Bare ^ and _ with no $ delimiters (used on pp42, 44 and elsewhere) render as literal carets and underscores and are the known residual form, not the target.
- The math run stops where the notation stops: a printed line that is only a comma-separated enumeration (ر = ٠ ، ١ ، ٢ ، ..... ، ن) carries no super/subscript and stays OUTSIDE $$, because the renderer discards the spacing around its Arabic commas.
- p54 prints the inch mark on the television sizes as a curly right double quote (١٤” ٢٠” ٢٤”), not a straight quote — transcribe the curly glyph as drawn.
- p54 spells النوع الثانى dotless in the body but النوع الثاني with a dotted ya inside the table header, one line apart — keep each occurrence as drawn; do not harmonise the two.
- A bare row of Arabic-Indic numerals printed as a display block (the proto-matrix on p54) is transcribed as plain text lines, not as $$ ... \quad ... $$ — there is no printed math notation to carry, and Arabic-Indic digits stay outside math runs.
- Exercise titles here (تمرين ( ٣ – ٣ )) are printed bold, CENTRED and larger than the body line that follows, so they take ### — not a bold run-in label; the separator between the two numerals is the book long dash –, and the large ornamental ؟ drawn beside the title is decoration and is not transcribed (settled on p99).
- In the partial-fractions exercise lists the same-looking denominators are NOT all of the form ( س٢ + ك )٢: p99 item (٥) prints ( ٤س٢ + ١ )٢ with the coefficient leading. Read each bracket on the crop; do not regularise one item to the shape of its neighbours.
- Statistics chapter (pp. 143, 145, 146, 149): the mean formula is printed as a STACKED fraction whose numerator is a Σ carrying ن above and ر = ١ below — transcribe it as $$\overline{س} = \frac{\sum_{ر=١}^{ن} س ر}{ن}$$, never as an inline solidus and never with the summation limits broken out onto lines of their own.
- The printed overbar on the mean symbol is \overline{س} inside the math run, not a combining mark on a bare Arabic letter; ∴ before a derived line is \therefore inside the same $$ block.
- A two-line cell inside a ruled table (a header such as ساعات العمل set above its symbol س) is ONE cell: write the words separated by a space, with no <br> and no extra row. The line wrap is justification, like kashida, not content.
- Summation limits in this book are Arabic symbols set above and below the ∑ (ن above, ر = ١ below). Transcribe them inside the math run as $\sum_{ر=١}^{ن}$ — never as orphan text lines carrying ن and ر = ١ above and below the sentence.
- A ruled table cell that prints a label over its symbol (عدد الطلاب over س، عدد الفصول over ك) keeps that line break as <br> inside the single cell; do not join them with a space and do not split them into two columns.
- The statistics chapter pads some products in a ك × س column to a fixed width with a LEADING ZERO (p146 prints ٠٨٤٠ and ٠٦٢٠ beside unpadded ١٩٢، ٤٤٨، ٢٠٤). Keep the leading zeros; never normalise them away.
- A summation printed with ن above the ∑ and ر = ١ below it is transcribed as $\sum_{ر=١}^{ن}$ inside the math run — never as free-standing ن and ر = ١ text lines above and below the paragraph, which breaks the sentence into fragments.
- The frequency-table mean formula (pp. 143, 145, 146, 149) prints a Σ with ن stacked above and ر = ١ stacked below, over a ruled fraction: transcribe it $\sum_{ر=١}^{ن}$ inline and $$\overline{س} = \frac{\sum_{ر=١}^{ن} م ر ك ر}{\sum_{ر=١}^{ن} ك ر}$$ in display — never as a plain solidus, and never as bare ن / ر = ١ lines placed above and below the paragraph.
- The lower-bound symbol in this book median/mode formulas is printed as هـ (ha with its connecting bar), not a bare ه — transcribe it هـ₁, with the subscript outside any math run.
- Class-interval cells in frequency tables are printed as ٢٠ – , ٢٥ – (open upper end) with the book long dash – ; never substitute an ASCII hyphen and never drop the dash.
- A header cell whose text wraps onto two lines is wrapping because the column is narrow — transcribe it as one line, with no <br>.
- This book writes cotangent as ظتا (ظ + ت + ا — exactly two tall strokes). At 1000 px render density the ظ and ت fuse and it reads as ظلتا; settle it on a native-density crop and keep ظتا.
- An Arabic-letter formula digit that is raised and set to the LEFT of its letter is an EXPONENT, not a coefficient: in these RTL runs a multiplying digit prints to the RIGHT of the letter. Check direction against the nearest ordinary RTL run (a radicand such as ل + ٥) before calling a digit a coefficient.
- p195 prints the (هـ) exercise without its function letter — س = ( س ) = ... where the neighbouring item prints ص = د ( ل ) = ... . Never supply the missing د.
- The limit operator is written نها[س ← ٠] — the limit in square brackets on the plain line, never \underset{س ← ٠}{نها} and never inside a $$ block. The print stacks the limit under نها, but Arabic operator words stay outside math runs in this book; only the stacked fraction goes in an inline $\frac{}{}$. Settled on p217 against pp. 216 and 218.
- A printed display line that mixes Arabic operators (نها ، جا ، جتا ، ظا) with a stacked fraction is transcribed as a plain line carrying inline $\frac{}{}$ fragments, not as a $$...$$ block — including a line that begins with = such as = ١ × ١ = ١. The ≤ , × and ← glyphs on such a line stay Unicode, not \leq / \times / \to.
- Exponents on Arabic symbols are printed as small raised Arabic-Indic digits (نق٢ س٣ بوصه٣). Transcribe them with the Unicode superscript characters — س² ، س³ ، نق² ، بوصه³ — never as a math run $س^٢$: Arabic letters never enter $...$ in this book, and Unicode has no Arabic-Indic superscript digit. Pages 271–273 already use the Unicode form.
- The book prints the prefix particle with a long kashida tail (يعطى بـــ : on p272, تعطى بـــ : on p273). It sits mid-line and is not justification stretching — keep the extended form, do not shorten it to بـ or ب.
- Dot-leader runs before an equation number vary in length and sometimes abut the number with no space (........(٢)) and sometimes leave one (............. (٥)). Reproduce each roughly as drawn; leader length is not countable from the render and a differing dot count is never a defect.
- A raised prime on an Arabic function letter (ر′ ، د′) is transcribed as ر^\prime inside the math run — not as the literal ′ character, and not dropped; when it falls in running text, wrap just the mark, ر$^\prime$.
- ∴ opening a display line belongs INSIDE that line $$ block as \therefore, written first because it is the rightmost printed symbol — do not leave it outside the block as a bare ∴ glyph.
- p372: superscript exponents inside a STACKED fraction denominator are set very small and vanish at 1000 px render density — the ٣٦/س٢ denominator on p372 was read as a bare س from the page render and only the native-density tile crop shows the ٢. When a page arithmetic depends on an exponent inside a \frac, read that exponent from a crop before transcribing it.
- Super- and subscript runs built from Arabic symbols are wrapped in a math run — `الحد الأول $ح_{١} = {}^{ن}ق_{٠} س^{ن} أ^{٠}$` — with the Arabic phrase kept outside it; the ⁿقᵣ combination notation is written `{}^{ن}ق_{ر}`. Bare `^` and `_` with no `$` delimiters (used on pp42, 44 and elsewhere) render as literal carets and underscores and are the known residual form, not the target.
- The math run stops where the notation stops: a printed line that is only a comma-separated enumeration (`ر = ٠ ، ١ ، ٢ ، ..... ، ن`) carries no super/subscript and stays OUTSIDE `$$`, because the renderer discards the spacing around its Arabic commas.
- p54 prints the inch mark on the television sizes as a curly right double quote (١٤” ٢٠” ٢٤”), not a straight ' — transcribe the curly glyph as drawn.
- Exercise titles here (`تمرين ( ٣ – ٣ )`) are printed bold, CENTRED and larger than the body line that follows, so they take `### ` — not a bold run-in label; the separator between the two numerals is the book's long dash `–`, and the large ornamental `؟` drawn beside the title is decoration and is not transcribed (settled on p99).
- In the partial-fractions exercise lists the same-looking denominators are NOT all of the form `( س٢ + ك )٢`: p99 item (٥) prints `( ٤س٢ + ١ )٢` with the coefficient leading. Read each bracket on the crop; do not regularise one item to the shape of its neighbours.
- A two-line cell inside a ruled table (a header such as 'ساعات العمل' set above its symbol 'س') is ONE cell: write the words separated by a space, with no <br> and no extra row. The line wrap is justification, like kashida, not content.
- A summation printed with ن above the ∑ and ر = ١ below it is transcribed as $\sum_{ر=١}^{ن}$ inside the math run — never as free-standing 'ن' and 'ر = ١' text lines above and below the paragraph, which breaks the sentence into fragments.
- The frequency-table mean formula (pp. 143, 145, 146, 149) prints a Σ with ن stacked above and ر = ١ stacked below, over a ruled fraction: transcribe it $\sum_{ر=١}^{ن}$ inline and $$\overline{س} = \frac{\sum_{ر=١}^{ن} م ر ك ر}{\sum_{ر=١}^{ن} ك ر}$$ in display — never as a plain solidus, and never as bare 'ن' / 'ر = ١' lines placed above and below the paragraph.
- The lower-bound symbol in this book's median/mode formulas is printed as هـ (ha with its connecting bar), not a bare ه — transcribe it هـ₁, with the subscript outside any math run.
- Class-interval cells in frequency tables are printed as ٢٠ – , ٢٥ – (open upper end) with the book's long dash – ; never substitute an ASCII hyphen and never drop the dash.
- An Arabic-letter formula's digit that is raised and set to the LEFT of its letter is an EXPONENT, not a coefficient: in these RTL runs a multiplying digit prints to the RIGHT of the letter. Check direction against the nearest ordinary RTL run (a radicand such as ل + ٥) before calling a digit a coefficient.
- p195 prints the (هـ) exercise without its function letter — 'س = ( س ) = ...' where the neighbouring item prints 'ص = د ( ل ) = ...'. Never supply the missing د.
- A printed display line that mixes Arabic operators (نها ، جا ، جتا ، ظا) with a stacked fraction is transcribed as a plain line carrying inline $\frac{}{}$ fragments, not as a $$...$$ block — including a line that begins with '=' such as '= ١ × ١ = ١'. The ≤ , × and ← glyphs on such a line stay Unicode, not \leq / \times / \to.
- Exponents on Arabic symbols are printed as small raised Arabic-Indic digits (نق٢ س٣ بوصه٣). Transcribe them with the Unicode superscript characters — س² ، س³ ، نق² ، بوصه³ — never as a math run `$س^٢$`: Arabic letters never enter `$...$` in this book, and Unicode has no Arabic-Indic superscript digit. Pages 271–273 already use the Unicode form.
- The book prints the prefix particle with a long kashida tail (`يعطى بـــ :` on p272, `تعطى بـــ :` on p273). It sits mid-line and is not justification stretching — keep the extended form, do not shorten it to بـ or ب.
- Dot-leader runs before an equation number vary in length and sometimes abut the number with no space (`........(٢)`) and sometimes leave one (`............. (٥)`). Reproduce each roughly as drawn; leader length is not countable from the render and a differing dot count is never a defect.
- A raised prime on an Arabic function letter (ر′ ، د′) is transcribed as `ر^\prime` inside the math run — not as the literal ′ character, and not dropped; when it falls in running text, wrap just the mark, `ر$^\prime$`.
- `∴` opening a display line belongs INSIDE that line's `$$` block as `\therefore`, written first because it is the rightmost printed symbol — do not leave it outside the block as a bare ∴ glyph.
- p372: superscript exponents inside a STACKED fraction's denominator are set very small and vanish at 1000 px render density — the `٣٦/س٢` denominator on p372 was read as a bare `س` from the page render and only the native-density tile crop shows the ٢. When a page's arithmetic depends on an exponent inside a \frac, read that exponent from a crop before transcribing it.
- p54 prints its الجدول التالي as an UNRULED aligned block (tables-audit/54.right.json reports no rules and no shading), and it is nevertheless transcribed as a Markdown table: the body names it الجدول, it is a true row/column arrangement of numbers, and both independent reads agreed. Its shape is an EMPTY corner cell first, then النوع الأول ١٤” ، النوع الثاني ٢٠” ، النوع الثالث ٢٤” as header columns 2–4, with الفرع أ / الفرع ب as the row labels in column 1.
- The bare two-row block of numerals lower on p54 is a different object — the proto-matrix — and stays plain text lines; do not promote it to a table or to a $$ math run.
- The page images are offset from the printed folio by seven: pages/143.webp carries the footer ١٣٦. The folio is page furniture and stays untranscribed — do not renumber a page to match its printed folio, and do not treat the mismatch as a defect.
- Example (١) on p143 prints its ten marks twice — once as the comma list ٣٥ ، ٢٤ ، ١٧ ، ٢٩ ، ٣٧ ، ٤٠ ، ٣٨ ، ٣٠ ، ٣٠ ، ٤٠ . and again as the numerator of the mean fraction, in the same right-to-left order. Reproduce both in the printed order; the numerator is not to be re-sorted or collapsed.
- The two-line header cells on the statistics worked-example tables (ساعات العمل over س، التكرار over ك، ساعات العمل × التكرار over ك × س, p144) are transcribed as ONE cell with the words joined by a SPACE, no <br> — this is the form the contract already fixes for the ساعات العمل / س header; the <br> form recorded for عدد الطلاب / عدد الفصول does not extend to these cells.
- p144 prints مجموع الساعات =∑ ك × س with the equals sign abutting the ∑, one line after عدد العمال = ∑ ك which is spaced — keep each spacing exactly as drawn, do not harmonise them.
- p144 spells the opener فإنه with the hamza (لحساب الوسط فإنه يجب أولاً) — visible only on the native-density crop crops/144.tile0.webp, where the page render suggests فانه; read hamza-bearing alifs in this chapter from a crop before dropping the hamza.
- p145 prints the frequency-mean numerator as ∑ ك ر × س ر with an EXPLICIT × sign — not م ر ك ر as the generic pp.143/145/146/149 contract line gives — so transcribe it $$\overline{س} = \frac{\sum_{ر=١}^{ن} ك ر \times س ر}{\sum_{ر=١}^{ن} ك ر}$$ and do not harmonise it with the neighbouring pages.
- On the same page the explanatory line one paragraph below prints the same summation WITHOUT the × (∑ ك ر س ر): keep the × in the display fraction and omit it in the running line, exactly as drawn.
- p146 prints the worked mean line with a BARE summation sign — ∑ ك س over ∑ ك, with no ن above and no ر = ١ below — one line after the same chapter's limit-bearing Σ: transcribe it $\overline{س} = \frac{\sum ك س}{\sum ك}$ and never add the limits to make it match its neighbours.
- p149 item (١) prints عمودة الأول (with a ta marbuta) where the sentence calls for العمود الأول, one line before it spells العمود الثانى and العمود الثالث correctly — keep عمودة exactly as drawn.
- The p149 frequency table prints its class intervals CLOSED (٠ – ١٠ ، ١٠ – ٢٠ ، … ٤٠ – ٥٠), unlike the open-ended ٢٠ – ، ٢٥ – cells noted elsewhere in the statistics chapter: transcribe the lower bound first (logical RTL order), so the render places it at the right as printed.
- The p149 frequency table's rightmost printed column is الفئات (confirmed on tables-audit/149.right.webp), so الفئات is Markdown column 1 and التكرارات column 2.
- In the median formula (الوسيط) the numerator prints ن/٢ – ك₁ : at 1000 px render density that subscript ١ fuses with the ك and reads as ك د. Settle it on a native-density crop against the denominator's ك₂ – ك₁ and keep ك₁ (p158).
- A frequency-table header cell that merely WRAPS a phrase onto two lines because the column is narrow (الحدود العليا للفئات ، التكرار المتجمع الصاعد on p158) is one cell on ONE line, words joined by a space — no <br>. The <br> form is reserved for a cell that prints a label OVER its symbol (عدد الطلاب over س).
<!-- observed:end -->
