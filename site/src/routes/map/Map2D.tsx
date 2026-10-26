import { useMemo } from "react";
import NodePopover from "./popover/NodePopover";
import type { MapViewProps } from "./viewTypes";

const PAD = 8;

/** A flat top-down drawing of the active layer for browsers without WebGL, with the same selection and links. */
export default function Map2D(props: MapViewProps) {
  const { data, layer, palette, highlight, trace, hidden, hovered, popoverNode } = props;
  const graph = layer === "code" ? data.code : data.manual;

  const view = useMemo(() => {
    if (!graph) return null;
    const nodes = graph.nodes.filter((n) => !hidden.has(n.group));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const xs = nodes.map((n) => n.position[0]);
    const zs = nodes.map((n) => n.position[2]);
    const minX = Math.min(...xs) - PAD;
    const minZ = Math.min(...zs) - PAD;
    const width = Math.max(...xs) + PAD - minX;
    const height = Math.max(...zs) + PAD - minZ;
    const edges = graph.edges.filter((e) => byId.has(e.from) && byId.has(e.to));
    return { nodes, byId, edges, viewBox: `${minX} ${minZ} ${width} ${height}` };
  }, [graph, hidden]);

  if (!graph || !view) return <p className="p-4 text-sm text-muted-foreground">Loading the code index...</p>;

  const traceEdges = new Set(trace?.edgeIds ?? []);
  const traceNodes = new Set(trace?.nodeIds ?? []);
  const dim = highlight.nodes.size > 0 || traceNodes.size > 0;
  const focus = new Set(highlight.focus);

  return (
    <div className="relative h-full w-full" data-testid="map-2d" style={{ background: palette.background }}>
      <svg viewBox={view.viewBox} className="h-full w-full" role="group" aria-label={`Two-dimensional map, ${layer} layer`}>
        <g fill="none">
          {view.edges.map((e) => {
            const a = view.byId.get(e.from)!;
            const b = view.byId.get(e.to)!;
            const lit = highlight.edges.has(e.id) || traceEdges.has(e.id);
            const mx = (a.position[0] + b.position[0]) / 2 + (b.position[2] - a.position[2]) * 0.12;
            const mz = (a.position[2] + b.position[2]) / 2 - (b.position[0] - a.position[0]) * 0.12;
            return (
              <path
                key={e.id}
                d={`M ${a.position[0]} ${a.position[2]} Q ${mx} ${mz} ${b.position[0]} ${b.position[2]}`}
                stroke={traceEdges.has(e.id) ? palette.trace : palette.groups[a.group]}
                strokeWidth={lit ? 0.45 : 0.15}
                strokeOpacity={lit ? 0.95 : dim ? 0.1 : 0.4}
              />
            );
          })}
        </g>
        {view.nodes.map((n) => {
          const isFocus = focus.has(n.id);
          const fill = isFocus ? palette.selected : traceNodes.has(n.id) ? palette.trace : palette.groups[n.group];
          const faded = dim && !isFocus && !highlight.nodes.has(n.id) && !traceNodes.has(n.id);
          const r = n.size * (isFocus ? 1.5 : 1) * (n.id === hovered ? 1.3 : 1);
          const common = {
            fill,
            fillOpacity: faded ? 0.25 : 1,
            className: "cursor-pointer",
            onPointerEnter: () => props.onHover(n.id),
            onPointerLeave: () => props.onHover(null),
            onClick: () => props.onSelect(n),
            "data-node": n.id,
          };
          const [x, , z] = n.position;
          return n.shape === "file" ? (
            <rect key={n.id} x={x - r} y={z - r * 0.7} width={r * 2} height={r * 1.4} {...common}>
              <title>{n.label}</title>
            </rect>
          ) : n.shape === "external" || n.shape === "hub" ? (
            <polygon key={n.id} points={`${x},${z - r * 1.2} ${x + r * 1.2},${z} ${x},${z + r * 1.2} ${x - r * 1.2},${z}`} {...common}>
              <title>{n.label}</title>
            </polygon>
          ) : (
            <circle key={n.id} cx={x} cy={z} r={r} {...common}>
              <title>{n.label}</title>
            </circle>
          );
        })}
        {graph.labels
          .filter((l) => !hidden.has(l.group))
          .map((l) => (
            <text
              key={l.id}
              x={l.position[0]}
              y={l.position[2] - (l.minor ? 0 : 3)}
              textAnchor="middle"
              className="pointer-events-none font-mono uppercase"
              fontSize={l.minor ? 2.2 : 3.4}
              fill="currentColor"
              opacity={l.minor ? 0.6 : 0.9}
            >
              {l.text}
            </text>
          ))}
      </svg>
      {popoverNode && view.byId.has(popoverNode.id) && (
        <div className="pointer-events-none absolute top-2 left-2">
          <NodePopover node={popoverNode} flows={data.flows} index={data.index} record={props.record} />
        </div>
      )}
    </div>
  );
}
