# Transcription contract — sd/g12/computer-science

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: علوم الحاسوب — Computer Science (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 5 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

الدوائر المنطقية والعد الثنائي · بنيات البيانات · الخوارزميات البيانية · نظم التشغيل · تحليل وتصميم النظم الآلية للمعلومات

Numbered section headings inside a chapter get `### `. The 52 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- Page 11 prints وفيزائياً, without the ي after ز. Keep it as printed and do not change it to وفيزيائياً.
- Switch names م١ / م٢ (and similar letter+digit variables) are printed with the digit as a subscript — write them $م_١$, $م_٢$ in tables, labels and prose, with ∧ / ∨ as \wedge / \vee inside the math run.
- Page 12's last paragraph prints an unmatched closing parenthesis 'وجود التيار) .' — keep it.
- Page 16: the law after قانون (١) is printed قانون (٣), not (٢) — keep (٣); do not renumber the laws into sequence.
- Switch names such as م١ and م٢ are written as plain text (م١), not LaTeX subscripts. In circuit equations a value ٠ is a single dot, so do not add a full stop after a final =٠ unless a second dot is printed.
- A worked repeated-multiplication calculation (e.g. decimal-to-binary by ×٢) is typeset text, not a figure: write each printed row as a plain line in right-to-left order (product, then the extracted bit, then any side note such as يتم إهمال الواحد في الضرب), with no image reference, no bullets and no dash separators that the print lacks.
- In vertical binary sums (e.g. مثال (٢٠), page 32), each result is one number printed with its digits spread across the sum's columns: write it as one number with no spaces (١٠, ١١), not as spaced digits. Spaced Arabic-Indic digits in an RTL line display in reverse order (١ ٠ shows as ٠ ١).
- A mixed number is stored fraction-first, the rightmost printed term first (e.g. `$^{٣}/_{٨}$ ١١`), not integer-first.
- A working line that opens with a printed + is written `\+` so Markdown does not turn it into a bullet and drop the sign.
- In the binary-fraction examples, the column working prints the binary point as ٫ but the closing إذن line can print it as a baseline dot (.) — keep each as drawn, never unify.
- In the binary-arithmetic examples the base is printed as a subscript after the closing bracket ((١٠١٠)٢, (٢)١٠): write it as a LaTeX subscript inside the math run, $(١٠١٠)_{٢}$, not as a plain trailing digit.
- Example labels differ in colon spacing: 'مثال (٣٠) :' has a space before the colon and 'مثال (٣١):' has none. Transcribe each one as printed.
- Binary strings in Arabic-Indic digits (gate tables, exercise bit rows) are stored in the left-to-right order the page draws them, e.g. a cell printed ١ ١ ١ ١ ٠ is written ١١١١٠. Do not reverse them to right-to-left reading order, and count the digits on the native-density crop. Page 42 had every string reversed and three 12-bit rows padded to 13.
- Page 53 (مثال (٢), floating-point addition) prints long runs of Arabic-Indic zeros (٠.٠٠٠٠٠٠...٢٥, ٠.٣٠٠٠٠...٢٥). At page-render and tile density the zero count cannot be settled, so it is marked [غير مقروء]. Count the zeros glyph by glyph on a higher-resolution crop, and never derive the count from the arithmetic (0.25 × 10^-2 shifted to 10^4).
- A topic title printed alone in a red tab at the top-right corner of a pink boxed section (e.g. السجلات) is a section heading: write it as `### `, not as a bold line.
- Page 70 (printed ٦١): the Arabic pseudocode column of the triangle-area table prints 'أدخل قيمة طول االقاعدة' with a doubled alif (االقاعدة), but the Pascal column next to it prints القاعدة normally. Keep the doubled alif in the pseudocode column.
- In mixed Arabic and Pascal function lines (abs (x), sqr (x), sin (x) …), the Latin term printed at the right edge of the line comes first in the transcription. Each bracket group has as many brackets as are drawn, e.g. جا (sin (x)); do not add brackets that only come from mirrored glyphs.
- Program listings printed as two shaded side-by-side columns (Arabic pseudocode on the right, Pascal on the left) with no ruled row lines are a single-row Markdown table: one cell per column, each code line separated by <br>, and a line wrapped only by column width (حرفي, char;, المضاف) joined to its line with a space — never split into one row per line.
- Pascal listings in this book carry typos that must stay: 'Newlelement' in the declaration vs 'newelement' in the body, and 'top + l' with a letter l instead of 1 (page 80).
- Page 84: the operations table prints its first-row date with the digits in the opposite visual order from the other rows (٣/٥ in row 1, ٥/٣ in rows 2–4). Keep each row as printed and do not unify them.
- Page 84: the phone column header is spelled التلفون (no ya), and the branch name is wrapped as الجمهور / يه, ending in an undotted ه. Write الجمهوريه, not الجمهورية.
- Page 84: digits hidden under the linking arrows stay [غير مقروء] for the hidden digit only. Keep the visible digits (٢٢[غير مقروء], ٣١[غير مقروء]).
- The bubble-sort trace pages (e.g. 'مصفوفة العناصر بعد الدورة ...' followed by 'التبديل الأول لا تبديل ١٢ ٢٥' rows) are unruled typeset text, not figures or tables: write each row as a plain text line, with no image reference, no bullets and no ← arrows, because none are printed.
- The book spells Fortran as فورتران (plain alif, no hamza) — never فورترإن.
- Job-control commands are printed with a space after the dollar sign ($ JOB, $ END, $ FTN, $ LOAD, $ RUN) — keep the space; letter-spaced runs such as $ F T N are tracking and are written $FTN.
- The centred, larger, blue lesson/section title line at the top of a page (e.g. p176 'علاقة كينونة المنهج مع الكينونات الأخرى') takes ### even though it carries no number; bold body-size run-in lines below it (الإدخال :، أولاً :) stay plain without ** markup.
- The book prints 'على النمو التالي' for النحو, 'والدة' / 'مؤهلة' with ة where ه is meant, and run-together 'أمرالتلميذ' — keep all as printed.
- Final ya is drawn dotless in some words and dotted in others on the same page (ولى vs السنة الأولي on p176) — transcribe each as drawn.
- A coloured (red) bold sub-item line numbered with a closing parenthesis, such as ١) الاستفسارات الرئيسية, sits at body size under a blue numbered section heading (٧- ...). It is a list enumerator, not a heading: write it as a plain line without ###. Only the blue section lines numbered ٧- and similar take ###.
- A screen-form figure (label box beside a value field) gets one bullet per printed box — the label (e.g. الإسم:) and its value on separate bullets, never joined.
- A date printed as Arabic-Indic digits with slashes (visually م١٩٩٠/١/١) is stored in logical order ١٩٩٠/١/١م — the digit run renders left-to-right as one unit; do not reverse it to ١/١/١٩٩٠م.
- Red bold numbered procedure steps at body size (٤) اختر اسم الطالب) are plain lines, not ### headings.
- Page 179 (printed ١٧٠) prints يتلفون and بوتسودان — keep both spellings.
- Page 181 prints 'التي بهـا سـماء المعلمين بالشعبة' with the initial أ of أسماء missing; transcribe سماء as printed, do not restore أسماء.
- Red bold step lines numbered with a closing parenthesis (٧) اختر شعبة المعلم، ٨) اختر اسم المعلم) are body-size enumerators at the right margin, not headings: write them as plain lines without ###.
- Binary long-division layouts (مثال (٣٠), مثال (٣١), page 38) are typeset text, not code or figures: write each printed row as a plain line, with each number unspaced (١٠١ | ١٠١٠, ٠١١١) in the left-to-right order the page draws it. Do not use a code block or spaced digits.
- Page 45 (chapter 2 opener, printed ٣٦) prints the chapter title as بنائيات البيانات, not بنيات البيانات as in the chapter list. Keep بنائيات on this page as the ## heading and do not change it to match the contents.
- Page 53 (مثال (٢)): the 2400 px tile crops crops/53.tile*.webp still do not let the zero runs in ٠.٠٠...٠٢٥ and ٠.٣٠٠...٠٢٥ be counted, so the three spans stay [غير مقروء]. Only a crop denser than the tiles can settle them. Writing a superscript exponent as ١٠$^{-٢}$ or as $١٠^{– ٢}$ gives the same value, so the difference is not a disagreement.
- Page 70 (printed ٦١): the abs line prints a colon between the function and its description — write 'abs (x) :القيمة المطلقة للعدد (x)' and do not drop the colon.
- Page 80 (printed ٧١): the Pascal listing prints 'Stack[top]=newelement;' with a plain = (no :=) and 'Top : = top + l' with a space inside : =. Keep both, and do not change it to := or to 1.
- Page 80 pseudocode prints 'أقرأ (الموقع العلي)' (missing ا after ع) and 'إذا كان موقع الاعلي=الاكبر' with no hamza and dotted final ya. Keep these spellings, even though the same cell also prints الموقع الأعلى correctly.
- Page 84: three ruled tables are linked by curved arrows and each has a pink title box (جدول حسابات العملاء, جدول بيانات الأفراد, جدول بيانات العمليات). Write them as three Markdown tables, each with its box title as a plain line directly above it. Do not add a figure image reference or a bullet list of the titles, because the arrows draw no labels of their own.
<!-- observed:end -->
