import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { frameNodes, homeGoal } from "./graph/focus";
import { RECORD_ORDER } from "./graph/labels";
import { mapSearch, parseMapParams } from "./graph/params";
import { highlightFor, selectionFromRef, selectionNodeId, type Selection } from "./graph/selection";
import { tracePath } from "./graph/trace";
import type { Layer, MapNode, NodeGroup } from "./graph/types";
import Map2D from "./Map2D";
import MapLegend from "./MapLegend";
import MapToolbar from "./MapToolbar";
import NodeFinder from "./NodeFinder";
import { PALETTES } from "./palette";
import SelectionPanel from "./panel/SelectionPanel";
import SceneErrorBoundary from "./SceneErrorBoundary";
import { useMapData } from "./useMapData";
import { useReducedMotion } from "./useReducedMotion";
import { useSceneTheme } from "./useSceneTheme";
import type { FocusRequest, MapViewProps } from "./viewTypes";
import { supportsWebGL } from "./webgl";

const MapCanvas = lazy(() => import("./scene/MapCanvas"));

const LAYER_GROUPS: Record<Layer, readonly NodeGroup[]> = {
  manual: ["core", ...RECORD_ORDER],
  code: [...RECORD_ORDER, "general", "support", "external", "file"],
};
const HOME_DIRECTION: [number, number, number] = [0, 0.78, 0.62];

export default function MapPage() {
  const data = useMapData();
  const [params, setParams] = useSearchParams();
  const parsed = useMemo(() => parseMapParams(params), [params]);
  const { layer } = parsed;
  // Files, externals, and the exit have no URL form, so their selection lives here.
  const [localSelection, setLocalSelection] = useState<Selection | null>(null);
  const selection = parsed.selection ?? localSelection;
  const record = parsed.record ?? (selection?.kind === "step" ? selection.record : "correspondence");

  const [hovered, setHovered] = useState<string | null>(null);
  const [hidden, setHidden] = useState<Set<NodeGroup>>(() => new Set());
  const [tracing, setTracing] = useState(false);
  const [webgl] = useState(supportsWebGL);
  const [view, setView] = useState<"3d" | "2d">(() => (supportsWebGL() ? "3d" : "2d"));
  const [focus, setFocus] = useState<FocusRequest | null>(null);
  const focusKey = useRef(0);
  const theme = useSceneTheme();
  const reducedMotion = useReducedMotion();
  const palette = PALETTES[theme];

  const graph = layer === "code" ? data.code : data.manual;
  const highlight = useMemo(
    () => (graph ? highlightFor(selection, layer, graph, data.xref) : { nodes: new Set<string>(), edges: new Set<string>(), focus: [] }),
    [selection, layer, graph, data.xref],
  );
  const trace = useMemo(() => (tracing && graph ? tracePath(layer, graph) : null), [tracing, layer, graph]);

  const go = useCallback(
    (next: Selection, nextLayer?: Layer) => {
      const l = nextLayer ?? layer;
      if (next.kind === "step" || next.kind === "routine") {
        setLocalSelection(null);
        setParams(mapSearch(l, next, null), { replace: true });
      } else {
        setLocalSelection(next);
        setParams(mapSearch(l, null, parsed.record), { replace: true });
      }
    },
    [layer, parsed.record, setParams],
  );

  const clear = useCallback(() => {
    setLocalSelection(null);
    setParams(mapSearch(layer, null, null), { replace: true });
  }, [layer, setParams]);

  const setLayer = (l: Layer) => {
    setHovered(null);
    setParams(mapSearch(l, parsed.selection, parsed.record), { replace: true });
  };

  const onSelectNode = useCallback((node: MapNode) => go(selectionFromRef(node.ref, record)), [go, record]);

  const requestFocus = useCallback(
    (kind: "auto" | "home") => {
      if (!graph) return;
      let goal = null;
      if (kind === "auto" && trace && !selection) goal = frameNodes(graph, trace.nodeIds);
      if (kind === "auto" && !goal && highlight.focus.length > 0) goal = frameNodes(graph, highlight.focus);
      goal ??= homeGoal(graph, kind === "auto" ? parsed.record : null);
      focusKey.current += 1;
      setFocus({
        key: focusKey.current,
        target: goal.target,
        distance: goal.distance,
        direction: goal.home ? HOME_DIRECTION : undefined,
      });
    },
    [graph, trace, selection, highlight, parsed.record],
  );

  // Fly to whatever the URL or a click now points at; clearing a selection leaves the camera where it is.
  const sceneKey = `${layer}|${parsed.record ?? ""}|${tracing}|${graph ? "ready" : ""}`;
  const selectionKey = selection ? selectionNodeId(selection) : "";
  const lastSceneKey = useRef("");
  useEffect(() => {
    const sceneChanged = lastSceneKey.current !== sceneKey;
    lastSceneKey.current = sceneKey;
    if (sceneChanged || selectionKey) requestFocus("auto");
  }, [sceneKey, selectionKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)) clear();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear]);

  useEffect(() => {
    if (view !== "3d") return;
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered, view]);

  const nodeById = useMemo(() => new Map((graph?.nodes ?? []).map((n) => [n.id, n])), [graph]);
  const popoverNode =
    (hovered ? nodeById.get(hovered) : undefined) ?? (highlight.focus[0] ? nodeById.get(highlight.focus[0]) : undefined) ?? null;

  const viewProps: MapViewProps = {
    data,
    layer,
    theme,
    palette,
    highlight,
    trace,
    hidden,
    hovered,
    popoverNode,
    record,
    reducedMotion,
    focus,
    onHover: setHovered,
    onSelect: onSelectNode,
  };
  const flat = <Map2D {...viewProps} />;

  return (
    <section className="space-y-4" data-layer={layer}>
      <header className="space-y-2">
        <h1 className="font-mono text-3xl font-semibold tracking-wide uppercase">Map</h1>
        <p className="max-w-3xl text-muted-foreground">
          MAIL LOG in two layers. The Manual layer lays out every step of the operating instructions, from login through each record's
          four modes. The Code layer shows the program as written: his routines, the CALLs between them, and the files they open.
        </p>
      </header>
      <MapToolbar
        layer={layer}
        onLayer={setLayer}
        groups={LAYER_GROUPS[layer]}
        hidden={hidden}
        onToggleGroup={(g) =>
          setHidden((prev) => {
            const next = new Set(prev);
            if (next.has(g)) next.delete(g);
            else next.add(g);
            return next;
          })
        }
        palette={palette}
        tracing={tracing}
        onTrace={setTracing}
        onReset={() => requestFocus("home")}
        view={view}
        onView={setView}
        webgl={webgl}
      />
      {/* Breaks out of the layout's max-width container to span the viewport; SiteLayout clips the
          horizontal overflow that w-screen's scrollbar width would otherwise cause. */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <div className="relative h-[64svh] min-h-80 overflow-hidden border-y" data-testid="map-viewport" data-view={view}>
          {!graph && (
            <p className="p-4 text-sm text-muted-foreground">
              {data.codeError ? "The code index could not be loaded." : "Loading the code index..."}
            </p>
          )}
          {graph &&
            (view === "3d" ? (
              <SceneErrorBoundary fallback={flat}>
                <Suspense fallback={<p className="p-4 text-sm text-muted-foreground">Loading the map...</p>}>
                  <MapCanvas {...viewProps} />
                </Suspense>
              </SceneErrorBoundary>
            ) : (
              flat
            ))}
        </div>
        {/* Floats over the map's right edge on wider screens; on phones it would bury the map, so it follows below. */}
        <div className="mx-4 mt-4 md:absolute md:top-4 md:right-4 md:z-10 md:m-0 md:max-h-[calc(100%-2rem)] md:w-[min(22rem,calc(100%-2rem))] md:overflow-y-auto md:rounded-md md:shadow-lg">
          <SelectionPanel selection={selection} data={data} layer={layer} tracing={tracing} go={go} onClear={clear} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <NodeFinder graph={graph} value={selection ? selectionNodeId(selection) : null} onPick={onSelectNode} />
        <MapLegend layer={layer} palette={palette} />
      </div>
    </section>
  );
}
