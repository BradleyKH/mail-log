/** Tesseract TSV parsing: per-word confidence and bounding boxes, grouped into OCR lines. */

export interface Word {
  block: number;
  par: number;
  line: number;
  left: number;
  top: number;
  width: number;
  height: number;
  conf: number;
  text: string;
}

export interface OcrLine {
  words: Word[];
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export function parseTsv(raw: string): Word[] {
  const words: Word[] = [];
  for (const row of raw.split(/\r?\n/).slice(1)) {
    const c = row.split("\t");
    if (c.length < 12 || c[0] !== "5") continue;
    const text = c.slice(11).join("\t");
    if (text.trim() === "") continue;
    words.push({
      block: Number(c[2]),
      par: Number(c[3]),
      line: Number(c[4]),
      left: Number(c[6]),
      top: Number(c[7]),
      width: Number(c[8]),
      height: Number(c[9]),
      conf: Number(c[10]),
      text,
    });
  }
  return words;
}

export function groupLines(words: Word[]): OcrLine[] {
  const lines: OcrLine[] = [];
  let key = "";
  for (const w of words) {
    const k = `${w.block}:${w.par}:${w.line}`;
    if (k !== key) {
      lines.push({ words: [], left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity });
      key = k;
    }
    const l = lines[lines.length - 1];
    l.words.push(w);
    l.left = Math.min(l.left, w.left);
    l.top = Math.min(l.top, w.top);
    l.right = Math.max(l.right, w.left + w.width);
    l.bottom = Math.max(l.bottom, w.top + w.height);
  }
  return lines;
}

export const lineText = (l: OcrLine) => l.words.map((w) => w.text).join(" ");

export function meanConf(words: Word[]): number {
  if (words.length === 0) return 0;
  return words.reduce((s, w) => s + Math.max(0, w.conf), 0) / words.length;
}

export function median(xs: number[]): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
