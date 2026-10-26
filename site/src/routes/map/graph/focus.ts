import type { RecordType } from "@/content/types";
import { distance } from "./geometry";
import type { MapGraph, Vec3 } from "./types";

export interface CameraGoal {
  target: Vec3;
  distance: number;
  home: boolean;
}

/** Frames a set of nodes: their centroid, far enough back to see all of them. */
export function frameNodes(graph: MapGraph, ids: string[]): CameraGoal | null {
  const nodes = graph.nodes.filter((n) => ids.includes(n.id));
  if (nodes.length === 0) return null;
  const c: Vec3 = [0, 0, 0];
  for (const n of nodes) for (let k = 0; k < 3; k++) c[k] += n.position[k] / nodes.length;
  const span = Math.max(...nodes.map((n) => distance(n.position, c)));
  const biggest = Math.max(...nodes.map((n) => n.size));
  return { target: c, distance: Math.max(34 + biggest * 8, span * 2.6), home: false };
}

export function homeGoal(graph: MapGraph, record: RecordType | null): CameraGoal {
  const center = record ? graph.groupCenters[record] : undefined;
  if (center) return { target: center, distance: 95, home: false };
  const extent = Math.max(...graph.nodes.map((n) => Math.hypot(n.position[0], n.position[2])), 40);
  return { target: [0, 0, 0], distance: extent * 1.95, home: true };
}
