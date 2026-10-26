import { estimateLinePitch, estimatePitch, estimateX1, STRICT_SEQ, type Grid } from "./geometry.ts";
import { labelDigits, leadingKeyword, repairStatement, type RepairContext } from "./fortran.ts";
import { snapJoint, snapRoutine } from "./routines.ts";
import { groupLines, meanConf, median, type OcrLine, type Word } from "./tsv.ts";

/**
 * Rebuilds one compiler-listing page (Volume II appendices) from Tesseract word boxes. Card
 * columns come from x positions on the printer's fixed pitch, sequence numbers from each
 * line's slot on the vertical line grid plus a vote over the OCR'd numbers (they are
 * consecutive, so one good reading fixes the whole page), and statements from the FORTRAN
 * repair rules. The default-PSM reading of the same line is used instead when it repairs
 * more cleanly.
 */

export interface LineRepair {
  seq: string | null;
  raw: string;
  out: string;
  rules: string[];
}

export interface ListingPage {
  /** code: statements; xref: compiler symbol table; none: not a listing page. */
  type: "code" | "xref" | "none";
  body: string[];
  listingPage: number | null;
  /** SUBROUTINE/FUNCTION names declared on the page, in order, and whether an END precedes the first. */
  declared: string[];
  /** The raw OCR readings behind `declared`. */
  declaredRaw: string[];
  endBeforeFirstDeclared: boolean;
  headerRoutine: string | null;
  headerRaw: string | null;
  firstSeq: number | null;
  lastSeq: number | null;
  confidence: number;
  problems: string[];
  repairs: LineRepair[];
}

export interface ListingContext {
  known: readonly string[];
  /** Last sequence number of the previous listing page in the same appendix. */
  prevLastSeq: number | null;
  /** Appendices B to D print sequence numbers; E and F do not. */
  numbered: boolean;
}

const pad4 = (n: number) => String(n).padStart(4, "0");
const center = (w: Word) => w.top + w.height / 2;
const isNoise = (w: Word) => !/[A-Za-z0-9]/.test(w.text) && w.text.length <= 2 && w.conf < 60;
const SEQ_CHARS = /[0-9OoGCcDQUuJe]/g;

function findHeader(lines: OcrLine[]): { index: number; listingPage: number | null; text: string } | null {
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const ws = lines[i].words;
    const p = ws.findIndex((w) => /PAGE$/i.test(w.text.replace(/[^A-Za-z]/g, "")) && w.text.replace(/[^A-Za-z]/g, "").length <= 5);
    if (p < 0 || p + 1 >= ws.length) continue;
    const num = ws[p + 1].text.replace(/[^0-9A-Za-z]/g, "");
    if (num.length < 3 || num.length > 5) continue;
    const digits = labelDigits(num) ?? labelDigits(num.replace(/[A-Za-z]/g, "0"));
    return {
      index: i,
      listingPage: digits !== null && digits.length === 4 && Number(digits) > 0 ? Number(digits) : null,
      text: ws.slice(0, p).filter((w) => w.conf >= 30 && /[A-Za-z]{2}/.test(w.text)).map((w) => w.text).join(" "),
    };
  }
  return null;
}

/** Similarity of an OCR'd sequence token to a candidate number, tolerant of the usual digit misreads. */
export function seqSimilarity(raw: string, n: number): number {
  const target = pad4(n);
  const chars = raw.replace(/^[(cC¢€]+(?=[0-9OoGCcDQUu6]{4})/, "").replace(/[().,:;'"\s]/g, "");
  if (chars.length === 0) return 0;
  let best = 0;
  const padded = chars.length < 4 ? " ".repeat(4 - chars.length) + chars : chars;
  for (let off = 0; off + 4 <= padded.length; off++) {
    let score = 0;
    for (let k = 0; k < 4; k++) score += charSim(padded[off + k], target[k]);
    best = Math.max(best, score);
  }
  return best;
}

const LOOKS: Record<string, string> = {
  "0": "OoDQGCcUu6e", "1": "IlLi|7J", "2": "Zz7", "3": "8", "4": "A", "5": "Ss68", "6": "Gb058", "7": "1T", "8": "B356e", "9": "g",
};
function charSim(c: string, d: string): number {
  if (c === d) return 1;
  return LOOKS[d]?.includes(c) ? 0.6 : 0;
}

/** The clean reading of a sequence token, when every character is a digit or `O`/`o`. */
function cleanSeq(raw: string): number | null {
  const m = /^\(?([0-9Oo]{4})\)?[.,]?$/.exec(raw);
  return m ? Number(m[1].replace(/[Oo]/g, "0")) : null;
}

interface Row {
  y: number;
  seqWord: Word | null;
  code: Word[];
  slot: number;
}

export function analyzeListingPage(psmWords: Word[], altWords: Word[], ctx: ListingContext): ListingPage {
  const lines = groupLines(psmWords);
  const pitch = estimatePitch(lines);
  const header = findHeader(lines);
  const bodyLines = header ? lines.slice(header.index + 1) : lines;
  const result: ListingPage = {
    type: "none",
    body: [],
    listingPage: header?.listingPage ?? null,
    declared: [],
    declaredRaw: [],
    endBeforeFirstDeclared: false,
    headerRoutine: null,
    headerRaw: null,
    firstSeq: null,
    lastSeq: null,
    confidence: 0,
    problems: [],
    repairs: [],
  };
  let headerRaw: string | null = null;
  if (header) {
    const m = /(?:SU\w*TIN\w*|FUNCTION)\s*([A-Z0-9$]+?)(?:[C(][^)]*\)|\s|$)/i.exec(header.text);
    if (m) headerRaw = m[1];
    result.headerRaw = headerRaw;
    if (headerRaw) result.headerRoutine = snapJoint([headerRaw], ctx.known);
  }

  const strict = bodyLines.flatMap((l) => l.words.filter((w) => STRICT_SEQ.test(w.text)));
  const looseSeq = (w: Word) => (w.text.match(SEQ_CHARS)?.length ?? 0) >= 3 && w.text.length <= 8 && /\d/.test(w.text);
  let seqX: number | null = null;
  if (ctx.numbered) {
    if (strict.length >= 2) seqX = median(strict.map((w) => w.left));
    else {
      const loose = bodyLines.map((l) => l.words[0]).filter((w) => w && looseSeq(w) && (w.text.includes(")") || /^[(cC¢€][0-9OoGCcDQ]{4}/.test(w.text)));
      if (loose.length >= 2) seqX = median(loose.map((w) => w.left));
    }
  }

  const solidLines = bodyLines.filter((l) => l.words.some((w) => w.conf >= 50 && /[A-Za-z0-9]{2}/.test(w.text)));
  if (seqX === null) {
    const codeLike = solidLines.filter((l) => leadingKeyword(l.words.map((w) => w.text).join(" ").replace(/^\W+/, "")) !== null).length;
    const xrefLike = solidLines.filter((l) => l.words.some((w) => /^[0-9OoGCcDQ]{6}[.,:]?$/.test(w.text))).length;
    if (!ctx.numbered && codeLike >= 4) return finishUnnumbered(result, bodyLines, pitch, altWords, ctx);
    // A compiler page header with no numbered lines under it is the tail of a symbol table.
    if ((xrefLike >= 3 || (ctx.numbered && header !== null)) && solidLines.length >= 1) return finishXref(result, bodyLines, pitch);
    return result;
  }

  const rows: Row[] = [];
  const firstLefts: number[] = [];
  for (const l of bodyLines) {
    const si = l.words.findIndex((w) => Math.abs(w.left - seqX!) < pitch * 2.5 && looseSeq(w));
    const seqWord = si >= 0 ? l.words[si] : null;
    const after = seqWord ? l.words.slice(si + 1) : l.words.filter((w) => w.left > seqX! + pitch * 5);
    const code = after.filter((w) => !isNoise(w));
    if (!seqWord && !code.some((w) => w.conf >= 50 && /[A-Za-z0-9]{3}/.test(w.text))) continue;
    if (seqWord && code[0]) firstLefts.push(code[0].left);
    const ys = [...(seqWord ? [seqWord] : []), ...code].filter((w) => /[A-Za-z0-9]/.test(w.text)).map(center);
    if (ys.length === 0) continue;
    rows.push({ y: median(ys), seqWord, code, slot: 0 });
  }
  if (rows.length === 0) return result;

  let x1 = estimateX1(firstLefts, pitch);
  const offset = (x1 - seqX) / pitch;
  if (!Number.isFinite(offset) || offset < 7 || offset > 8.6) x1 = seqX + 7.85 * pitch;
  const grid: Grid = { pitch, x1, seqX, linePitch: estimateLinePitch(rows.filter((r) => r.seqWord).map((r) => r.y)) };
  if (!Number.isFinite(grid.linePitch)) grid.linePitch = 38;

  // Slots on the vertical grid; refit the pitch once against the first assignment.
  const y0 = rows[0].y;
  for (const r of rows) r.slot = Math.round((r.y - y0) / grid.linePitch);
  const last = rows[rows.length - 1];
  if (last.slot > 0) {
    grid.linePitch = (last.y - y0) / last.slot;
    for (const r of rows) r.slot = Math.round((r.y - y0) / grid.linePitch);
  }
  const offGrid = rows.filter((r) => Math.abs((r.y - y0) / grid.linePitch - r.slot) > 0.35).length;
  const merged: Row[] = [];
  let collisions = 0;
  for (const r of rows) {
    const prev = merged[merged.length - 1];
    if (prev && prev.slot === r.slot) {
      collisions++;
      prev.code = [...prev.code, ...r.code].sort((a, b) => a.left - b.left);
      prev.seqWord ??= r.seqWord;
    } else merged.push(r);
  }

  const seqs = assignSequence(merged.map((r) => ({ seqRaw: r.seqWord?.text ?? null, slot: r.slot })), ctx.prevLastSeq);
  const support = merged.filter((r, i) => r.seqWord && cleanSeq(r.seqWord.text) === seqs[i]).length;
  const withSeq = merged.filter((r) => r.seqWord).length;
  if (support < Math.max(2, withSeq * 0.25)) result.problems.push(`sequence numbers weakly supported (${support} of ${merged.length} lines read cleanly)`);
  if (ctx.prevLastSeq !== null && seqs[0] !== ctx.prevLastSeq + 1 && seqs[0] !== ctx.prevLastSeq && seqs[0] > 1)
    result.problems.push(`sequence starts at ${pad4(seqs[0])}, previous page ended at ${pad4(ctx.prevLastSeq)}`);
  if (collisions + offGrid > 0) result.problems.push(`${collisions + offGrid} line(s) off the line grid`);

  const labels = collectLabels(merged.map((r) => r.code), grid);
  const rctx: RepairContext = { known: ctx.known, labels };
  const unresolved: string[] = [];
  let unbalanced = 0;
  const confWords: Word[] = [];
  for (const [i, r] of merged.entries()) {
    const seq = seqs[i];
    const alt = altWords.filter((w) => Math.abs(center(w) - r.y) < grid.linePitch * 0.45 && w.left >= grid.x1 - grid.pitch * 0.6);
    const line = bestCard(r.code, alt, grid, rctx);
    confWords.push(...r.code);
    noteDeclarations(result, line, ctx.known);
    for (const u of line.unresolved) {
      if (u === "unbalanced parentheses") unbalanced++;
      else unresolved.push(u);
    }
    const out = `(${pad4(seq)}) ${line.card}`.trimEnd();
    result.body.push(out);
    const raw = `${r.seqWord?.text ?? "?"} ${r.code.map((w) => w.text).join(" ")}`;
    const rules = [...line.rules];
    if (!r.seqWord || cleanSeq(r.seqWord.text) !== seq) rules.unshift("seq-inferred");
    if (rules.length > 0) result.repairs.push({ seq: pad4(seq), raw, out, rules });
  }
  if (unbalanced > 0) result.problems.push(`${unbalanced} line(s) with unbalanced parentheses`);
  if (unresolved.length > 0) result.problems.push(`unresolved: ${[...new Set(unresolved)].sort().join(", ")}`);
  result.type = "code";
  result.firstSeq = seqs[0];
  result.lastSeq = seqs[seqs.length - 1];
  const penalty = merged.length > 0 ? (unbalanced + unresolved.length) / merged.length : 0;
  result.confidence = meanConf(confWords) * (1 - Math.min(0.5, penalty));
  return result;
}

/**
 * Assigns a sequence number to every row. Numbers normally step by one per printed line, but
 * lines pulled in by `$INSERT` all repeat the number of the insert statement, so each step may
 * also be zero. A small dynamic program picks the path that best explains the OCR'd numbers,
 * with continuity from the previous page as a soft prior.
 */
export function assignSequence(rows: { seqRaw: string | null; slot: number }[], prevLast: number | null): number[] {
  if (rows.length === 0) return [];
  const starts = new Set<number>();
  for (const r of rows) {
    if (!r.seqRaw) continue;
    const reads = [cleanSeq(r.seqRaw), r.seqRaw.replace(/[^0-9]/g, "").length === 4 ? Number(r.seqRaw.replace(/[^0-9]/g, "")) : null];
    for (const c of reads) if (c !== null) for (let k = 0; k <= r.slot; k++) if (c - k >= 1) starts.add(c - k);
  }
  if (prevLast !== null) [prevLast, prevLast + 1].forEach((v) => starts.add(v));
  if (starts.size === 0) starts.add(1);
  const emit = (r: { seqRaw: string | null }, v: number) => (r.seqRaw ? 4 - seqSimilarity(r.seqRaw, v) : 2);
  type State = { cost: number; path: number[] };
  let states = new Map<number, State>();
  for (const v of [...starts].sort((a, b) => a - b)) {
    const prior = prevLast === null ? 0 : v === prevLast + 1 ? 0 : v === prevLast ? 1 : 3;
    states.set(v, { cost: prior + emit(rows[0], v), path: [v] });
  }
  for (let i = 1; i < rows.length; i++) {
    const g = Math.max(1, rows[i].slot - rows[i - 1].slot);
    const next = new Map<number, State>();
    for (const [v, st] of states) {
      for (let d = 0; d <= g + 1; d++) {
        const trans = d === g ? 0 : d === 0 ? 0.5 : 2.5;
        const nv = v + d;
        const cost = st.cost + trans + emit(rows[i], nv);
        const cur = next.get(nv);
        if (!cur || cost < cur.cost) next.set(nv, { cost, path: [...st.path, nv] });
      }
    }
    const best = Math.min(...[...next.values()].map((s) => s.cost));
    states = new Map([...next].filter(([, s]) => s.cost <= best + 12).sort((a, b) => a[1].cost - b[1].cost).slice(0, 150).sort((a, b) => a[0] - b[0]));
  }
  let best: State | null = null;
  for (const st of states.values()) if (!best || st.cost < best.cost) best = st;
  return best!.path;
}

const colOf = (w: Word, g: Grid) => Math.round((w.left - g.x1) / g.pitch) + 1;

function collectLabels(rows: Word[][], grid: Grid): Set<string> {
  const labels = new Set<string>();
  for (const ws of rows) {
    const w = ws[0];
    if (w && colOf(w, grid) <= 5) {
      const d = labelDigits(w.text);
      if (d) labels.add(String(Number(d)));
    }
  }
  return labels;
}

interface Card {
  card: string;
  rules: string[];
  unresolved: string[];
  score: number;
  nameRaw?: string;
}

/** Places words on card columns 1 to 72 and repairs the statement field. */
export function buildCard(words: Word[], grid: Grid, rctx: RepairContext): Card {
  const rules: string[] = [];
  const kept = words.filter((w) => {
    if (isNoise(w)) return false;
    if (colOf(w, grid) > 72) {
      if (!rules.includes("beyond-72")) rules.push("beyond-72");
      return false;
    }
    return true;
  });
  const chars: string[] = [];
  const put = (col: number, text: string) => {
    let i = Math.max(0, col - 1);
    if (chars.length > 0 && i <= chars.length) i = chars.length + (chars.length > 0 ? 1 : 0);
    while (chars.length < i) chars.push(" ");
    for (const ch of text) chars.push(ch);
  };
  const first = kept[0];
  let comment = false;
  let rest = kept;
  if (first && colOf(first, grid) <= 5) {
    const label = labelDigits(first.text.replace(/[.,]$/, ""));
    // Statements never start left of column 6, so anything there that is not a label marks a comment.
    if (label === null && (/[Cc¢€*]/.test(first.text) || colOf(first, grid) <= 2)) {
      comment = true;
      if (first.text !== "C") rules.push("comment-c");
      put(1, "C");
      const cAt = first.text.search(/[Cc¢€*]/);
      const tail = first.text.slice(cAt + 1).replace(/^[^A-Za-z0-9]+/, "").replace(/^[cC]?[^A-Za-z0-9]*$/, "");
      if (tail) put(colOf(first, grid) + 1, tail);
      rest = kept.slice(1);
    } else if (label !== null) {
      if (label !== first.text) rules.push("label-digit");
      put(colOf(first, grid), label);
      rest = kept.slice(1);
    }
  }
  if (comment) {
    for (const w of rest) put(colOf(w, grid), w.text);
    return { card: chars.join("").trimEnd(), rules, unresolved: [], score: 0 };
  }
  let i = 0;
  const c0 = rest[0] ? colOf(rest[0], grid) : 0;
  if (rest[0] && c0 >= 5 && c0 <= 7 && rest.length > 1 && /^[1-9lI|&*$+][^A-Za-z0-9]{0,2}$/.test(rest[0].text) && colOf(rest[1], grid) > c0 + 1) {
    const mark = /^[lI|]/.test(rest[0].text) ? "1" : rest[0].text[0];
    if (rest[0].text !== mark || c0 !== 6) rules.push("continuation");
    put(6, mark);
    i = 1;
  }
  const continuation = i === 1;
  while (chars.length < 6) chars.push(" ");
  const stmtChars: string[] = [];
  const putStmt = (col: number, text: string) => {
    let at = Math.max(0, col - 7);
    if (stmtChars.length > 0 && at <= stmtChars.length) at = stmtChars.length + 1;
    while (stmtChars.length < at) stmtChars.push(" ");
    for (const ch of text) stmtChars.push(ch);
  };
  for (const w of rest.slice(i)) putStmt(colOf(w, grid), w.text);
  const stmt = stmtChars.join("").trimEnd();
  const lead = /^\s*/.exec(stmt)![0];
  const repaired = continuation ? { text: stmt.trim(), rules: [], unresolved: [] as string[], nameRaw: undefined } : repairStatement(stmt.trim(), rctx);
  // Prose with no keyword, assignment, or parentheses is a comment whose C was lost.
  if (!continuation && repaired.unresolved.some((u) => u.startsWith("keyword ")) && !/[=()]/.test(stmt) && /^[A-Za-z]{2,}(\s+\S+)+$/.test(stmt.trim())) {
    const card = ("C" + chars.join("").slice(1) + stmt).trimEnd();
    return { card, rules: [...rules, "comment-inferred"], unresolved: [], score: 0 };
  }
  const card = (chars.join("") + lead + repaired.text).trimEnd();
  const text = repaired.text;
  const odd = (text.match(/[^A-Z0-9 =+\-*/(),.$'":&]/g) ?? []).length;
  return { card, rules: [...rules, ...repaired.rules], unresolved: repaired.unresolved, score: repaired.unresolved.length * 3 + odd, nameRaw: repaired.nameRaw };
}

function bestCard(primary: Word[], alt: Word[], grid: Grid, rctx: RepairContext): Card {
  const a = buildCard(primary, grid, rctx);
  if (a.score === 0 || alt.length === 0) return a;
  const b = buildCard(alt, grid, rctx);
  // Comments never switch: the default-PSM pass reads comment text no better.
  if (/^C/.test(a.card) || /^C/.test(b.card)) return a;
  const better = b.score < a.score || (b.score === a.score && meanConf(alt) >= meanConf(primary) + 15);
  return better ? { ...b, rules: ["alt-ocr", ...b.rules] } : a;
}

function noteDeclarations(result: ListingPage, line: Card, known: readonly string[]) {
  const card = line.card;
  const stmt = card.slice(6).trim();
  if (/^C/.test(card)) return;
  if (/^END$/.test(stmt) && result.declared.length === 0 && result.body.length > 0) result.endBeforeFirstDeclared = true;
  const m = /^(?:(?:INTEGER|REAL|LOGICAL)(?:\*\d)?\s+)?(?:SUBROUTINE|FUNCTION)\s*([A-Z0-9$]+)/.exec(stmt);
  if (m) {
    result.declaredRaw.push(line.nameRaw ?? m[1]);
    result.declared.push(snapRoutine(m[1], known) ?? m[1]);
  }
}

function finishUnnumbered(result: ListingPage, lines: OcrLine[], pitch: number, altWords: Word[], ctx: ListingContext): ListingPage {
  const rows = lines
    .map((l) => l.words.filter((w) => !isNoise(w)))
    .filter((ws) => ws.some((w) => w.conf >= 40 && /[A-Za-z0-9]{2}/.test(w.text)));
  const firsts = rows.map((ws) => ws.find((w) => /[A-Za-z0-9]{2}/.test(w.text))?.left ?? ws[0].left);
  const grid: Grid = { pitch, x1: estimateX1(firsts, pitch), seqX: null, linePitch: 38 };
  if (!Number.isFinite(grid.x1)) return result;
  const labels = collectLabels(rows, grid);
  const rctx: RepairContext = { known: ctx.known, labels };
  const words: Word[] = [];
  let unbalanced = 0;
  const unresolved: string[] = [];
  for (const ws of rows) {
    // Words left of column 1 are margin noise on these pages.
    const inside = ws.filter((w) => colOf(w, grid) >= 1);
    if (inside.length === 0) continue;
    const y = median(inside.map(center));
    const alt = altWords.filter((w) => Math.abs(center(w) - y) < 17 && colOf(w, grid) >= 1);
    const line = bestCard(inside, alt, grid, rctx);
    if (line.card.trim() === "") continue;
    words.push(...inside);
    noteDeclarations(result, line, ctx.known);
    for (const u of line.unresolved) {
      if (u === "unbalanced parentheses") unbalanced++;
      else unresolved.push(u);
    }
    result.body.push(line.card);
    if (line.rules.length > 0) result.repairs.push({ seq: null, raw: inside.map((w) => w.text).join(" "), out: line.card, rules: line.rules });
  }
  if (unbalanced > 0) result.problems.push(`${unbalanced} line(s) with unbalanced parentheses`);
  if (unresolved.length > 0) result.problems.push(`unresolved: ${[...new Set(unresolved)].sort().join(", ")}`);
  result.type = "code";
  const penalty = result.body.length > 0 ? (unbalanced + unresolved.length) / result.body.length : 0;
  result.confidence = meanConf(words) * (1 - Math.min(0.5, penalty));
  return result;
}

/** Symbol-table pages: columns kept on the printer pitch, no repairs. */
function finishXref(result: ListingPage, lines: OcrLine[], pitch: number): ListingPage {
  const rows = lines
    .map((l) => l.words.filter((w) => !isNoise(w) && w.conf >= 20))
    .filter((ws) => ws.some((w) => w.conf >= 50 && /[A-Za-z0-9]{2}/.test(w.text)));
  const lefts = rows.map((ws) => ws[0].left);
  const x0 = median(lefts) - pitch;
  const words: Word[] = [];
  for (const ws of rows) {
    const inside = ws.filter((w) => w.left >= x0 - pitch);
    let line = "";
    for (const w of inside) {
      const col = Math.max(0, Math.round((w.left - x0) / pitch));
      line = line.length > 0 && col <= line.length ? `${line} ${w.text}` : line.padEnd(col) + w.text;
    }
    if (line.trim() === "") continue;
    words.push(...inside);
    result.body.push(line.trimEnd());
  }
  const minIndent = Math.min(...result.body.map((l) => /^ */.exec(l)![0].length));
  result.body = result.body.map((l) => l.slice(minIndent));
  result.type = "xref";
  result.confidence = meanConf(words);
  return result;
}
