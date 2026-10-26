import { levenshtein, snapRoutine } from "./routines.ts";

/**
 * FORTRAN-aware repair of one OCR'd listing statement (card columns 7 to 72). Every rule that
 * changes the text is recorded by name so repairs stay auditable. The listings are all
 * uppercase, which is what makes most of these rules safe: a lowercase letter in code is
 * always a misread.
 */

export interface RepairContext {
  /** Known routine names (internal and external) for CALL and SUBROUTINE targets. */
  known: readonly string[];
  /** Statement labels seen on the page, used to tell `WRITE(1,300)` from `WRITE(19300)`. */
  labels: ReadonlySet<string>;
}

export interface Repaired {
  text: string;
  rules: string[];
  /** Problems no rule could resolve (routine name, keyword, unbalanced parentheses). */
  unresolved: string[];
  /** The CALL/SUBROUTINE/FUNCTION target as read, before snapping. */
  nameRaw?: string;
}

export const KEYWORDS = [
  "ASSIGN", "BACKSPACE", "BLOCK", "CALL", "COMMON", "CONTINUE", "DATA", "DIMENSION", "DO", "DOUBLE", "END", "ENDFILE",
  "EQUIVALENCE", "EXTERNAL", "FORMAT", "FUNCTION", "GO", "GOTO", "IF", "IMPLICIT", "INTEGER", "LOGICAL", "PAUSE",
  "LIST", "NOLIST", "PROGRAM", "READ", "REAL", "RETURN", "REWIND", "STOP", "SUBROUTINE", "WRITE", "$INSERT",
];
const KEYWORD_SET = new Set(KEYWORDS);
/** Statements whose operands are comma lists outside any parentheses. */
const LIST_STATEMENTS = new Set(["WRITE", "READ", "COMMON", "DIMENSION", "INTEGER", "REAL", "LOGICAL", "EXTERNAL"]);
const OPERATORS: Record<string, string> = {
  EQ: "EQ", EG: "EQ", E0: "EQ", EO: "EQ", NE: "NE", "N£": "NE", NF: "NE", LT: "LT", LE: "LE", GT: "GT", GE: "GE",
  AND: "AND", OR: "OR", NOT: "NOT", "0R": "OR",
};
const DIGIT_LIKE: Record<string, string> = { O: "0", o: "0", D: "0", Q: "0", I: "1", l: "1", "|": "1", i: "1", S: "5", s: "5", B: "8", G: "6", Z: "2" };

/** Maps a label-field token to digits when every character is a digit or a common digit misread. */
export function labelDigits(token: string): string | null {
  if (!/\d/.test(token)) return null;
  let out = "";
  for (const ch of token) {
    if (/\d/.test(ch)) out += ch;
    else if (DIGIT_LIKE[ch]) out += DIGIT_LIKE[ch];
    else return null;
  }
  return out.length <= 5 ? out : null;
}

function parenBalance(s: string): { unmatchedClose: number[]; openCount: number } {
  const unmatchedClose: number[] = [];
  let depth = 0;
  let inQuote = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "'") inQuote = !inQuote;
    if (inQuote) continue;
    if (ch === "(") depth++;
    else if (ch === ")") {
      if (depth === 0) unmatchedClose.push(i);
      else depth--;
    }
  }
  return { unmatchedClose, openCount: depth };
}

const setAt = (s: string, i: number, ch: string) => s.slice(0, i) + ch + s.slice(i + 1);
const OPEN_LOOKALIKE = /[C¢€]/;

/** The statement's leading keyword, with `GO TO` reported as `GOTO`. */
export function leadingKeyword(stmt: string): string | null {
  const t = stmt.trimStart();
  const m = /^(\$?[A-Z]+)/.exec(t);
  if (!m) return null;
  if (/^GO ?TO/.test(t)) return "GOTO";
  for (const k of ["IF", "WRITE", "READ", "FORMAT", "CALL", "DO"]) {
    if (t.startsWith(k) && (t.length === k.length || /[^A-Z]/.test(t[k.length]) || (k !== "DO" && OPEN_LOOKALIKE.test(t[k.length])))) {
      if (k === "DO" && !/^DO\s*\d/.test(t)) continue;
      return k;
    }
  }
  return KEYWORD_SET.has(m[1]) ? m[1] : null;
}

export function isAssignment(stmt: string): boolean {
  return /^\s*[A-Z][A-Z0-9]*\s*(\([^=]*\))?\s*=/.test(stmt);
}

export function repairStatement(input: string, ctx: RepairContext): Repaired {
  let s = input;
  const rules: string[] = [];
  const unresolved: string[] = [];
  const apply = (name: string, next: string) => {
    if (next !== s) {
      s = next;
      if (!rules.includes(name)) rules.push(name);
    }
  };

  apply("lead-junk", s.replace(/^[^A-Za-z0-9$]+(?=[A-Z])/, ""));
  apply("cent-paren", s.replace(/[¢€{[]/g, "(").replace(/[}\]]/g, ")"));
  apply("do-zero", s.replace(/^(\s*)(?:00|0O|O0|OO|D0|Do|0o)(\s+\d)/, "$1DO$2"));
  apply("keyword", snapKeyword(s));

  const kw = leadingKeyword(s.replace(/[a-z]/g, (c) => c.toUpperCase()));
  if (kw === "FORMAT") {
    apply("io-paren", s.replace(/^(\s*)FORMAT\s?[C(]/i, "$1FORMAT("));
    // FORMAT has no use for `*` or these glyphs, so they can only be misread apostrophes.
    apply("format-quote", s.replace(/[*®°‘’`"]/g, "'"));
    return { text: s, rules, unresolved };
  }

  apply("rel-op", fixOperators(s));
  apply("goto-dot", s.replace(/\bGO[.,]\s?TO\b/g, "GO TO"));
  if (kw === "IF" && unclosedOpeners(s) > 0) apply("goto-paren", s.replace(/([A-Z0-9])\s?[Il|]\s?(GO\s?TO\b)/, "$1)$2"));

  if (kw === "CALL") apply("call-paren", fixCallName(s, ctx.known));
  // Innermost first: subscripts like `DACI)` close before the statement's own opener does.
  for (let guard = 0; parenBalance(s).unmatchedClose.length > 0 && guard < 10; guard++) {
    const next = fixSubscriptParen(s);
    if (next !== s) {
      apply("subscript-paren", next);
      continue;
    }
    const before = s;
    if (kw === "IF") apply("if-paren", s.replace(/^(\s*IF\s?)[C¢€]/, "$1("));
    if (kw === "WRITE" || kw === "READ") apply("io-paren", s.replace(/^(\s*(?:WRITE|READ)\s?)[Cc¢€]/, "$1("));
    if (kw === "CALL") apply("call-paren", fixCallParen(s, ctx.known));
    if (s === before) break;
  }

  if (kw === "WRITE" || kw === "READ") apply("io-comma", fixIoComma(s, ctx.labels));
  apply("arg-comma", fixArgCommas(s, kw !== null && LIST_STATEMENTS.has(kw)));
  apply("letter-0", s.replace(/(?<=[A-Z])0(?=[A-Z])/g, "O"));
  apply("digit-o", s.replace(/\b(GO ?TO\s*)([0-9OoDQ]{1,5})\b/g, (_m, g: string, n: string) => g + n.replace(/[OoDQ]/g, "0")));
  apply("digit-o", s.replace(/(?<![A-Z0-9$])(?=[0-9OoQ]*\d)[0-9OoQ]{2,}(?![A-Z0-9$])/g, (n) => n.replace(/[OoQ]/g, "0")));
  apply("digit-o", s.replace(/(?<=[=(,]|\.[A-Z]{2,3}\.)O(?=[),.]|$)/g, "0"));
  if (kw !== "DATA") apply("ident-1I", s.replace(/(^|[\s(,=+\-*/])1(?=[A-Z][A-Z0-9]*(?:[\s),=+\-*/.]|$))/g, "$1I"));
  apply("upper", s.replace(/[a-df-np-rt-z]/g, (c) => c.toUpperCase()));

  let nameRaw: string | undefined;
  const kw2 = leadingKeyword(s);
  if (kw2 === "CALL" || kw2 === "SUBROUTINE" || kw2 === "FUNCTION") {
    const m = /^(\s*(?:CALL|SUBROUTINE|FUNCTION)\s*)([A-Z0-9$]+)/.exec(s);
    if (m) {
      nameRaw = m[2];
      const snapped = snapRoutine(m[2], ctx.known);
      if (snapped === null) unresolved.push(`routine ${m[2]}`);
      else if (snapped !== m[2]) apply("routine-snap", m[1] + snapped + s.slice(m[0].length));
    }
  }
  if (kw2 === null && !isAssignment(s) && s.trim() !== "") unresolved.push(`keyword ${s.trim().split(/[\s(=]/)[0] || s.trim()}`);
  const bal = parenBalance(s);
  if (bal.unmatchedClose.length > 0 || bal.openCount > 0) unresolved.push("unbalanced parentheses");
  return { text: s, rules, unresolved, nameRaw };
}

/** Openers still waiting for a `)`, counting a `C` misread for `(` right after `IF`. */
function unclosedOpeners(s: string): number {
  const b = parenBalance(s);
  return b.openCount + (/^\s*IF\s?[C¢€]/.test(s) ? 1 : 0) - b.unmatchedClose.length;
}

/** Snaps a misspelled leading keyword (`SUHROUTINE`, `RF TURN`, `CONTINUF`), never an assignment target. */
function snapKeyword(s: string): string {
  const m = /^(\s*)([A-Za-z$]+)(\s?)([A-Za-z]*)/.exec(s);
  if (!m) return s;
  const [, lead, w1, sp, w2] = m;
  const rest = s.slice(m[0].length);
  const after = rest.trimStart()[0];
  if (after === "=") return s;
  const up1 = w1.toUpperCase();
  if (/^(IF|WRITE|READ|FORMAT|CALL)[C¢]/.test(up1)) return s;
  if (KEYWORD_SET.has(up1)) return lead + up1 + sp + w2 + rest;
  const best = (word: string) => {
    if (word.length < 4) return null;
    let found: string | null = null;
    let bestD = Infinity;
    let tie = false;
    for (const k of KEYWORDS) {
      if (k.length < 4) continue;
      const d = levenshtein(word, k);
      if (d < bestD) [found, bestD, tie] = [k, d, false];
      else if (d === bestD) tie = true;
    }
    const limit = word.length >= 8 ? 2 : 1;
    return found && bestD <= limit && !tie ? found : null;
  };
  if (sp && w2) {
    const joined = best((w1 + w2).toUpperCase());
    if (joined && !KEYWORD_SET.has(w2.toUpperCase())) return lead + joined + rest;
  }
  const one = best(up1);
  if (one) return lead + one + sp + w2 + rest;
  // A keyword glued to a misread "(" (FCRMATC, WRITFC).
  const glued = /[C¢]$/.test(up1) ? best(up1.slice(0, -1)) : null;
  if (glued && ["IF", "WRITE", "READ", "FORMAT", "CALL"].includes(glued)) return lead + glued + w1.slice(-1) + sp + w2 + rest;
  // IF with its I misread, followed by its condition.
  return s.replace(/^(\s*)[TL1l|]F(?=\s?[C(¢][^=]*\)\s*[A-Z])/, "$1IF");
}

/**
 * Dotted operators with their dots misread: `TEVDeLEoTIM` is `TEVD.LE.TIM`. The opening dot
 * may be any of `.,eos:«*`; the closing one may also come out as `S` or `5` once the opening
 * one is clearly a misread.
 */
function fixOperators(s: string): string {
  return s.replace(
    /(?<=[A-Z0-9)'\s])\s?([.,eos:;«*£])\s?(AND|NOT|EQ|EG|E0|EO|NE|N£|NF|LT|LE|GT|GE|OR|0R)\s?([.,eos:;«*£]|[S5](?=[A-Z0-9(]))/g,
    (m, _a: string, op: string) => (OPERATORS[op] ? `.${OPERATORS[op]}.` : m),
  );
}

/** `CALL SCRNHDCITEM)` is `CALL SCRNHD(ITEM)`: the `C` that ends the longest known routine name opens the arguments. */
function fixCallParen(s: string, known: readonly string[]): string {
  const m = /^(\s*CALL\s*)([A-Z0-9$]*[C¢€][A-Z0-9$ ,.(=+\-*/a-z]*\))/.exec(s);
  if (!m || m[2].includes("(")) return s;
  const body = m[2];
  const candidates: number[] = [];
  for (let i = 1; i <= Math.min(7, body.length - 1); i++) if (OPEN_LOOKALIKE.test(body[i])) candidates.push(i);
  if (candidates.length === 0) return s;
  const knownHit = candidates.find((i) => known.includes(body.slice(0, i).replace(/SS$/, "$$$$")));
  const nearHit = candidates.find((i) => snapRoutine(body.slice(0, i), known) !== null);
  const pick = knownHit ?? nearHit ?? candidates[candidates.length - 1];
  return m[1] + setAt(body, pick, "(") + s.slice(m[0].length);
}

/** `CALL SRCHSSCKSCLOS,...`: a name too long to be one, which a known name plus `C` explains, opens its arguments there. */
function fixCallName(s: string, known: readonly string[]): string {
  const m = /^(\s*CALL\s*)([A-Z0-9$]+)([C¢€])/.exec(s);
  if (!m) return s;
  const word = /^[A-Z0-9$]+/.exec(s.slice(m[1].length))![0];
  if (word.length <= 6 && snapRoutine(word, known) !== null) return s;
  for (let i = Math.min(7, word.length - 1); i >= 3; i--) {
    if (OPEN_LOOKALIKE.test(word[i]) && snapRoutine(word.slice(0, i), known) !== null) return m[1] + setAt(s.slice(m[1].length), i, "(");
  }
  return s;
}

/** For the rightmost unmatched `)`, turn the nearest `C` that follows an identifier and opens a short subscript into `(`. */
function fixSubscriptParen(s: string): string {
  const { unmatchedClose } = parenBalance(s);
  if (unmatchedClose.length === 0) return s;
  const close = unmatchedClose[0];
  for (let i = close - 1; i > 0; i--) {
    const ch = s[i];
    if (ch === "(" || ch === ")") break;
    if (!OPEN_LOOKALIKE.test(ch)) continue;
    const inner = s.slice(i + 1, close);
    if (/^[A-Z0-9+\-*,e ]{1,12}$/.test(inner) && /[A-Z0-9 ]/.test(s[i - 1])) return setAt(s, i, "(");
  }
  return s;
}

/** `WRITE(19300)` with a FORMAT labeled 300 on the page is `WRITE(1,300)`. */
function fixIoComma(s: string, labels: ReadonlySet<string>): string {
  return s.replace(/^(\s*(?:WRITE|READ)\s?\()(\d{1,2})\s?([9es«.;:,])\s?(\d{1,5})\)/, (m, head: string, unit: string, sep: string, fmt: string) => {
    if (sep === ",") return m;
    if (sep === "9" && !labels.has(fmt)) return m;
    return `${head}${unit},${fmt})`;
  });
}

/** Lowercase `e`, `s`, and `«` between operands inside parentheses are commas once operators are fixed. */
function fixArgCommas(s: string, topLevelList: boolean): string {
  let depth = 0;
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);
    if ((depth > 0 || topLevelList) &&/[es«]/.test(ch) && /[A-Z0-9)]/.test(s[i - 1] ?? "") && /[A-Z0-9( ]/.test(s[i + 1] ?? "")) out += ",";
    else out += ch;
  }
  return out;
}
