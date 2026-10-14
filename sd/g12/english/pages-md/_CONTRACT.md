# Transcription contract — sd/g12/english

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: English Language — English Language (sd curriculum, g12).
Language: en (LTR). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear. Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[illegible]` in its place. If a whole page is unreadable, write `[illegible]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: left to right, top to bottom. On a two-column layout the left column is read fully before the right. Never interleave columns.

**Headings.** These are the book's 10 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

Trees · Young People Today · Doing the Right Thing · Education · Women's Participation: Life-line for Development · Food and Nutrition · Development · A World of Difference · Agatha Christie · Science in Action

Numbered section headings inside a chapter get `### `. The 40 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

**Tables** become real Markdown tables, with the columns in printed order. Never flatten a table into prose. Numbers inside tables are the highest-value content — read them carefully. **A table is a ruled or shaded grid only.** A cross, a flow chart, a genetics diagram, a labelled drawing or any arrangement of labels joined by arrows is a FIGURE, not a table: transcribe its labels as a list (below), never as a Markdown table. Every table row must have the same number of cells.

**`[غير مقروء]` means ink you cannot read — NOT "nothing is printed".** The two are different findings. If the page prints nothing where a symbol is expected — a limit under an operator, an exponent, an integral sign — transcribe nothing and REPORT a print omission. A false illegible marker is worse than none: it sends adjudication hunting for glyphs that do not exist, and it hides a real defect in the book behind a transcription caveat.

**Do not restore what the page omits.** These books routinely drop an integral sign, an exponent, a minus, a closing bracket or the constant factor their own substitution introduced. The arithmetic "obviously" demanding the missing symbol is exactly the trap: transcribe what is drawn and report it. Equally, never reconcile a worked solution against the expression it restates, a figure caption against the body reference that points at it, or one cell of a table against its neighbours.

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

### latin-language

- Pages read left to right, top to bottom; on two columns the left column is read fully first. Arabic glosses or instructions printed inside the page stay inline, in place, in their own script — never translated or moved to the end. *(seed: not yet observed in a transcribed book)*
- Keep the book's own spelling variety (British or American), accents and diacritics (é, à, ç, ï), apostrophes, quotation marks (" " ‘ ’ « ») and the spacing before French ; : ! ? exactly as printed. Never correct grammar, spelling or a missing accent in a reading passage or exercise. *(seed: not yet observed in a transcribed book)*
- Fill-in blanks are written as printed — a run of underscores (escaped \_ so Markdown keeps them) or dots, roughly the printed length — and are never filled in. Answer options (a) b) c)) and dialogue speaker labels keep their printed form and are not converted to Markdown list syntax. *(seed: not yet observed in a transcribed book)*

## Independence

When your caller says the read is independent (an audit read, a benchmark run, or an adjudication), you must not open any earlier transcription of the page — not `pages-md/<N>.md`, not `pages-md-audit/`, not `gold/`, not `textbook.md`. Reading them turns a measurement into a copy. The image and this contract are your only inputs.

## When you finish

Reply with ONE line only: `done <first>-<last>, <count> files, illegible: <page list or "none">, printed-errors: <page: what, or "none">`. Do not paste any transcribed text back. It all lives in the files.

## Observed in this book (do not repair)

Each line names a real case a transcriber once "fixed". Transcribe these exactly as printed.

<!-- observed:begin -->
- The boxed cartoon icon beside '① Working with words' (a head with scattered letters such as S, R, B, G, L, K, Z) is a recurring decorative section icon: emit ![figure](pages/<N>.webp) with no bullet list, because its letters are drawing, not labels.
- 'SECTION n: ...' lines (e.g. SECTION 2: EXPLORING LANGUAGE) are numbered section headings inside a chapter and take '### ', never '## '.
- Drawn illustrations sometimes show a book or poster with scribbled cover art (e.g. the person reading on the page printed as 11). That art is part of the drawing, not a label: emit `![figure](...)` with no label bullets and never put an [illegible] label there.
- Vocabulary exercises that refer to 'the words which are underlined' print those words underlined; mark each with <u>…</u> exactly over the underlined span (e.g. 'much <u>physical effort</u>', '<u>Rules of the road</u>').
- Page 29 item 1 prints 'disadvantages o a) bicycles' with 'of' truncated to 'o' — keep 'o', do not restore 'of'.
- The Grammar Corner badge beside each Grammar Corner heading prints the words GRAMMAR (top edge and left edge) and CORNER (right edge and bottom edge); list each printed word as its own label (GRAMMAR, CORNER, GRAMMAR, CORNER) and do not merge them into one composed 'GRAMMAR CORNER' label.
- Timelines printed under picture pairs as a bold dotted arrow chain between two labels (1985 ... NOW, 2 PM ... 3PM) are written as one bullet under the figure with a single → between the printed labels, keeping the printed spacing ('2 PM' but '3PM'); never reproduce the arrow run as a counted string of arrows.
- Small uncaptioned drawings set beside a body paragraph (e.g. the farmer drawing at the top of page 36) are figures: emit ![figure](pages/<N>.webp) for each one, before the paragraph when the drawing sits in the left column.
- Page 48 (printed 43): the cartoon beside exercise 3 has no caption, so its alt text is figure; its letters are drawn into the artwork. List them as separate labels (K and W are two separate drawn capitals, not 'Kw'). The first letter of the top pair is a round letterform with a face inside, and the scan cannot tell g from O, so it stays [illegible]h.
- The square 'GRAMMAR CORNER' badge printed beside Grammar Corner headings is a decorative section logo (an empty frame whose border spells GRAMMAR / CORNER). Drop it as page furniture: no image reference and no label list.
- A Grammar Corner title printed with a circled number and underlined (e.g. '② Grammar Corner: Comparing things') is a numbered section heading. Write it as '### ', not as bold.
- The boxed, centred 'Brain Teasers' display title that opens a puzzle page is an exercise-set title: mark it `### Brain Teasers`, not a plain line.
- Numbered section titles printed bold and underlined with a circled digit (e.g. ② The Sweet Smell of Success) are ### headings; keep the circled digit as printed.
- Circled-number activity labels such as '③ Over to you' and display lines such as 'SECTION 4: SPINE CHALLENGE' carry section numbering and take `### `.
- Small uncaptioned clip-art (e.g. a hand writing beside an 'Over to you' task) is still a figure: emit `![figure](pages/<N>.webp)` with no caption line and no labels.
- Exercise section titles printed bold and underlined with a circled number (② Step by Step, ③ Over to you) are numbered section headings: write them as `### ② Step by Step`, keeping the circled digit.
- The recurring boxed 'Grammar Corner' logo prints four separate words around its frame (GRAMMAR top, GRAMMAR left side, CORNER right side, CORNER bottom): list each printed word as its own label bullet, not one merged 'GRAMMAR CORNER' label.
- The cartoon-head icon beside '① Working with Words' carries hand-drawn letters (S, R, B, L, G, S, H, K, Z and one G/Q-like glyph): transcribe them as single-letter bullets under ![figure](pages/<N>.webp), marking only an unsettleable glyph [illegible], never the whole icon.
- 'SECTION 3: EXPLORING LANGUAGE' (bold, underlined capitals on its own line) is a numbered section heading: write it as ### SECTION 3: EXPLORING LANGUAGE.
- p.161 (file 166) D.1 prints 'Give reasons for you answer' — keep 'you', do not correct to 'your'.
- A single framed box that holds a row of prompt words (e.g. 'How? When? How often?' on page 168) has no internal rules and is not a table: write the words on one plain line in printed order, not as a header-only Markdown table.
- Writing-section openers such as 'SECTION 4: WRITING: ARGUMENTATIVE' and circled-number activity lines such as '① Read this!' take `### `; a centred bold passage title without numbering (e.g. 'POWER TO THE PEOPLE!') is not promoted to a heading.
<!-- observed:end -->
