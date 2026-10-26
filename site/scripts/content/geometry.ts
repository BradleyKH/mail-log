import { median, type OcrLine, type Word } from "./tsv.ts";

/** Fixed-pitch layout of a line-printer listing page, measured from word boxes. */
export interface Grid {
  /** Character pitch in pixels. */
  pitch: number;
  /** x of card column 1. */
  x1: number;
  /** x where the printed sequence number starts, or null when the page has none. */
  seqX: number | null;
  /** Vertical line pitch in pixels. */
  linePitch: number;
}

export const STRICT_SEQ = /^\(\d{4}\)$/;
const ALNUM = /^[A-Z0-9]+$/;

export function estimatePitch(lines: OcrLine[]): number {
  const solid = lines.flatMap((l) => l.words).filter((w) => w.conf >= 85 && ALNUM.test(w.text) && w.text.length >= 3);
  const p0 = solid.length > 0 ? median(solid.map((w) => w.width / w.text.length)) * 1.07 : 22;
  const ps: number[] = [];
  for (const l of lines) {
    for (let i = 0; i + 1 < l.words.length; i++) {
      const a = l.words[i];
      const b = l.words[i + 1];
      if (a.conf < 85 || b.conf < 85 || !ALNUM.test(a.text) || !ALNUM.test(b.text)) continue;
      const d = b.left - a.left;
      const m = Math.round(d / p0);
      if (m < a.text.length + 1 || m > 40) continue;
      ps.push(d / m);
    }
  }
  return ps.length >= 5 ? median(ps) : p0;
}

export function estimateLinePitch(tops: number[]): number {
  const diffs: number[] = [];
  for (let i = 1; i < tops.length; i++) diffs.push(tops[i] - tops[i - 1]);
  const m0 = median(diffs.filter((d) => d > 5));
  if (!Number.isFinite(m0)) return NaN;
  // Single-line steps only, so a dropped line (double gap) does not skew the estimate.
  return median(diffs.filter((d) => d > m0 * 0.7 && d < m0 * 1.3));
}

/**
 * Card column 7 is where most statements begin, and comments and labels begin six columns
 * left of it, so the statement anchor is the most common first-token position that has
 * company six columns to its left, falling back to the plain mode.
 */
export function estimateX1(firstLefts: number[], pitch: number): number {
  if (firstLefts.length === 0) return NaN;
  const bins = new Map<number, number[]>();
  for (const x of firstLefts) {
    const b = Math.round(x / pitch);
    bins.set(b, [...(bins.get(b) ?? []), x]);
  }
  const count = (b: number) => (bins.get(b - 1)?.length ?? 0) + (bins.get(b)?.length ?? 0) + (bins.get(b + 1)?.length ?? 0);
  const ranked = [...bins.keys()].sort((a, b) => count(b) - count(a) || a - b);
  const total = firstLefts.length;
  for (const b of ranked) {
    if (count(b) < total * 0.15) break;
    if (count(b - 6) > 0) return median(bins.get(b)!) - 6 * pitch;
  }
  return median(bins.get(ranked[0])!) - 6 * pitch;
}

export const columnOf = (w: Word, grid: Grid) => Math.round((w.left - grid.x1) / grid.pitch) + 1;
