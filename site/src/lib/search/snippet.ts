import type { SnippetSegment } from "./types";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, (c) => `${String.fromCharCode(92)}${c}`);

/** A window of `text` around the first matched term, split into plain and matched segments. */
export function buildSnippet(text: string, terms: string[], width = 180): SnippetSegment[] {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return [];
  const usable = terms.filter((t) => t.length > 0);
  if (usable.length === 0) return [{ text: flat.slice(0, width), match: false }];
  const re = new RegExp(usable.map(escapeRegExp).join("|"), "gi");
  const first = re.exec(flat);
  re.lastIndex = 0;
  const start = first ? Math.max(0, first.index - Math.floor(width / 3)) : 0;
  const end = Math.min(flat.length, start + width);
  const window = `${start > 0 ? "..." : ""}${flat.slice(start, end)}${end < flat.length ? "..." : ""}`;
  const segments: SnippetSegment[] = [];
  let last = 0;
  for (const m of window.matchAll(re)) {
    if (m.index > last) segments.push({ text: window.slice(last, m.index), match: false });
    segments.push({ text: m[0], match: true });
    last = m.index + m[0].length;
  }
  if (last < window.length) segments.push({ text: window.slice(last), match: false });
  return segments;
}
