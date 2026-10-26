import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { listDocs } from "@/content/load";
import type { DocId } from "@/content/types";
import GlossaryRow from "./GlossaryRow";
import { filterGlossary, mergedGlossary } from "./glossaryEntries";

export default function GlossaryPage() {
  const all = useMemo(mergedGlossary, []);
  const docs = listDocs().filter((d) => all.some((e) => e.docId === d.docId));
  const [query, setQuery] = useState("");
  const [docId, setDocId] = useState<DocId | "all">("all");
  const shown = filterGlossary(all, query, docId);

  return (
    <section className="max-w-3xl space-y-6">
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Glossary</h1>
        <p className="text-muted-foreground">Terms defined across the MAIL LOG reports, as the reports print them.</p>
      </header>
      <div className="flex flex-wrap gap-3">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter terms and definitions"
          aria-label="Filter glossary"
          className="max-w-sm"
        />
        <select
          value={docId}
          onChange={(e) => setDocId(e.target.value as DocId | "all")}
          aria-label="Report"
          className="h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All reports</option>
          {docs.map((d) => (
            <option key={d.docId} value={d.docId}>
              {d.reportNumber}: {d.title.replace("MAIL LOG - ", "")}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {shown.length} of {all.length} entries
      </p>
      <dl className="divide-y divide-border">
        {shown.map((e) => (
          <GlossaryRow key={e.key} entry={e} />
        ))}
      </dl>
      {shown.length === 0 && <p>No terms match.</p>}
    </section>
  );
}
