import { Link } from "react-router";
import { archivePageHref, scanSrc } from "./codeLinks";

type Props = { docId: string; pages: number[]; label: string; empty?: string; activePage?: number };

export default function RoutineScans({ docId, pages, label, empty = "No scan pages are indexed for this routine.", activePage }: Props) {
  if (pages.length === 0) return <p className="text-muted-foreground">{empty}</p>;
  return (
    <div className="space-y-6">
      {pages.map((page) => (
        <figure key={page} className="space-y-1" data-active={page === activePage || undefined}>
          <figcaption className="flex items-baseline justify-between text-sm">
            <span className={page === activePage ? "font-semibold" : "text-muted-foreground"}>
              {label}, page {page}
            </span>
            <Link to={archivePageHref(docId, page)} className="text-primary underline underline-offset-2">
              Open in the Archive
            </Link>
          </figcaption>
          <img
            src={scanSrc(docId, page)}
            alt={`${label}, scan of page ${page}`}
            loading="lazy"
            className={`w-full rounded-md border bg-white ${page === activePage ? "ring-2 ring-primary" : ""}`}
          />
        </figure>
      ))}
    </div>
  );
}
