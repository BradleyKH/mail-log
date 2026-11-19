import { Link } from "react-router";
import { displayText } from "@/lib/display";
import type { DocId, Section } from "@/content/types";
import { pagePath } from "./scanUrl";

// Every report's page 1 is its cover, which no printed contents list names.
const TITLE_PAGE: Section = { id: "0.0", title: "TITLE PAGE", level: 1, pdfPage: 1 };

export default function TocList({ docId, sections }: { docId: DocId; sections: Section[] }) {
  return (
    <ul className="text-sm" data-testid="toc">
      {[TITLE_PAGE, ...sections].map((s) => (
        <li key={s.id}>
          <Link
            to={pagePath(docId, s.pdfPage)}
            style={{ paddingLeft: `${Math.max(0, s.level - 1) * 1}rem` }}
            className="flex items-baseline gap-2 rounded-sm py-1 hover:bg-accent"
          >
            <span className="shrink-0 font-mono text-xs text-muted-foreground">{s.id}</span>
            <span className={s.level <= 2 ? "font-medium" : undefined}>{displayText(s.title)}</span>
            <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground tabular-nums">p. {s.pdfPage}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
