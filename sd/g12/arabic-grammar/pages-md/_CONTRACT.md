# Transcription contract — sd/g12/arabic-grammar

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: قواعد النحو — Grammar Rules (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 10 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

الجملُ وأشباهُ الجملِ التي لها محلٌّ من الإعراب "مراجعة" · أسلوب الشّرط · النسب · الجامد والمشتقّ · جمع التكسير · أفعال المدح والذّم · الإضافة · كسر همزة إنّ · بعض حروف المعاني · بعض الأخطاء الشّائعة

Numbered section headings inside a chapter get `### `. The 38 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- Chapter openers in this book print their qualifier on a second centred line in the same bold face — e.g. page 9 prints (مراجعة) under (١) الجُمَلُ وأشباهُ الجُمَلِ الّتي لها محلٌّ من الإعراب. Keep the two printed lines as ONE `## ` heading (title then the qualifier in its printed parentheses); do not make the second line a separate `### ` heading.
- Quranic quotations in this book are set in a font that drops the hamza/kasra on some initial alifs — page 11 prints انَّ عَلَيْنَا جَمْعَهُۥ وَقُرْءَانَهُۥ with a bare alif. Transcribe the alif exactly as drawn; do not restore إِ from the standard mushaf spelling.
- Two hemistichs of a verse are separated in the print by two literal asterisks (**). Write them escaped, as \*\*, so Markdown renders the printed asterisks instead of treating them as emphasis delimiters.
- On a table continued from the previous page the book re-prints the header row (الجملة | الأداة | شرطها | جوابها | المعني) partway down the page, and the rows above it sit in their own ruled box with slightly different column rules: transcribe that as TWO Markdown tables — the upper one with an empty header row — and never hoist the header above the rows printed before it.
- When one table cell prints two stacked entries (e.g. لولا above لولا، الأمطار above القوانين), separate them with <br>; the book prints no slash or comma between them, so do not invent one.
- Final ya is printed WITHOUT dots throughout this book (شَجِي، شَقِي، ثاني، المهدي، المستفتِي): the bare hook is ي, not ى. Do not transcribe it as alif maqsura, and never put a nisba shadda on ى.
- The lesson labels العرضُ : ، التحليل : (and their kin) are printed in a bold display face — mark them bold, and mark them the same way within a page.
- Words the book underlines inside the القاعدة rules (واواً، ثالثة، رابعة، خامسة، فتح) carry a printed underline: keep them as <u>…</u>.
- Diacritic-only variants — a fatha stacked on a shadda (النّسب vs النَّسب), a tanween hiding under an underline, kashida counts in justified words (مــع vs مـــع) — are not disagreements: transcribe the marks you can actually see and do not add ones you cannot.
- In this book the run-in section labels الأول / الثّاني / الثّالث : , العرض : and التّحليل : are printed in bold. Transcribe them as bold lines (**...**), never promote them to headings.
- Exercise words that the instruction refers to as تحتها خطّ are printed with a real underline. Keep the underline as <u>...</u> around exactly the underlined word.
- In this book's العرض boxes a curly brace may group two printed lines under one number (page 50, table of وزن فعيلة). Transcribe one Markdown row per printed line, putting the group number in the first row of the pair and leaving the number cell empty in the second — do not merge the pair into a single row with <br>.
- No Latin script or Latin markup is printed in this book's grammar pages; a <br> or any Latin run inside a cell is transcriber markup, not print.
- Pages in the النسب chapter underline the words the التحليل then discusses («الأسماء الّتي تحتها خطٌّ»). Keep the printed underlines as <u>…</u> spans around exactly the underlined word — dropping them breaks the sentence that refers to them.
- The العرض verse lines in this book are fully vocalised; transcribe every printed diacritic (رُبَّ، أُمُّك، تَبَسُّمٌ وَسَنَاءُ) rather than a bare consonant skeleton.
- The book sets النَّسب with shadda + fatha in headings and in body text, and النّسب with a bare shadda elsewhere on the same page; reproduce each occurrence as printed instead of normalising them to one form.
- Justification kashida (ـــ) inside words such as فــي، الــخ، التثنيــة is typographic stretching; the exact number of tatweel characters is not a disagreement worth adjudicating.
- Qur'anic verses in this book are set in Uthmani rasm — keep ٱ with wasla and the dotless yaa of وَهِىَ; do not modernise them.
- The book is inconsistent about the shadda in الّتي: some lines set it over the ت (التّي), others over the لام (الّتي). Transcribe each occurrence as printed and do not normalise.
- Do not add HTML markup to these pages: a raised footnote reference is transcribed as the printed characters only, e.g. مُفَنَّدا(١), never <sup>(١)</sup>, and the gap between the two hemistichs of a verse is literal spaces, never &nbsp;.
- The book frequently omits a tanwin the grammar would require (e.g. مغمورة for مغمورةٌ). Transcribe the bare form as printed.
- This book's pages are Arabic-only prose; no Latin characters are printed. Do not insert &nbsp; entities (or any HTML) to hold the gap between the two hemistichs of a verse — write the two hemistichs on one line separated by plain spaces.
- The rule banner القاعدة is printed as a boxed display label on its own line: transcribe it as `### القاعدة`, exactly like `### التّدريبات`. Do not demote it to a bold line.
- The wide gap between the two hemistichs of a verse line is written with non-breaking spaces (`&nbsp;&nbsp;` or `&nbsp;&nbsp;&nbsp;`), never a run of plain spaces, which Markdown collapses.
- Rule and exercise items that open with a printed en-dash keep the literal `– ` and stay separate paragraphs; do not convert them into Markdown `- ` list items.
- This book vowels its case-endings erratically: the same word appears with and without a final kasra on one page (باللّامِ then باللّام), and words such as حسب and الثّالث carry no ending mark at all. Transcribe exactly the marks that are drawn — never supply the grammatically expected ending, and never delete an odd one.
- The book also doubles or misplaces a shadda (الشّمّس with a shadda on the م, التعّريف with the shadda on the ع, الطائفة written both with and without the shadda on the ط on the same page). These are printed and must be kept.
- A kasra under a ي cannot be told apart from that letter's own two dots at the scan density of this book, so forms like وعَيّنِ / وعَيِّنِ are not a resolvable disagreement; keep the reading you have and do not mark the word illegible.
- This book marks list items with two different glyphs — an en dash for one level and a filled round bullet • for the next. Reproduce the glyph that is printed instead of normalising both to a Markdown dash.
- Row 3 of the ياء مشدّدة table on page 47 prints the SAME words in both columns (مَرْضِيٌّ / بُحْتُرِيٌّ in أ and again in ب) because the nisba of such words is unchanged — this is printed, not a duplication slip; do not differentiate the two cells.
- The book sets the space before a comma inconsistently: the same page prints بيضاءَ ، فمن with a space and حرف واحد، ولا without one. Reproduce the spacing that is printed instead of normalising every comma to the spaced form.
- On pages where العرض : and التّحليل : both appear, both are printed in the same bold display face — mark BOTH bold; a page that bolds only التّحليل : is under-marked.
- The `| --- |` (spaced) Markdown delimiter row is the house form for tables in this book; a bare `|---|` row is the same table and is not a disagreement worth adjudicating.
- The العرض verses in the الجامد والمشتقّ chapter carry printed underlines under exactly the words the التحليل then calls «الكلماتِ الّتي تحتها خطّ» (page 62: مُفْكِرٌ، صامتٌ، قاتــلٍ، تَبَتَّــلَ، تائــبِ، مُــدْلِجٍ، ومُــؤَوِّبٍ، المُتَأَنّي، المُسْتَعْجِلِ). Wrap each underlined word in <u>…</u>; both independent reads of page 62 dropped these and left the التحليل sentence pointing at nothing.
<!-- observed:end -->
