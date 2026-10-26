import { Color } from "three";
import type { Highlight } from "../graph/selection";
import type { MapGraph } from "../graph/types";
import type { ScenePalette } from "../palette";
import type { NodeStyle } from "./NodeInstances";

/** Group colors, with everything outside the highlight faded toward the background. */
export function nodeStyles(graph: MapGraph, palette: ScenePalette, highlight: Highlight, traceNodes: Set<string>, hovered: string | null): Map<string, NodeStyle> {
  const out = new Map<string, NodeStyle>();
  const dim = highlight.nodes.size > 0 || traceNodes.size > 0;
  const bg = new Color(palette.background);
  const focus = new Set(highlight.focus);
  for (const n of graph.nodes) {
    const base = palette.groups[n.group];
    let color = base;
    let scale = 1;
    if (focus.has(n.id)) {
      color = palette.selected;
      scale = 1.6;
    } else if (traceNodes.has(n.id)) {
      color = palette.trace;
      scale = 1.3;
    } else if (dim && !highlight.nodes.has(n.id)) {
      color = `#${new Color(base).lerp(bg, 0.72).getHexString()}`;
    }
    if (n.id === hovered) scale *= 1.35;
    out.set(n.id, { color, scale });
  }
  return out;
}
