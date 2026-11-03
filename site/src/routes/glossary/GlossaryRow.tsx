import { Link } from "react-router";
import type { MergedGlossaryEntry } from "./glossaryEntries";

export default function GlossaryRow({ entry }: { entry: MergedGlossaryEntry }) {
  return (
    <div className="space-y-2 py-3" data-testid="glossary-row">
      <dt className="font-mono font-semibold">{entry.term}</dt>
      {entry.definitions.map((d) => (
        <dd key={d.text} className="space-y-1">
          <p className="text-muted-foreground">{d.text}</p>
          <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
            {d.sources.map((s) => (
              <Link
                key={`${s.docId}:${s.pdfPage}`}
                to={`/archive/${s.docId}/page/${s.pdfPage}`}
                className="font-mono text-primary underline-offset-2 hover:underline"
              >
                {s.reportNumber} p. {s.pdfPage}
              </Link>
            ))}
          </p>
        </dd>
      ))}
    </div>
  );
}
