import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import FortranBlock from "@/components/shared/FortranBlock";
import { resolveLineId, type FortranLine } from "@/components/shared/fortranLines";
import RouteFallback from "@/components/layout/RouteFallback";
import NotFound from "@/components/layout/NotFound";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadRoutineLines, loadRoutineSource } from "@/content/load";
import type { RoutineLines } from "@/content/types";
import { displayText } from "@/lib/display";
import { archivePageHref, buildLines, findRoutine, routineHref } from "./codeLinks";
import RoutineScans from "./RoutineScans";
import RoutineSidebar from "./RoutineSidebar";
import { useCodeData } from "./useCodeData";

type Source = { id: string; lines: FortranLine[]; meta: RoutineLines } | "missing";

export default function RoutinePage() {
  const { routine = "" } = useParams();
  const [params] = useSearchParams();
  const data = useCodeData();
  const entry = data ? findRoutine(data.index, routine) : undefined;
  const [source, setSource] = useState<Source | undefined>();
  const [tab, setTab] = useState("source");

  const id = entry?.id;
  useEffect(() => {
    if (!id) return;
    let live = true;
    Promise.all([loadRoutineSource(id), loadRoutineLines(id)])
      .then(([text, meta]) => live && setSource(text !== undefined && meta ? { id, lines: buildLines(text, meta.lineIds), meta } : "missing"))
      .catch(() => live && setSource("missing"));
    return () => {
      live = false;
    };
  }, [id]);

  if (data === undefined) return <RouteFallback />;
  if (!data || !entry) return <NotFound />;

  const loaded = source && source !== "missing" && source.id === entry.id ? source : undefined;
  const wanted = params.get("line");
  const activeId = loaded ? resolveLineId(loaded.lines, wanted) : undefined;
  const activeIndex = loaded && activeId ? loaded.lines.findIndex((l) => l.id === activeId) + 1 : 0;
  const activePage = loaded?.meta.pages.find((p) => activeIndex >= p.firstLine && activeIndex <= p.lastLine)?.pdfPage;

  return (
    <section className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link to="/code" className="underline underline-offset-2">
          Code
        </Link>{" "}
        / <span className="font-mono">{entry.id}</span>
      </nav>
      <header className="space-y-3">
        <h1 className="font-mono text-3xl font-semibold tracking-wide">{entry.id}</h1>
        <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
          {entry.kind} / Appendix {entry.appendix} / {entry.lines} lines
        </p>
        {entry.description ? (
          <p className="max-w-3xl leading-relaxed">
            {displayText(entry.description)}
            {entry.descriptionPage && (
              <>
                {" "}
                <Link to={archivePageHref("cr-159063", entry.descriptionPage)} className="text-sm text-primary underline underline-offset-2">
                  Volume I, page {entry.descriptionPage}
                </Link>
              </>
            )}
          </p>
        ) : (
          <p className="text-muted-foreground">This routine has no separate description in Volume I; read its comments below.</p>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-3">
          {!entry.reviewed && (
            <p role="note" className="rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
              This text is machine-read from the listing and may contain mistakes. The listing scan is the original.
            </p>
          )}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="source">Source</TabsTrigger>
              <TabsTrigger value="listing">Listing scans</TabsTrigger>
              <TabsTrigger value="flowchart">Flowchart scans</TabsTrigger>
            </TabsList>
            <TabsContent value="source">
              {source === "missing" && <p className="text-muted-foreground">The source for this routine is not available.</p>}
              {!source || (source !== "missing" && !loaded) ? (
                <RouteFallback />
              ) : (
                loaded && (
                  <>
                    <FortranBlock
                      lines={loaded.lines}
                      gutter="printed"
                      highlightId={wanted}
                      lineHref={(lineId) => routineHref(entry.id, lineId)}
                    />
                    {activePage && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Highlighted line is on{" "}
                        <button className="text-primary underline underline-offset-2" onClick={() => setTab("listing")}>
                          listing page {activePage}
                        </button>
                        .
                      </p>
                    )}
                  </>
                )
              )}
            </TabsContent>
            <TabsContent value="listing">
              <RoutineScans docId="cr-159064" pages={entry.listingPages} label="Listing" activePage={activePage} />
            </TabsContent>
            <TabsContent value="flowchart">
              <RoutineScans
                docId="cr-159063"
                pages={entry.flowchartPages}
                label={entry.flowchartFigure ? `Flowchart, Figure ${entry.flowchartFigure}` : "Flowchart"}
                empty="No flowchart page is indexed for this routine."
              />
            </TabsContent>
          </Tabs>
        </div>
        <RoutineSidebar entry={entry} data={data} />
      </div>
    </section>
  );
}
