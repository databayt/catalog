# Transcription contract — sd/g12/biology

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: علم الأحياء — الصف الثالث الثانوي (Sudan national curriculum, grade 12).
Language: Arabic (RTL), with English/Latin scientific terms printed inline.
Printed book page = PDF page number − 8.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory).
2. Write the transcription to `pages-md/<N>.md`.

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.**
Reproduce what is printed, including Arabic-Indic digits (٣٤، ١٠٠٠) exactly as
they appear. Do not fix the book's spelling or punctuation. Do not add
explanation, notes or commentary of your own.

**Do not repair the book.** The book contains real typos: a body reference to
`(الصورة 51)` whose caption is `الصورة (15)`, a `(الصورة 42)` that should by
sequence be 24. Transcribe the wrong number. Cross-referencing a later page to
"establish" the right one is out of scope and produces a file that disagrees with
the scan. The same applies to spelling: the book writes `الساڤانا` with ڤ — keep
it, do not normalise to ف. If you notice an apparent error, transcribe it as
printed and say so in your final status line. Never silently fix it.

Observed 2026-09-09: a transcriber "corrected" both figure numbers above and
normalised ڤ→ف, reporting the corrections as improvements. They were reverted.

**Never guess.** If a word or span is genuinely illegible, write `[غير مقروء]`
in its place. If a whole page is unreadable, write `[غير مقروء]` and nothing
else. Plausible-looking invented Arabic is the single worst failure here: it is
undetectable later. Marking uncertainty is always the correct choice.

**Reading order.** Follow the logical Arabic reading order of the page: right to
left, top to bottom. On a two-column layout the right column is read fully before
the left. Never interleave columns.

**Headings.** These are the book's 22 chapter titles. When a line on the page is
one of them, or clearly a chapter opener, mark it `## `:

التكاثر غير الجنسي · التكاثر الجنسي · تجارب وقوانين مندل · دور الصبغيات في انتقال
الصفات الوراثية · التحورات في النسب المندلية · الأليلات المتعددة · الجينات المتعددة ·
تحديد الجنس · الوراثة المرتبطة بالجنس · الصفات الوراثية المتأثرة بالجنس · الصفات
الوراثية المقصورة على الجنس · الارتباط والعبور · الطفرات · الاختلالات الوراثية عند
الإنسان · البصمة الوراثية · الهندسة الوراثية · الاستشارة الوراثية · الدورات
البيوجيوكيميائية · عوامل توازن النظام البيئي الطبيعي واستقراره، وعوامل اختلاله ·
الموارد الطبيعية الدائمة · الموارد الطبيعية المتجددة · الموارد الطبيعية غير المتجددة

Numbered section headings inside a chapter (`٢.٧ التكاثر الجنسي في الديدان
الشريطية`) get `### `. Do not invent a heading for a page that has none.

**Tables** become real Markdown tables, with the columns in printed order
(rightmost printed column = leftmost Markdown column, so the rendered RTL table
matches the book). Never flatten a table into prose. Numbers inside tables are
the highest-value content in this book — read them carefully.

**Figures and diagrams.** Emit the image reference followed by the transcribed
caption, then transcribe every label inside the figure as a bullet list:

```
![الشكل (٥٦): تكوين الأمشاج المذكرة](pages/112.webp)

**الشكل (٥٦): تكوين الأمشاج المذكرة**

- الخلايا المولدة
- مرحلة النمو
```

Labels inside diagrams are real teaching content. A page that is nothing but a
diagram still produces a full transcription of its labels.

**Latin and scientific terms** stay inline exactly as printed, in place:
`الديدان الشريطية Cestoda Worms`, `Taenia solium`, `Proglottids`.

**Notation** uses LaTeX where the print uses super/subscripts or symbols:
`$I^A I^B$`, `$I^B i$`, `H_2O`. Genetic crosses and ratios keep their printed
form (`AB x A`, `1B : 1AB : 2A`).

**Page furniture is dropped.** Do not transcribe the running footer
(`الأحياء - ثالث ثانوي`), the page-number diamond, or decorative rules.

**Do not write a `<!-- page N -->` marker.** The assembler adds those.

**Blank or purely decorative page**: write the single line `<!-- blank -->`.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <list of page numbers or "none">`.
Do not paste any transcribed text back. It all lives in the files.

## Observed in this book (do not repair)

<!-- observed:begin -->
- Figure labels are the printed letters and words only. A diagram of a genetic cross carries bare letters (G, W, g, w); never expand them into phrases such as 'كروماتيدا الصبغي الأول: G ، W' or add positional gloss like '(تحت نقطة التصالب)' — that is interpretation, not transcription.
- When a caption is printed under a figure, emit it as a bold line directly after the image reference and before the label list, as the contract's example shows — do not move it below the labels to match the printed position.
- Captions in this book can carry doubled punctuation (page 188 prints 'الشكل (20): :ظاهرة'). Reproduce both colons; do not tidy punctuation.
- The book drops letters in some words (كرماتيدتين for كروماتيدتين, الامشاج for الأمشاج). Keep them as printed; do not restore the missing letter or hamza.
- Small labels printed inside a diagram at reduced size are often unreadable even at native crop density. Write [غير مقروء] for them rather than filling them in from what the biology implies.
- A multi-line Arabic label inside a figure is one label, not one bullet per printed line — join the wrapped lines.
<!-- observed:end -->
