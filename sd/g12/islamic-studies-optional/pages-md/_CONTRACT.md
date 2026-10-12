# Transcription contract — sd/g12/islamic-studies-optional

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: الدراسات الإسلامية (اختياري) — Islamic Studies (Elective) (sd curriculum, g12).
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

القرآن الكريم وعلومه · النظام الاقتصادي · من أصول الفقه · علوم السنة

Numbered section headings inside a chapter get `### `. The 10 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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

### religious

- Every verse or scripture quotation is read off the page, never quoted from memory or a reference text. Keep every printed diacritic and Uthmani mark, the ornamental brackets ﴿ ﴾ (or plain parentheses where those are printed) and the verse-number glyph as printed; a number you cannot read inside an ornament is [غير مقروء], not supplied. *(seed: not yet observed in a transcribed book)*
- Honorific formulas keep the printed form: a ligature glyph (ﷺ، رضي الله عنه as a single mark) stays the glyph, a spelled-out phrase stays spelled out, and an abbreviation (صلى الله عليه وسلم as (ص)) stays abbreviated. Never expand, contract or add one. *(seed: not yet observed in a transcribed book)*
- A hadith, its chain of narrators and its source citation (رواه البخاري) are transcribed verbatim in printed order, with the book's own brackets and punctuation. Never complete a truncated chain or text, and never add or correct a citation from another collection. *(seed: not yet observed in a transcribed book)*

## Independence

When your caller says the read is independent (an audit read, a benchmark run, or an adjudication), you must not open any earlier transcription of the page — not `pages-md/<N>.md`, not `pages-md-audit/`, not `gold/`, not `textbook.md`. Reading them turns a measurement into a copy. The image and this contract are your only inputs.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <page list or "none">, printed-errors: <page: what, or "none">`. Do not paste any transcribed text back. It all lives in the files.

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- The contents page title المحتويات, printed large and centred on a decorative banner, is transcribed as the heading `### المحتويات`.
- In the contents, the entry المنافقون والمؤمنون (ب) prints its range as ( الآية ١٦ – ١٥) with the opening bracket before الآية — keep it exactly; do not correct it to a forward range.
- p.38: the book prints the narrator's name as يحى القطاني (one ي, and القطاني not القطان) — keep both as printed, do not restore يحيى القطان.
- p.38: the book writes أولى الأمر with dotless final ى in prose (for أولي) — keep as printed.
- The discussion-set label أسئلة للمناقشة : sits bold at the right margin between decorative green ornaments; it is body-size and not centred, so it is written as a plain line, never a ### heading.
- The Qur'an boxes print a number inside each end-of-ayah ornament (e.g. ۝٩ … ۝١١ on p41); transcribe ۝ followed by the printed number, and use [غير مقروء] after ۝ when the number is too small to read — never drop it and never supply it from the verse sequence.
- The Qur'an font in this book sometimes fails to draw the letter ف (p41: تُفلحون and ٱنفضّوا show a gap where ف belongs); never restore the missing letter from the mushaf.
- Qur'anic passages in this book print the ayah number inside each end-of-ayah ornament; write it after the mark as ۝١، ۝٢ … — never drop the printed number.
- In the green Qur'anic quotations the font sometimes fails to draw a medial ف, leaving a blank gap with only its fatha (p51: وَنِصۡ َهُۥ for نصفه، وَطَآئِ َةٌ for طائفة). That is a print omission, not illegible ink: do not restore the ف and do not write [غير مقروء]; write the letters that are drawn, keep the floating fatha, and report it as a printed error.
- Verse-end ornaments in this book print their āyah number inside (۝١٠٧); the number is legible on the native-density crop — write it as ۝ followed by the printed digits, do not drop it and do not mark it illegible.
- The book writes the word شيء in two ways, sometimes on the same page: شيء and شئ (hamza on a ya seat, often stretched by kashida, e.g. في شـئ ليس لله on page 111). Write each one the way it is drawn and do not make them match.
- Section numbers in headings print the chapter digit first beside the opening bracket, e.g. (٣–٢) and (٣–٢–١); write the parent section in the same digit order as its subsections and use the en dash.
- Chapter opener pages print a part label (الباب الأول / الباب الرابع …) above the green chapter-title cartouche. Only the cartouche title (e.g. علوم السنة) is the ## heading, and the الباب line stays plain text.
- Chapter opener pages list their sections on lines that begin with a printed asterisk (* الفصل الأول ...). Write it escaped as \* so it stays a literal asterisk and does not become a Markdown bullet.
- Section-opener pages print a centred bold الفصل الأول / الفصل الثاني line above the numbered section heading (e.g. p.117 above (٣–٢) الحكم والاجتهاد); it is not a chapter title, so it takes ### like the section heading, never ##.
<!-- observed:end -->
