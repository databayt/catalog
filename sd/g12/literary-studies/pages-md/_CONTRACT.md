# Transcription contract — sd/g12/literary-studies

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: دراسات أدبية ولغوية — Literary and Linguistic Studies (sd curriculum, g12).
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

النقد · شاعر وقصيدة · مقدمة في علم العروض · شذرات من علم اللغة

Numbered section headings inside a chapter get `### `. The 19 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- The contents page title المحتويات (page 4) is printed centred in a heavy display face larger than the body, so it takes ### ; the contents themselves are a two-column table (الموضوع | الصفحة) with الموضوع as Markdown column 1.
- Numbered sub-section lines in bold on their own line (١ – تعرّف شخصيّة صاحب النّصّ :) are numbered section headings and take ### ; keep the digit–dash spacing exactly as printed, which varies (١ – vs ٣–) on the same page.
- Page 28 (printed 20) ends «وما جرى فيه ما أحداث.» with ما where من is expected — keep ما.
- A centred poem title printed at body size above a model poem (e.g. قصيدة المساء under النموذج الأوّل) is a plain line, not a ### heading; only the numbered section line above it (e.g. (٢-٣-١) نماذج التّحليل :) is a heading.
- The book opens comment lines inside المعنى sections with a printed # sign (e.g. «# كأن الشّاعر يشير هنا…»). It is a printed character, not a heading: write it escaped as \# at the start of the line so Markdown does not turn the line into an H1.
- The book prints a literal bold # at the start of some explanatory paragraphs (# أراد الشّاعر أن يقول ...); write it escaped as \# so it stays text and never becomes a Markdown heading.
- The vocabulary glosses under اللغة : (الكلمة / المعنى) are unruled, space-aligned columns, not a grid: write the header line and each word-gloss pair as its own line (word, three spaces, gloss), never as a Markdown table.
- The الكلمة / المعنى vocabulary glossaries are two aligned columns with no rules or shading: they are not tables. Write each entry as its own line, word then meaning separated by spaces, with the الكلمة المعنى header line first, never as a Markdown table.
- The اللغة glossaries (الكلمة / المعنى) are unruled two-column word lists, not grids: write each row as a plain line, the word, three spaces, then its meaning, with no Markdown table; a meaning that runs on into the next row's line stays on that line as printed.
- Some commentary paragraphs open with a printed bold # sign: write it escaped as \# so it stays a literal character and never becomes a Markdown heading.
- The اللغة glossaries (الكلمة / المعنى) are unruled two-column word lists, not tables: write the الكلمة المعنى header line, then each entry as its own line (word, three spaces, meaning), never as a Markdown table.
- Commentary paragraphs that open with a printed bold # sign keep it escaped as \# so it stays a literal character and never becomes a Markdown heading.
- The book opens remark paragraphs with a printed # mark; write it escaped as \# so it stays literal text and never becomes a Markdown heading.
- The اللغة : word glossaries (الكلمة / المعنى) are printed as two aligned columns with no rules or shading; they are not tables — write the header line and each word–meaning pair as its own plain line, word first, separated by spaces.
- The الكلمة / المعنى glossary under each «اللغة :» is two unruled aligned columns, not a grid: write a plain 'الكلمة المعنى' line, then one paragraph per entry (word, space, meaning). Never a Markdown table.
- A literal # printed at the start of a commentary paragraph (# يمكن أن يكون معناه …) is escaped as \# so it does not render as a heading.
- Page 68's verse (٤٢) and glossary print فُحَّلُ / فحّل with one dot (ف). Do not change it to قُحَّلُ / قحّل.
- An اللغة glossary may reprint its الكلمة / المعنى header partway through (page 68, before أحاظةَ). Keep the repeated header as its own plain line where it is printed.
- The example line of prosodic symbols on the page printed 83 (file page 90) is hand-drawn and uneven. Do not normalise it into identical o – – – groups taken from the prose. Mark it [غير مقروء] unless a crop shows every mark.
- In the symbol column (الصورة الرمزية) of the تفعيلات table, each row's dash and circle string must be read from that row's own print. Do not copy the string from the row above.
- A bold line that opens with a section number in parentheses, such as (٣–٨) تقطيع البيت الشّعري :, is a numbered section heading and takes ###, even when it sits at the foot of a page under an exercise block.
- Ordinal sub-section lines under a numbered section (e.g. «أولاً : البحر الطويل (…):», «ثانياً بحر الكامل (…):») are bold, body-size and flush right: write them as plain lines, not ### headings; only the numbered line such as «(٣–٩) بحور مختارة :» is a heading.
- Handwritten reader annotations on the scan (e.g. the pen-written «مُتفاعِلُ» below the الكامل scheme) are not print: do not transcribe them as figure labels.
- Scansion rows on the العروض pages draw small hand-made circles (sakin) and dashes (mutaharrik); the print does not show whether they are Latin o or Arabic-Indic ٥. Keep the incumbent symbol, and do not reorder a row into logical RTL order when it was written as drawn. The difference is encoding, not a reading.
- Each braced صدر/عجز scansion block with its own label above (العروضة / الضرب) is a separate figure, so write one ![شكل] per block. Do not merge a bayt's two halves into one figure.
- Page 107 (100 printed): the فاعلن row prints فَاعِلُقْ as the 7th tafeela (second from the left edge) — keep فَاعِلُقْ and keep it in 7th position.
- Page 107 (100 printed): the scansion columns print فَعَلُنْ with a fatha on ع (all of الصدر, last column of العجز) although the body text says فَعِلُنْ — do not change it to فَعِلُنْ.
- Prosody rhythm lines (dashes for moving letters, a small circle for a quiescent one) are written in right-to-left reading order: each segment starts with what is printed at its right end, so فَعَلُنْ is ---٥ and فَعْلُنْ is -٥-٥ — never the mirror-image o--- / o-o- copied left to right.
- Each scansion block (الصدر with its العروضة, العجز with its الضرب) is printed as its own braced block and gets its own ![شكل](pages/<N>.webp) reference.
- Lettered/numbered section lines such as ثالثاً : البحر المتدارك (...) : that stand alone on a bold line above their paragraph are ### headings.
- A chapter-opening page prints the chapter number (e.g. الفصلُ الرّابعُ) centred in display type above the chapter title; both lines take ## (## الفصلُ الرّابعُ then ## شَذَراتٌ من علمِ اللُّغةِ).
- Worked examples printed as words aligned in columns with no rules or shading (e.g. the مثال of الفعل / الباب / الفصل in the dictionaries lesson) are not tables in this book: write each printed line as a plain paragraph, words in printed order, not as a Markdown table.
- Years in this book use wide digit spacing and a wide gap after هـ (المتوفى ٤٠٠ هـ ١٠٠٣م): write the year as one unbroken number followed by م, and do not split off its last digit.
- This book prints some tables with no rules at all — a bold header row (e.g. الكلمة، أصولها، ملحوظات، الباب، الفصل) over column-aligned rows. These are tables, not figures: transcribe them as Markdown tables with the rightmost printed column first, never as space-separated lines.
- The dictionary section openers (فصل الدال، فصل الراء، فصل الشين …) are centred in their column in a larger display face: mark each as `### فصل …`; the bracketed root lines beneath them ([ دأظ ]) stay plain paragraphs.
- In the dictionary pages the print draws final ya dotless in أى، فى، الذى، بنى، الأموى، شناظى — transcribe them dotless as drawn, not أي/في.
- Page 90 (printed 83): the الصورة الرمزية column of the تفعيلات table is kept as drawn left-to-right with Latin o (فَعُولُنْ = o – o – –); a re-read written in RTL order with ٥ (--٥-٥) is the same reading, not a disagreement.
- Page 90 (printed 83): in the مُفَاعَلَتُنْ row of the الصورة الرمزية column the dash group between the two circles is one long hand-drawn stroke whose dash count cannot be read; it stays o [غير مقروء] o – – and must not be filled in from the tafeela's expected pattern.
- Page 91 (printed 84), بحور الشعر table: the التّفعيلات cells of الطّويل and الهزج, and الهزج's last cell, print مفاعلين, not مفاعيلن. Only الطّويل's last cell prints مفاعيلن. Keep each spelling exactly as printed and do not unify them.
- Page 91 (printed 84), بحور الشعر table: الرَّمل carries a fatha on the shadda (رَّ), unlike الرّجز and السّريع. Keep the fatha.
- Page 99 (92 printed): the scansion rhythm rows under the الطويل example are legible on the page render and are written in RTL order (فعولن --٥-٥, مفاعيلن --٥-٥-٥, مفاعلن --٥--٥); do not mark a whole row [غير مقروء] when the segments can be counted, and mark only a segment whose dash count runs into a bar stroke.
- Page 100 (93 printed): each of the four braced scansion blocks (صدر البيت / عجز البيت for bayt ب and bayt جـ) is its own ![شكل](pages/100.webp); the two verses are printed bold with a plain space gap and only partial harakat (ما كنتَ جاهلاً, نائباتِ الدّهْرِ) — do not supply full vocalisation or a · separator.
- Page 100 (93 printed): the rhythm rows are legible on the page render and are written in RTL logical order (فعولن --٥-٥, مفاعيلن --٥-٥-٥, مفاعلن --٥--٥, فعول --٥-); only the الضرب row of bayt ب and the joined مفاعيلن/فعول run of bayt جـ عجز stay [غير مقروء] until a native-density crop shows every mark.
- Page 103 (96 printed): the first word of the الكامل example list is مُتَقَاعِسٌ with ق (not مُتَفَاعِسٌ), and the last bullet prints «كلمة متشاغل تمثّل الضرب ، فوزنها (متفاعلن)» with the final ن. Keep both as printed.
- Page 105 (98 printed): the body line and the ضرب taf'ila of example جـ print (فَعْلُنْ) with a sukun on ع, not فَعِلُنْ; the verse's فَعَاقِلُ ends in a damma.
- Where the two scansion rules conflict, write rhythm rows with ٥ for the circle and each segment in right-to-left order (مُتَفَاعِلُنْ is ---٥--٥), segments listed rightmost first — this supersedes keeping an incumbent left-to-right o--o--- copy.
- Page 107 (100 printed): the الخبب scansion blocks may be written row by row (segments joined by / on one bullet, then the tafeela row, then the rhythm row) or column by column; both carry the same printed labels, and the difference is ordering, not omission — keep the incumbent order.
<!-- observed:end -->
