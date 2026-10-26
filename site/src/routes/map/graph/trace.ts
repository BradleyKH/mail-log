import { routineNodeId, stepNodeId } from "./ids";
import type { Layer, MapGraph } from "./types";

/**
 * The author/source search as the manual walks it: login and entry, the mode menu, the search
 * menu, the current-date and subfile prompts, the AUTH dispatch at #10, the search itself (#30,
 * #31, #32), and the continue prompt (#17) back to the search menu.
 */
export const MANUAL_TRACE_STEPS = [1, 2, 3, 4, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 330, 331, 332, 317, 301] as const;

/** SEAC dispatches the search to AUSEA, which prints through the screen and hard-copy routines. */
export const CODE_TRACE_ROUTINES = ["SEAC", "AUSEA", "SCRNHD", "SCRNPT", "HARDHD", "HARDPT"] as const;

export interface TracePath {
  nodeIds: string[];
  edgeIds: string[];
}

export function tracePath(layer: Layer, graph: MapGraph): TracePath {
  const edgeIds = new Set(graph.edges.map((e) => e.id));
  if (layer === "manual") {
    const nodeIds = MANUAL_TRACE_STEPS.map((n) => stepNodeId("correspondence", n));
    const path: string[] = [];
    for (let i = 1; i < nodeIds.length; i++) {
      const id = `${nodeIds[i - 1]}->${nodeIds[i]}`;
      if (edgeIds.has(id)) path.push(id);
    }
    return { nodeIds: [...new Set(nodeIds)], edgeIds: path };
  }
  const [caller, search, ...printers] = CODE_TRACE_ROUTINES.map(routineNodeId);
  const candidates = [`${caller}->${search}`, ...printers.map((p) => `${search}->${p}`)];
  return { nodeIds: [caller, search, ...printers], edgeIds: candidates.filter((id) => edgeIds.has(id)) };
}
