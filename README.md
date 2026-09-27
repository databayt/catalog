# catalog

**An open catalog of school curricula.** Every curriculum, grade, subject, chapter and lesson is in one shape, with its question banks, exams and textbook twins. It is published to `cdn.databayt.org` for any app to use.

|           |                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------- |
| Curricula | Sudan (`sd`), British (`gb`), American (`us`), Indian CBSE (`cbse`), IB Diploma (`ib-dp`), Cambridge IGCSE (`caie-igcse`) |
| Browse    | [`curricula/index.json`](curricula/index.json) · CDN: `https://cdn.databayt.org/catalog/index.json`                       |
| Schema    | [`schema/index.ts`](schema/index.ts) (zod) → [`schema/json/`](schema/json) (JSON Schema)                                  |
| Package   | `@databayt/catalog`: key and URL builders, types, concept art                                                             |

## The one rule: the path is the key

```
curricula/sd/g12/biology/textbook.pdf      ← in this repo
catalog/sd/g12/biology/textbook.pdf        ← on the CDN
https://cdn.databayt.org/catalog/sd/g12/biology/textbook.pdf
sd-g12-biology                             ← the subject id every app keys on
```

A file's place in the repo is its CDN key, and its first three segments are its id. No override tables and no folder↔slug maps are needed.

## Layout

```
curricula/
  index.json                         generated: every curriculum → grade → subject, with counts
  <curriculum>/
    curriculum.json                  stages, and the subjects offered per grade
    <grade>/                         g1 … g12 (kg1, kg2 reserved)
      <subject>/                     an id from vocab/subjects.json (+ optional -specialized / -optional)
        structure.json               THE subject manifest: title, source, license, chapters → lessons
        textbook.md                  Markdown twin of the textbook (where transcribed)
        pages-md/<N>.md              per-page twin + _CONTRACT.md
        qbank.json   exams.json      subject-level question pool and assessments
        textbook.pdf  cover.jpg  thumbnail.jpg  banner.jpg  pages/<N>.webp   ← binaries, on the CDN
        <NN-chapter>/
          qbank.json  exams.json
          <NN-lesson>/
            qbank.json  exams.json
```

The validator allows only these files and folders.

### Naming

- Every path segment is **ASCII kebab-case**. Arabic, English and French live in `title: { ar, en, fr }`, never in a path.
- Chapter and lesson folders are **`NN-topic`**, such as `01-asexual-reproduction`. The number gives the order, and the prefix keeps them apart from `pages/`.
- Subjects come from a **controlled vocabulary** ([`vocab/subjects.json`](vocab/subjects.json)). `islamic`, `islamic-education` and `islamic-studies` are one subject: `islamic-studies`. Old names are kept as aliases.
- Curriculum ids are the lowercased DB `Curriculum.code`: `sd`, `gb`, `us`, `cbse`, `ib-dp`, `caie-igcse`.

## Binaries live on the CDN, not in git

Git holds only text: JSON and Markdown, about 12 MB. PDFs, covers and page renders (about 3 GB) live in the `databayt-cdn` bucket, and [`assets.lock.json`](assets.lock.json) pins each one by sha256. So the repo still records exactly which bytes belong where.

```bash
pnpm assets pull sd/g12/biology   # fetch binaries for one subject (public CDN, no credentials)
pnpm assets lock                  # after adding or replacing a binary, re-pin it
pnpm assets push --apply          # upload what the bucket lacks (maintainers)
```

## Working on it

```bash
pnpm install
pnpm validate          # the gate: schema, naming, vocabulary, tree shape, lockfile
pnpm index             # regenerate curricula/index.json
pnpm schema:json       # regenerate schema/json/ from schema/index.ts
pnpm publish:cdn       # dry run of the text publish (maintainers add --apply)
```

CI runs `validate`, `index --check`, `schema:json --check` and `typecheck` on every push and PR.

## Using it from an app

```ts
import { catalogKey, catalogUrl, catalogIndexUrl } from "@databayt/catalog"
import type { Structure } from "@databayt/catalog/schema"

const key = catalogKey({ curriculum: "sd", grade: "g12", subjectDir: "biology" }, "structure.json")
const structure: Structure = await fetch(catalogUrl(key)).then((r) => r.json())
```

Install from git (`"@databayt/catalog": "github:databayt/catalog"`), or just fetch `catalog/index.json` from the CDN and follow the keys. Nothing needs a database.

## Contributing

Brands, schools and publishers are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). In short, you add your publisher to `vocab/publishers.json` and open a PR against your curriculum folder. CI then tells you exactly what doesn't fit.

## License

- Tooling (`src/`, `schema/`, `scripts/`): [MIT](LICENSE).
- Content authored by contributors (structures, question banks, exams, Markdown twins): [CC BY-SA 4.0](LICENSE-CONTENT).
- Source textbooks belong to their publishers. Each `structure.json` names its publisher and license in `source`, and `LicenseRef-Publisher` means the publisher's own terms apply.
