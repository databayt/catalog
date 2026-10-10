# Transcription contract — sd/g12/arabic-rhetoric

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: البلاغة والتعبير — Rhetoric and Expression (sd curriculum, g12).
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

الباب الأول: مراجعة علم البيان · الباب الثاني: علم المعاني · الباب الثالث: علم البديع · الباب الرابع: مختارات

Numbered section headings inside a chapter get `### `. The 24 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- On the imprint/credits page the bold labels (التنقيح، الإخراج الفني والتصميم، تصميم الغلاف، الجمع بالحاسوب) are bold lines, not headings: write them as **bold** lines, never ### — the contract heading levels are reserved for the 4 chapter titles and numbered/lesson section headings.
- Two-column credit and name lists in this book carry no printed bullet marker: transcribe each entry as a plain line pairing the right-column name with its left-column affiliation using an em dash, not as a Markdown bullet list and never as a table (no rules or shading are printed).
- In the imprint الإخراج الفني والتصميم / تصميم الغلاف band the book prints one more affiliation line (المركز القومي للمناهج والبحث التربوي) than there are names — keep the extra standalone line, do not drop it to make the pairing come out even.
- Verse pages in this book print footnote markers as a raised Arabic-Indic digit inside round brackets — ( ١ ) after بِقِيعَةٍ, ( ٢ ) after حُلُولا — and repeat the same raised digit before each note under the rule at the foot of the page. The digit is small but legible in the native-density crops: read it there rather than writing [غير مقروء].
- Section labels such as أولاً : and أ) التّشبيه وأنواعه : are printed bold on their own lines at the right margin but at body size; only the centred, larger bold line (e.g. مراجعةُ علم البيان) is a heading. Transcribe the أولاً / أ) labels as ordinary paragraph lines.
- Hemistichs of a بيت are separated on one Markdown line by a run of &nbsp; entities; the number of entities is a layout choice, not printed content, so it is never a disagreement worth adjudicating.
- Lettered sub-section labels such as أ) التّشبيه وأنواعه : and ب) التّشبيهُ البليغُ : are printed bold at body size, not as headings — transcribe them as plain paragraphs, never as ###.
- Footnote calls are superscript Arabic-Indic numerals in parentheses and their spacing is inconsistent on the same page — ( ١ ) and ( ٣ ) are spaced while (٢) is closed up against the preceding word. Reproduce each call spacing as printed; do not normalise them.
- The printed page number in the footer does not match the image index (image pages/8.webp carries the printed folio ٢). The footer is page furniture and is dropped — do not renumber anything to match it.
- The gap between the two hemistichs of a verse is written as three &nbsp; entities in this book transcriptions.
- In the تدريبات the example verses and آيات are set in a heavier face and individual words are underlined (عليلٌ، سَهَرٌ، يَدْعُوٓاْ on page 28) — the underline is the teaching mark that points at the محذوف. Transcribe it as <u>…</u> in place; do not replace it with ** bold and do not bold the whole line.
- Quranic references are printed surah-name (or الآية) then colon then numeral: transcribe them as (مريم الآية :٤٦) and (سبأ :٣٢) — the colon goes before the numeral in the file, never after it.
- Do not insert &nbsp; entities for the wide gaps between hemistichs or before a verse reference; a single ordinary space is the transcription.
- Poetry lines are set in heavier display type in this book; transcribe them as plain text without ** ** emphasis.
- Quranic quotations carry small waqf marks above the line (ۖ / ۚ / ۗ) that the scans do not resolve; leave them out rather than guessing which mark is printed.
- Qur’anic quotations in this book are set in Uthmani script with their waqf marks (ۚ) and the circular end-of-āyah ornament; transcribe the marks that are printed and do not drop them, and write the ornament as ۝ without inventing the number inside it.
- Printed dashes that open an example line (– قال تعالى) and the dashes numbering table rows (١–) are kept as text with an en dash, not converted into Markdown bullets or ASCII hyphens.
- Elongated kashidas (بــ) are justification artefacts in this book: write the word with a single tatweel (بـ), not a doubled one.
- Qur’anic quotations in this book are set in Uthmani orthography — keep ءَامَنُواْ, مَعَهُۥ, لَفِى, ٱلصَّٰلِحَٰتِ, أَلَآ as printed and do not normalise them to plain Arabic spelling.
- The numbered circle that closes a Qur’anic verse in this book is an end-of-ayah rosette: transcribe it ۝, never ۞ (rub el hizb).
- Lines of poetry are printed in bold in this book — mark them bold, with the two hemistichs on one line separated by spacing filler.
- Body lines that open with a printed dash (–) are transcribed as paragraphs beginning with that dash, not as Markdown bullets.
- In the جناس/تورية comparison table the book spells the verb حكي with a final ya (حكي الشّاعر ... بصوتٍ حكي الموسيقا) even though its own body paragraph writes حكى — keep both forms as printed; do not normalise to حكى and do not add a ي to make يحكي.
- Verse lines that the book sets in bold (e.g. فقالتْ رُحْ بِرَبِّكَ مِن أمامي) are transcribed with ** ** and the gap between hemistichs as plain spaces — never as &nbsp; entities.
- The long dash the book uses as an item marker before قال الشاعر is transcribed as – (en dash), not an ASCII hyphen.
- Verse pages set the two hemistichs of a line side by side; separate them with plain spaces and never with HTML such as &nbsp; or <sup> — no markup is printed in this book.
- Footnote reference marks are printed as raised Arabic-Indic digits in parentheses attached to the last word of the line, e.g. وَدَدا(١); transcribe them inline exactly like that, and give the footnote itself at the foot of the page as ( ١ ) ... with the spaces the print shows inside the parentheses.
- On the imprint/credits page the bold labels (التنقيح، الإخراج الفني والتصميم، تصميم الغلاف، الجمع بالحاسوب) are bold lines, not headings: write them as **bold** lines, never `###` — the contract's heading levels are reserved for the 4 chapter titles and numbered/lesson section headings.
- In the imprint's الإخراج الفني والتصميم / تصميم الغلاف band the book prints one more affiliation line (المركز القومي للمناهج والبحث التربوي) than there are names — keep the extra standalone line, do not drop it to make the pairing come out even.
- Lettered sub-section labels such as أ) التّشبيه وأنواعه : and ب) التّشبيهُ البليغُ : are printed bold at body size, not as headings — transcribe them as plain paragraphs, never as ### .
- Footnote calls are superscript Arabic-Indic numerals in parentheses and their spacing is inconsistent on the same page — ( ١ ) and ( ٣ ) are spaced while (٢) is closed up against the preceding word. Reproduce each call's spacing as printed; do not normalise them.
- The gap between the two hemistichs of a verse is written as three &nbsp; entities in this book's transcriptions.
- Qur'anic quotations in this book are set in Uthmani script with their waqf marks (ۚ) and the circular end-of-āyah ornament; transcribe the marks that are printed and do not drop them, and write the ornament as ۝ without inventing the number inside it.
- Qur'anic quotations in this book are set in Uthmani orthography — keep ءَامَنُواْ, مَعَهُۥ, لَفِى, ٱلصَّٰلِحَٰتِ, أَلَآ as printed and do not normalise them to plain Arabic spelling.
- The numbered circle that closes a Qur'anic verse in this book is an end-of-ayah rosette: transcribe it ۝, never ۞ (rub el hizb).
- The contract's observed section currently contradicts itself about poetry: one line says verse is 'heavier display type … transcribe as plain text without ** **', two later lines say verse is bold and must carry ** **. Page 42 was settled as bold (the print is visibly heavier than body text) — drop the plain-text line so the next transcriber is not sent both ways.
- Harakāt in this book's scans are at the edge of resolution: two independent reads will always disagree on individual fathas, dammas and shaddas inside words that are otherwise fully legible (page 42: الأرضُ/الأرضَ، صيّنٌ/صَيِّنٌ، عورات/عوراتٌ). Those spans are not adjudicable from the scan and must NOT be marked [غير مقروء] — that marker is reserved for ink that cannot be read at all. Keep the incumbent read.
- The المقدم column of a تدريبات answer table is set unvocalised even when the word it quotes carries tanwin in the āyah above it (page 42 prints أراغب in the cell and أَرَاغِبٌ in the verse) — transcribe the cell as printed, do not carry the vowels down from the quotation.
- Waqf marks in this book are printed but illegible in kind: the scan shows that a mark sits above the line (after يَـٰإِبْرَٰهِيمُ and after جَآءَكُم on page 42) without showing which of ۖ ۚ ۗ it is. Leave the mark out and do not choose one; its presence alone is not enough to transcribe it.
- A Qur'anic quotation in the تدريبات is followed by a printed full stop after the closing ornament bracket and before the reference — ﴾ . (سبأ :٣٢) — keep the period; it is printed, not editorial.
- Exercise-series labels (الأوّل : on p48, الثّاني : on p49) are printed bold at body size at the right margin but are transcribed as plain paragraph lines — no ** ** and no ### — matching the أولاً / أ) rule already in this contract.
- Imperative verbs opening an exercise instruction carry a printed sukun (وضّحْ) that the full-page render loses; read it from the native-density crop rather than dropping it.
- The space padding around the colon inside a reference — (هود : ٨٨) against (هود: ٨٨) — is below the resolution of these scans; keep the spacing already in the file and do not re-adjudicate it.
- The book sets tanwin as a detached mark a space away from its word (معناها جار ٍ on page 73, meaning جارٍ): it is printed ink, not a scan speck — attach it to the word rather than dropping it.
- Diacritics in this book are shadda-only where a shadda is printed (الرّابع، التّورية، التّامّ): do not add a fatha that is not drawn.
<!-- observed:end -->
