import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { getDoc, getSections, loadPage } from "@/content/load";
import { displayText } from "@/lib/display";
import type { Page } from "@/content/types";
import ArchiveSearchBar from "./ArchiveSearchBar";
import Breadcrumb from "./Breadcrumb";
import OcrBadge from "./OcrBadge";
import PageNav from "./PageNav";
import PageText from "./PageText";
import RoutineLinks from "./RoutineLinks";
import ScanViewer from "./ScanViewer";
import SidebarToc from "./SidebarToc";
import { pagePath, scanUrl } from "./scanUrl";
import { useCodeIndex } from "./useCodeIndex";
import { useIsDesktop } from "./useIsDesktop";
import ViewToggle, { type PageView } from "./ViewToggle";

const LOW_CONFIDENCE = 60;
const VIEWS: PageView[] = ["text", "scan", "both"];

export default function PageViewPage() {
  const { docId = "", pdfPage = "" } = useParams();
  const doc = getDoc(docId);
  const n = Number(pdfPage);
  const valid = doc !== undefined && Number.isInteger(n) && n >= 1 && n <= doc.pageCount;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const desktop = useIsDesktop();
  const codeIndex = useCodeIndex();
  const [loaded, setLoaded] = useState<Page | undefined>();
  const page = loaded?.docId === docId && loaded.pdfPage === n ? loaded : undefined;

  useEffect(() => {
    if (!valid) return;
    let live = true;
    void loadPage(doc.docId, n).then((p) => live && setLoaded(p));
    return () => {
      live = false;
    };
  }, [valid, doc, n]);

  useEffect(() => {
    if (!valid) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
      // Read the page from the address: a key pressed right after a navigation can beat this effect's re-run.
      const current = Number(/\/page\/(\d+)\/?$/.exec(window.location.pathname)?.[1] ?? n);
      const next = e.key === "ArrowRight" ? current + 1 : e.key === "ArrowLeft" ? current - 1 : 0;
      if (next >= 1 && next <= doc.pageCount) navigate({ pathname: pagePath(doc.docId, next), search: window.location.search });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [valid, doc, n, navigate]);

  const sections = useMemo(() => (doc ? getSections(doc.docId) : []), [doc]);

  if (!valid) {
    return (
      <section className="space-y-3">
        <h1 className="font-mono text-2xl font-semibold uppercase">Page not found</h1>
        <p className="text-muted-foreground">THERE IS NO PAGE {pdfPage} IN THIS REPORT.</p>
        <Link to={doc ? `/archive/${doc.docId}` : "/archive"} className="text-primary underline">
          Back to {doc ? doc.reportNumber : "the Archive"}
        </Link>
      </section>
    );
  }

  const flowchartPage = page?.kind === "flowchart";
  const defaultView: PageView = page && (flowchartPage || page.confidence < LOW_CONFIDENCE) ? "scan" : "both";
  const requested = params.get("view");
  const picked = (VIEWS as string[]).includes(requested ?? "") ? (requested as PageView) : defaultView;
  const view: PageView = picked === "both" && !desktop ? "text" : picked;
  const setView = (v: PageView) =>
    setParams(
      (p) => {
        p.set("view", v);
        return p;
      },
      { replace: true },
    );

  const section = sections.find((s) => s.id === page?.sectionId);
  const routines = (codeIndex?.routines ?? []).filter((r) =>
    flowchartPage ? r.flowchartPages.includes(n) : page?.kind === "listing" ? [...r.listingPages, ...r.symbolTablePages].includes(n) : false,
  );
  const showText = view === "text" || view === "both";
  const showScan = view === "scan" || view === "both";

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside>
        <SidebarToc docId={doc.docId} sections={sections} currentSectionId={page?.sectionId ?? null} pdfPage={n} />
      </aside>
      <section className="min-w-0 space-y-4">
        <ArchiveSearchBar />
        <Breadcrumb
          items={[
            { label: "Archive", to: "/archive" },
            { label: doc.reportNumber, to: `/archive/${doc.docId}` },
            ...(section ? [{ label: displayText(section.title) }] : []),
          ]}
        />
        <header className="space-y-1">
          <h1 className="font-mono text-2xl font-semibold tracking-wide">
            {doc.reportNumber}, page {n}
          </h1>
          <p className="text-sm text-muted-foreground">
            {page?.folio ? `Printed page ${page.folio}` : "Unnumbered page"}
            {section ? ` · Section ${section.id}` : ""}
            {page ? ` · ${page.kind}` : ""}
          </p>
          {page && <OcrBadge source={page.source} />}
        </header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageNav docId={doc.docId} pdfPage={n} pageCount={doc.pageCount} />
          <ViewToggle value={view} onChange={setView} />
        </div>
        {page && routines.length > 0 && <RoutineLinks routines={routines} kind={flowchartPage ? "flowchart" : "listing"} />}
        <div className={showText && showScan ? "grid items-start gap-4 lg:grid-cols-2" : ""}>
          {showText && (
            <div className="min-w-0" data-pane="text">
              {page ? <PageText page={page} routines={routines} /> : <p className="font-mono text-sm text-muted-foreground">LOADING...</p>}
            </div>
          )}
          {showScan && (
            <div className="min-w-0" data-pane="scan">
              <ScanViewer
                src={scanUrl(doc.docId, n)}
                alt={`Scan of page ${n} of ${doc.reportNumber}`}
                tall={flowchartPage}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
