import MiniSearch from "minisearch";
import { displayText } from "@/lib/display";
import { buildSnippet } from "./snippet";
import type { SearchDoc, SearchHit } from "./types";

export type SearchEngine = {
  search(query: string, limit?: number): SearchHit[];
};

export function createSearchEngine(docs: SearchDoc[]): SearchEngine {
  const byId = new Map(docs.map((d) => [d.id, d]));
  const index = new MiniSearch<SearchDoc>({
    fields: ["title", "text"],
    idField: "id",
    searchOptions: { prefix: true, boost: { title: 3 } },
  });
  index.addAll(docs);

  return {
    search(query, limit = 200) {
      const q = query.trim();
      if (!q) return [];
      let results = index.search(q, { combineWith: "AND" });
      if (results.length === 0) results = index.search(q, { combineWith: "OR" });
      const target = (d: SearchDoc) => `${d.docId}:${d.pdfPage}`;
      const pageTargets = new Set(results.flatMap((r) => (r.id.startsWith("p:") ? [target(byId.get(String(r.id))!)] : [])));
      const seen = new Set<string>();
      return results.flatMap((r): SearchHit[] => {
        const d = byId.get(String(r.id));
        if (!d) return [];
        // A section or figure entry that points at a page already matched on its own text adds nothing.
        const structural = d.kind === "section" || d.kind === "figure";
        if (structural && (pageTargets.has(target(d)) || seen.has(target(d)))) return [];
        seen.add(target(d));
        const inText = d.text && Object.values(r.match).some((fields) => fields.includes("text"));
        return [
          {
            id: d.id,
            docId: d.docId,
            pdfPage: d.pdfPage,
            kind: d.kind,
            label: d.label,
            score: r.score,
            snippet: buildSnippet(displayText(inText ? d.text : d.title || d.text), r.terms),
          },
        ];
      }).slice(0, limit);
    },
  };
}
