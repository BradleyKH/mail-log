import type { CodeIndex, RoutineEntry } from "@/content/types";
import { deg, distance, phyllotaxis, phyllotaxisRadius, polar } from "./geometry";
import { externalNodeId, fileNodeId, routineNodeId } from "./ids";
import { GROUP_LABELS } from "./labels";
import { RECORD_ANGLES } from "./manualLayout";
import { jitter } from "./random";
import type { ClusterLabel, CodeGroup, MapEdge, MapGraph, MapNode, Vec3 } from "./types";

type RoutineGroup = Exclude<CodeGroup, "file" | "external">;

const GROUP_PLACEMENT: Record<RoutineGroup, { angle: number; radius: number }> = {
  correspondence: { angle: RECORD_ANGLES.correspondence, radius: 46 },
  dir: { angle: RECORD_ANGLES.dir, radius: 46 },
  "drawing-eo": { angle: RECORD_ANGLES["drawing-eo"], radius: 46 },
  general: { angle: deg(90), radius: 34 },
  support: { angle: deg(-30), radius: 40 },
};
const ROUTINE_ORDER: readonly RoutineGroup[] = ["correspondence", "dir", "drawing-eo", "general", "support"];

const ROUTINE_SPACING = 4.4;
const FILE_HEIGHT = 16;
const FILE_SIZE = 0.9;
const EXTERNAL_SIZE = 0.9;
const ORIGIN: Vec3 = [0, 0, 0];

/** Routines are sized by line count; the square root keeps the 300-line drivers from swamping the rest. */
export const routineSize = (lines: number) => 0.6 + Math.sqrt(lines) / 9;

const isEntry = (r: RoutineEntry) => r.kind === "main" || r.kind === "program";

function routineGroup(r: RoutineEntry): RoutineGroup | "external" {
  return r.record;
}

export function buildCodeGraph(index: CodeIndex): MapGraph {
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];
  const labels: ClusterLabel[] = [];
  const groupCenters: MapGraph["groupCenters"] = { external: ORIGIN };
  const positions = new Map<string, Vec3>();

  for (const group of ROUTINE_ORDER) {
    const members = index.routines
      .filter((r) => routineGroup(r) === group)
      .sort((a, b) => Number(isEntry(b)) - Number(isEntry(a)) || b.lines - a.lines || a.id.localeCompare(b.id));
    if (members.length === 0) continue;
    const { angle, radius } = GROUP_PLACEMENT[group];
    const center = polar(ORIGIN, angle, radius, 0);
    groupCenters[group] = center;
    labels.push({
      id: `label:${group}`,
      text: GROUP_LABELS[group],
      group,
      position: [center[0], 4 + phyllotaxisRadius(members.length, ROUTINE_SPACING) * 0.15, center[2]],
    });
    members.forEach((r, i) => {
      const id = routineNodeId(r.id);
      // Skipping the first ring slot leaves room for the large entry routine at the center.
      const p = phyllotaxis(center, i === 0 ? 0 : i + 1, ROUTINE_SPACING, angle);
      const position: Vec3 = [p[0], jitter(id, 1.5), p[2]];
      positions.set(id, position);
      nodes.push({ id, layer: "code", shape: "routine", group, label: r.id, position, size: routineSize(r.lines), ref: { kind: "routine", id: r.id } });
    });
  }

  // Shared externals (system calls plus the Appendix E routine) ring the center, where every record reaches them.
  const externalNames = new Set<string>();
  for (const r of index.routines) for (const c of r.calls) if (c.kind === "external") externalNames.add(c.name);
  const centralRoutines = index.routines.filter((r) => routineGroup(r) === "external").sort((a, b) => a.id.localeCompare(b.id));
  const ring: { id: string; label: string; node: Omit<MapNode, "position"> }[] = [
    ...centralRoutines.map((r) => ({
      id: routineNodeId(r.id),
      label: r.id,
      node: { id: routineNodeId(r.id), layer: "code" as const, shape: "routine" as const, group: "external" as const, label: r.id, size: routineSize(r.lines), ref: { kind: "routine" as const, id: r.id } },
    })),
    ...[...externalNames].sort().map((name) => ({
      id: externalNodeId(name),
      label: name,
      node: { id: externalNodeId(name), layer: "code" as const, shape: "external" as const, group: "external" as const, label: name, size: EXTERNAL_SIZE, ref: { kind: "external" as const, name } },
    })),
  ];
  const ringRadius = Math.max(6, (ring.length * 2.6) / (Math.PI * 2));
  ring.forEach((item, i) => {
    const position = polar(ORIGIN, (i / ring.length) * Math.PI * 2, ringRadius, jitter(item.id, 0.8));
    positions.set(item.id, position);
    nodes.push({ ...item.node, position });
  });
  labels.push({ id: "label:external", text: GROUP_LABELS.external, group: "external", position: [0, 5, 0] });

  // Data files float above the routines that open them, nudged apart so none overlap.
  const fileUsers = new Map<string, string[]>();
  for (const r of index.routines) {
    for (const f of r.files) if (f.kind === "file") fileUsers.set(f.unit, [...(fileUsers.get(f.unit) ?? []), routineNodeId(r.id)]);
  }
  const filePositions = [...fileUsers.keys()].sort().map((unit) => {
    const users = fileUsers.get(unit)!.map((id) => positions.get(id)!).filter(Boolean);
    const cx = users.reduce((s, p) => s + p[0], 0) / users.length;
    const cz = users.reduce((s, p) => s + p[2], 0) / users.length;
    const id = fileNodeId(unit);
    return { unit, id, p: [cx * 0.85 + jitter(`${id}x`, 2), FILE_HEIGHT + jitter(id, 1.5), cz * 0.85 + jitter(`${id}z`, 2)] as Vec3 };
  });
  for (let iter = 0; iter < 60; iter++) {
    for (let a = 0; a < filePositions.length; a++) {
      for (let b = a + 1; b < filePositions.length; b++) {
        const pa = filePositions[a].p;
        const pb = filePositions[b].p;
        const d = distance(pa, pb);
        const min = 4;
        if (d >= min) continue;
        const dx = d === 0 ? 1 : (pb[0] - pa[0]) / d;
        const dz = d === 0 ? 0 : (pb[2] - pa[2]) / d;
        const push = (min - d) / 2;
        pa[0] -= dx * push;
        pa[2] -= dz * push;
        pb[0] += dx * push;
        pb[2] += dz * push;
      }
    }
  }
  for (const { unit, id, p } of filePositions) {
    positions.set(id, p);
    nodes.push({ id, layer: "code", shape: "file", group: "file", label: unit, position: p, size: FILE_SIZE, ref: { kind: "file", unit } });
  }

  const seen = new Set<string>();
  const addEdge = (from: string, to: string, kind: MapEdge["kind"], label?: string) => {
    const id = `${from}->${to}`;
    if (from === to || seen.has(id) || !positions.has(from) || !positions.has(to)) return;
    seen.add(id);
    edges.push({ id, from, to, kind, label });
  };
  for (const r of index.routines) {
    const from = routineNodeId(r.id);
    for (const c of r.calls) {
      if (c.kind === "routine" && c.target) addEdge(from, routineNodeId(c.target), "call");
      else if (c.kind === "external") addEdge(from, externalNodeId(c.name), "call");
    }
    for (const f of r.files) if (f.kind === "file") addEdge(from, fileNodeId(f.unit), "file", f.mode);
  }

  return { layer: "code", nodes, edges, labels, groupCenters };
}
