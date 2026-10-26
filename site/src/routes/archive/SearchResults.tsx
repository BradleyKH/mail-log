import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { listDocs } from "@/content/load";
import type { SearchEngine } from "@/lib/search/engine";
import SearchResultRow from "./SearchResultRow";

const PER_DOC = 12;

/** Results for one query, grouped by report. The engine (and its page text) loads on first search. */
export default function SearchResults({ query }: { query: string }) {
  const [engine, setEngine] = useState<SearchEngine | undefined>();
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    let live = true;
    import("@/lib/search/loadEngine")
      .then((m) => m.loadSearchEngine())
      .then((e) => live && setEngine(e))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, []);

  const hits = useMemo(() => engine?.search(query) ?? [], [engine, query]);
  useEffect(() => setExpanded(new Set()), [query]);

  if (failed) return <p role="alert">The search index could not be loaded.</p>;
  if (!engine) return <p role="status" className="font-mono text-sm text-muted-foreground">BUILDING SEARCH INDEX...</p>;
  if (hits.length === 0) {
    return <p role="status" className="font-mono text-sm">THERE ARE 0 DOCUMENTS MATCHING &quot;{query}&quot;.</p>;
  }

  return (
    <div className="space-y-8">
      <p role="status" className="font-mono text-sm text-muted-foreground">
        {hits.length} {hits.length === 1 ? "RESULT" : "RESULTS"} FOR &quot;{query}&quot;
      </p>
      {listDocs().map((doc) => {
        const group = hits.filter((h) => h.docId === doc.docId);
        if (group.length === 0) return null;
        const open = expanded.has(doc.docId);
        const shown = open ? group : group.slice(0, PER_DOC);
        return (
          <section key={doc.docId} aria-label={doc.reportNumber} className="space-y-2" data-testid={`results-${doc.docId}`}>
            <h2 className="font-mono text-sm tracking-widest uppercase">
              {doc.reportNumber} <span className="text-muted-foreground">({group.length})</span>
            </h2>
            <ul className="space-y-2">
              {shown.map((h) => (
                <SearchResultRow key={h.id} hit={h} />
              ))}
            </ul>
            {group.length > PER_DOC && !open && (
              <Button variant="outline" size="sm" onClick={() => setExpanded((s) => new Set(s).add(doc.docId))}>
                Show all {group.length}
              </Button>
            )}
          </section>
        );
      })}
    </div>
  );
}
