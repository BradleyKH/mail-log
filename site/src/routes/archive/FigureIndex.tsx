import { Link } from "react-router";
import { displayText } from "@/lib/display";
import type { DocId, Figure } from "@/content/types";
import { pagePath } from "./scanUrl";

export default function FigureIndex({ docId, figures }: { docId: DocId; figures: Figure[] }) {
  if (figures.length === 0) return <p className="text-sm text-muted-foreground">This report has no list of figures.</p>;
  return (
    <ul className="text-sm" data-testid="figure-index">
      {figures.map((f) => (
        <li key={f.number}>
          <Link to={pagePath(docId, f.pdfPage)} className="flex items-baseline gap-2 rounded-sm py-1 hover:bg-accent">
            <span className="w-16 shrink-0 font-mono text-xs text-muted-foreground">Fig. {f.number}</span>
            <span>{displayText(f.title)}</span>
            <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground tabular-nums">p. {f.pdfPage}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
