/**
 * Flowchart index for cr-159063 (MAIL LOG Program Theory, Vol. I). Section 4 names the
 * routine behind each figure id; the flowchart sheets in sections 5.3 and 5.4 carry only
 * figure captions, so sheets are placed by walking their `Page (k of n)` counters.
 */
import { candidateNames, levenshtein, snapRoutine } from "./routines.ts";

export interface FlowchartEntry {
  routine: string;
  figure: string;
  caption: string;
  pdfPages: number[];
}
export interface FlowchartMiss {
  pdfPage: number;
  reason: string;
}
export interface FlowchartIndex {
  entries: FlowchartEntry[];
  misses: FlowchartMiss[];
  notes: string[];
  pageFigure: Map<number, string>;
}

const TOC_PAGES = [5, 6, 7, 8];
const PROSE_FIRST = 25;
const PROSE_LAST = 54;
const MAIN_SHEETS: [number, number] = [56, 69];
const SUB_SHEETS: [number, number] = [71, 513];
const MAIN_DEFAULTS = ["BFILE", "*DIR", "*DRAW"];

/** Maps glyphs Tesseract substitutes for digits in this typeface back to digits. */
export function ocrDigits(s: string): string {
  return s
    .replace(/[\]|Il!iJ]/g, "1")
    .replace(/[oOQD]/g, "0")
    .replace(/[S§s$]/g, "5")
    .replace(/[B]/g, "8")
    .replace(/[°'"`]/g, "");
}

function figId(s: number, k: number): string {
  return s === 0 ? `5.3-${k}` : `5.4.${s}-${k}`;
}

function figKey(id: string): number {
  const m = /^5\.(?:3-(\d+)|4\.(\d)-(\d+))$/.exec(id);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return m[1] !== undefined ? Number(m[1]) : Number(m[2]) * 100 + Number(m[3]);
}

/** Parses a figure id out of noisy caption or prose text, e.g. `5,4,1-3.` or `5. 4. 1 ]` or `53-2`. */
export function parseFigureId(raw: string): string | null {
  const t = ocrDigits(raw.replace(/\s+/g, "")).replace(/,/g, ".").replace(/\+/g, "-");
  let m = /^5\.?4\.?([1-4])[-.]?(\d{1,2})/.exec(t);
  if (m && Number(m[2]) > 0) return figId(Number(m[1]), Number(m[2]));
  m = /^5\.?3\.?-?\.?([1-3])(?!\d)/.exec(t);
  if (m) return figId(0, Number(m[1]));
  return null;
}

/** Last `(k of n)` sheet counter on a page, tolerant of OCR damage. */
export function parseSheet(text: string): { k: number | null; n: number | null } {
  const re = /\(\s*([0-9A-Za-z\]|§°!]{1,3})\s*[o0O]f\s*([0-9A-Za-z\]|§!]{0,3})\s*\)?/g;
  let k: number | null = null;
  let n: number | null = null;
  for (const m of text.matchAll(re)) {
    const kk = ocrDigits(m[1]);
    const nn = ocrDigits(m[2]);
    if (!/^\d+$/.test(kk)) continue;
    k = Number(kk);
    n = /^\d+$/.test(nn) ? Number(nn) : null;
  }
  if (k !== null && n !== null && (k < 1 || k > n)) return { k: null, n: n >= 1 ? n : null };
  return { k: k !== null && k >= 1 ? k : null, n };
}

/** Last figure id in a sheet caption. */
export function parseCaptionFigure(text: string): string | null {
  let out: string | null = null;
  for (const m of text.matchAll(/(?:F?i?gure|Fig\.)\s*([^\n]{0,16})/g)) {
    const id = parseFigureId(m[1]);
    if (id) out = id;
  }
  return out;
}

interface Heading {
  s: number;
  k: number | null;
  name: string;
  refs: string[];
}

const HEADING_RE = /^4\s*\.\s*([1-4])\s*\.\s*([0-9\]Il|]{1,3})\s*\.?[\s_]+([A-Z][A-Z0-9]{1,5})\s*\.?$/;
const SECTION_RE = /^4\s*\.\s*([1-4])\s*\.?\s+[A-Z]{3,}/;

function parseProse(pages: ReadonlyMap<number, string>) {
  const headings: Heading[] = [];
  const mainCalled: string[] = [];
  const mainRefs: number[] = [];
  const declaredCount = new Map<number, number>();
  const notes: string[] = [];
  let current: Heading | null = null;
  let section = 0;
  for (let p = PROSE_FIRST; p <= PROSE_LAST; p++) {
    const text = pages.get(p);
    if (!text) continue;
    for (const raw of text.split(/\r?\n/)) {
      const line = raw.trim();
      const h = HEADING_RE.exec(line);
      if (h) {
        const k = /^\d+$/.test(ocrDigits(h[2])) ? Number(ocrDigits(h[2])) : null;
        current = { s: Number(h[1]), k, name: h[3], refs: [] };
        section = current.s;
        headings.push(current);
        continue;
      }
      const sec = SECTION_RE.exec(line);
      if (sec && !/^4\s*\.\s*[1-4]\s*\.\s*[0-9\]]/.test(line)) {
        section = Number(sec[1]);
        current = null;
      }
      if (p <= 25 || section === 0) {
        for (const m of line.matchAll(/called\s+(\*?[A-Z][A-Z0-9_]{1,5})/g)) mainCalled.push(m[1]);
      }
      for (const m of line.matchAll(/Figures?\s*(5[^a-z]{1,14})/g)) {
        const id = parseFigureId(m[1]);
        if (!id) continue;
        if (id.startsWith("5.3-")) {
          if (p < 52) mainRefs.push(mainCalled.length);
          continue;
        }
        if (p < 52 && current) current.refs.push(id);
      }
      // `Figures 5.4.2-1 thru 5.4.1-16`: the first id names the section, the last its count.
      const thru = /Figures\s*(5[^a-z]{1,10}?)\s*thru\s*(5[^a-z]{1,10})/.exec(line);
      if (thru) {
        const a = parseFigureId(thru[1]);
        const b = parseFigureId(thru[2]);
        if (a && b && a.startsWith("5.4.") && b.startsWith("5.4.")) {
          const s = Number(a[4]);
          const n = Number(b.split("-")[1]);
          if (b[4] !== a[4]) notes.push(`Range "Figures ${a} thru ${b}" read as figures ${figId(s, 1)} to ${figId(s, n)}.`);
          declaredCount.set(s, n);
        }
      }
    }
  }
  return { headings, mainCalled, declaredCount, notes };
}

/** Finds a name in the TOC sequence: exact, else the unique entry one edit away. */
function tocIndex(toc: readonly string[], name: string, from = 0): number {
  const exact = toc.indexOf(name, from);
  if (exact >= 0) return exact;
  const near = toc.map((t, i) => (i >= from && levenshtein(t, name) <= 1 ? i : -1)).filter((i) => i >= 0);
  return near.length === 1 ? near[0] : -1;
}

function figureRoutines(pages: ReadonlyMap<number, string>, known: readonly string[], notes: string[]) {
  const { headings, mainCalled, declaredCount, notes: rangeNotes } = parseProse(pages);
  notes.push(...rangeNotes);

  const byFig = new Map<string, string>();
  for (const h of headings) {
    const fromRef = h.refs.find((r) => r.startsWith(`5.4.${h.s}-`));
    const fromHeading = h.k !== null ? figId(h.s, h.k) : null;
    const id = fromRef ?? fromHeading;
    if (!id) {
      notes.push(`Heading 4.${h.s}.? ${h.name} has no readable number or figure reference; skipped.`);
      continue;
    }
    if (fromRef && fromHeading && fromRef !== fromHeading) {
      notes.push(`Heading ${h.name} numbered as ${fromHeading} but its prose cites Figure ${fromRef}; used ${fromRef}.`);
    }
    if (byFig.has(id)) {
      notes.push(`Figure ${id} claimed by both ${byFig.get(id)} and ${h.name}; kept ${byFig.get(id)}.`);
      continue;
    }
    byFig.set(id, h.name);
  }

  const counts = new Map<number, number>();
  for (let s = 1; s <= 4; s++) {
    let max = 0;
    for (const id of byFig.keys()) if (id.startsWith(`5.4.${s}-`)) max = Math.max(max, Number(id.split("-")[1]));
    const declared = declaredCount.get(s);
    if (declared !== undefined && declared !== max) {
      notes.push(`Section 5.4.${s}: headings reach ${max} figures, section 5.2 declares ${declared}; using ${Math.max(max, declared)}.`);
    }
    counts.set(s, Math.max(max, declared ?? 0));
  }

  const order: string[] = [];
  for (let s = 1; s <= 4; s++) for (let k = 1; k <= counts.get(s)!; k++) order.push(figId(s, k));

  // TOC order fills headings OCR dropped: the names between the two nearest known neighbors.
  const toc: string[] = [];
  // TOC lines end in a page number (`4.1.3   SEAC   |   13`) that would hide the name from candidateNames.
  for (const p of TOC_PAGES) toc.push(...candidateNames((pages.get(p) ?? "").replace(/[ \t]{2,}[^\s]{1,4}[ \t]*$/gm, "")));
  for (let i = 0; i < order.length; i++) {
    if (byFig.has(order[i])) continue;
    let j = i;
    while (j < order.length && !byFig.has(order[j])) j++;
    const lo = i - 1;
    const loIdx = lo >= 0 ? tocIndex(toc, byFig.get(order[lo])!) : -1;
    const hiIdx = j < order.length ? tocIndex(toc, byFig.get(order[j])!, Math.max(loIdx, 0)) : toc.length;
    const gap = order.slice(i, j);
    const slice = loIdx >= 0 || lo < 0 ? toc.slice(loIdx + 1, hiIdx) : [];
    const fill = slice.length >= gap.length && (hiIdx < toc.length || lo >= 0) ? (hiIdx < toc.length ? slice.slice(-gap.length) : slice.slice(0, gap.length)) : [];
    for (let g = 0; g < gap.length; g++) {
      const name = fill.length === gap.length ? fill[g] : "UNKNOWN";
      byFig.set(gap[g], name);
      notes.push(`Figure ${gap[g]} heading not found; ${name === "UNKNOWN" ? "TOC could not supply a name" : `inferred ${name} from TOC order`}.`);
    }
    i = j - 1;
  }

  const routines = new Map<string, string>();
  for (const id of order) {
    const raw = byFig.get(id)!;
    const snapped = raw === "UNKNOWN" ? null : snapRoutine(raw, known);
    if (snapped === null) {
      if (raw !== "UNKNOWN") notes.push(`Figure ${id}: ${raw} not in the known routine list; kept as read.`);
      routines.set(id, raw);
    } else {
      if (snapped !== raw) notes.push(`Figure ${id}: snapped ${raw} to ${snapped}.`);
      routines.set(id, snapped);
    }
  }

  const mainRoutines = new Map<string, string>();
  for (let k = 1; k <= 3; k++) {
    const def = MAIN_DEFAULTS[k - 1];
    const said = mainCalled[k - 1];
    if (said && said !== def) notes.push(`Main entry ${figId(0, k)}: prose names ${said}; kept ${def}.`);
    mainRoutines.set(figId(0, k), def);
  }
  return { order: [...mainRoutines.keys(), ...order], routines: new Map([...mainRoutines, ...routines]) };
}

interface Obs {
  k: number | null;
  n: number | null;
  fig: string | null;
}

interface Run {
  figure: string;
  n: number | null;
  k: number;
  pages: number[];
}

function placeSheets(
  pages: ReadonlyMap<number, string>,
  range: [number, number],
  figures: readonly string[],
  notes: string[],
  misses: FlowchartMiss[],
): Run[] {
  const runs: Run[] = [];
  let fi = -1;
  let cur: Run | null = null;
  const exhausted = () => cur === null || (cur.n !== null && cur.k >= cur.n);
  const start = (p: number, o: Obs, why: string): boolean => {
    if (fi + 1 >= figures.length) {
      misses.push({ pdfPage: p, reason: `no figure left in ${figures[0]}..${figures[figures.length - 1]} (${why})` });
      return false;
    }
    if (cur && cur.n !== null && cur.k < cur.n) notes.push(`Figure ${cur.figure} ends at sheet ${cur.k} of ${cur.n} (PDF ${cur.pages[cur.pages.length - 1]}).`);
    fi++;
    cur = { figure: figures[fi], n: o.n, k: o.k ?? 1, pages: [p] };
    if (o.k !== null && o.k !== 1) notes.push(`Figure ${cur.figure} starts at PDF ${p} on sheet ${o.k}; sheet 1 not seen.`);
    if (o.k === null && o.fig !== cur.figure) notes.push(`Figure ${cur.figure} start at PDF ${p} inferred (${why}).`);
    if (o.fig && o.fig !== cur.figure) notes.push(`PDF ${p} caption reads ${o.fig}; placed as ${cur.figure}.`);
    runs.push(cur);
    return true;
  };
  const extend = (p: number, o: Obs) => {
    const c = cur!;
    c.k = c.k + 1;
    if (o.k !== null && o.k !== c.k) notes.push(`PDF ${p} reads sheet ${o.k} but follows sheet ${c.k - 1} of ${c.figure}; placed as sheet ${c.k}.`);
    if (o.n !== null && c.n === null) c.n = o.n;
    else if (o.n !== null && o.n !== c.n && o.k !== null) notes.push(`PDF ${p} reads "of ${o.n}" in ${c.figure} (expected ${c.n}).`);
    // A trailing `]` or `|` after the id reads as an extra digit (`5.4.1-1]` as 5.4.1-11); not worth a note.
    const strayDigit = o.fig !== null && /^\d$/.test(o.fig.slice(c.figure.length)) && o.fig.startsWith(c.figure);
    if (o.fig && o.fig !== c.figure && !strayDigit) notes.push(`PDF ${p} caption reads ${o.fig}; placed in ${c.figure}.`);
    c.pages.push(p);
  };

  for (let p = range[0]; p <= range[1]; p++) {
    const text = pages.get(p);
    if (text === undefined || !text.trim()) {
      misses.push({ pdfPage: p, reason: text === undefined ? "page text missing" : "page text empty" });
      continue;
    }
    const sheet = parseSheet(text);
    const o: Obs = { ...sheet, fig: parseCaptionFigure(text) };
    const next = figures[fi + 1];
    const c = cur as Run | null;
    if (o.fig && o.fig === next && o.fig !== c?.figure && (o.k === null || o.k === 1 || exhausted())) start(p, o, "caption names next figure");
    else if (c && o.fig === c.figure && !(o.k === 1 && exhausted())) extend(p, o);
    else if (o.k === 1) start(p, o, "sheet 1");
    else if (exhausted()) {
      if (c && o.k !== null && o.k === c.k + 1 && (o.n === null || o.n !== c.n)) {
        notes.push(`${c.figure} runs past its read count ${c.n} at PDF ${p}.`);
        c.n = o.n;
        extend(p, o);
      } else start(p, o, o.k === null && o.n === null && !o.fig ? "no caption; previous figure complete" : "previous figure complete");
    } else extend(p, o);
  }
  const last = cur as Run | null;
  if (last && last.n !== null && last.k < last.n) notes.push(`Figure ${last.figure} ends at sheet ${last.k} of ${last.n} (PDF ${last.pages[last.pages.length - 1]}).`);
  if (fi + 1 < figures.length) notes.push(`No sheets found for ${figures.slice(fi + 1).join(", ")}.`);
  const declared = runs.reduce((sum, r) => sum + (r.n ?? r.pages.length), 0);
  const span = range[1] - range[0] + 1;
  if (declared !== span) notes.push(`PDF ${range[0]}-${range[1]}: captions declare ${declared} sheets for ${span} pages.`);
  return runs;
}

export function buildFlowchartIndex(pages: ReadonlyMap<number, string>, known: readonly string[]): FlowchartIndex {
  const notes: string[] = [];
  const misses: FlowchartMiss[] = [];
  const { order, routines } = figureRoutines(pages, known, notes);
  const mainFigs = order.filter((f) => f.startsWith("5.3-"));
  const subFigs = order.filter((f) => f.startsWith("5.4."));
  const runs = [
    ...placeSheets(pages, MAIN_SHEETS, mainFigs, notes, misses),
    ...placeSheets(pages, SUB_SHEETS, subFigs, notes, misses),
  ];

  const pageFigure = new Map<number, string>();
  const pagesOf = new Map<string, number[]>();
  for (const r of runs) {
    pagesOf.set(r.figure, r.pages);
    for (const p of r.pages) pageFigure.set(p, r.figure);
    if (r.n !== null && r.pages.length !== r.n) notes.push(`Figure ${r.figure}: ${r.pages.length} pages placed, caption says ${r.n} sheets.`);
  }
  const entries: FlowchartEntry[] = [];
  for (const figure of [...order].sort((a, b) => figKey(a) - figKey(b))) {
    const pdfPages = pagesOf.get(figure) ?? [];
    const n = pdfPages.length;
    const caption = `Figure ${figure}, ${n === 0 ? "no sheets found" : n === 1 ? "sheet 1" : `sheets 1 to ${n}`}`;
    entries.push({ routine: routines.get(figure)!, figure, caption, pdfPages });
  }
  return { entries, misses: misses.sort((a, b) => a.pdfPage - b.pdfPage), notes, pageFigure };
}
