# Transcription contract — sd/g12/biology

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: علم الأحياء — Biology (sd curriculum, g12).
Language: ar (RTL — right-to-left). Terms printed in another script stay inline, in place, as printed.
Printed book page = PDF page number − 8.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear (Arabic-Indic ٣٤، ١٠٠٠ stay Arabic-Indic; Latin digits stay Latin). Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]` in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: right to left, top to bottom. On a two-column layout the right column is read fully before the left. Never interleave columns.

**Headings.** These are the book's 22 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

التكاثر غير الجنسي · التكاثر الجنسي · تجارب وقوانين مندل · دور الصبغيات في انتقال الصفات الوراثية · التحورات في النسب المندلية · الأليلات المتعددة · الجينات المتعددة · تحديد الجنس · الوراثة المرتبطة بالجنس · الصفات الوراثية المتأثرة بالجنس · الصفات الوراثية المقصورة على الجنس · الارتباط والعبور · الطفرات · الاختلالات الوراثية عند الإنسان · البصمة الوراثية · الهندسة الوراثية · الاستشارة الوراثية · الدورات البيوجيوكيميائية · عوامل توازن النظام البيئي الطبيعي واستقراره، وعوامل اختلاله · الموارد الطبيعية الدائمة · الموارد الطبيعية المتجددة · الموارد الطبيعية غير المتجددة

Numbered section headings inside a chapter get `### `. The 51 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- Figure labels are the printed letters and words only. A diagram of a genetic cross carries bare letters (G, W, g, w); never expand them into phrases such as 'كروماتيدا الصبغي الأول: G ، W' or add positional gloss like '(تحت نقطة التصالب)' — that is interpretation, not transcription.
- When a caption is printed under a figure, emit it as a bold line directly after the image reference and before the label list, as the contract's example shows — do not move it below the labels to match the printed position.
- Captions in this book can carry doubled punctuation (page 188 prints 'الشكل (20): :ظاهرة'). Reproduce both colons; do not tidy punctuation.
- The book drops letters in some words (كرماتيدتين for كروماتيدتين, الامشاج for الأمشاج). Keep them as printed; do not restore the missing letter or hamza.
- Small labels printed inside a diagram at reduced size are often unreadable even at native crop density. Write [غير مقروء] for them rather than filling them in from what the biology implies.
- A multi-line Arabic label inside a figure is one label, not one bullet per printed line — join the wrapped lines.
- Section openers printed as standalone lines in blue bold type, such as 'ثانياً: التبرعم Budding', are numbered section headings: mark them ### rather than bold.
- Keep the book's harakat on shadda exactly as printed (ويكوِّن with kasra, البيئيَّة and فتتكوَّن with fatha). Do not drop or swap the vowel that sits on the shadda.
- Numbered sub-method lines such as '2. بالرايزوم Rhizome' are printed on their own line in larger blue bold type. They are numbered section headings and take '### ', not a bold line.
- Numbered method lines such as '3. بالكورمة Corm' and '4. بالبصلة Bulb' are printed in coloured bold on their own line. They are numbered section headings, so mark them '### ', not bold.
- Some figures (e.g. figure 9 on page 20) print an empty '( )' panel marker and leader lines that end without label text. Write the '( )' as a label bullet. Do not fill in أ/ب or label words from the caption, and do not mark the bare leader lines [غير مقروء], because nothing is printed there.
- Numbered sub-method headings printed in larger blue type on their own line (e.g. '2. بالترقيد Layering' on page 26) are section headings: mark them ### and keep the English term inline after the Arabic, as printed.
- The book prints full diacritics on some words in activity boxes (هلاَّ, خُضرِيًّا) and puts a space before ؟; reproduce the diacritics and the space as printed.
- Section numbers (e.g. 2.5, 2.6), exercise numbers (تدريب (5)) and list numbers are printed in Latin digits in this book; only the page-number mark uses Arabic-Indic digits. Do not convert them to ٢.٥ or (٥).
- Page 43 prints 'proglottid Gravid' (in that word order) jammed against الحامل with a space before the full stop ('الحاملproglottid Gravid .'); keep the spacing and word order as printed.
- Page 43 body text says (الشكل 20) directly above the figure captioned الشكل (21); do not renumber either one.
- Page 47 (taenia life-cycle figure): the larvae label is printed 'يرقات مُعلقة في البُراز' — with ع, not 'مغلفة', and ending in البُراز, not 'العشب'; do not substitute the biologically expected wording.
- Hand-lettered figure labels in this book are often unfamiliar compounds (page 52 prints الغدة followed by a single word like الجاركلوية). Never expand such a word into a textbook phrase like 'الغدة المجاورة الكلوية', and never swap in the familiar term (الحويصلة المنوية) when the label prints something else (المرسلة ...).
- Lettered sub-labels on their own line, such as 'أ) جهاز التناسل في ذكر الضفدعة:' printed in red bold, are bold lines (**...**), not #### headings. Only chapter titles (##) and numbered sections (###) are headings.
- Section numbers print as Latin digits that look reversed in the RTL line (page 52 shows '9 .2' left to right). Read them right to left as chapter.section (2.9). Do not copy the left-to-right glyph order.
- A figure label that wraps over two printed lines (page 56: 'مرفق الطرف الأمامي يشق طريقه' / 'خلال الفتحة الخيشومية') is one bullet in that figure's label list. Do not take it out of the list and write it as prose above the caption.
- Figure 30 (page 60, flower structure) prints 12 labels in a degraded dotless typeface; only متاع and العنق are readable. Do not fill the rest from biology (السداة، المتك، الخيط، الميسم، القلم، المبيض، السبلة، التويج، التخت) — write [غير مقروء] for each, one bullet per printed label.
- Page 62, figure (32): the connective-tissue label is printed 'انسيج ضام' with a leading alif; keep 'انسيج', do not correct it to 'نسيج'.
- Imperative verbs opening exercise items (اكتب، اذكر) carry a mark over the initial alef that the page render cannot resolve as damma alone (اُكتب) or hamza with damma (أُكتب); read it from a native-density crop and transcribe exactly what is drawn, without normalising to either form.
- Short red bold sub-topic labels ending in a colon (e.g. 'تركيب البذرة :' on page 85) are not chapter titles. Write them as a bold line (**...**), never as '## ', and keep the printed space and colon.
- Topic labels printed in bold blue and ending in a colon (e.g. 'أنواع المواد الغذائية المخزونة في البذرة :' and 'أولاً : الكربوهيدرات :') are not chapter titles. Do not mark them '## '; write them as bold lines.
- The book writes 'للزوبان' with ز instead of 'للذوبان'. Keep it as printed.
- Ordinal run-in labels printed in red bold at body-text size (أولاً : / ثانياً : / ثالثاً : ...) are not chapter titles: write them as a bold line (**ثانياً : الدهون :**), never as ## and never as a composed heading.
- The book prints الهيدورجين, والأوزون (النتروجين), الجزير and فيعملها (run together) on page 87 — keep them as printed.
- Lettered section lines printed in red bold, such as 'د) انتشار البذور والثمار' on page 88, are section headings: mark them ###, never ##. ## is only for the contract's 22 chapter titles.
- An unnumbered black line where only the Arabic term is bold, followed by a boxed definition (e.g. 'انتشار البذور Dispersal of seeds' on page 88), is a term label, not a heading. Write it as '**انتشار البذور** Dispersal of seeds'.
- Figure (48) on page 88 prints empty '( )' panel markers, like figure 9 on page 20. Write each one as a '( )' label bullet and do not add أ/ب. A leader line that runs into a label is not a letter: the label is 'العرق الأوسط', not 'للعرق الأوسط'.
- A coloured bold line standing alone that opens a numbered subsection (e.g. 'ثانياً: الانتشار بالرياح Dispersal by Wind') is a section heading — mark it ###, not a bold line.
- The caption of صورة (49) prints 'انتثارها' (with ث), while the body uses 'الانتشار' — keep the caption's 'انتثارها'; do not harmonise it with the body.
- Enzyme equations in this book use single-headed arrows (←) with the enzyme name printed above the arrow; write ← and never ⇌, which would claim a reversible reaction the print does not draw.
- Red unnumbered section headings inside a chapter (e.g. 'أنواع الإنبات') are ### — ## is reserved for the 22 chapter titles listed in this contract.
- One printed caption over several panels is ONE figure: page 94 prints panels (د) and (هـ) under a single caption 'الشكل (50)'; emit one image reference whose alt text is that caption, then the bold caption line, then each panel letter as a bold line followed by its labels — never one image reference per panel with the panel letter as its caption.
- The coleoptile label in this book is printed غمد الريشة, not عقد الريشة.
- Page 95 panel (د) prints the label 'سويقة فوق فلقه' in its short form (فلقه, not فلقية), unlike panel (ج) on the same page, which prints 'سويقة فوق فلقية'. Keep each one as printed.
- The book prints a space before some commas and closing brackets ('(الولادة) ،', 'التبيعة )') and sometimes runs words together ('كماينشق'). Keep the spacing as printed.
- Unnumbered bold coloured labels that end in a colon and sit on their own line above a paragraph (page 125 'إفراز الحليب :') are bold labels, not headings: write them as **label :** with the printed space before the colon, not as ###.
- Quranic verses are printed in an Uthmani mushaf font (ٱ with hamzat-wasl, open sukun ۡ, dagger alif ٰ, open tanween ٖ ٗ); transcribe them in that orthography, not in simplified modern diacritics.
- The book prints a space before ؟ and before : (e.g. 'المرأة ؟', 'سورة القيامة :') and writes shadda with its vowel (أنَّ، فإنَّ، أمَّا); keep both as printed.
- An inline verse quoted inside running prose is enclosed in plain round parentheses ( ... ) on the page, not in ornate ﴿ ﴾ brackets; only the verse number keeps its ornate marker.
- The book prints Quranic verses in Uthmani script (ٱ wasla, ۥ small waw, ٰ dagger alif, ٓ madda) with the verse-number medallion inside the closing ﴾ — transcribe that spelling as printed, do not turn it into standard spelling, and keep the number inside the brackets.
- Bold run-in labels preceded by a printed bullet dot (e.g. • طرق العدوى) are written as '- **label**', not as headings and not without the bullet.
- Count the dotted blanks in fill-in exercises (the number of 'و'-joined groups) exactly as printed; do not add an extra blank.
- Unit opener pages (e.g. 'الوحدة الثانية' followed by a large title such as 'الوراثة' and an English subtitle) carry no printed caption on their decorative diagram; the alt text is 'شكل', never a composed description such as 'رسم توضيحي لوراثة الصبغيات الجنسية'.
- Contents-table pages that continue a table from the previous page print no header row; do not compose one (such as 'الموضوع | الصفحة'). Leave the Markdown header row empty and start with the first printed row.
- Figure (3) on page 144 (Mendel's seven pea crosses) is drawn in ruled cells, but it is a cross figure, not a table. Transcribe it as a label list, row by row and right to left, with the printed × kept in each bullet (e.g. 'أحمر × أبيض' followed by the result label 'أحمر'). Never invent column headers such as 'العمود الأيمن'.
- Inheritance flow charts drawn inside a shaded box (for example Figure 6 on PDF page 150: P → gametes → F1 → F2 with arrows) are figures, not tables. Do not build a Markdown table with header words such as النسبة / الطراز الوراثي / الطراز المظهري that the print does not carry. List the printed labels.
- Phenotype labels under F2 genotypes are not uniform. Page 150 prints 'أحمر نقي' under 1 RR, without الأزهار, while its neighbours read 'أحمر الأزهار خليط' and 'أبيض الأزهار نقي'. Do not add الأزهار to make them match.
- A question box with sub-parts أ/ and ب/ restarts its numbering at 1 under each sub-part (page 190). Put the sub-part label on its own paragraph with blank lines around it so Markdown does not keep counting from the earlier list (3., 4.).
- Page 196 (printed 188) prints 'الكروماتيدتان غير الشقيقة شكل صليب' with the adjective 'الشقيقة', which does not agree in number with its noun. Transcribe 'الشقيقة' as printed; do not change it to 'الشقيقتان'.
- The book sometimes runs two words together and drops letters at the join (page 200 prints 'تصنعلخلية' for 'تصنعه الخلية'). Keep the fused form as printed; do not split it or restore the letters.
- Plain inline Latin formulas with no super/subscripts, such as '(2n= 4x)', stay plain text. Do not wrap them in $...$.
- Ordinal-numbered section lines (أولاً، ثانياً، ثالثاً، رابعاً ...) printed on their own line in the heavy display font are numbered section headings and take '### '. Lettered sub-lines such as 'أ) الإدارة غير الرشيدة للغابات', printed in the smaller body-bold weight, stay as bold lines.
- The book sometimes prints diacritics in body text, such as a damma in 'مُجتمعات' and a shadda in 'تكوّن' and 'إنّ'. Keep them as printed; do not strip them.
- Ordinal section titles such as 'ثانياً: المراعي الطبيعية' are printed in larger red bold on their own line. They are numbered section headings, so mark them '### ', not bold. The bulleted bold line that follows ('• الإدارة الرشيدة للمراعي الطبيعية') is a run-in sub-label: keep it as bold text and do not promote it to a heading.
- Figure numbers in captions can be printed with reversed digits (page 243 prints 'الصورة (31أ)' where the body and sequence give 13أ). Transcribe the caption number exactly as printed; never reconcile it with the body reference.
- Numbered flower-part lines such as '2. المتاع Pistil' (page 62) are printed on their own line in larger blue type and open a numbered subsection. Mark them '### ' with the English term inline after the Arabic, not as a bold line.
- Page 85 spells the endosperm term two ways in one paragraph: 'والاندوسيبرم' (with ي before ب) on body line 3 and 'والأندوسبيرم' on line 4. Keep each spelling as printed and do not make them match.
- Page 95, panel (د): the stem label's last word is degraded hand lettering. The page render looks like 'فلقه', but the native crop (crops/95.img3.webp) may show a ي tooth before ة ('فلقية'). It is transcribed as 'سويقة فوق [غير مقروء]' until a sharper scan settles it. Do not fill it in from panel (ج), and do not take the earlier 'فلقه' note as confirmed.
- The torn seed-coat label on page 95 panels (أ), (ب) and (ج) is legible at crop density as 'قصرة مُمزقة', with a damma on the first meem. Transcribe it, not [غير مقروء].
<!-- observed:end -->
