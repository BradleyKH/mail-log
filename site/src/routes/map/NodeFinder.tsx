import { GROUP_LABELS } from "./graph/labels";
import type { MapGraph, MapNode, NodeGroup } from "./graph/types";

/** A keyboard and screen-reader route to every node, since the scene itself is pointer-only. */
export default function NodeFinder({ graph, value, onPick }: { graph: MapGraph | null; value: string | null; onPick: (node: MapNode) => void }) {
  if (!graph) return null;
  const groups = new Map<NodeGroup, MapNode[]>();
  for (const n of graph.nodes) groups.set(n.group, [...(groups.get(n.group) ?? []), n]);
  const label = (n: MapNode) => (n.ref.kind === "step" && n.ref.n >= 100 ? `${n.label} (${n.ref.n})` : n.label);
  return (
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      Find
      <select
        className="h-7 max-w-56 rounded-md border bg-background px-2 font-mono text-xs text-foreground"
        value={value && graph.nodes.some((n) => n.id === value) ? value : ""}
        onChange={(e) => {
          const node = graph.nodes.find((n) => n.id === e.target.value);
          if (node) onPick(node);
        }}
        aria-label={graph.layer === "manual" ? "Find a step" : "Find a routine or file"}
      >
        <option value="">{graph.layer === "manual" ? "a step..." : "a routine or file..."}</option>
        {[...groups].map(([g, nodes]) => (
          <optgroup key={g} label={GROUP_LABELS[g]}>
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {label(n)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
