import type { Flow, RecordType } from "@/content/types";
import { deg, phyllotaxis, phyllotaxisRadius, polar } from "./geometry";
import { EXIT_NODE_ID, isCoreStep, stepNodeId } from "./ids";
import { GROUP_LABELS, MODE_LABELS, RECORD_ORDER, STEP_MODES, modeOfStep } from "./labels";
import { deriveMenuKeys } from "./menuKeys";
import { jitter } from "./random";
import type { ClusterLabel, MapEdge, MapGraph, MapNode, NodeGroup, Vec3 } from "./types";

/** Shared by both layers so a record sits in the same direction when the layers cross-fade. */
export const RECORD_ANGLES: Record<RecordType, number> = {
  correspondence: deg(-90),
  dir: deg(30),
  "drawing-eo": deg(150),
};

const RECORD_RADIUS = 52;
const STEP_SPACING = 2.3;
/** Mode sub-clusters fan out on the far side of the hub, away from the core. */
const MODE_OFFSETS = { input: deg(-105), revise: deg(-38), search: deg(38), archive: deg(105) };
const STEP_SIZE = 0.65;
const HUB_SIZE = 1.1;

const ORIGIN: Vec3 = [0, 0, 0];

export function buildManualGraph(flows: Partial<Record<RecordType, Flow>>): MapGraph {
  const nodes: MapNode[] = [];
  const edges: MapEdge[] = [];
  const labels: ClusterLabel[] = [];
  const groupCenters: MapGraph["groupCenters"] = { core: ORIGIN };
  const seen = new Set<string>();

  const coreTitles = new Map<number, string>();
  for (const record of RECORD_ORDER) {
    for (const s of flows[record]?.steps ?? []) if (isCoreStep(s.n) && s.title) coreTitles.set(s.n, s.title);
  }
  const coreIds = [1, 2, 3, "exit"] as const;
  coreIds.forEach((n, i) => {
    const angle = deg(-90) + (i * Math.PI * 2) / coreIds.length + deg(45);
    const id = n === "exit" ? EXIT_NODE_ID : stepNodeId("correspondence", n);
    nodes.push({
      id,
      layer: "manual",
      shape: "hub",
      group: "core",
      label: n === "exit" ? "Exit" : `Step #${n}${coreTitles.get(n) ? ` ${coreTitles.get(n)}` : ""}`,
      position: polar(ORIGIN, angle, 5, jitter(id, 0.6)),
      size: HUB_SIZE,
      ref: n === "exit" ? { kind: "exit" } : { kind: "step", record: null, n },
    });
  });
  labels.push({ id: "label:core", text: GROUP_LABELS.core, group: "core", position: [0, 4.5, 0] });

  for (const record of RECORD_ORDER) {
    const flow = flows[record];
    if (!flow) continue;
    const angle = RECORD_ANGLES[record];
    const hub = polar(ORIGIN, angle, RECORD_RADIUS, 0);
    groupCenters[record] = hub;
    labels.push({ id: `label:${record}`, text: GROUP_LABELS[record], group: record, position: [hub[0], 6, hub[2]] });

    const hubStep = flow.steps.find((s) => s.n === 4);
    nodes.push({
      id: stepNodeId(record, 4),
      layer: "manual",
      shape: "hub",
      group: record,
      label: `Step #4${hubStep?.title ? ` ${hubStep.title}` : ""}`,
      position: hub,
      size: HUB_SIZE * 1.3,
      ref: { kind: "step", record, n: 4 },
    });

    for (const mode of STEP_MODES) {
      const steps = flow.steps.filter((s) => modeOfStep(s.n) === mode).sort((a, b) => a.n - b.n);
      if (steps.length === 0) continue;
      const clusterRadius = phyllotaxisRadius(steps.length, STEP_SPACING);
      const center = polar(hub, angle + MODE_OFFSETS[mode], 9 + clusterRadius, 0);
      labels.push({
        id: `label:${record}:${mode}`,
        text: MODE_LABELS[mode],
        group: record,
        position: [center[0], 3.2, center[2]],
        minor: true,
      });
      steps.forEach((s, i) => {
        const id = stepNodeId(record, s.n);
        const p = phyllotaxis(center, i, STEP_SPACING, angle);
        const isMenu = s.mode === "menu";
        nodes.push({
          id,
          layer: "manual",
          shape: isMenu ? "hub" : "step",
          group: record,
          label: s.title ?? `Step ${s.n}`,
          position: [p[0], jitter(id, 1.2), p[2]],
          size: isMenu ? HUB_SIZE : STEP_SIZE,
          ref: { kind: "step", record, n: s.n },
        });
      });
    }

    const addEdge = (fromN: number, to: number | "exit", kind: MapEdge["kind"], label?: string) => {
      const from = stepNodeId(record, fromN);
      const toId = to === "exit" ? EXIT_NODE_ID : stepNodeId(record, to);
      const id = `${from}->${toId}`;
      if (from === toId || seen.has(id)) return;
      seen.add(id);
      edges.push({ id, from, to: toId, kind, label });
    };
    for (const s of flow.steps) {
      for (const b of s.branches) addEdge(s.n, b.goto, "flow", b.when);
      if (s.next !== undefined) addEdge(s.n, s.next, "flow");
    }
    for (const k of deriveMenuKeys(flow).keys) addEdge(301, k.goto, "menu", k.key);
  }

  const ids = new Set(nodes.map((n) => n.id));
  return { layer: "manual", nodes, edges: edges.filter((e) => ids.has(e.from) && ids.has(e.to)), labels, groupCenters };
}

export const manualGroups: readonly NodeGroup[] = ["core", ...RECORD_ORDER];
