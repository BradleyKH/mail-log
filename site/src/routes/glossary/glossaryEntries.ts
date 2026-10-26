import { getGlossary, listDocs } from "@/content/load";
import { displayText } from "@/lib/display";
import type { DocId } from "@/content/types";

export type MergedGlossaryEntry = {
  key: string;
  term: string;
  definition: string;
  docId: DocId;
  reportNumber: string;
  pdfPage: number;
};

/** All reports' glossary entries, alphabetical by term, then by report. */
export function mergedGlossary(): MergedGlossaryEntry[] {
  return listDocs()
    .flatMap((doc) =>
      getGlossary(doc.docId).map((e) => ({
        key: `${doc.docId}:${e.term}:${e.pdfPage}`,
        term: displayText(e.term),
        definition: displayText(e.definition),
        docId: doc.docId,
        reportNumber: doc.reportNumber,
        pdfPage: e.pdfPage,
      })),
    )
    .sort((a, b) => a.term.localeCompare(b.term, "en") || a.docId.localeCompare(b.docId));
}

export function filterGlossary(entries: MergedGlossaryEntry[], query: string, docId: DocId | "all"): MergedGlossaryEntry[] {
  const q = query.trim().toLowerCase();
  return entries.filter(
    (e) =>
      (docId === "all" || e.docId === docId) &&
      (!q || e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)),
  );
}
