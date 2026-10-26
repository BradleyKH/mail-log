import { groupLines, meanConf, type Word } from "./tsv.ts";

/** Conservative cleanup of prose OCR: drop junk, fence column-aligned regions, never reword. */

const ROMAN = /^[ivxlc]{1,7}$/i;

/**
 * Printed folios sit alone on a line near the bottom (or top) of the page as `- 28 -`,
 * `-iii-`, `- page 11 -`, or `B-25`. Returns the folio and the line index to remove.
 */
export function detectFolio(lines: string[]): { folio: string | null; index: number | null } {
  const nonBlank = lines.map((l, i) => [l.trim(), i] as const).filter(([l]) => l !== "");
  const candidates = [...nonBlank.slice(-3).reverse(), ...nonBlank.slice(0, 2)];
  for (const [l, i] of candidates) {
    const dashed = /^[-\u2014\u2013~_.]+\s*([0-9]{1,3}|[ivxlcIVX]{1,7})\s*[-\u2014\u2013~_.]+$/.exec(l);
    if (dashed && (/^\d+$/.test(dashed[1]) || ROMAN.test(dashed[1]))) return { folio: dashed[1].toLowerCase(), index: i };
    const paged = /^[-—–~_.]*\s*page\s+([0-9]{1,3})\s*[-—–~_.]+$/i.exec(l);
    if (paged) return { folio: paged[1], index: i };
    const appendix = /^([A-K])\s*-\s*([0-9]{1,3})$/.exec(l);
    if (appendix) return { folio: `${appendix[1]}-${appendix[2]}`, index: i };
  }
  return { folio: null, index: null };
}

const alnumCount = (s: string) => (s.match(/[A-Za-z0-9]/g) ?? []).length;
const collapse = (s: string) => s.trim().replace(/\s+/g, " ");

/** Mean confidence per text line, matched in order to the TSV's lines by their words. */
export function lineConfidences(lines: string[], words: Word[]): (number | null)[] {
  const tsvLines = groupLines(words).map((l) => ({ text: collapse(l.words.map((w) => w.text).join(" ")), conf: meanConf(l.words) }));
  const out: (number | null)[] = [];
  let j = 0;
  for (const line of lines) {
    const t = collapse(line);
    if (t === "") {
      out.push(null);
      continue;
    }
    let found: number | null = null;
    for (let k = j; k < Math.min(tsvLines.length, j + 6); k++) {
      if (tsvLines[k].text === t) {
        found = tsvLines[k].conf;
        j = k + 1;
        break;
      }
    }
    out.push(found);
  }
  return out;
}

const GAP = /\S {3,}\S/;
/** Column-aligned, not counting the gap after a leading section number (`4.1.14    DDAT`). */
const isColumnar = (line: string) => GAP.test(line.replace(/^\s*\d+(?:\.\d+)*\.?\s+/, ""));
const MD_LEAD = /^(\s*)([#>]|[*+-](?=\s)|\d+[.)](?=\s))/;

export interface ProseResult {
  body: string;
  folio: string | null;
  dropped: number;
}

export function normalizeProse(text: string, words: Word[]): ProseResult {
  const raw = text.replace(/\r\n/g, "\n").replace(/\f/g, "").split("\n").map((l) => l.replace(/\s+$/, ""));
  const { folio, index } = detectFolio(raw);
  const conf = lineConfidences(raw, words);
  let dropped = 0;
  const kept: string[] = [];
  raw.forEach((line, i) => {
    if (i === index) return;
    const t = line.trim();
    const c = conf[i];
    if (t !== "" && alnumCount(t) < 3 && (c === null || c < 60)) {
      dropped++;
      return;
    }
    // A wide gap then one or two stray glyphs at the end of a line is scanner noise.
    kept.push(line.replace(/(?<=\S.{18,}) {3,}[^\s0-9A-Za-z]{1,2}$|(?<=\S.{18,}) {3,}[a-zA-Z]$/, ""));
  });

  // Rejoin words hyphenated across a line break when the next line continues in lowercase.
  for (let i = 0; i + 1 < kept.length; i++) {
    if (/[a-z]-$/.test(kept[i]) && /^\s*[a-z]/.test(kept[i + 1]) && !isColumnar(kept[i])) {
      const next = kept[i + 1].trimStart();
      const sp = next.indexOf(" ");
      const head = sp < 0 ? next : next.slice(0, sp);
      kept[i] = kept[i].slice(0, -1) + head;
      kept[i + 1] = sp < 0 ? "" : next.slice(sp + 1);
      if (kept[i + 1] === "") kept.splice(i + 1, 1);
    }
  }

  const out: string[] = [];
  let i = 0;
  while (i < kept.length) {
    if (isColumnar(kept[i])) {
      // A region of column-aligned lines, allowing single blank lines inside it.
      let j = i;
      let count = 0;
      let end = i;
      while (j < kept.length && (isColumnar(kept[j]) || (kept[j].trim() === "" && j + 1 < kept.length && isColumnar(kept[j + 1])))) {
        if (kept[j].trim() !== "") {
          count++;
          end = j;
        }
        j++;
      }
      if (count >= 2) {
        const block = kept.slice(i, end + 1);
        const indent = Math.min(...block.filter((l) => l.trim() !== "").map((l) => /^ */.exec(l)![0].length));
        pushBlank(out);
        out.push("```text", ...block.map((l) => l.slice(indent).replace(/`/g, "'")), "```");
        pushBlank(out);
        i = end + 1;
        continue;
      }
    }
    const t = kept[i].trim();
    if (t === "") pushBlank(out);
    else out.push(collapse(t).replace(MD_LEAD, "$1\\$2"));
    i++;
  }
  while (out.length > 0 && out[0] === "") out.shift();
  while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return { body: out.join("\n"), folio, dropped };
}

function pushBlank(out: string[]) {
  if (out.length > 0 && out[out.length - 1] !== "") out.push("");
}

export interface WordStats {
  total: number;
  good: number;
  conf: number;
}

export function wordStats(words: Word[]): WordStats {
  const good = words.filter((w) => w.conf >= 70 && /[A-Za-z]{2}|\d{2}/.test(w.text)).length;
  return { total: words.length, good, conf: meanConf(words) };
}

/** Asterisk or letter-art banners (the big block letters on listing separator pages). */
export function isBanner(text: string): boolean {
  const lines = text.split("\n").filter((l) => l.trim().length >= 20);
  if (lines.length < 3) return false;
  const art = lines.filter((l) => {
    const s = l.replace(/\s/g, "");
    return (s.match(/[*Ww#=]/g) ?? []).length / s.length > 0.4 || /(?:[A-Z]{2,}\s?){12,}/.test(l) && !/[a-z]/.test(l) && /(.)\1\1/.test(s);
  }).length;
  return art >= Math.max(3, lines.length * 0.3);
}

/** Heuristic kind for pages the document maps do not settle. */
export function classifyProse(stats: WordStats, text: string): "text" | "figure" | "mixed" | "blank" {
  if (stats.good < 3) return "blank";
  if (isBanner(text)) return "figure";
  const ratio = stats.good / stats.total;
  if (ratio < 0.35) return "figure";
  if (ratio < 0.6) return "mixed";
  return "text";
}
