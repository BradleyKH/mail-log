import { getGlossary, listDocs } from "@/content/load";
import { displayText } from "@/lib/display";
import type { DocId } from "@/content/types";

export type GlossarySource = { docId: DocId; reportNumber: string; pdfPage: number };

export type GlossaryDefinition = { text: string; sources: GlossarySource[] };

export type MergedGlossaryEntry = {
  key: string;
  term: string;
  definitions: GlossaryDefinition[];
};

/** The reports reprint the same glossary with OCR-level differences in case, spacing, and closing punctuation. */
const normalize = (s: string) =>
  s
    .toUpperCase()
    .replace(/;/g, ",")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:]+$/, "");

/** One entry per term across all reports, alphabetical; matching definitions are merged and list every source. */
export function mergedGlossary(): MergedGlossaryEntry[] {
  const byTerm = new Map<string, MergedGlossaryEntry>();
  for (const doc of listDocs()) {
    for (const e of getGlossary(doc.docId)) {
      const term = displayText(e.term);
      const termKey = normalize(term);
      let entry = byTerm.get(termKey);
      if (!entry) {
        entry = { key: termKey, term, definitions: [] };
        byTerm.set(termKey, entry);
      }
      const text = displayText(e.definition);
      const source = { docId: doc.docId, reportNumber: doc.reportNumber, pdfPage: e.pdfPage };
      const same = entry.definitions.find((d) => normalize(d.text) === normalize(text));
      if (!same) entry.definitions.push({ text, sources: [source] });
      else {
        same.sources.push(source);
        if (!/[.)]$/.test(same.text) && /[.)]$/.test(text)) same.text = text;
      }
    }
  }
  return [...byTerm.values()].sort((a, b) => a.term.localeCompare(b.term, "en"));
}

export function filterGlossary(entries: MergedGlossaryEntry[], query: string, docId: DocId | "all"): MergedGlossaryEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter(
    (e) =>
      (docId === "all" || e.definitions.some((d) => d.sources.some((s) => s.docId === docId))) &&
      (!q || e.term.toLowerCase().includes(q) || e.definitions.some((d) => d.text.toLowerCase().includes(q))),
  );
}
