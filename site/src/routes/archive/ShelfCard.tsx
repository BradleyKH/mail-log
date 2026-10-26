import { Link } from "react-router";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DocMeta } from "@/content/types";
import { scanUrl } from "./scanUrl";
import { formatDocDate } from "./shelfGroups";

export default function ShelfCard({ doc }: { doc: DocMeta }) {
  return (
    <Card className="overflow-hidden py-0">
      <CardContent className="flex gap-4 p-4">
        <Link to={`/archive/${doc.docId}`} className="shrink-0" tabIndex={-1} aria-hidden>
          <img
            src={scanUrl(doc.docId, 1, true)}
            alt=""
            loading="lazy"
            className="h-40 w-28 rounded-sm border bg-muted object-cover object-top shadow-sm"
          />
        </Link>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{doc.reportNumber}</p>
          <h3 className="text-lg leading-snug font-semibold">
            <Link to={`/archive/${doc.docId}`} className="hover:text-primary hover:underline">
              {doc.title}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">{formatDocDate(doc.date)} &middot; {doc.pageCount} pages</p>
          <a
            href={`https://ntrs.nasa.gov/citations/${doc.ntrsId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1 pt-2 text-sm text-primary underline-offset-2 hover:underline"
          >
            NTRS record <ExternalLink className="size-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
