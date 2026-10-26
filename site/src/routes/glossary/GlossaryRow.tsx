import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import type { MergedGlossaryEntry } from "./glossaryEntries";

export default function GlossaryRow({ entry }: { entry: MergedGlossaryEntry }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3" data-testid="glossary-row">
      <dt className="font-mono font-semibold">{entry.term}</dt>
      <dd className="flex flex-wrap items-baseline gap-x-3">
        <Badge variant="outline">{entry.reportNumber}</Badge>
        <Link
          to={`/archive/${entry.docId}/page/${entry.pdfPage}`}
          className="text-sm text-primary underline-offset-2 hover:underline"
        >
          Source: page {entry.pdfPage}
        </Link>
      </dd>
      <dd className="basis-full text-muted-foreground">{entry.definition}</dd>
    </div>
  );
}
