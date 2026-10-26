import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  RECORDS,
  codeIndexSchema,
  flowSchema,
  flowchartsSchema,
  parsePageFile,
  routineDescriptionsSchema,
  sectionsSchema,
  xrefSchema,
} from "../src/content/schema.ts";
import type {
  Appendix,
  CodeIndex,
  Flow,
  Flowchart,
  PageFrontmatter,
  RecordType,
  RoutineDescription,
  RoutineEntry,
  RoutineLines,
  Section,
  Xref,
} from "../src/content/types.ts";
import { confusionKey, levenshtein, snapRoutine } from "./content/routines.ts";

// ---------------------------------------------------------------------------
// Listing lines and routine splitting
// ---------------------------------------------------------------------------

export interface ListingPageInput {
  pdfPage: number;
  fm: PageFrontmatter;
  body: string;
}

export interface SourceLine {
  pdfPage: number;
  appendix: Appendix;
  sectionId: string | null;
  seq: number | null;
  /** The card image as printed: column 1 is the first character. */
  code: string;
  reviewed: boolean;
}

export interface SplitRoutine {
  name: string;
  /** The name as the header printed it, before snapping; null for a headerless main program. */
  headerName: string | null;
  kind: "main" | "subroutine" | "function" | "program";
  appendix: Appendix;
  lines: SourceLine[];
}

const SEQ_LINE = /^\((\d{4})\) ?(.*)$/;
const APPENDIX_LETTERS = new Set<string>(["B", "C", "D", "E", "F"]);

export function fencedLines(body: string, lang: string): string[] {
  const out: string[] = [];
  let inside = false;
  for (const line of body.split(/\r?\n/)) {
    if (!inside && line.trim() === "```" + lang) inside = true;
    else if (inside && line.trim() === "```") inside = false;
    else if (inside) out.push(line);
  }
  return out;
}

export function sourceLines(page: ListingPageInput): SourceLine[] {
  const appendix = page.fm.listing?.appendix;
  if (!appendix || !APPENDIX_LETTERS.has(appendix)) return [];
  return fencedLines(page.body, "fortran").map((raw) => {
    const m = SEQ_LINE.exec(raw);
    return {
      pdfPage: page.pdfPage,
      appendix: appendix as Appendix,
      sectionId: page.fm.sectionId,
      seq: m ? Number(m[1]) : null,
      code: m ? m[2] : raw,
      reviewed: page.fm.source === "reviewed",
    };
  });
}

/** Columns 1 to 72 only: the compiler ignores 73 to 80, where OCR also leaves speckle and reviewer `! [?]` notes. */
const analysisText = (code: string) => code.replace(/\s+! \[\?\].*$/, "").slice(0, 72);

export const isComment = (code: string) => /^[Cc*]/.test(code);
const isDirective = (code: string) => /^\$/.test(code);
export const isContinuation = (code: string) => code.length > 5 && /^\s{5}[^\s0]/.test(code);

const HEADER = /^(?:(?:INTEGER|REAL|LOGICAL|DOUBLEPRECISION|COMPLEX)(?:\*\d)?)?(SUBROUTINE|FUNCTION|PROGRAM)([A-Z][A-Z0-9$]{0,7})/;

/** Reads a SUBROUTINE/FUNCTION/PROGRAM statement; spaces are insignificant in fixed form. */
export function parseHeader(code: string): { keyword: "subroutine" | "function" | "program"; name: string } | null {
  if (isComment(code) || isDirective(code) || isContinuation(code)) return null;
  const m = HEADER.exec(analysisText(code).slice(6).replace(/\s+/g, "").toUpperCase());
  return m ? { keyword: m[1].toLowerCase() as "subroutine" | "function" | "program", name: m[2] } : null;
}

const isEnd = (code: string) =>
  !isComment(code) && !isDirective(code) && !isContinuation(code) && /^\s*EN[DO0](\s{8,}\S{1,3})?\s*$/.test(analysisText(code).slice(6));

const headerlessName = (sectionId: string | null, appendix: string) => sectionId?.split(".")[1]?.replace(/\s+/g, "") ?? `MAIN${appendix}`;

/**
 * Splits listing lines into routines from the code itself: a routine ends at `END`, and the
 * lines after it (leading comments included) belong to the next one, named by its header or,
 * for a headerless main program, by the section the program starts in. A header met while
 * the current routine already has statements also starts a routine, since OCR loses some
 * `END` lines. A second header right after the first with nothing between is a reprint
 * (page 516 prints JTIME's header twice). In Appendices E and F, which print no sequence
 * numbers, a change of section between pages also starts a routine.
 */
export function splitRoutines(lines: SourceLine[], known: readonly string[]): SplitRoutine[] {
  const out: SplitRoutine[] = [];
  let cur: SplitRoutine | null = null;
  let ended = false;
  let statements = 0;
  let prev: SourceLine | null = null;
  let afterEnd = false;

  const close = () => {
    if (cur && cur.lines.length > 0) {
      if (cur.kind === "main" && cur.headerName === null) cur.name = headerlessName(firstStatementLine(cur)?.sectionId ?? cur.lines[0].sectionId, cur.appendix);
      out.push(cur);
    }
    cur = null;
    ended = false;
    statements = 0;
  };
  const open = (l: SourceLine) => {
    cur = { name: "", headerName: null, kind: "main", appendix: l.appendix, lines: [] };
  };

  for (const l of lines) {
    const pageTurn = prev !== null && prev.pdfPage !== l.pdfPage;
    if (prev && prev.appendix !== l.appendix) close();
    else if (pageTurn && (l.appendix === "E" || l.appendix === "F") && prev!.sectionId !== l.sectionId && statements > 0) close();
    prev = l;

    const header = parseHeader(l.code);
    const comment = isComment(l.code) || isDirective(l.code) || l.code.trim() === "";
    if (ended) {
      close();
      afterEnd = true;
    } else if (!cur) afterEnd = false;
    if (!cur) open(l);
    const c = cur as unknown as SplitRoutine;

    if (header) {
      const snapped = snapRoutine(header.name, known) ?? header.name;
      // up to two "statements" ahead of a header are comments whose C the OCR lost (page 344)
      if (c.headerName === null && (statements === 0 || (statements <= 2 && afterEnd))) {
        Object.assign(c, { name: snapped, headerName: header.name, kind: header.keyword });
      } else if (c.headerName !== null && statements === 1 && snapped === c.name) {
        // reprinted header: keep it as a printed line of the same routine
      } else {
        // comments after the last statement of a routine that lost its END introduce the next routine
        const carried: SourceLine[] = [];
        while (c.lines.length > 0 && isComment(c.lines[c.lines.length - 1].code) && statements > 0) carried.unshift(c.lines.pop()!);
        close();
        open(l);
        (cur as unknown as SplitRoutine).lines.push(...carried);
        Object.assign(cur as unknown as SplitRoutine, { name: snapped, headerName: header.name, kind: header.keyword });
      }
    }
    (cur as unknown as SplitRoutine).lines.push(l);
    if (!comment && !isContinuation(l.code)) statements++;
    if (isEnd(l.code)) ended = true;
  }
  close();
  return out;
}

function firstStatementLine(r: SplitRoutine): SourceLine | undefined {
  return r.lines.find((l) => !isComment(l.code) && !isDirective(l.code) && l.code.trim() !== "");
}

/** Line ids: `NNNN.k` (k-th line printing sequence NNNN in the routine) or `uN` where no number is printed. */
export function lineIds(lines: SourceLine[]): string[] {
  const seen = new Map<number, number>();
  let unnumbered = 0;
  return lines.map((l) => {
    if (l.seq === null) return `u${++unnumbered}`;
    const k = (seen.get(l.seq) ?? 0) + 1;
    seen.set(l.seq, k);
    return `${String(l.seq).padStart(4, "0")}.${k}`;
  });
}

// ---------------------------------------------------------------------------
// Statements and extraction
// ---------------------------------------------------------------------------

export interface Statement {
  /** Index of the statement's first line within the routine. */
  index: number;
  label: string;
  /** Statement text from column 7 with continuation text appended. */
  text: string;
}

export function statements(lines: { code: string }[]): Statement[] {
  const out: Statement[] = [];
  lines.forEach((l, i) => {
    const code = analysisText(l.code);
    if (isComment(code) || isDirective(code) || code.trim() === "") return;
    if (isContinuation(code) && out.length > 0) {
      out[out.length - 1].text += code.slice(6);
      return;
    }
    out.push({ index: i, label: code.slice(0, 5).trim(), text: code.slice(6) });
  });
  return out;
}

const squash = (s: string) => s.replace(/\s+/g, "").toUpperCase();

export function extractCalls(stmts: Statement[]): { name: string; index: number }[] {
  const out: { name: string; index: number }[] = [];
  for (const s of stmts) {
    for (const m of squash(s.text).matchAll(/(?:^|[^A-Z0-9$])CALL([A-Z][A-Z0-9$]{0,7})/g)) out.push({ name: m[1], index: s.index });
  }
  return out;
}

/** Quoted strings and `nH` Hollerith constants in WRITE, PRINT, and FORMAT statements, joined per statement. */
export function extractLiterals(stmt: Statement): string[] {
  const head = squash(stmt.text);
  if (!/^(FORMAT|WRITE|PRINT|TYPE)\(?/.test(head) && !/\)(WRITE|PRINT)\(/.test(head)) return [];
  // a slash outside a literal is a FORMAT record break, so it starts a new printed line
  const groups: string[][] = [[]];
  const t = stmt.text;
  let i = 0;
  while (i < t.length) {
    const ch = t[i];
    if (ch === "'" || ch === '"') {
      const end = t.indexOf(ch, i + 1);
      groups[groups.length - 1].push(t.slice(i + 1, end < 0 ? t.length : end));
      i = end < 0 ? t.length : end + 1;
      continue;
    }
    if (ch === "/") {
      groups.push([]);
      i++;
      continue;
    }
    const h = /^(\d+)H/i.exec(t.slice(i));
    if (h && (i === 0 || /[^A-Z0-9$]/i.test(t[i - 1]))) {
      const n = Number(h[1]);
      const start = i + h[0].length;
      groups[groups.length - 1].push(t.slice(start, start + n));
      i = start + n;
      continue;
    }
    i++;
  }
  return groups
    .map((g) => g.map((p) => p.trim()).filter(Boolean).join(" ").replace(/\s+/g, " ").trim())
    .filter((text) => (text.match(/[A-Z]/gi)?.length ?? 0) >= 3);
}

export function extractCommons(stmts: Statement[]): string[] {
  const out = new Set<string>();
  for (const s of stmts) {
    const t = squash(s.text);
    if (!t.startsWith("COMMON")) continue;
    for (const m of t.matchAll(/\/([A-Z0-9]{1,6})\//g)) out.add(m[1]);
  }
  return [...out];
}

interface FileUse {
  unit: string;
  kind: "unit" | "file";
  op: string;
  index: number;
}

export function extractFiles(stmts: Statement[]): FileUse[] {
  const out: FileUse[] = [];
  for (const s of stmts) {
    const t = squash(s.text);
    for (const m of t.matchAll(/(?:^|\))(READ|WRITE)\(([0-9]{1,2}|[A-Z][A-Z0-9]{0,5})[,)]/g))
      out.push({ unit: m[2], kind: "unit", op: m[1].toLowerCase(), index: s.index });
    const r = /^(REWIND|ENDFILE)([0-9]{1,2})$/.exec(t);
    if (r) out.push({ unit: r[2], kind: "unit", op: r[1].toLowerCase(), index: s.index });
    const f = /SRCH\$\$\(([^,]*),['"]([^'"]+)['"]/.exec(s.text.toUpperCase().replace(/\s*\(\s*/g, "(").replace(/SRCH\$\$\s+/, "SRCH$$$$"));
    if (f) out.push({ unit: f[2].trim(), kind: "file", op: /CLOS/.test(f[1]) ? "close" : "open", index: s.index });
  }
  return out;
}

/** The comment block directly above `index` (nearest wordy line), with the comment marker removed. */
export function nearbyComment(lines: { code: string }[], index: number): string | null {
  for (let i = index - 1; i >= 0 && isComment(lines[i].code); i--) {
    const text = analysisText(lines[i].code).slice(1).replace(/\s+/g, " ").trim();
    if ((text.match(/[A-Z]{2,}/gi)?.length ?? 0) >= 2) return text;
  }
  return null;
}

/**
 * Snaps a CALL target to a known name. Beyond whole-name snapping, OCR often reads the
 * argument paren as `C` and drops `$`, so `SKCHSSCK` is `SRCH$$(K` and `COMI` is `COMI$$`:
 * a leading part of the token may match instead.
 */
export function snapCall(token: string, known: readonly string[]): string | null {
  const whole = snapRoutine(token, known);
  if (whole) return whole;
  for (let len = Math.min(8, token.length); len >= 4; len--) {
    const prefix = confusionKey(token.slice(0, len));
    const limit = len >= 6 ? 2 : len === 5 ? 1 : 0;
    let best: string | null = null;
    let bestD = Infinity;
    let tie = false;
    for (const k of known) {
      const d = Math.min(levenshtein(prefix, confusionKey(k)), levenshtein(prefix, confusionKey(k.replace(/\$+$/, ""))));
      if (d < bestD) [best, bestD, tie] = [k, d, false];
      else if (d === bestD) tie = true;
    }
    if (best && !tie && bestD <= limit) return best;
  }
  return null;
}

/**
 * Two routines of one name in one program are an OCR loss (page 528 reads `OPENN` as
 * `OPEN`); when the program calls a missing name one edit away, the later one takes it.
 */
export function renameByCallSite(split: SplitRoutine[], report: string[]): void {
  const groups: SplitRoutine[][] = [];
  for (const r of split) {
    if (r.kind === "main" || groups.length === 0 || groups[groups.length - 1][0].appendix !== r.appendix) groups.push([]);
    groups[groups.length - 1].push(r);
  }
  for (const g of groups) {
    const names = new Set(g.map((r) => r.name));
    const missing = [...new Set(g.flatMap((r) => extractCalls(statements(r.lines)).map((c) => c.name)))].filter((n) => !names.has(n));
    const seen = new Set<string>();
    for (const r of g) {
      if (seen.has(r.name)) {
        const to = missing.filter((n) => levenshtein(n, r.name) === 1);
        if (to.length === 1) {
          report.push(`renamed: second ${r.name} in ${g[0].name} (page ${r.lines[0].pdfPage}) to ${to[0]}, the name its program calls`);
          r.name = to[0];
        }
      }
      seen.add(r.name);
    }
  }
}

// ---------------------------------------------------------------------------
// Fuzzy prompt matching
// ---------------------------------------------------------------------------

const PLACEHOLDER = /^(([XAN9])\2+|MM?DD?YY\w*|!+)$/;

/** Uppercase words with punctuation and the manual's input masks (XXX, AAAA, MMDDYY) removed. */
export function normalizePrompt(s: string): string {
  return s
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w && !PLACEHOLDER.test(w))
    .join(" ");
}

function trigrams(s: string): Map<string, number> {
  const out = new Map<string, number>();
  for (const w of s.split(" ")) {
    const p = ` ${w} `;
    for (let i = 0; i + 3 <= p.length; i++) out.set(p.slice(i, i + 3), (out.get(p.slice(i, i + 3)) ?? 0) + 1);
  }
  return out;
}

/**
 * Dice coefficient on word-padded character trigrams, tolerant of OCR noise and `A`/`AN`.
 * `weight` lets boilerplate shared by many prompts ("THERE ARE ... DOCUMENTS WITH A") count
 * for less than the words that tell prompts apart.
 */
export function similarity(a: string, b: string, weight: (g: string) => number = () => 1): number {
  const ta = trigrams(a);
  const tb = trigrams(b);
  let shared = 0;
  let total = 0;
  for (const [g, n] of ta) {
    shared += Math.min(n, tb.get(g) ?? 0) * weight(g);
    total += n * weight(g);
  }
  for (const [g, n] of tb) total += n * weight(g);
  return total === 0 ? 0 : (2 * shared) / total;
}

/** Step prompt lines worth matching: at least two words and ten letters after normalization. */
export function matchableLines(prompt: string[]): { index: number; text: string }[] {
  return prompt
    .map((p, index) => ({ index, text: normalizePrompt(p) }))
    .filter((l) => l.text.split(" ").length >= 2 && l.text.replace(/[^A-Z]/g, "").length >= 10);
}

export const MATCH_THRESHOLD = 0.6;
const MAX_MATCHES = 3;

export function matchStep(
  prompt: string[],
  candidates: { id: string; prompts: { line: string; text: string }[] }[],
  threshold = MATCH_THRESHOLD,
): { routine: string; score: number; line: string; promptLine: number }[] {
  const lines = matchableLines(prompt);
  const all = candidates.flatMap((c) => c.prompts.map((p) => normalizePrompt(p.text)));
  const df = new Map<string, number>();
  for (const t of all) for (const g of trigrams(t).keys()) df.set(g, (df.get(g) ?? 0) + 1);
  const weight = (g: string) => Math.log(1 + all.length / (df.get(g) ?? 1));
  const best: { routine: string; score: number; line: string; promptLine: number }[] = [];
  for (const c of candidates) {
    let top: { routine: string; score: number; line: string; promptLine: number } | null = null;
    for (const p of c.prompts) {
      const pt = normalizePrompt(p.text);
      for (const l of lines) {
        const score = Math.round(similarity(l.text, pt, weight) * 1000) / 1000;
        if (score >= threshold && (!top || score > top.score)) top = { routine: c.id, score, line: p.line, promptLine: l.index };
      }
    }
    if (top) best.push(top);
  }
  best.sort((a, b) => b.score - a.score || a.routine.localeCompare(b.routine));
  return best.slice(0, MAX_MATCHES);
}

// ---------------------------------------------------------------------------
// Name joins
// ---------------------------------------------------------------------------

/** Join key for names printed differently across reports (`PHASE 1`/`PHASE1`, `NEOADD`/`NEQADD`, `ALDW`/`ALOW`). */
export const nameKey = (s: string) => confusionKey(s.replace(/\s+/g, ""));

const APPENDIX_RECORD: Record<Appendix, RoutineEntry["record"]> = {
  B: "correspondence",
  C: "dir",
  D: "drawing-eo",
  E: "external",
  F: "support",
};

/** Which appendices a description's record grouping can describe. */
const DESCRIPTION_APPENDICES: Record<RoutineDescription["record"], Appendix[]> = {
  correspondence: ["B"],
  dir: ["C"],
  "drawing-eo": ["D"],
  general: ["B", "C", "D"],
  external: ["E"],
  support: ["F"],
};

/** Flowchart figure families: 5.3-n are the main entries, 5.4.n-k the subroutines by record. */
function flowchartAppendices(figure: string): Appendix[] {
  const main = /^5\.3-(\d)$/.exec(figure);
  if (main) return [(["B", "C", "D"] as const)[Number(main[1]) - 1]];
  const sub = /^5\.4\.(\d)-/.exec(figure);
  if (!sub) return [];
  return ({ "1": ["B"], "2": ["C"], "3": ["D"], "4": ["B", "C", "D"] } as Record<string, Appendix[]>)[sub[1]] ?? [];
}

const MAIN_FLOWCHART = new Set(["BFILE", "*DIR", "*DRAW"]);

// ---------------------------------------------------------------------------
// Externals (cr-159063 section 8.0)
// ---------------------------------------------------------------------------

export const SYSTEM_EXTERNALS = [
  "ATCH$$", "BREAK$", "C1IN", "CNAM$$", "COMI$$", "ENDFILE", "EXIT", "LS", "LT", "RECYCL", "RESU$$", "REWIND", "RT",
  "SRCH$$", "T1OU", "TIMDAT",
];
/** Section 8.2: defined at load time; CLEAR and CHKLIN are printed in Appendix E only as figures. */
export const MISC_EXTERNALS = [
  { name: "CLEAR", sectionId: "8.2.1" },
  { name: "PAUS", sectionId: "8.2.2" },
  { name: "CHKLIN", sectionId: "8.2.2" },
];

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------

export interface BuildInputs {
  pages: ListingPageInput[];
  sections: Section[];
  vol1Sections: Section[];
  descriptions: RoutineDescription[];
  flowcharts: Flowchart[];
  flows: Flow[];
}

export interface BuildOutput {
  index: CodeIndex;
  xref: Xref;
  sources: Map<string, { text: string; lines: RoutineLines }>;
  report: string[];
}

export function buildCodeIndex(input: BuildInputs): BuildOutput {
  const report: string[] = [];
  const pages = [...input.pages].sort((a, b) => a.pdfPage - b.pdfPage);
  const routineSections = input.sections.filter((s) => s.level === 2 && /^[B-F]\./.test(s.id));
  const known = [
    ...new Set([
      ...routineSections.map((s) => s.id.split(".")[1]),
      ...input.descriptions.map((d) => d.routine.replace(/\s+/g, "")),
      ...input.flowcharts.map((f) => f.routine).filter((r) => !MAIN_FLOWCHART.has(r)),
      ...SYSTEM_EXTERNALS,
      ...MISC_EXTERNALS.map((e) => e.name),
    ]),
  ].sort();

  const all: SourceLine[] = [];
  const symbolPages: ListingPageInput[] = [];
  for (const p of pages) {
    if (p.fm.kind !== "listing") continue;
    const ls = sourceLines(p);
    if (ls.length > 0) all.push(...ls);
    else symbolPages.push(p);
  }

  const split = splitRoutines(all, known);
  renameByCallSite(split, report);

  // ids: the bare name when unique, else name@appendix, else name@appendix-<main program>
  const byName = new Map<string, SplitRoutine[]>();
  for (const r of split) byName.set(r.name, [...(byName.get(r.name) ?? []), r]);
  const ids = new Map<SplitRoutine, string>();
  let lastMain = "";
  for (const r of split) {
    if (r.kind === "main") lastMain = r.name;
    const same = byName.get(r.name)!;
    if (same.length === 1) ids.set(r, r.name);
    else if (same.filter((o) => o.appendix === r.appendix).length === 1) ids.set(r, `${r.name}@${r.appendix}`);
    else ids.set(r, `${r.name}@${r.appendix}-${lastMain}`);
  }
  const taken = new Map<string, number>();
  for (const r of split) {
    const base = ids.get(r)!;
    const n = (taken.get(base) ?? 0) + 1;
    taken.set(base, n);
    if (n > 1) {
      ids.set(r, `${base}-${n}`);
      report.push(`id collision: ${base} repeats; second is ${base}-${n}`);
    }
  }

  const lineOwner = new Map<SourceLine, SplitRoutine>();
  for (const r of split) for (const l of r.lines) lineOwner.set(l, r);

  // symbol-table pages belong to the routine whose listing they follow
  const symbolOf = new Map<SplitRoutine, number[]>();
  for (const p of symbolPages) {
    const before = [...all].reverse().find((l) => l.pdfPage < p.pdfPage && l.appendix === p.fm.listing?.appendix);
    const owner = before && lineOwner.get(before);
    if (!owner) {
      report.push(`symbol-table page ${p.pdfPage}: no preceding routine in appendix ${p.fm.listing?.appendix}`);
      continue;
    }
    symbolOf.set(owner, [...(symbolOf.get(owner) ?? []), p.pdfPage]);
    const hint = (p.fm.listing?.routines ?? []).map((h) => snapRoutine(h, known) ?? h);
    if (hint.length > 0 && !hint.includes(owner.name)) report.push(`attribution: page ${p.pdfPage} (symbol table) frontmatter says ${hint.join(", ")}; follows ${ids.get(owner)}`);
  }

  // frontmatter and sections.json disagreements
  for (const p of pages) {
    const ls = all.filter((l) => l.pdfPage === p.pdfPage);
    if (ls.length === 0) continue;
    const names = [...new Set(ls.map((l) => lineOwner.get(l)!.name))];
    const hint = (p.fm.listing?.routines ?? []).map((h) => snapRoutine(h, known) ?? h);
    if (hint.join(",") !== names.join(",")) report.push(`attribution: page ${p.pdfPage} frontmatter says [${hint.join(", ")}]; code says [${names.join(", ")}]`);
  }
  const byNameSection = (r: SplitRoutine): Section | undefined =>
    routineSections.find((s) => s.id.startsWith(`${r.appendix}.`) && nameKey(s.id.split(".")[1]) === nameKey(r.name));
  // a routine the section list names differently (JTIME under E.JUL) takes the section it starts in, if no routine claims it
  const claimed = new Set(split.map(byNameSection).filter(Boolean));
  const sectionFor = (r: SplitRoutine): Section | undefined => {
    const own = byNameSection(r);
    if (own) return own;
    const s = routineSections.find((x) => x.id === r.lines[0].sectionId);
    if (s && !claimed.has(s) && split.filter((o) => !byNameSection(o) && o.lines[0].sectionId === s.id).length === 1) return s;
    // Appendix F prints each program's own OPEN and CLOSE under the program's section
    return r.appendix === "F" ? s : undefined;
  };
  for (const r of split) {
    const s = sectionFor(r);
    if (!s) report.push(`section: no sections.json entry for ${ids.get(r)} (starts page ${r.lines[0].pdfPage}, section there ${r.lines[0].sectionId})`);
    else if (s.id.split(".")[1] !== r.name) report.push(`section: ${ids.get(r)} is ${s.id} in sections.json`);
    else if (s.pdfPage !== r.lines[0].pdfPage && s.pdfPage !== firstStatementLine(r)?.pdfPage)
      report.push(`section: ${s.id} at page ${s.pdfPage}, code starts page ${r.lines[0].pdfPage}`);
  }
  for (const s of routineSections) {
    if (!split.some((r) => sectionFor(r) === s)) report.push(`section: ${s.id} (page ${s.pdfPage}) has no listing lines`);
  }

  // commons: OCR mangles block names, so a rare spelling snaps to a common one with the same confusion key
  const commonCounts = new Map<string, number>();
  const rawCommons = new Map<SplitRoutine, string[]>();
  const stmtsOf = new Map<SplitRoutine, Statement[]>();
  for (const r of split) {
    const st = statements(r.lines);
    stmtsOf.set(r, st);
    const cs = extractCommons(st);
    rawCommons.set(r, cs);
    for (const c of cs) commonCounts.set(c, (commonCounts.get(c) ?? 0) + 1);
  }
  const canonicalCommon = (c: string) => {
    const n = commonCounts.get(c)!;
    let best = c;
    for (const [o, m] of commonCounts) {
      if (m >= 3 * n && m > (commonCounts.get(best) ?? 0) && o.length === c.length && levenshtein(confusionKey(o), confusionKey(c)) <= 1) best = o;
    }
    return best;
  };

  const externalNames = [...SYSTEM_EXTERNALS, ...MISC_EXTERNALS.map((e) => e.name)];
  const routineNames = [...new Set(split.map((r) => r.name))];
  const callable = [...new Set([...routineNames, ...externalNames])].sort();
  const localCallable = new Map<Appendix, string[]>();
  for (const a of ["B", "C", "D", "E", "F"] as const)
    localCallable.set(a, [...new Set([...split.filter((r) => r.appendix === a).map((r) => r.name), ...externalNames])].sort());

  const entries: RoutineEntry[] = [];
  const sources = new Map<string, { text: string; lines: RoutineLines }>();
  const unresolvedCalls: CodeIndex["unresolvedCalls"] = [];
  const usedDescriptions = new Set<RoutineDescription>();
  const usedFlowcharts = new Set<Flowchart>();

  for (const r of split) {
    const id = ids.get(r)!;
    const lids = lineIds(r.lines);
    const st = stmtsOf.get(r)!;

    const description = input.descriptions.find(
      (d) => nameKey(d.routine) === nameKey(r.name) && DESCRIPTION_APPENDICES[d.record].includes(r.appendix),
    );
    if (description) usedDescriptions.add(description);
    const flowchart = input.flowcharts.find((f) => {
      const apps = flowchartAppendices(f.figure);
      if (!apps.includes(r.appendix)) return false;
      return MAIN_FLOWCHART.has(f.routine) ? r.name === "MAIN" && r.kind === "main" : nameKey(f.routine) === nameKey(r.name);
    });
    if (flowchart) usedFlowcharts.add(flowchart);

    const callMap = new Map<string, string[]>();
    for (const c of extractCalls(st)) {
      const name = snapCall(c.name, localCallable.get(r.appendix)!) ?? snapCall(c.name, callable) ?? c.name;
      callMap.set(name, [...(callMap.get(name) ?? []), lids[c.index]]);
    }
    const calls: RoutineEntry["calls"] = [...callMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, lines]) => {
        const targets = split.filter((o) => o.name === name);
        const target = targets.find((o) => o.appendix === r.appendix) ?? (targets.length === 1 ? targets[0] : undefined);
        if (target) return { name, target: ids.get(target)!, kind: "routine" as const, lines };
        if (externalNames.includes(name)) return { name, target: null, kind: "external" as const, lines };
        unresolvedCalls.push({ routine: id, name, lines });
        return { name, target: null, kind: "unresolved" as const, lines };
      });

    const fileMap = new Map<string, { kind: "unit" | "file"; ops: Set<string>; purpose: string | null }>();
    for (const f of extractFiles(st)) {
      const key = `${f.kind}:${f.unit}`;
      const e = fileMap.get(key) ?? { kind: f.kind, ops: new Set<string>(), purpose: null };
      e.ops.add(f.op);
      e.purpose ??= nearbyComment(r.lines, f.index);
      fileMap.set(key, e);
    }
    const files = [...fileMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true }))
      .map(([key, e]) => ({ unit: key.slice(key.indexOf(":") + 1), kind: e.kind, mode: [...e.ops].sort().join("/"), purpose: e.purpose }));

    const prompts = st.flatMap((s) => extractLiterals(s).map((text) => ({ line: lids[s.index], text })));

    const seqs = r.lines.map((l) => l.seq).filter((s): s is number => s !== null);
    const listingPages = [...new Set(r.lines.map((l) => l.pdfPage))];
    const sec = sectionFor(r);
    entries.push({
      id,
      name: r.name,
      appendix: r.appendix,
      record: description?.record === "general" ? "general" : APPENDIX_RECORD[r.appendix],
      kind: r.kind,
      sectionId: sec?.id ?? null,
      lines: r.lines.length,
      commentLines: r.lines.filter((l) => isComment(l.code)).length,
      firstSeq: seqs.length ? seqs[0] : null,
      lastSeq: seqs.length ? seqs[seqs.length - 1] : null,
      listingPages,
      symbolTablePages: symbolOf.get(r) ?? [],
      flowchartFigure: flowchart?.figure ?? null,
      flowchartPages: flowchart?.pdfPages ?? [],
      description: description?.description ?? null,
      descriptionPage: description?.pdfPage ?? null,
      calls,
      calledBy: [],
      commons: [...new Set((rawCommons.get(r) ?? []).map(canonicalCommon))].sort(),
      files,
      prompts,
      reviewed: r.lines.some((l) => l.reviewed),
    });

    const pageRuns: RoutineLines["pages"] = [];
    r.lines.forEach((l, i) => {
      const last = pageRuns[pageRuns.length - 1];
      if (last && last.pdfPage === l.pdfPage) last.lastLine = i + 1;
      else pageRuns.push({ pdfPage: l.pdfPage, firstLine: i + 1, lastLine: i + 1 });
    });
    sources.set(id, { text: r.lines.map((l) => l.code).join("\n") + "\n", lines: { routine: id, lineIds: lids, pages: pageRuns } });
  }

  const byId = new Map(entries.map((e) => [e.id, e]));
  for (const e of entries) for (const c of e.calls) if (c.target && c.target !== e.id) byId.get(c.target)!.calledBy.push(e.id);
  for (const e of entries) e.calledBy = [...new Set(e.calledBy)].sort();

  for (const d of input.descriptions) if (!usedDescriptions.has(d) && !externalNames.includes(d.routine)) report.push(`unmatched description: ${d.routine} (${d.record})`);
  for (const f of input.flowcharts) if (!usedFlowcharts.has(f)) report.push(`unmatched flowchart: ${f.routine} (${f.figure})`);
  for (const e of entries) if (e.name !== "MAIN" && !input.descriptions.some((d) => nameKey(d.routine) === nameKey(e.name))) report.push(`routine without description: ${e.id}`);
  for (const d of input.descriptions) {
    const e = entries.find((x) => nameKey(x.name) === nameKey(d.routine.replace(/\s+/g, "")));
    if (e && e.name !== d.routine) report.push(`name alias: description ${d.routine} joined to ${e.id}`);
  }
  for (const f of input.flowcharts) {
    const e = entries.find((x) => x.flowchartFigure === f.figure);
    if (e && e.name !== f.routine) report.push(`name alias: flowchart ${f.routine} (${f.figure}) joined to ${e.id}`);
  }

  const totalsOf = (es: RoutineEntry[]) => ({
    routines: es.length,
    lines: es.reduce((n, e) => n + e.lines, 0),
    commentLines: es.reduce((n, e) => n + e.commentLines, 0),
  });
  const byAppendix = {} as CodeIndex["totals"]["byAppendix"];
  for (const a of ["B", "C", "D", "E", "F"] as const) byAppendix[a] = totalsOf(entries.filter((e) => e.appendix === a));

  const vol1 = (id: string) => input.vol1Sections.find((s) => s.id === id)?.pdfPage;
  const externals: CodeIndex["externals"] = [
    ...SYSTEM_EXTERNALS.map((name) => ({ name, group: "system" as const, sectionId: "8.1", pdfPage: vol1("8.1") ?? 546 })),
    ...MISC_EXTERNALS.map((e) => ({ name: e.name, group: "miscellaneous" as const, sectionId: e.sectionId, pdfPage: vol1(e.sectionId) ?? 548 })),
  ];

  const index: CodeIndex = { totals: { ...totalsOf(entries), byAppendix }, externals, unresolvedCalls, routines: entries };
  const xref = buildXref(input.flows, entries);
  return { index: codeIndexSchema.parse(index), xref: xrefSchema.parse(xref), sources, report };
}

const RECORD_APPENDIX: Record<RecordType, Appendix> = { correspondence: "B", dir: "C", "drawing-eo": "D" };

export function buildXref(flows: Flow[], entries: RoutineEntry[]): Xref {
  const stepToRoutines: Xref["stepToRoutines"] = [];
  const unmatchedSteps: Xref["unmatchedSteps"] = [];
  const toSteps = new Map<string, { record: RecordType; step: number; score: number }[]>();
  for (const flow of [...flows].sort((a, b) => RECORDS.indexOf(a.record) - RECORDS.indexOf(b.record))) {
    const candidates = entries.filter((e) => e.appendix === RECORD_APPENDIX[flow.record]);
    for (const step of [...flow.steps].sort((a, b) => a.n - b.n)) {
      if (matchableLines(step.prompt).length === 0) continue;
      const matches = matchStep(step.prompt, candidates);
      if (matches.length === 0) {
        unmatchedSteps.push({ record: flow.record, step: step.n });
        continue;
      }
      stepToRoutines.push({ record: flow.record, step: step.n, matches });
      for (const m of matches) toSteps.set(m.routine, [...(toSteps.get(m.routine) ?? []), { record: flow.record, step: step.n, score: m.score }]);
    }
  }
  return {
    threshold: MATCH_THRESHOLD,
    stepToRoutines,
    routineToSteps: entries.filter((e) => toSteps.has(e.id)).map((e) => ({ routine: e.id, steps: toSteps.get(e.id)! })),
    unmatchedSteps,
    unmatchedRoutines: entries.filter((e) => !toSteps.has(e.id)).map((e) => e.id),
  };
}

// ---------------------------------------------------------------------------
// I/O
// ---------------------------------------------------------------------------

const json = (v: unknown) => JSON.stringify(v, null, 2) + "\n";
const readJson = (f: string): unknown => JSON.parse(readFileSync(f, "utf8"));

export function readInputs(contentRoot: string): BuildInputs {
  const vol2 = path.join(contentRoot, "docs", "cr-159064");
  const pagesDir = path.join(vol2, "pages");
  const pages = readdirSync(pagesDir)
    .filter((n) => /^page-\d{3}\.md$/.test(n))
    .sort()
    .map((n) => {
      const { frontmatter, body } = parsePageFile(readFileSync(path.join(pagesDir, n), "utf8"));
      return { pdfPage: frontmatter.pdfPage, fm: frontmatter, body };
    });
  return {
    pages,
    sections: sectionsSchema.parse(readJson(path.join(vol2, "sections.json"))),
    vol1Sections: sectionsSchema.parse(readJson(path.join(contentRoot, "docs", "cr-159063", "sections.json"))),
    descriptions: routineDescriptionsSchema.parse(readJson(path.join(contentRoot, "code", "descriptions.json"))),
    flowcharts: flowchartsSchema.parse(readJson(path.join(contentRoot, "docs", "cr-159063", "flowcharts.json"))),
    flows: RECORDS.flatMap((r) => {
      const f = path.join(contentRoot, "program", "flows", `${r}.json`);
      return existsSync(f) ? [flowSchema.parse(readJson(f))] : [];
    }),
  };
}

export function writeOutputs(contentRoot: string, out: BuildOutput) {
  const codeDir = path.join(contentRoot, "code");
  const routinesDir = path.join(codeDir, "routines");
  mkdirSync(routinesDir, { recursive: true });
  const wanted = new Set<string>();
  for (const [id, s] of out.sources) {
    wanted.add(`${id}.f`).add(`${id}.lines.json`);
    writeFileSync(path.join(routinesDir, `${id}.f`), s.text);
    writeFileSync(path.join(routinesDir, `${id}.lines.json`), json(s.lines));
  }
  // remove stale files one by one; removing the directory itself hits EPERM on Windows while it is watched
  for (const n of readdirSync(routinesDir)) if (!wanted.has(n)) rmSync(path.join(routinesDir, n));
  writeFileSync(path.join(codeDir, "index.json"), json(out.index));
  writeFileSync(path.join(codeDir, "xref.json"), json(out.xref));
}

function main() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const contentRoot = path.resolve(here, "../../content");
  const out = buildCodeIndex(readInputs(contentRoot));
  writeOutputs(contentRoot, out);
  const t = out.index.totals;
  console.log(`routines ${t.routines}, lines ${t.lines}, comment lines ${t.commentLines}`);
  for (const [a, v] of Object.entries(t.byAppendix)) console.log(`  ${a}: ${v.routines} routines, ${v.lines} lines, ${v.commentLines} comment lines`);
  console.log(`unresolved calls: ${out.index.unresolvedCalls.map((u) => `${u.routine}->${u.name}`).join(", ") || "none"}`);
  console.log(`xref: ${out.xref.stepToRoutines.length} steps matched, ${out.xref.unmatchedSteps.length} unmatched steps, ${out.xref.unmatchedRoutines.length} unmatched routines`);
  for (const r of out.report) console.log(`note ${r}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
