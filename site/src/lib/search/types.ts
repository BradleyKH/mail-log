import type { DocId } from "../../content/types.ts";

export type SearchKind = "page" | "listing" | "flowchart" | "section" | "figure" | "glossary";

export type SearchDoc = {
  id: string;
  docId: DocId;
  pdfPage: number;
  kind: SearchKind;
  /** Boosted field: routine names, section or figure titles, glossary terms. */
  title: string;
  text: string;
  /** What a result row shows as its heading. */
  label: string;
};

export type SnippetSegment = { text: string; match: boolean };

export type SearchHit = {
  id: string;
  docId: DocId;
  pdfPage: number;
  kind: SearchKind;
  label: string;
  score: number;
  snippet: SnippetSegment[];
};
