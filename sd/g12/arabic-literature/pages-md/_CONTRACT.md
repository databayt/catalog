# Transcription contract — sd/g12/arabic-literature

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: المطالعة والأدب — Reading and Literature (sd curriculum, g12).
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

العصر الجاهلي · مختارات أدبية للقراءة · العصر الإسلامي - عهد الرسول صلى الله عليه وسلم وخلفائه · مختارات أدبية للقراءة · العصر الأموي · مختارات أدبية للقراءة

Numbered section headings inside a chapter get `### `. The 26 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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

### arabic-language

- The two hemistichs of a verse go on ONE Markdown line separated by plain spaces — no &nbsp; or other HTML. The width of that gap is layout, not content, and is never a disagreement. Literal asterisks printed between hemistichs are escaped (\*\*) so they render as asterisks, not emphasis.
- Words the print underlines — usually the ones an analysis or exercise refers to as «تحتها خطّ» — keep the underline as <u>…</u> around exactly the underlined word. Never substitute bold, never widen it to the whole line, and never drop it: the sentence that points at it then points at nothing.
- A footnote call is the printed characters only — a raised Arabic-Indic digit in parentheses attached as printed (وَدَدا(١)) — never <sup>. Reproduce each call's inner and outer spacing as drawn, even when it varies on one page, and give the note at the page foot with the same marker.

## Independence

When your caller says the read is independent (an audit read, a benchmark run, or an adjudication), you must not open any earlier transcription of the page — not `pages-md/<N>.md`, not `pages-md-audit/`, not `gold/`, not `textbook.md`. Reading them turns a measurement into a copy. The image and this contract are your only inputs.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <page list or "none">, printed-errors: <page: what, or "none">`. Do not paste any transcribed text back. It all lives in the files.

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- Footnote markers at the page foot may print a Latin digit, e.g. (1), while the body call they answer prints Arabic-Indic, e.g. الشنفرى(١) (page 12); transcribe each as drawn and do not unify them.
- A bold numbered topic title on its own line such as (٢) <u>الغزل</u> : is a numbered section heading and takes ### (page 12).
- Bold body-size margin labels such as (ب) الخصائص اللفظية :، ثانياً النثر :، (١) الخطب والوصايا :، أنواع النثر الجاهلي : are run-in labels, not headings — write them as plain lines without ###.
- In underlined labels the underline covers only the words: the list marker ((ب)، (١)) and the trailing colon stay outside <u>…</u>, e.g. (ب) <u>الخصائص اللفظية</u> :
- Numbered sub-section lines such as '( ١ – ٤ – ٣ ) التعليق :' take ### even though they print at body size: the section numbering decides. Keep the underline exactly as drawn, which on التعليق includes the colon.
- Section numbers print in the order ( ١ – ٤ – ٣ ) reading right to left. Transcribe them in that order and do not reverse them.
- Numbered sub-section lines such as «( ١ – ٥ – ١ ) الشاعر :» and «( ١ – ٥ – ٢ ) النص :» are ### headings (they carry section numbering), and the print underlines only the word after the number: write `### ( ١ – ٥ – ١ ) <u>الشاعر</u> :` with the colon outside the underline.
- Footnote calls in the body are raised Arabic-Indic digits in parentheses — (١) (٢) (٣) — but the matching markers at the page foot are printed as Latin (1) (2) (3). Transcribe each as printed and do not make them match (seen on p. 101).
- Numbered section lines of the form ( ٣ – ٢ – ٤ ) <title> : stand on their own line and take ### ; the book underlines the title words, so keep <u>…</u> around exactly the title inside the heading (### ( ٣ – ٢– ٤ ) <u>التعليق والتذوق</u> :), and keep the printed spacing of the dashes in the number as drawn (٢– without a space on p.115).
- Numbered section lines such as «( ٥ – ٥ – ٣ ) الشرح :» and «( ٥ – ٥ – ٤ ) التذوق :» are headings and take ### .
- The book underlines the death year in poet biographies (توفي <u>٦٨</u> ه) — keep it as <u>…</u>, and write the hijri abbreviation as plain ه, not the presentation form ﻫ.
- Verse hemistichs on this book's pages are separated by a blank gap only; do not insert \*\* where no asterisks are printed.
- Footnote calls in the body are printed as Arabic-Indic digits in parentheses (وأيم(١)) while the footnote lines at the page foot are numbered with Latin digits ((1) أيم الله ...) — transcribe each as printed; never unify them.
- Section headings carrying the lesson numbering, e.g. ( ٥ – ٧ – ١ ) صاحب النص :, take ### even though they are body-size bold lines at the margin; the unnumbered bold label الشرح : stays plain.
- Footnote markers at the page foot may be printed with Latin digits, e.g. (1), even when the call in the body is Arabic-Indic (١) — transcribe each as drawn, never unify them (p. 183).
- Numbered sub-section lines of the form ( ٦ – ٢ – ١ ) الاستيعاب : and ( ٦ – ٢ – ٢ ) التدريبات اللغوية : are section headings and take ### (keep the parenthesised number and trailing colon exactly as printed); the boxed «من نفيس الكلام :» quote has no numbering and is not a heading.
- Section lines like ( ٦ – ٥ – ١ ) مناسبة الخطبة : print in bold at body size and carry section numbering. Mark them ### and do not write them as bold paragraphs.
<!-- observed:end -->
