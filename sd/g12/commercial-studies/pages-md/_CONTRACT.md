# Transcription contract — sd/g12/commercial-studies

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: العلوم التجارية — Commercial Studies (sd curriculum, g12).
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

التبادل التجاري · المحاسبة المالية · الأسواق المالية

Numbered section headings inside a chapter get `### `. The 40 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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

### humanities

- A map is a figure: emit the image reference with its printed caption, then every printed place name, legend entry and scale label as a bullet in reading order. Never add a place the map does not print, and never describe what a region shows. *(seed: not yet observed in a transcribed book)*
- A timeline, chronology strip or arrow sequence of events is a figure or a list in reading order, not a Markdown table, unless the print draws a ruled grid. Each printed date stays with its event on one bullet. *(seed: not yet observed in a transcribed book)*
- Dates keep their printed calendar suffix and form (هـ / م, a range drawn ١٩٥٦–١٩٦٩) and are never converted between calendars or reconciled with another page. Personal, tribal and place names keep the printed spelling, even when it differs from a common form or from elsewhere in the book. *(seed: not yet observed in a transcribed book)*
- A quoted primary source — a treaty clause, a speech, a document excerpt — is transcribed verbatim with its printed quotation marks and attribution line; never complete or modernise it from a known version. *(seed: not yet observed in a transcribed book)*

## Independence

When your caller says the read is independent (an audit read, a benchmark run, or an adjudication), you must not open any earlier transcription of the page — not `pages-md/<N>.md`, not `pages-md-audit/`, not `gold/`, not `textbook.md`. Reading them turns a measurement into a copy. The image and this contract are your only inputs.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <page list or "none">, printed-errors: <page: what, or "none">`. Do not paste any transcribed text back. It all lives in the files.

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- The introduction page (page 7) prints its title مقدمة: in a large outlined display font on its own line; it is transcribed as `### مقدمة:` (no kashida).
- The calligraphic basmala at the top of the introduction page is printed text, not decoration: transcribe it as the plain line بسم الله الرحمن الرحيم.
- The scan's font widens the gap after every non-joining letter (و، ا، د، ر، ز), so words look split (قر ار ات، الو لايات، وغير ها); this is letter-spacing, not a word break — write the word unbroken.
- A red bold numbered line on its own line under a section heading, styled like that heading (e.g. (١) الأنظمة التي تميل إلي الحرية التجارية :), takes ### ; the lettered items أ/ ب/ that open running text with an underlined term stay plain paragraphs.
- Unit opener pages (e.g. الوحدة الثانية / المحاسبة المالية) carry an uncaptioned photo collage below the title: emit it as ![شكل](pages/<N>.webp) with no caption line, and do not list the incidental English text visible inside the photographed documents or screens as labels.
- Page 52 (printed 45), right column: the box reads إعدد القوائم المالية (نهاية العام المالي) with no alif after the ع. The left column prints إعداد. Keep إعدد. Do not fix it.
- The book uses the Sudanese word حوجة (need), e.g. لا حوجة لقائمة المتاجرة on page 52. Keep حوجة. Do not change it to حاجة, and do not drop the ح.
- The body text writes ايجار without hamza while the ledger tables print إيجار with hamza — transcribe each occurrence as drawn.
- Amounts followed by جنيه are often printed joined with no space (١٠٠٠٠جنيه) — keep them joined as printed.
- The receipts-and-payments statements (قائمة المقبوضات والمدفوعات) print each ruled half as two aligned sub-columns, amount on the right and its label to the left; transcribe them as a 4-column table in printed order (receipts amount | receipts label | payments amount | payments label), with the total ٣٣٠٠٠٠-style row in the amount columns and empty label cells.
- Arabic-Indic dates and sums inside RTL lines must be written so that the rendered RTL line matches the print. When the print shows the day next to the preceding word (في ٣١/١٢/٢٠٠٧م as seen on the page), write ٢٠٠٧/١٢/٣١م. When the print shows (٤٥٠٠٠+٥٥٠٠٠) with ٥٥٠٠٠ next to the label, write (٥٥٠٠٠+٤٥٠٠٠). Never reverse the visual order of the print.
- Keep worked amounts such as ٤٠.٠٠٠ × $\frac{١٠}{١٠٠}$ outside math mode with × as plain text. Wrapping the whole product in $...$ renders it left-to-right and swaps the amount and the fraction relative to the print.
- Cash receipts/payments summaries printed as two unruled columns (مقبوضات on the right, مدفوعات on the left, amounts with only total underlines) are not ruled grids: transcribe the right column fully as lines (amount then label, as printed), then the left column, never as a Markdown table.
- The red right-aligned body-size line ending in a colon that opens a paragraph (e.g. الحسابات الختامية في حالة ممارسة نشاط ربحي :) is a run-in label: write it plain, not as a ### heading.
- The receipts-and-payments accounts (قائمة حـ/ المقبوضات والمدفوعات) are printed as a framed box split by one vertical rule. Each half has its own amount column and item column, so transcribe the box as a 4-column table (amount | item | amount | item, rightmost printed column first). Do not merge an amount into its item cell. The totals row puts ٣٠٠,٠٠٠ in both amount columns and leaves the item cells empty.
- Decided: dates are stored year-first (٢٠٠١/١٢/٣١م), which renders with the day on the right as printed; a date printed with the day on the left keeps day-first.
- The framed two-half balance boxes in the exercises (item name and amount side by side in each half, one centre rule) are transcribed as 4-column tables: name | amount | name | amount, with the rightmost printed name as column 1; never merge name and amount into one cell.
- Exercise titles such as تمرين (٤) are printed centred, bold, blue and larger than body text: mark them ### .
- Each exercise title (تمرين رقم (N)) is a centred, bold, blue line set larger than the body. Write it as a `### ` heading, never as plain text.
- Blank ledger-form tables (e.g. نموذج (١–١) دفتر يومية وارد الخزينة) print the row numbers ١ ٢ ٣ ٤ stacked inside a single ruled cell with no rules between them: transcribe them as one cell ١<br>٢<br>٣<br>٤ in one body row, not as separate Markdown rows.
- Blank ledger forms (نموذج) print stacked row numbers or denominations inside one unruled cell: keep them in one Markdown cell joined with <br>, and do not split them into rows that the print does not rule.
- In the نموذج ledger tables a total label (المجموع) printed in a merged cell that starts at the second column goes in Markdown column 2; leave the rightmost column empty when its cell is printed empty.
- A specimen banking document drawn inside a box (cash deposit receipt, cheque, withdrawal slip) under a numbered red caption such as (١–٤) : إيصال إيداع نقدية is a figure: write the image reference with that caption as alt text, the bold caption line, then each printed field label as a bullet in right-to-left, top-to-bottom order. Do not write it as plain paragraphs, and do not make it a Markdown table, because the box has no ruled grid.
- Worked zakat and working-capital solutions print assets and liabilities as two side-by-side columns with no rules: they are not tables, and the right-hand column (مجموع الأصول المتداولة) is transcribed in full before the left-hand column (مجموع الخصوم المتداولة), never interleaved line by line.
- Red body-size numbered labels ending in a colon (١. البنك الدولي للإنشاء والتعمير :) that enumerate items announced by the preceding sentence (المؤسسات التالية :) are run-in list labels: write them as plain lines, not ### headings.
- Page 52 (printed 45): the two-column comparison chart prints a hollow double-headed vertical arrow between استخراج ميزان المراجعة نهاية الشهر and التسويات الجردية in each column. Write the two labels as separate bullets and do not add an arrow glyph; the printed words are the labels.
- Page 52 (printed 45), left column, last box: the text reads (المتراكم الفائض) and is legible on crops/52.tile2.webp. Do not mark it [غير مقروء].
<!-- observed:end -->
