# Transcription contract — sd/g12/engineering

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: العلوم الهندسية — Engineering Sciences (sd curriculum, g12).
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

أساسيات الرسم الهندسي · أساسيات الهندسة الميكانيكية · أساسيات الهندسة الكهربائية · أساسيات الهندسة المدنية

Numbered section headings inside a chapter get `### `. The 81 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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

## Learned across books

Each rule below was settled against the scan in at least two other books of the same kind. They refine the rules above; where this book's own observed cases (at the end) disagree, this book wins.

### all

- Kashida/tatweel (ـ) that stretches a word for justification or display is typography, not spelling: write the plain form (وفي, not وفــي). A stretched letter left unjoined before a space (بـــ س) keeps exactly one ـ so it keeps its connected shape. A difference in tatweel count is never a disagreement worth adjudicating.
- Hamza is often omitted on alif (الاحصاء، الايثيل، الامشاج) and final ya drawn both dotted and dotless: transcribe each occurrence as drawn. One word may be spelled two ways on a page, or differ between caption, table and body — never unify them either way. Settle a tiny hamza on the native-density crop.
- Transcribe exactly the harakat that are drawn: never supply a grammatically expected ending or tanwin, never strip a printed one, and keep the vowel that sits on a shadda as printed. Single fathas, dammas or shaddas below scan resolution are not adjudicable and are never marked illegible — keep the incumbent reading.
- A bold body-size label at the margin that opens its own text (الحل :، مثال (١) :، أولاً :، العرض :) is a run-in label, never a heading. Only a centred line larger than the body (e.g. an exercise-set title) or one carrying section numbering takes `### `. Write them plain unless the book's observed section says it bolds them.
- The long mid-height dash used in references (٢–٣), row and question numbers (١–), class intervals and exercise titles is an en dash – (U+2013), never an ASCII hyphen. A line that opens with a printed dash stays a text paragraph beginning with –, not a Markdown bullet; a printed • stays •.
- Qur'anic quotations keep the book's own orthography — Uthmani rasm (ٱ، ۥ، ٰ، dotless ى), or a bare alif where the font drops a hamza — and its brackets, end-of-āyah ۝ (never ۞) and waqf marks as printed. Never restore or complete a verse from the mushaf. A waqf mark of unresolvable kind is left out, not chosen.
- A table continued from the previous page that prints no header row gets an EMPTY Markdown header row; never repeat or compose one (الموضوع | الصفحة). If the header is re-printed partway down the page, the rows above it form their own table with an empty header — never hoist the header above them.
- A table cell whose words wrap only because the column is narrow is one cell on one line, words joined by a space — no <br>, no extra row. Use <br> only when the cell prints two distinct stacked entries (a label over its symbol, two listed words), and never invent a separator between them.
- Small print — an exponent inside a fraction, a footnote digit, a sukun, a one-letter figure label, digits in a rotated table — vanishes or misreads at page-render density. Read it on the native-density crop before writing it or marking it [غير مقروء]; a span the crop resolves is never illegible, nor is a whole legible grid.

### math-science

- Numeric glyphs are content: keep each decimal separator as drawn (Arabic ٫, comma or dot; with or without leading zero) even when mixed on one page, keep padding zeros, and keep the printed multiplication glyph (×, or a Latin X — never \times). A percent sign printed left of its number is written after it, spaced: ٩٠ ٪.
- In a Latin-digit reference (section 2-5-3, figure, example, equation) the bidi engine can draw the parts in either visual order. Settle the order by hierarchy — which component is the chapter, checked against the chapter or lesson the page belongs to — on the native-density crop, never from glyph order on the page render.
- Equations, products and matrices are set right to left: store the rightmost printed term first in the LaTeX source, and the rightmost printed matrix column is column 1. The rendered math looks mirrored against the page; that is expected — never reorder to the left-to-right convention. An identity or symmetric matrix cannot test this.
- A stacked fraction (numerator over a rule) is \frac{}{}, never an inline solidus, and gains no parentheses the print lacks. Limits printed above and below Σ belong inside the math run as \sum_{…}^{…}, never as orphan text lines above and below the sentence; a Σ printed without limits stays bare.
- A unit or chapter opener's decorative frame (arch, scroll, curl) is not a figure: transcribe only the printed title lines, with no image reference and no label list. If an opener carries a real uncaptioned illustration, its alt text is the bare word شكل, never a composed description.

## Independence

When your caller says the read is independent (an audit read, a benchmark run, or an adjudication), you must not open any earlier transcription of the page — not `pages-md/<N>.md`, not `pages-md-audit/`, not `gold/`, not `textbook.md`. Reading them turns a measurement into a copy. The image and this contract are your only inputs.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <page list or "none">, printed-errors: <page: what, or "none">`. Do not paste any transcribed text back. It all lives in the files.

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- Verse lines (two hemistichs) are separated by plain spaces, never &nbsp; entities or other HTML markup.
- On the second-edition preface page, the line 'ولنعمل مع علي الجارم :' is printed between the two verses; keep it in that position.
- The contents page title المحتويات (page 7) is a bold centred line at body size: write it as a plain line, not a ### heading.
- Contents-table entries are followed by dot leaders to the page-number column; drop the leaders entirely, including a leader dot that touches the entry text (e.g. ورقة الرسم.......) — it is not a full stop.
- The contents pages (p9 and following) are one continuous ruled grid; a thin empty ruled band between chapter blocks is an empty row of the same table (| | |), not a break into two tables.
- The contents on p9 prints المقناطيسية (with ق) in the entry أثر الأقطاب المقناطيسية والسرعة على التردد — keep it, do not correct to المغناطيسية.
- The table of contents on pages 9–11 is printed as one ruled box, with horizontal rules between sections. Transcribe each page as one Markdown table, not one table per section.
- Contents entries run straight into dot leaders. Do not write a trailing period after an entry, because it cannot be told apart from the leader dots.
- In the contents pages the dot leader often touches the entry title (تحليل القوة.......): the dots are leaders, not a full stop, so do not end the entry with '.'.
- Contents page 11 (ي) is a framed box divided by a full-width horizontal rule; the block above the rule and the التساقط block below it are transcribed as two separate tables, each with an empty header row.
- Page 19, figure (١–١٠): on the front view's right-hand vertical dimension for the base, the digits sit on the dimension line, so at page-render density only a ٢ shows. Read this label on a native-density crop. Do not fill it in as ١٢ from the isometric view.
- The exercise-set title 'تمارين ( ١–١ )' is printed centred, bold and larger than body text: transcribe it as a ### heading.
- Page 40 (figure ١–٢٧, top view of the hexagonal prism): the left-hand vertex labels print a subscript ١ (هـ١، د١، جـ١); write the subscript, do not drop it.
- Page 40 step ٦ and the right-hand hexagon labels (و، أ، ب) carry subscripts that the page render cannot resolve; read them on a native-density crop and never infer them from the neighbouring steps or the drawing's geometry.
- Page 71 (2-18 الملفاف worked example): in a product printed inside a fraction, e.g. the denominator ٣ X ٠,٥ read visually left-to-right, store the rightmost printed factor first in the LaTeX source (٠,٥ X ٣), the same way ٢ X ٦ and ( ٦ - ٢ ) are stored on that page.
- Figure (٢–١٩) caption prints للمستوي with a dotted final ya while the body prints للمستوى dotless on the same page: transcribe each as drawn, do not unify.
- In worked equations on this book's pages the result (e.g. ٠,٨ =) is often printed at the right margin with the fraction to its left: write the rightmost printed term first (٠,٨ = $\frac{...}{...}$), and inside a product like ٠,٨ X ٤ keep the rightmost printed factor first.
- The book prints the multiplication sign as both a capital Latin X and a small lowercase x on the same page. Page 82, example (٢–١٦), has ٢٢/٧ x ٧٠ with a lowercase x. Keep the case of each sign as it is printed.
- A radical's vinculum covers the whole expression under it (page 82: ٢√(م٢ + (نق١ – نق٢)٢)). Put the whole radicand inside \sqrt{...}. Never write an empty \sqrt{} followed by the terms.
- Units with a raised digit inside table cells and formulas (كجم / م٢, نق٢) are written as LaTeX superscripts: $\text{م}^{٢}$, $\text{نق}^{٢}$.
- The multiplication sign in this book's equations is a Latin X (e.g. حجم الخلوص = π نق٢ X ر); write X, never × or \times, and do not drop it.
- On page 99 the numerator of equation (٢–١٩) prints the second term as ح ص with a full-size ص while the denominator subscripts it; keep the numerator unsubscripted.
- Page 113 prints «كهربائية عند طوفي عضو الإنتاج» — طوفي is a print typo for طرفي; keep طوفي.
- Equation numbers in the electrical chapter are chapter-first: the print shows (١٠–٣) visually but the logical text is (٣–١٠), matching body references like ( ٣–٨ ).
- Inside the equations the book sets products right to left (∴ ت X ي = ت X ف …) while the same quantity in prose reads ( ف X ت ); transcribe each as printed and do not unify them.
- Worked solutions in this book mix decimal separators on one page: the Arabic decimal mark ٫ (drawn ر-shaped) in most solution lines and a comma in others (e.g. ٢,٥ and the fraction ١٧٢,٥ on the page where ١٧٢٫٥ appears) — transcribe each separator as drawn, never unify.
- Subscripts on ف and ت (voltage and current symbols) are Arabic-Indic digits (ف٢، ت٢) — write $\text{ف}_{٢}$, never a Latin 2.
- In sums such as ١٧٠ + ٢,٥ the term printed right-adjacent to '=' is written first; do not reverse the addends into left-to-right order.
- The exercise-set title تمارين(٤–١) is printed centred, red and larger than the body with no space before the bracket: write it as ### تمارين(٤–١).
- Force-diagram angle labels print the degree sign to the left of the digits; store it after the number (٤٥°), as with the percent sign.
- Rotated dimension labels in the exercise figures (١,٥ / ٢,٥) are legible on the page render; do not mark them [غير مقروء].
- Comparison signs (>, ≥) in the truss stability conditions (٢ط > ض + ر، ض > ٢ط – ٣، ١١ ≥ …) are printed and legible on the page render; do not mark them [غير مقروء]. Store them logically as in RTL text (the print's visual < under bidi mirroring is >).
- Page 196 prints 'وتصبح علاقة الضغط عند أي عمق كما بلي' with ب, not يلي — keep بلي.
- Subscripts and superscripts in this book's formulas and units (ض١، م٢، م٣، ث٢) are printed in Arabic-Indic digits — write ض$_١$, م$^٢$, never Latin 1/2/3.
- In the pressure formulas (ض، ث، ر) the subscripts are Arabic letters (أ، د، ب، ج، س، ص) or Arabic-Indic digits (ر١، ر٢); a Latin 1 never appears there — a thin vertical subscript under ض is the letter أ, not 1.
- The height subscripts ر١ / ر٢ in the manometer pages (figure ٤–٣٥, equation ٤–١٤) cannot be told apart at page-render density: read them on a native-density crop or mark them [غير مقروء], never infer them from which leg the fluid is in.
- Contents page 10 (و) is one framed box: the horizontal rule after تمارين (٣–٥) and the space under it come before المحولات. Write the page as one Markdown table with an empty header row and no empty spacer row.
- Page 19, example (١–٥): the list items end with a spaced full stop (أيمن . / جانبي . / أفقي .) but the closing line prints كل المقاسات بالمليمتر. with the stop touching the word; keep each as printed.
- Page 19, figure (١–١٠): the base-height dimension at the far right of the front view stays [غير مقروء] even on the native-density crop, because the dimension line covers any leading ١. Do not change it to ١٢ or ٢.
- Page 20, figure (١–١١) (أ): the top-left solid prints exactly ten dimension labels with ١٠ three times (top width, notch height, right step), and the bottom-left solid prints eleven with ١٠ four times (two in the top row, the slot width and the left height). Count the ١٠ labels on the native-density crop and do not add an extra one.
- Page 40 step ٦: the subscript after أ in «من النقطة ( أ_ )» falls on the boundary between crops tile0 and tile1 and cannot be read on either; do not write ١ (or ٢ from the drawing, where the 45° line starts at أ٢) — keep [غير مقروء] until a crop centred on that line exists.
- Page 40, figure ١–٢٧: the right-hand hexagon vertex labels و، أ، ب are unresolved even on crops/40.tile2.webp; keep [غير مقروء] after each and never copy the ١ that the left-hand labels هـ١، د١، جـ١ carry.
- Page 40 step ٩ prints «المسقط الجابي» (missing ن); keep الجابي.
- Page 43, step ١١ of the hexagonal pyramid: the last sentence prints 'صل ( م٣ ) بالنقاط القاعدة للحصول على المسقط الأفقي' with subscript ٣, although the top-view apex is م١ — keep م٣, do not correct it to م١.
- Page 43, figure (١–٣١): the subscript under the centre label م of the hexagon top view cannot be read at page or tile density; keep it as م [غير مقروء] and do not infer م١ from the body text.
- Page 73 (المستوى المائل) prints وفى with a dotless final ya in the body; keep وفى, do not write وفي.
- Section numbers and figure numbers on page 73 are printed with spaces inside the brackets: ( ٢–١–٨ ) and شكل ( ٢–١٩ ).
- Page 98: in the boxed relation حجم الإزاحة = π نق٢ X ش the multiplication sign is a Latin X. Keep it inside the math run as X, never ×. The second line = م ش is its own paragraph.
- Page 186 prints القوي (dotted ya) as the first word of 'القوي المستعرضة هي القوى المتعامدة' and القوى (dotless) later on the same line: keep each as drawn.
- The bold run-in labels مثال( ٤–١٠ ) : and الحل : are written plain, without ** markup.
- Page 186, figure (٤–٢٧): the printed caption 'شكل ( ٤–٢٧ ) : مخطط قوى القص' has no final full stop, unlike 'الشكل( ٤–٢٦ ) : كابولي .' on the same page. Do not add one.
- Page 200 (figure ٤–٣٥, equation ٤–١٤): the native-density crops resolve the height subscripts. The figure has ر٢ on the right leg and ر١ on the left. The equation reads ض$_د$ + ث$_س$ . د . ر$_٢$ = ض$_أ$ + ث$_ص$ . د . ر$_١$. Do not mark them [غير مقروء].
- Page 200: the final definition line prints ر١ = ارتفاع المائع س فوق نقطة تساوي الضغط ب, even though the equation pairs fluid س with ر٢. Keep ر١ and do not change it to ر٢.
- Page 223 (equation ٤–١٨, green box): the multiplication sign is a bold lowercase x in both fractions; write \mathbf{x}, not a capital X.
- Page 223: the boxed equation (٤–١٨) is printed on two lines, the second opening with '=' (= ك x ع٢ / نق), and the equation number sits beside the first line. Keep the two lines; do not merge them into one display.
<!-- observed:end -->
