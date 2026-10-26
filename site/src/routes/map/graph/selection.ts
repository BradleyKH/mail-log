import type { RecordType, Xref } from "@/content/types";
import { routinesForStep, stepsForRoutine } from "./crossLinks";
import { EXIT_NODE_ID, externalNodeId, fileNodeId, routineNodeId, stepNodeId } from "./ids";
import type { Layer, MapGraph, NodeRef } from "./types";

export type Selection =
  | { kind: "step"; record: RecordType; n: number }
  | { kind: "exit" }
  | { kind: "routine"; id: string }
  | { kind: "file"; unit: string }
  | { kind: "external"; name: string };

export function selectionNodeId(s: Selection): string {
  switch (s.kind) {
    case "step":
      return stepNodeId(s.record, s.n);
    case "exit":
      return EXIT_NODE_ID;
    case "routine":
      return routineNodeId(s.id);
    case "file":
      return fileNodeId(s.unit);
    case "external":
      return externalNodeId(s.name);
  }
}

/** Turns a clicked node into a selection; core steps borrow the record in view so their links work. */
export function selectionFromRef(ref: NodeRef, record: RecordType): Selection {
  if (ref.kind === "step") return { kind: "step", record: ref.record ?? record, n: ref.n };
  return ref;
}

export function sameSelection(a: Selection | null, b: Selection | null): boolean {
  if (!a || !b) return a === b;
  return selectionNodeId(a) === selectionNodeId(b);
}

export interface Highlight {
  nodes: Set<string>;
  edges: Set<string>;
  /** Nodes to treat as selected in this layer (the node itself, or its counterparts from the other layer). */
  focus: string[];
}

/** What a selection lights up in a layer: itself and its neighbors, or its counterparts across layers. */
export function highlightFor(selection: Selection | null, layer: Layer, graph: MapGraph, xref: Xref | undefined): Highlight {
  const nodes = new Set<string>();
  const edges = new Set<string>();
  if (!selection) return { nodes, edges, focus: [] };

  let focus: string[] = [];
  const native = selectionNodeId(selection);
  const ids = new Set(graph.nodes.map((n) => n.id));
  if (ids.has(native)) focus = [native];
  else if (layer === "code" && selection.kind === "step") focus = routinesForStep(xref, selection.record, selection.n).map(routineNodeId);
  else if (layer === "manual" && selection.kind === "routine") {
    focus = stepsForRoutine(xref, selection.id).map((s) => stepNodeId(s.record, s.step));
  }
  focus = focus.filter((id) => ids.has(id));

  for (const id of focus) nodes.add(id);
  for (const e of graph.edges) {
    if (focus.includes(e.from) || focus.includes(e.to)) {
      edges.add(e.id);
      nodes.add(e.from);
      nodes.add(e.to);
    }
  }
  return { nodes, edges, focus };
}
