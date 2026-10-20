# Transcription contract — sd/g12/french

You transcribe scanned textbook pages into Markdown. One input image, one output file.

Book: اللغة الفرنسية — French Language (sd curriculum, g12).
Language: fr (LTR). Terms printed in another script stay inline, in place, as printed.

## For each page N you are assigned

1. Read the image `pages/<N>.webp` (relative to the book directory). Read the image BEFORE anything else.
2. Write the transcription to the output file your caller names (normally `pages-md/<N>.md`).

## The rules

**Transcribe. Do not correct, normalize, modernize, translate or summarize.** Reproduce what is printed, including the book's own digits exactly as they appear. Do not fix the book's spelling or punctuation. Do not add explanation, notes or commentary of your own.

**Do not repair the book.** Printed books contain real errors: wrong figure numbers, reversed dates, non-standard spellings, mismatched labels. Transcribe them as printed. Cross-referencing another page to "establish" the right value is out of scope and produces a file that disagrees with the scan. If you notice an apparent error, transcribe it as printed and say so in your final status line. Never silently fix it. The cases already observed in THIS book are listed at the end of this contract — every one of them was "corrected" by a transcriber once and had to be reverted.

**Never guess.** If a word or span is genuinely illegible, write `[illegible]` in its place. If a whole page is unreadable, write `[illegible]` and nothing else. Plausible-looking invented text is the single worst failure here: it is undetectable later. Marking uncertainty is always the correct choice and is never penalised. A later pass re-reads illegible spans from a higher-resolution crop; it can only do that if you marked them.

**Reading order.** Follow the logical reading order of the page: left to right, top to bottom. On a two-column layout the left column is read fully before the right. Never interleave columns.

**Headings.** These are the book's 6 chapter titles. When a line on the page is one of them, or clearly a chapter opener, mark it `## `:

Unité 13 : C'est trop cher ! · Unité 14 : On s'habille ! · Unité 15 : Je cherche un emploi d'étudiant · Unité 16 : À la une ! · Unité 17 : Vive la Francophonie ! · Unité 18 : Bienvenue au Soudan !

Numbered section headings inside a chapter get `### `. The 38 lesson titles from the book's contents are ordinary `### ` candidates when printed as headings. Do not invent a heading for a page that has none, and do not promote a bold run-in label to a heading.

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
- Curly apostrophes (’) are printed in the unit-opener headings, the J’apprends à... boxes and the vocabulary box (C’est, d’occasion, c’est cher), while the bold exercise prompts use straight apostrophes (de l'argent, d'occasion): transcribe each as printed, never unify.
- Unit titles are printed as 'UNITÉ 13' over 'C’est trop cher !' with no colon: write the ## heading as printed (## UNITÉ 13 C’est trop cher !), not in the contract's list form with an added colon.
- The audio-track cloud icon prints a track number (e.g. 132) beside listening instructions; it is printed content, write the number on its own line before the instruction.
- Price tags in the drawings are legible on the native-density crop (the TV on page 9 reads 1000€); read them there rather than marking [illegible].
- Exercise badges (01, 02 ...) carry an audio-track number in a small cloud with a note glyph (e.g. 133, 134); transcribe that number on its own line after the exercise number — it is printed content, not furniture.
- The bold exercise instructions use a curly apostrophe (l’enregistrement) while body text uses straight ones (s'appelle, n'en); keep each as printed.
- Each exercise icon prints two numbers: the exercise number (04, 05, 06…) in the red pen circle and the audio-track number (135, 136, 137…) beside the music note in the cloud below it. Transcribe both, each on its own line, exercise number first, before the instruction.
- In the conjugation tables the book prints the stem regular and the ending bold (av**ais**, ét**ions**, fais**aient**); keep that split as **bold** on the ending only, with the bold header row and bold pronoun column, because the rule text above the table points to those endings.
- In the conjugation tables the stem is printed regular weight and the ending bold (voudr**ais**, aimer**aient**); transcribe the split bold exactly, and bold the header verbs and pronoun column as printed.
- The book prints s'il vous plait / s'il te plait without the circumflex on plait (reformed spelling) — keep it unaccented.
- The rubric banner DÉCOUVERTE (large caps in a dotted orange frame with a globe icon at the top of the page) is a section heading: write it as `### DÉCOUVERTE`, not as a plain line.
- A photo gallery in which every framed photo has its own caption printed beneath it (e.g. p. 20, the flea-market objects) is transcribed as one figure per photo, each with its printed caption as alt text plus a bold caption line, never as one uncaptioned figure with the captions turned into a label list.
- Unit opener pages print the section banner OUVERTURE in large caps inside a dotted box; transcribe it as `### OUVERTURE`.
- The unit 14 opener price tags print inconsistent spacing: -50 %, -30 %, -25 % with a space but -70% without; keep each as printed.
- The rubric banner LIRE (large caps in a dotted green frame with an open-book icon at the top of the page) is a section heading: write it as `### LIRE`, the same way as DÉCOUVERTE and OUVERTURE.
- The skill rubric banner PARLER (large caps in a dotted red frame with a lips icon at the top of the page) is a section heading: write it as `### PARLER`, like DÉCOUVERTE and OUVERTURE.
- Speech-bubble handwriting on the unit-opener cartoons uses capital-form letters mid-sentence (p. 39: 'en Panne !', 'Pour ne pas') — transcribe the capitals as drawn, do not lowercase them.
- Letters printed on objects inside a cartoon (p. 39: 'VU' on each hard hat) are figure labels and go in the label list, one bullet each.
- Red, right-aligned subtopic lines with a dotted underline (e.g. page 46 'La liaison dans l'interrogation avec inversion du sujet') are body-sized and unnumbered: write them as plain lines, not ### headings.
- The rubric banner ÉCOUTER ET COMPRENDRE (large caps in a dotted magenta frame with ear and light-bulb icons at the top of the page) is a section heading: write it as `### ÉCOUTER ET COMPRENDRE`, not as a plain line.
- p97: the LIRE questionnaire (questions with a 'Réponses' column, split by a dotted vertical rule) is a two-column table: empty header cell over the questions, 'Réponses' over the answers.
- p97: the skill banners in dotted boxes (LIRE and the like) are plain lines, not ### headings: they carry no section number and are not lesson titles.
- p97: keep the survey answers exactly as printed, including 'Oui 65 %ou Non 35 %)' with no opening parenthesis, '(Oui 12 % ou Non 78 %)' which does not add up to 100, and the stray space in '22 % )' and '16 % )'.
- A full-page divider that prints only a title in display type, such as 'Précis Grammatical' on the sun-ray divider page, counts as a chapter opener: mark the title `## `. The decorative rays and circle are not a figure and get no image reference.
- The grammar-reference pages print section titles centred in capitals inside a coloured ruled box (e.g. LIAISONS ET ENCHAÎNEMENTS, LE NOM : GENRE ET NOMBRE); transcribe each as a `### ` heading.
- The book prints the curly apostrophe ’ (l’apparition, d’une, L’article); keep ’ rather than the straight '.
- The grammar list lines open with a printed hyphen (- après les déterminants : …); escape it as \- so it stays a text line and not a Markdown bullet.
- Table header cells such as terminaison and exemples are printed in bold; keep the bold.
- In the audio-transcript appendix (around page 156), unit dividers such as 'Unité 17' are printed plain at body size, without the unit title. Write them as plain text lines, not '## ' headings. Only the full chapter opener 'Unité N : <title>' printed as a heading gets '## '.
- The 'Tableau des objectifs' opener (words centred inside a starburst of eight uncaptioned lines, followed by an 'Année 3 :' periods paragraph) is not one of the six Unité chapter titles: transcribe it as ![figure](pages/<N>.webp) with the single label bullet '- Tableau des objectifs', never as a '## ' heading.
- The bold instruction line that opens a grammar section (p. 15: 'Observe ces textes. Que remarques-tu ?') is printed in bold: write it as a **bold** paragraph, not as plain text and not as a heading.
- Exercise badges with only a pen-circle number and no audio cloud (p. 18: 13, 14) still put that number on its own line, then a blank line, then the instruction — never inline as '13 Classe ...'.
- p. 20: the body paragraph prints curly apostrophes (n’a, l’habitude, c’est, n’existe) while the orange line 'Voici des objets que l'on peut trouver…' and the photo caption 'huile d'arachide' print straight ones; keep each as printed.
- p25: the rotated cue 'Complète le tableau !' with a curved arrow pointing at the table is an instruction label: write it as a plain line, not a heading and not a standalone bold line.
- p25: the green subtitle and the exercise 04 text print the curly apostrophe (d’un, L’équipe, « l’étoile rouge »), while the serif magazine passage prints straight ones (c'est, jusqu'à, N'oubliez, l'indispensable); keep each as printed.
- On unit-opener pages the 'J’apprends à...' line is printed with a curly ’; the objectives that follow sit in separate framed boxes and are written as plain lines, not bullets.
- The pen icon beside 'Écoute et entoure...' (p. 39) prints the word 'entoure'; write it on its own line before the instruction.
- The mascot drawing beside the unit-15 title (p. 39) prints 'OFFRES D'EMPLOI' on the job board; neither read transcribed it, so check the img1 crop for it on unit openers.
- p97: the contract has two conflicting LIRE rules (general: `### LIRE`; p97-specific: plain line). Page 97 was kept as a plain `LIRE` line under the page-specific rule; settle the conflict before re-transcribing p97.
<!-- observed:end -->
