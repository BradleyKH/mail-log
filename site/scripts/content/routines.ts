/** Routine-name helpers shared by listing repair and the flowchart index. */

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/** Collapses glyphs Tesseract confuses in this typeface, so `HAROHD` and `HARDHD` compare closer than unrelated names. */
export function confusionKey(s: string): string {
  return s
    .toUpperCase()
    .replace(/[0OQD]/g, "O")
    .replace(/[1IL|]/g, "I")
    .replace(/[5S$]/g, "S")
    .replace(/[8B]/g, "B")
    .replace(/[6G]/g, "G")
    .replace(/[UV]/g, "U");
}

/**
 * Snaps an OCR'd name to the known list: exact match, else the unique nearest name within
 * `maxDist` edits (confusion-normalized distance breaks ties). Returns null when nothing is
 * close or two names tie.
 */
export function snapRoutine(token: string, known: readonly string[], maxDist = 2): string | null {
  const t = token.toUpperCase();
  if (known.includes(t)) return t;
  if (t.length < 3) return null;
  let best: string | null = null;
  let bestScore = Infinity;
  let tie = false;
  for (const k of known) {
    const d = levenshtein(t, k);
    if (d > maxDist) continue;
    const score = d * 10 + levenshtein(confusionKey(t), confusionKey(k));
    if (score < bestScore) {
      best = k;
      bestScore = score;
      tie = false;
    } else if (score === bestScore) tie = true;
  }
  // Short names are easy to collide (ALC, ALDR, ALDW), so allow only one edit there.
  if (best && t.length <= 4 && levenshtein(t, best) > 1) return null;
  return tie ? null : best;
}

const STOP = new Set([
  "TABLE", "CONTENTS", "PAGE", "VOL", "APPENDIX", "FILE", "MAIL", "DESIGN", "DRAWING", "GENERAL", "FOR", "AND",
  "THE", "OF", "ORDER", "REPORT", "RELEASE", "SOURCE", "GLOSSARY", "TERMS", "DATA", "BASE", "INFORMATION",
  "PREFACE", "LOGIN", "SYSTEM", "EXIT", "ENTRY", "FLOWCHARTS", "ENTRIES", "SUBROUTINES", "CORRESPONDENCE",
  "ENGINEERING", "PROGRAM", "XXX", "DIR", "DRAW", "SUBFILES", "FILES", "STRUCTURE", "SPECIAL", "SUPPORT",
  "ROUTINES", "EXTERNAL", "MISCELLANEOUS", "CONTINUED", "LISTING", "DESCRIPTION", "FIGURES", "SECTION",
]);

/** All-caps FORTRAN-style names (up to six characters) standing alone on a line or after a section number. */
export function candidateNames(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/^[\s\-_~'"‘’.:;|*]+/, "").replace(/[\s.:;|°,]+$/, "");
    const m = /^(?:[0-9][0-9.,\]]*\s+)?([A-Z][A-Z0-9]{1,5})$/.exec(line.replace(/\s+/g, " ").replace(/^([0-9.,\]]+) /, "$1 "));
    if (m && !STOP.has(m[1])) out.push(m[1]);
  }
  return out;
}

/**
 * Builds the known routine list by agreement between independent sources (each TOC, the
 * section 4 headings, the listings' own SUBROUTINE statements). A name seen in only one
 * source is kept unless it sits one edit from a better-supported name, which is how OCR
 * variants like `ARCODW` for `ARCDW` drop out.
 */
export function buildKnownRoutines(sources: string[][], always: string[] = []): string[] {
  const support = new Map<string, number>();
  for (const src of sources) for (const n of new Set(src)) support.set(n, (support.get(n) ?? 0) + 1);
  for (const a of always) support.set(a, Math.max(support.get(a) ?? 0, sources.length));
  const names = [...support.keys()].sort();
  const kept = names.filter((n) => {
    const s = support.get(n)!;
    if (s >= 2) return true;
    return !names.some((o) => o !== n && (support.get(o)! > s || (support.get(o) === s && o < n)) && levenshtein(n, o) <= 1 && support.get(o)! >= 2);
  });
  return kept.filter((n) => !/^(.)\1+$/.test(n));
}

/**
 * Picks the known name that best explains several independent readings of the same name
 * (the compiler page header and the SUBROUTINE statement), since each alone can sit one
 * edit from two names.
 */
export function snapJoint(readings: string[], known: readonly string[]): string | null {
  const rs = readings.map((r) => r.toUpperCase().replace(/[^A-Z0-9$]/g, "")).filter((r) => r.length >= 2);
  if (rs.length === 0) return null;
  let best: string | null = null;
  let bestScore = Infinity;
  for (const k of known) {
    let score = 0;
    for (const r of rs) score += Math.min(3, levenshtein(confusionKey(r), confusionKey(k))) + 0.1 * Math.min(3, levenshtein(r, k));
    if (score < bestScore) [best, bestScore] = [k, score];
  }
  return best !== null && bestScore <= 1.6 * rs.length ? best : null;
}
