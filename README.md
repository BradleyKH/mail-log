# MAIL LOG

A website about MAIL LOG, the FORTRAN records-tracking program Danny Harris wrote for the Scout Project Office at NASA Langley Research Center while working for Vought Corporation's Hampton Technical Center (contract NAS1-13500). MAIL LOG was one of the first parts of SPADS, the Scout Project Automatic Data System. The site is built from his four May 1979 MAIL LOG reports, including the program's FORTRAN source listings and flowcharts, and from three July 1985 SPADS User's Operating Procedures volumes that describe SPADS as it stood in 1985, including its Contract Analysis (financial analysis) program and the MAIL LOG correspondence file. It is deployed to GitHub Pages as a static site.

## The reports

| docId | Report | NTRS | Source PDF | Pages |
|---|---|---|---|---|
| `cr-159065` | NASA CR-159065, MAIL LOG - Program Operating Instructions | [19810023338](https://ntrs.nasa.gov/citations/19810023338) | `NASA-contractor-report.pdf` | 150 |
| `cr-159063` | NASA CR-159063, MAIL LOG - Program Theory, Vol. I | [19810019287](https://ntrs.nasa.gov/citations/19810019287) | `sources/CR-159063-mail-log-program-theory-vol1.pdf` | 552 |
| `cr-159064` | NASA CR-159064, MAIL LOG - Program Theory, Vol. II | [19810019290](https://ntrs.nasa.gov/citations/19810019290) | `sources/CR-159064-mail-log-program-theory-vol2.pdf` | 535 |
| `cr-159066` | NASA CR-159066, MAIL LOG - Program Summary and Specifications | [19810019291](https://ntrs.nasa.gov/citations/19810019291) | `sources/CR-159066-mail-log-summary-and-specifications.pdf` | 126 |
| `cr-177948` | NASA CR-177948, User's Operating Procedures Vol. I, Scout Project Information Programs (July 1985) | [19850026205](https://ntrs.nasa.gov/citations/19850026205) | `sources/CR-177948-spads-vol1-scout-project-information-programs.pdf` | 273 |
| `cr-177949` | NASA CR-177949, User's Operating Procedures Vol. II, Scout Project Financial Analysis Program (July 1985) | [19850026206](https://ntrs.nasa.gov/citations/19850026206) | `sources/CR-177949-spads-vol2-scout-project-financial-analysis.pdf` | 173 |
| `cr-177950` | NASA CR-177950, User's Operating Procedures Vol. III, Projects Directorate Information Programs (July 1985) | [19850026207](https://ntrs.nasa.gov/citations/19850026207) | `sources/CR-177950-spads-vol3-projects-directorate-information-programs.pdf` | 241 |

The 1985 volumes are cited by report number, and the site does not credit them to an individual author.

`sources/TM-X-72628-scout-program-final-report-phases-iv-v.pdf` is reference material only. Like every other PDF in `sources/` that is not in the table above, it never appears in the site, its content files, or its search index. The `sources/` folder is gitignored, so the PDFs stay local; the committed record of the reports is `content/`.

## Transcriptions of the 1985 Vol. II appendices

`sources/CR-177949-spads-vol2-scout-project-financial-analysis.ai/` holds 39 AI transcriptions, one `page-NNN.md` per appendix printout page of Vol. II (PDF pages 119 to 132, the even pages 134 to 160 and 161 to 170, and 172). Each file has YAML frontmatter (`pdfPage`, `appendix`, `title`, `source: ai`, `printouts`, `rotation`, `illegible`, and a `checks` list whose entries are `pass`, `fail`, or `n/a` against the printout's own totals) followed by fenced `text` blocks that reproduce the printout. A failed check means the printed figures do not reconcile; the transcription keeps them as printed.

Each transcription becomes `content/docs/cr-177949/overrides/page-NNN.md`, with the page-file frontmatter the content schema requires (`source: ai`, `folio`, `sectionId`, `kind`, `figures`, `confidence`). The import copies the override in place of the OCR-generated page, the same way it handles reviewed overrides. The site and the validator never read the `.ai/` folder itself.

## OCR

`ocr.sh` makes a deterministic Tesseract transcript of a scanned report: the same PDF with the same poppler and Tesseract versions gives byte-identical output.

```bash
bash ocr.sh                      # NASA-contractor-report.pdf
bash ocr.sh sources/CR-159063-mail-log-program-theory-vol1.pdf
PSM=6 bash ocr.sh sources/CR-159064-mail-log-program-theory-vol2.pdf   # program listings
TSV=1 bash ocr.sh sources/CR-177949-spads-vol2-scout-project-financial-analysis.pdf   # word confidence and boxes only
```

Each run writes `<stem>.md` beside the PDF (one fenced `## Page N` section per page; `PSM=6` writes `<stem>.psm6.md`), with 300 DPI page renders in `build/<stem>/pages/` and per-page text in `build/<stem>/text/` (or `text-psm6/`). `PSM=6` treats each page as one block, which keeps each listing line's sequence number on the same line as its code. `TSV=1` writes per-word confidence and bounding boxes to `build/<stem>/tsv/` (or `tsv-psm6/`) and skips the text outputs. The header comment in `ocr.sh` documents every mode. Raw transcripts are never edited by hand; corrections go into the site content as reviewed or AI-transcribed pages.

`scripts/derive-scans.sh [-j JOBS]` turns the page renders in `build/` into WebP page scans (full and thumbnail) under `site/public/scans/<docId>/` for all seven reports. It needs `pdftoppm` and Python with Pillow, and skips outputs that are already current.

## Content

All site content lives in `content/` and is described in [`content/README.md`](content/README.md): per-report metadata, one Markdown file per page, report structure (sections, figures, glossary), the program's step logic, field layouts, sample records, the code index, and the SPADS data for the 1985 volumes. Page files under `content/docs/<docId>/pages/` are generated by script and never edited by hand; reviewed corrections and AI transcriptions go in `content/docs/<docId>/overrides/`.

```bash
pnpm --filter site content:import   # rebuilds docs/<docId>/pages/ from build/ (needs the OCR outputs)
pnpm --filter site code-index       # rebuilds content/code/ from the cr-159064 listing pages
```

## Site

The site is a Vite + React + TypeScript single-page app in `site/`, using React Router, Tailwind CSS 4 with shadcn/ui, three.js, MiniSearch, and Shiki. It is a pnpm workspace; use Node 24.

```bash
pnpm install
pnpm --filter site dev          # http://localhost:5173
pnpm --filter site build        # site/dist, with 404.html for deep links on GitHub Pages
pnpm --filter site test         # Vitest unit tests
pnpm --filter site test:e2e     # Playwright against a production build served on port 5180 (E2E_DEV=1 uses the dev server instead)
```

`BASE_PATH` sets the URL prefix the site is served under (default `/`). In Git Bash, disable path conversion so the value is not rewritten into a Windows path:

```bash
MSYS_NO_PATHCONV=1 BASE_PATH=/maillog/ pnpm --filter site build
```

The site loads only the seven reports above; a build fails if `content/docs/` holds any other report. `content:import` and `code-index` finish by clearing Vitest's module cache, because Vitest can otherwise keep a `load.ts` transform made while pages were missing; don't run the tests while either one is writing.

## Validation

```bash
pnpm --filter site validate            # missing content is a warning
pnpm --filter site validate --strict   # warnings are errors (used by the deploy workflow)
```

The validator checks every content file against its schema, including each `content/spads/*.json` file that exists; that flow branches and `next` steps resolve; that figure and section references exist; that each report has pages 001 to its page count; that override pages carry `source: reviewed` or `source: ai` (never `ocr`); and that listing sequence numbers increase within each routine across pages (gaps warn, decreases fail). Set `NAME_DENYLIST` to a comma-separated list of names to fail validation if any content file contains one of them; the check is skipped when it is unset, and the output reports matches by index, never by name. The 1985 volumes' page transcriptions (`pages/` and `overrides/` under `content/docs/cr-177948/`, `cr-177949/`, and `cr-177950/`) are exempt from the denylist because they reproduce printed names; every other file under `content/` is checked, and `fixtures/` is skipped. `--root <dir>` validates another content tree, such as one under `content/fixtures/`.

## Deploy

`.github/workflows/deploy.yml` runs on pushes to `main` and on manual dispatch: it installs with the frozen lockfile, validates strictly (with `NAME_DENYLIST` from an optional repository secret), runs the unit tests, builds with `BASE_PATH=/<repository name>/`, and deploys `site/dist` to GitHub Pages. Pages must be enabled for the repository with GitHub Actions as the source.
