# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static site about MAIL LOG, a 1979 FORTRAN records-tracking program from NASA Langley's Scout Project Office, and SPADS, the Scout Project Automatic Data System it became part of. It is built from seven scanned NASA contractor reports: the four May 1979 MAIL LOG reports (`cr-159065`, `cr-159063`, `cr-159064`, `cr-159066`) and the three July 1985 SPADS User's Operating Procedures volumes (`cr-177948`, `cr-177949`, `cr-177950`). `README.md` has the report table and full command reference; `content/README.md` is the authoritative description of every content file's shape. Read both before changing content or its schemas.

The pipeline runs in three stages, each feeding the next:

1. **OCR** (`ocr.sh`, Tesseract + poppler): scanned PDF to `build/<stem>/{pages,text,text-psm6,tsv,tsv-psm6}/`. Deterministic; `build/` is gitignored. `scripts/derive-scans.sh` turns the page renders into WebP scans under `site/public/scans/<docId>/`.
2. **Import** (`site/scripts/content/import.ts`): `build/` OCR to `content/docs/<docId>/pages/page-NNN.md`, `cr-159063/flowcharts.json`, and `content/reports/{flags,listing-repairs}.json`. Pure function of `build/` + `content/`; byte-identical output. Overrides in `content/docs/<docId>/overrides/` are copied in place of the generated page.
3. **Code index** (`site/scripts/build-code-index.ts`): `cr-159064` listing pages to `content/code/{index.json,xref.json,routines/*}`.

The site (`site/`, Vite + React 19 + React Router + Tailwind 4/shadcn) imports `content/` through the `@content` alias (`site/src/content/load.ts`, schemas in `site/src/content/schema.ts`, zod). The search index is computed in Node at build time by a Vite plugin (`virtual:search-index` in `site/vite.config.ts`, from `site/scripts/search/searchIndex.ts`).

## Commands

Run from the repo root; Node 24, pnpm.

```bash
pnpm install
pnpm --filter site dev                 # http://localhost:5173
pnpm --filter site build               # tsc -b + vite build; also writes dist/404.html
pnpm --filter site typecheck
pnpm --filter site test                # Vitest (src/**/*.test.ts[x], scripts/**/*.test.ts)
pnpm --filter site exec vitest run src/terminal/engine.test.ts      # one test file
pnpm --filter site exec vitest run -t "name of test"                # by test name
pnpm --filter site test:e2e            # Playwright, light + dark projects, own server on 5180
pnpm --filter site exec playwright test e2e/terminal.spec.ts        # one spec
pnpm --filter site validate [--strict] # content validator; deploy uses --strict
pnpm --filter site content:import      # regenerate pages/ from build/ (needs OCR outputs)
pnpm --filter site code-index          # regenerate content/code/ from cr-159064 pages
```

In Git Bash, set `MSYS_NO_PATHCONV=1` before `BASE_PATH=/maillog/ ...` so the path isn't rewritten. `E2E_BASE_PATH=/maillog/` (after a build with the same `BASE_PATH`) adds a `base-path` Playwright project that runs the deep-link specs against `dist/` served like GitHub Pages.

Deploy is `.github/workflows/deploy.yml`: strict validate, unit tests, build, GitHub Pages. There is no lint step.

## Rules that aren't obvious from the code

- **Generated files are never hand-edited:** `content/docs/*/pages/`, `cr-159063/flowcharts.json`, `content/code/index.json`, `xref.json`, `routines/*`, `content/reports/flags.json`, `listing-repairs.json`, and the raw OCR `*.md` transcripts beside the PDFs. Corrections go in `overrides/page-NNN.md` (with `source: reviewed`, or `source: ai` for AI transcriptions), then rerun `content:import` and `code-index`, then `validate`.
- **Only the seven reports ship.** A Vite plugin fails the build, and the validator fails, if `content/docs/` holds any other docId (`DOC_IDS` in `schema.ts`). Other PDFs in `sources/` (TM-X-72628) are reference only and must not reach the site, content files, or search index.
- **Names in site text.** The site credits only Danny K. Harris. No other family member's name belongs in app copy, headings, metadata, or authored data files, and the family history behind the project is kept outside the repo. The validator's `NAME_DENYLIST` env var (a deploy secret) enforces this; never print the matched names. The 1985 volumes' page transcriptions (`pages/` and `overrides/` under `cr-177948`, `cr-177949`, `cr-177950`) are exempt because they reproduce printed names; nothing authored may quote them.
- **Listing identity.** Routines are identified by appendix plus name (`TINPUT@C`, `OPEN@F-PHASE1`); line ids are sequence number plus ordinal (`0795.2`) because `$INSERT` repeats sequence numbers. See `content/README.md` before touching listing parsing or the code index.
- `content/reports/known-gaps.json` allowlists specific validator warnings under `--strict`; errors are never suppressed.

## Site layout

- `site/src/routes/<area>/`: one folder per route (home, about, archive, terminal, code, map, glossary, spads); routes are lazy-loaded in `site/src/routes.tsx`.
- `site/src/terminal/`: a pure engine that replays the program's interactive flows (`content/program/flows/*.json`) as a simulated terminal. Behavior the flow JSON can't express lives in per-step hooks under `terminal/hooks/` (keyed by record type and step number, plus `common`).
- `site/src/spads/`: the 1985 SPADS simulation, built from `content/spads/*.json`; `terminal/` is its session engine (menus, updates, retrievals, report spooling) and `finance/` computes the Contract Analysis spreads and reports.
- `site/src/routes/map/`: three.js / react-three-fiber call-graph view with a 2D fallback.
- `site/src/components/ui/` is shadcn-generated; leave its files in generated shape.
- `site/public/scans/` (about 160 MB of WebP) is produced by `scripts/derive-scans.sh`, which needs `pdftoppm` and Python with Pillow.

`scout-print/` is an unrelated 3D-printable Scout G-1 model (Python, manifold3d); see its README.
