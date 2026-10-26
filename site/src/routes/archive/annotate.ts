import type { GlossaryEntry, RecordType } from "@/content/types";

export type Segment =
  | { kind: "text"; text: string }
  | { kind: "step"; text: string; n: number }
  | { kind: "term"; text: string; entry: GlossaryEntry };

const RECORD_BY_SECTION: RecordType[] = ["correspondence", "dir", "drawing-eo"];
const MODE_BASE = [0, 100, 200, 300, 400];

/** The record and flow numbering base for a cr-159065 section 4.x id, or undefined elsewhere. */
export function stepContext(sectionId: string | null): { record: RecordType; base: number } | undefined {
  const m = /^4\.([123])(?:\.([1-4]))?/.exec(sectionId ?? "");
  return m ? { record: RECORD_BY_SECTION[Number(m[1]) - 1], base: MODE_BASE[Number(m[2] ?? 0)] } : undefined;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, (c) => `${String.fromCharCode(92)}${c}`);

function termMatcher(glossary: GlossaryEntry[]) {
  if (glossary.length === 0) return undefined;
  const sorted = [...glossary].sort((a, b) => b.term.length - a.term.length);
  const source = sorted.map((g) => escapeRegExp(g.term)).join("|");
  // Short terms (DIR, FILE, MODE) are uppercase jargon in the report; match them only as printed.
  return new RegExp(`(?<![A-Za-z0-9])(${source})(?![A-Za-z0-9])`, "g");
}

export type Annotator = (text: string) => Segment[];

/**
 * Builds a function that marks `Step #N` references and glossary terms in prose. Each glossary term is marked
 * once per page so definitions help without littering the text.
 */
export function createAnnotator(opts: { steps: boolean; glossary: GlossaryEntry[] }): Annotator {
  const matcher = termMatcher(opts.glossary);
  const byTerm = new Map(opts.glossary.map((g) => [g.term, g]));
  const used = new Set<string>();
  const stepRe = /(?:Step\s*)?#(\d{1,3})\b/g;

  const termSegments = (text: string): Segment[] => {
    if (!matcher) return [{ kind: "text", text }];
    const out: Segment[] = [];
    let last = 0;
    for (const m of text.matchAll(matcher)) {
      const entry = byTerm.get(m[1]);
      if (!entry || used.has(entry.term)) continue;
      used.add(entry.term);
      if (m.index > last) out.push({ kind: "text", text: text.slice(last, m.index) });
      out.push({ kind: "term", text: m[1], entry });
      last = m.index + m[1].length;
    }
    if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
    return out;
  };

  return (text) => {
    if (!opts.steps) return termSegments(text);
    const out: Segment[] = [];
    let last = 0;
    for (const m of text.matchAll(stepRe)) {
      if (m.index > last) out.push(...termSegments(text.slice(last, m.index)));
      out.push({ kind: "step", text: m[0], n: Number(m[1]) });
      last = m.index + m[0].length;
    }
    if (last < text.length) out.push(...termSegments(text.slice(last)));
    return out;
  };
}
