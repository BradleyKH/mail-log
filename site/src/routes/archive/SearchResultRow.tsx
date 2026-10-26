import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import type { SearchHit } from "@/lib/search/types";
import { pagePath } from "./scanUrl";

const KIND_LABEL: Record<SearchHit["kind"], string> = {
  page: "Page",
  listing: "Listing",
  flowchart: "Flowchart",
  section: "Section",
  figure: "Figure",
  glossary: "Glossary",
};

export default function SearchResultRow({ hit }: { hit: SearchHit }) {
  return (
    <li className="rounded-md border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{KIND_LABEL[hit.kind]}</Badge>
        <Link to={pagePath(hit.docId, hit.pdfPage)} className="font-medium text-primary underline-offset-2 hover:underline">
          {hit.label}
        </Link>
      </div>
      {hit.snippet.length > 0 && (
        <p className="mt-1 text-sm break-words text-muted-foreground">
          {hit.snippet.map((s, i) =>
            s.match ? (
              <mark key={i} className="rounded-sm bg-primary/20 px-0.5 text-foreground">
                {s.text}
              </mark>
            ) : (
              <span key={i}>{s.text}</span>
            ),
          )}
        </p>
      )}
    </li>
  );
}
