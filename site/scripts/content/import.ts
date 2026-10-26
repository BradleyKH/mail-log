import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { DOC_IDS, docMetaSchema, figuresSchema, parsePageFile, sectionsSchema } from "../../src/content/schema.ts";
import type { DocMeta, Figure, PageFrontmatter, Section } from "../../src/content/types.ts";
import { buildFlowchartIndex, type FlowchartIndex } from "./flowcharts.ts";
import { analyzeListingPage, type LineRepair, type ListingPage } from "./listing.ts";
import { classifyProse, detectFolio, normalizeProse, wordStats } from "./prose.ts";
import { snapJoint } from "./routines.ts";
import { loadKnownRoutines, OcrSource, pad3 } from "./sources.ts";
import { meanConf, round1 } from "./tsv.ts";

/**
 * Rebuilds every content/docs/<docId>/pages/page-NNN.md from the OCR under build/, plus
 * cr-159063's flowcharts.json and the review reports under content/reports/. Pure function
 * of its inputs: the same build/ and content/ trees always give byte-identical output.
 */

export const PROSE_FLAG_THRESHOLD = 70;
/** Mixed pages are partly figure, so their word confidence runs lower without the text being worse. */
export const MIXED_FLAG_THRESHOLD = 60;
/** A listing page is flagged when at least this many of its lines failed to repair, or on any sequence problem. */
export const LISTING_LINE_FLAG_THRESHOLD = 5;

const VOL2_APPENDICES: { appendix: string; from: number; to: number; numbered: boolean; main: string | null }[] = [
  { appendix: "B", from: 15, to: 227, numbered: true, main: "MAIN" },
  { appendix: "C", from: 228, to: 325, numbered: true, main: "MAIN" },
  { appendix: "D", from: 326, to: 511, numbered: true, main: "MAIN" },
  { appendix: "E", from: 512, to: 517, numbered: false, main: null },
  { appendix: "F", from: 518, to: 535, numbered: false, main: null },
];
const FLOWCHART_SHEETS = (n: number) => (n >= 56 && n <= 69) || (n >= 71 && n <= 513);

export interface FlagEntry {
  pdfPage: number;
  kind: PageFrontmatter["kind"];
  confidence: number;
  reasons: string[];
}

export interface ImportSummary {
  docs: Record<string, { pages: number; reviewed: number; ai: number; kinds: Record<string, number>; flagged: number }>;
  flowchartFigures: number;
  flowchartMisses: number;
}

export interface ImportOptions {
  contentDir: string;
  buildDir: string;
}

function readJsonIf<T>(file: string, parse: (raw: unknown) => T): T | null {
  if (!existsSync(file)) return null;
  try {
    return parse(JSON.parse(readFileSync(file, "utf8")));
  } catch {
    return null;
  }
}

export function serializePage(fm: PageFrontmatter, body: string): string {
  const q = (s: string | null) => (s === null ? "null" : JSON.stringify(s));
  const lines = [
    "---",
    `pdfPage: ${fm.pdfPage}`,
    `folio: ${q(fm.folio)}`,
    `sectionId: ${q(fm.sectionId)}`,
    `kind: ${fm.kind}`,
    `source: ${fm.source}`,
    `confidence: ${fm.confidence}`,
    `figures: ${JSON.stringify(fm.figures)}`,
  ];
  if (fm.listing) {
    lines.push("listing:", `  appendix: ${q(fm.listing.appendix)}`, `  routines: ${JSON.stringify(fm.listing.routines)}`, `  listingPage: ${fm.listing.listingPage ?? "null"}`);
  }
  lines.push("---", "");
  const text = body.trim() === "" ? "" : body.replace(/\s+$/, "") + "\n";
  return lines.join("\n") + text;
}

export function sectionFor(sections: Section[] | null, n: number): string | null {
  if (!sections) return null;
  let id: string | null = null;
  let at = -1;
  for (const s of sections) {
    if (s.pdfPage <= n && s.pdfPage >= at) {
      id = s.id;
      at = s.pdfPage;
    }
  }
  return id;
}

const fence = (lang: string, lines: string[]) => ["```" + lang, ...lines, "```"].join("\n");

interface RoutineState {
  current: string | null;
}

/** Decides which routines a listing page holds, carrying the current routine across pages. */
export function routinesForPage(page: ListingPage, state: RoutineState, known: readonly string[]): string[] {
  const declared = page.declared.map((d, i) =>
    i === 0 && page.headerRaw ? (snapJoint([page.declaredRaw[0], page.headerRaw], known) ?? d) : d,
  );
  if (page.type === "xref") {
    const r = page.headerRoutine ?? state.current;
    state.current = r;
    return r ? [r] : [];
  }
  if (declared.length === 0) {
    if (page.headerRoutine && page.headerRoutine !== state.current && state.current !== null) {
      // The compiler header names the routine whose code is on the page; trust it when the
      // SUBROUTINE statement itself was unreadable.
      state.current = page.headerRoutine;
    } else if (state.current === null) state.current = page.headerRoutine;
    return state.current ? [state.current] : [];
  }
  const out = page.endBeforeFirstDeclared && state.current ? [state.current, ...declared] : [...declared];
  state.current = declared[declared.length - 1];
  return [...new Set(out)];
}

function lastSeqOf(body: string): number | null {
  const m = [...body.matchAll(/^\((\d{4})\)/gm)];
  return m.length > 0 ? Number(m[m.length - 1][1]) : null;
}

export function runImport(opts: ImportOptions): ImportSummary {
  const { contentDir, buildDir } = opts;
  const known = loadKnownRoutines(buildDir);
  const flags: Record<string, FlagEntry[]> = {};
  const repairs: Record<string, Record<string, LineRepair[]>> = {};
  const summary: ImportSummary = { docs: {}, flowchartFigures: 0, flowchartMisses: 0 };
  let flowIndex: FlowchartIndex | null = null;

  for (const docId of DOC_IDS) {
    const docDir = path.join(contentDir, "docs", docId);
    const meta = readJsonIf<DocMeta>(path.join(docDir, "doc.json"), (r) => docMetaSchema.parse(r));
    if (!meta) continue;
    const src = new OcrSource(buildDir, meta.stem);
    const sections = readJsonIf<Section[]>(path.join(docDir, "sections.json"), (r) => sectionsSchema.parse(r));
    const figures = readJsonIf<Figure[]>(path.join(docDir, "figures.json"), (r) => figuresSchema.parse(r));
    const figureIds = figures ? new Set(figures.map((f) => f.number)) : null;

    if (docId === "cr-159063") {
      const texts = new Map<number, string>();
      for (let n = 1; n <= meta.pageCount; n++) texts.set(n, src.text(n));
      flowIndex = buildFlowchartIndex(texts, known);
      const out = flowIndex.entries.map((e) => ({ routine: e.routine, figure: e.figure, caption: e.caption, pdfPages: e.pdfPages }));
      writeFileSync(path.join(docDir, "flowcharts.json"), JSON.stringify(out, null, 2) + "\n");
      summary.flowchartFigures = out.length;
      summary.flowchartMisses = flowIndex.misses.length;
    }

    const pagesDir = path.join(docDir, "pages");
    // Removing the directory itself fails with EPERM on Windows whenever anything holds a handle on it.
    mkdirSync(pagesDir, { recursive: true });
    for (const f of readdirSync(pagesDir)) rmSync(path.join(pagesDir, f), { recursive: true, force: true });
    const docSummary = { pages: 0, reviewed: 0, ai: 0, kinds: {} as Record<string, number>, flagged: 0 };
    const docFlags: FlagEntry[] = [];
    const docRepairs: Record<string, LineRepair[]> = {};
    let prevLastSeq: number | null = null;
    let appendixKey: string | null = null;
    const routineState: RoutineState = { current: null };

    for (let n = 1; n <= meta.pageCount; n++) {
      const name = `page-${pad3(n)}.md`;
      const app = docId === "cr-159064" ? VOL2_APPENDICES.find((a) => n >= a.from && n <= a.to) : undefined;
      if (app && app.appendix !== appendixKey) {
        appendixKey = app.appendix;
        prevLastSeq = null;
        routineState.current = app.main;
      }

      const override = path.join(docDir, "overrides", name);
      if (existsSync(override)) {
        const raw = readFileSync(override, "utf8");
        writeFileSync(path.join(pagesDir, name), raw);
        try {
          const { frontmatter, body } = parsePageFile(raw);
          if (frontmatter.source === "ai") docSummary.ai++;
          else docSummary.reviewed++;
          docSummary.kinds[frontmatter.kind] = (docSummary.kinds[frontmatter.kind] ?? 0) + 1;
          if (frontmatter.listing) {
            prevLastSeq = lastSeqOf(body) ?? prevLastSeq;
            const rs = frontmatter.listing.routines;
            if (rs.length > 0) routineState.current = rs[rs.length - 1];
          }
        } catch {
          // An invalid override is still copied; the validator reports it.
          docSummary.reviewed++;
        }
        docSummary.pages++;
        continue;
      }

      const text = src.text(n);
      const words = src.words(n);
      const pageFigures: string[] = figures ? figures.filter((f) => f.pdfPage === n).map((f) => f.number) : [];
      const fm: PageFrontmatter = {
        pdfPage: n,
        folio: null,
        sectionId: sectionFor(sections, n),
        kind: "text",
        source: "ocr",
        confidence: 0,
        figures: [],
      };
      let body = "";
      let reasons: string[] = [];
      let flaggable = true;

      const listing: ListingPage | null = app ? analyzeListingPage(src.words(n, "-psm6"), words, { known, prevLastSeq, numbered: app.numbered }) : null;
      if (app && listing && listing.type !== "none") {
        fm.kind = "listing";
        fm.listing = { appendix: app.appendix, routines: routinesForPage(listing, routineState, known), listingPage: listing.listingPage };
        fm.confidence = round1(listing.confidence);
        body = fence(listing.type === "code" ? "fortran" : "text", listing.body);
        if (listing.lastSeq !== null) prevLastSeq = listing.lastSeq;
        if (listing.repairs.length > 0) docRepairs[pad3(n)] = listing.repairs;
        reasons = listingFlagReasons(listing);
      } else if (docId === "cr-159063" && FLOWCHART_SHEETS(n) && flowIndex?.pageFigure.has(n)) {
        const fig = flowIndex.pageFigure.get(n)!;
        const entry = flowIndex.entries.find((e) => e.figure === fig);
        fm.kind = "flowchart";
        fm.folio = detectFolio(text.split("\n")).folio;
        fm.confidence = round1(meanConf(words));
        if (figureIds?.has(fig)) pageFigures.push(fig);
        const sheet = entry ? entry.pdfPages.indexOf(n) + 1 : 0;
        body = entry ? `Figure ${fig}, ${entry.routine}, sheet ${sheet} of ${entry.pdfPages.length}` : `Figure ${fig}`;
        flaggable = false;
      } else {
        const prose = normalizeProse(text, words);
        const stats = wordStats(words);
        fm.kind = n === 1 ? "cover" : classifyProse(stats, text);
        fm.folio = prose.folio;
        fm.confidence = round1(stats.conf);
        body = fm.kind === "blank" ? "" : prose.body;
        flaggable = fm.kind === "text" || fm.kind === "mixed";
        const threshold = fm.kind === "mixed" ? MIXED_FLAG_THRESHOLD : PROSE_FLAG_THRESHOLD;
        if (flaggable && fm.confidence < threshold) reasons = [`mean word confidence ${fm.confidence} below ${threshold}`];
      }
      fm.figures = [...new Set(pageFigures)];

      writeFileSync(path.join(pagesDir, name), serializePage(fm, body));
      docSummary.pages++;
      docSummary.kinds[fm.kind] = (docSummary.kinds[fm.kind] ?? 0) + 1;
      if (flaggable && reasons.length > 0) docFlags.push({ pdfPage: n, kind: fm.kind, confidence: fm.confidence, reasons });
    }

    docFlags.sort((a, b) => a.confidence - b.confidence || a.pdfPage - b.pdfPage);
    docSummary.flagged = docFlags.length;
    flags[docId] = docFlags;
    if (Object.keys(docRepairs).length > 0) repairs[docId] = docRepairs;
    summary.docs[docId] = docSummary;
  }

  const reportsDir = path.join(contentDir, "reports");
  mkdirSync(reportsDir, { recursive: true });
  const flagReport = {
    thresholds: { proseConfidence: PROSE_FLAG_THRESHOLD, mixedConfidence: MIXED_FLAG_THRESHOLD, listingBadLines: LISTING_LINE_FLAG_THRESHOLD },
    counts: Object.fromEntries(Object.entries(flags).map(([d, f]) => [d, f.length])),
    docs: flags,
    flowchartMisses: flowIndex?.misses ?? [],
    flowchartNotes: flowIndex?.notes ?? [],
  };
  writeFileSync(path.join(reportsDir, "flags.json"), JSON.stringify(flagReport, null, 2) + "\n");
  writeFileSync(path.join(reportsDir, "listing-repairs.json"), JSON.stringify(repairs, null, 1) + "\n");
  return summary;
}

export function listingFlagReasons(page: ListingPage): string[] {
  const seqProblems = page.problems.filter((p) => p.startsWith("sequence") || p.includes("line grid"));
  const bad = page.problems
    .map((p) => /^(\d+) line\(s\) with unbalanced/.exec(p)?.[1])
    .filter(Boolean)
    .reduce((s, x) => s + Number(x), 0);
  const unresolved = page.problems.find((p) => p.startsWith("unresolved: "));
  const unresolvedCount = unresolved ? unresolved.slice("unresolved: ".length).split(", ").length : 0;
  const routineMiss = unresolved?.includes("routine ") ?? false;
  if (seqProblems.length > 0 || routineMiss || bad + unresolvedCount >= LISTING_LINE_FLAG_THRESHOLD) return page.problems;
  return [];
}

function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repo = path.resolve(here, "../../..");
  const summary = runImport({ contentDir: path.join(repo, "content"), buildDir: path.join(repo, "build") });
  for (const [docId, s] of Object.entries(summary.docs)) {
    const kinds = Object.entries(s.kinds)
      .sort()
      .map(([k, v]) => `${k} ${v}`)
      .join(", ");
    console.log(`${docId}: ${s.pages} pages (${s.reviewed} reviewed, ${s.ai} ai); ${kinds}; ${s.flagged} flagged`);
  }
  console.log(`cr-159063 flowcharts: ${summary.flowchartFigures} figures, ${summary.flowchartMisses} unplaced pages`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();

