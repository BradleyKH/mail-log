import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { getDoc, getSections, loadPage } from "@/content/load";
import { displayText } from "@/lib/display";
import type { Page } from "@/content/types";
import Breadcrumb from "./Breadcrumb";
import PageNav from "./PageNav";
import PageText from "./PageText";
import RoutineLinks from "./RoutineLinks";
import ScanViewer from "./ScanViewer";
import SidebarToc from "./SidebarToc";
import { pagePath, scanUrl } from "./scanUrl";
import { useCodeIndex } from "./useCodeIndex";
import ViewToggle, { type PageView } from "./ViewToggle";

const VIEWS: PageView[] = ["text", "scan"];

export default function PageViewPage() {
  const { docId = "", pdfPage = "" } = useParams();
  const doc = getDoc(docId);
  const n = Number(pdfPage);
  const valid = doc !== undefined && Number.isInteger(n) && n >= 1 && n <= doc.pageCount;
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
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
        <Link to={doc ? `/reports/${doc.docId}` : "/reports"} className="text-primary underline">
          Back to {doc ? doc.reportNumber : "Reports"}
        </Link>
      </section>
    );
  }

  const flowchartPage = page?.kind === "flowchart";
  const requested = params.get("view");
  const view: PageView = (VIEWS as string[]).includes(requested ?? "") ? (requested as PageView) : "scan";
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

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside>
        <SidebarToc docId={doc.docId} sections={sections} currentSectionId={page?.sectionId ?? null} pdfPage={n} />
      </aside>
      <section className="min-w-0 space-y-4">
        <Breadcrumb
          items={[
            { label: "Reports", to: "/reports" },
            { label: doc.reportNumber, to: `/reports/${doc.docId}` },
            ...(section ? [{ label: displayText(section.title) }] : []),
          ]}
        />
        <h1 className="font-mono text-2xl font-semibold tracking-wide">{doc.reportNumber}</h1>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <PageNav docId={doc.docId} pdfPage={n} pageCount={doc.pageCount} />
          <ViewToggle value={view} onChange={setView} />
        </div>
        {page && routines.length > 0 && <RoutineLinks routines={routines} kind={flowchartPage ? "flowchart" : "listing"} />}
        <div>
          {view === "text" && (
            <div className="min-w-0" data-pane="text">
              {page ? <PageText page={page} routines={routines} /> : <p className="font-mono text-sm text-muted-foreground">LOADING...</p>}
            </div>
          )}
          {view === "scan" && (
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
