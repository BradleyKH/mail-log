import { Link, useParams } from "react-router";
import { ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getDoc, getFigures, getSections } from "@/content/load";
import { cn } from "@/lib/utils";
import ArchiveSearchBar from "./ArchiveSearchBar";
import Breadcrumb from "./Breadcrumb";
import FigureIndex from "./FigureIndex";
import ThumbnailStrip from "./ThumbnailStrip";
import TocList from "./TocList";
import { pagePath } from "./scanUrl";
import { formatDocDate } from "./shelfGroups";

export default function DocumentPage() {
  const { docId = "" } = useParams();
  const doc = getDoc(docId);

  if (!doc) {
    return (
      <section className="space-y-3">
        <h1 className="font-mono text-2xl font-semibold uppercase">Unknown report</h1>
        <p className="text-muted-foreground">NO REPORT WITH THIS ID.</p>
        <Link to="/archive" className="text-primary underline">
          Back to the Archive
        </Link>
      </section>
    );
  }

  const sections = getSections(doc.docId);
  const figures = getFigures(doc.docId);

  return (
    <section className="space-y-6">
      <ArchiveSearchBar />
      <Breadcrumb items={[{ label: "Archive", to: "/archive" }, { label: doc.reportNumber }]} />
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide">{doc.reportNumber}</h1>
        <p className="text-lg">{doc.title}</p>
        <p className="text-sm text-muted-foreground">{formatDocDate(doc.date)} &middot; {doc.pageCount} pages</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to={pagePath(doc.docId, 1)} className={cn(buttonVariants({ size: "sm" }))}>
            Start reading
          </Link>
          <a
            href={`https://ntrs.nasa.gov/citations/${doc.ntrsId}`}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            NTRS record <ExternalLink />
          </a>
        </div>
      </header>

      <section aria-labelledby="thumbs-h" className="space-y-2">
        <h2 id="thumbs-h" className="font-mono text-sm tracking-widest uppercase">
          Pages
        </h2>
        <ThumbnailStrip docId={doc.docId} pageCount={doc.pageCount} reportNumber={doc.reportNumber} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="toc-h" className="space-y-2">
          <h2 id="toc-h" className="font-mono text-sm tracking-widest uppercase">
            Contents
          </h2>
          <TocList docId={doc.docId} sections={sections} />
        </section>
        <section aria-labelledby="figs-h" className="space-y-2">
          <h2 id="figs-h" className="font-mono text-sm tracking-widest uppercase">
            Figures
          </h2>
          <FigureIndex docId={doc.docId} figures={figures} />
        </section>
      </div>
    </section>
  );
}
