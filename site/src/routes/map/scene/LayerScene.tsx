import { useFrame } from "@react-three/fiber";
import { useCallback, useMemo, useRef } from "react";
import type { Group } from "three";
import type { Highlight } from "../graph/selection";
import type { TracePath } from "../graph/trace";
import type { MapEdge, MapGraph, MapNode, NodeGroup, NodeShape } from "../graph/types";
import type { ScenePalette } from "../palette";
import EdgeLines from "./EdgeLines";
import FocusRings from "./FocusRings";
import HighlightEdges from "./HighlightEdges";
import NodeInstances from "./NodeInstances";
import { nodeStyles } from "./nodeStyles";
import TraceTraveler from "./TraceTraveler";

const SHAPES: readonly NodeShape[] = ["step", "hub", "routine", "file", "external"];

interface Props {
  graph: MapGraph;
  active: boolean;
  palette: ScenePalette;
  glow: "additive" | "normal";
  highlight: Highlight;
  trace: TracePath | null;
  hidden: Set<NodeGroup>;
  hovered: string | null;
  reducedMotion: boolean;
  onHover: (id: string | null) => void;
  onSelect: (node: MapNode) => void;
}

/** One layer of the map; the inactive layer shrinks and fades out rather than vanishing. */
export default function LayerScene(props: Props) {
  const { graph, active, palette, glow, highlight, trace, hidden, hovered, reducedMotion } = props;
  const group = useRef<Group>(null);
  const progress = useRef(active ? 1 : 0);

  useFrame((_, delta) => {
    const target = active ? 1 : 0;
    const p = reducedMotion ? target : progress.current + (target - progress.current) * (1 - Math.exp(-delta * 5));
    progress.current = Math.abs(p - target) < 0.002 ? target : p;
    if (group.current) {
      group.current.scale.setScalar(0.82 + 0.18 * progress.current);
      group.current.visible = progress.current > 0.01;
    }
  });

  const nodes = useMemo(() => graph.nodes.filter((n) => !hidden.has(n.group)), [graph, hidden]);
  const nodeById = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);
  const visibleIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);
  const traceNodes = useMemo(() => new Set(trace?.nodeIds ?? []), [trace]);
  const traceEdges = useMemo(() => new Set(trace?.edgeIds ?? []), [trace]);
  const styles = useMemo(() => nodeStyles(graph, palette, highlight, traceNodes, hovered), [graph, palette, highlight, traceNodes, hovered]);

  const { base, lit } = useMemo(() => {
    const base: MapEdge[] = [];
    const lit: MapEdge[] = [];
    for (const e of graph.edges) {
      if (!visibleIds.has(e.from) || !visibleIds.has(e.to)) continue;
      (highlight.edges.has(e.id) || traceEdges.has(e.id) ? lit : base).push(e);
    }
    return { base, lit };
  }, [graph, visibleIds, highlight, traceEdges]);

  const colorOf = useCallback(
    (e: MapEdge) => {
      if (traceEdges.has(e.id)) return palette.trace;
      const from = nodeById.get(e.from);
      return from ? palette.groups[from.group] : palette.edge;
    },
    [traceEdges, palette, nodeById],
  );

  const traced = useMemo(() => (trace ? trace.edgeIds.flatMap((id) => graph.edges.filter((e) => e.id === id)) : []), [trace, graph]);
  const dimmed = highlight.nodes.size > 0 || traceNodes.size > 0;
  const focused = useMemo(() => highlight.focus.flatMap((id) => nodes.filter((n) => n.id === id)), [highlight, nodes]);

  return (
    <group ref={group}>
      {SHAPES.map((shape) => {
        const subset = nodes.filter((n) => n.shape === shape);
        if (subset.length === 0) return null;
        return (
          <NodeInstances
            key={shape}
            nodes={subset}
            shape={shape}
            styles={styles}
            progress={progress}
            active={active}
            glow={glow}
            onHover={props.onHover}
            onSelect={props.onSelect}
          />
        );
      })}
      <EdgeLines nodes={nodes} edges={base} colorOf={colorOf} dimmed={dimmed} progress={progress} pulse={!reducedMotion} additive={glow === "additive"} />
      <HighlightEdges nodes={nodes} edges={lit} colorOf={colorOf} progress={progress} animate={!reducedMotion} />
      {active && focused.length > 0 && (
        <FocusRings nodes={focused} color={palette.selected} additive={glow === "additive"} animate={!reducedMotion} progress={progress} />
      )}
      {active && trace && !reducedMotion && <TraceTraveler nodes={nodes} edges={traced} color={palette.trace} />}
    </group>
  );
}
