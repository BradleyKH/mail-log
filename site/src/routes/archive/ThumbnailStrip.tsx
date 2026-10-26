import { Link } from "react-router";
import type { DocId } from "@/content/types";
import { pagePath, scanUrl } from "./scanUrl";

/** Every page as a lazy-loaded thumbnail in a horizontally scrolling strip. */
export default function ThumbnailStrip({ docId, pageCount, reportNumber }: { docId: DocId; pageCount: number; reportNumber: string }) {
  return (
    <ul className="flex gap-2 overflow-x-auto pb-2" aria-label="Page thumbnails" data-testid="thumbnail-strip">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <li key={p} className="shrink-0">
          <Link to={pagePath(docId, p)} className="block w-24 space-y-1 text-center hover:text-primary">
            <img
              src={scanUrl(docId, p, true)}
              alt={`${reportNumber}, page ${p}`}
              loading="lazy"
              className="h-32 w-24 rounded-sm border bg-muted object-cover object-top"
            />
            <span className="font-mono text-xs tabular-nums">{p}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
