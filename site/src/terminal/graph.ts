import type { Flow } from "@/content/types";
import { DATA_TYPE_KEYS } from "./hooks/common";
import { DISPATCH_STEP, MENU_KEYS } from "./menuKeys";
import type { ProgramData, RecordType } from "./types";

export type StepRef = `${RecordType}:${number}`;

/**
 * Edges the engine can take that the flow data doesn't list as branches: the search menu's keys,
 * Step 3's switch between record flows, and the hand-routed returns to the mode menu.
 */
function extraEdges(flow: Flow): [number, RecordType | undefined, number][] {
  const record = flow.record;
  const edges: [number, RecordType | undefined, number][] = [];
  for (const key of Object.values(MENU_KEYS[record])) edges.push([DISPATCH_STEP[record], undefined, key.goto]);
  for (const target of Object.values(DATA_TYPE_KEYS)) if (target !== "exit") edges.push([3, target, 4]);
  return edges;
}

/** Every step reachable from login, following branches, `next`, menu keys, and flow switches across all three records. */
export function reachableSteps(data: ProgramData): Set<StepRef> {
  const seen = new Set<StepRef>();
  // The Terminal can open on any record's flow, so each flow's entry step is a root.
  const queue: [RecordType, number][] = Object.values(data.flows).flatMap((f) => (f ? [[f.record, f.entryStep] as [RecordType, number]] : []));
  while (queue.length > 0) {
    const [record, n] = queue.pop()!;
    const ref: StepRef = `${record}:${n}`;
    if (seen.has(ref)) continue;
    const flow = data.flows[record];
    const step = flow?.steps.find((s) => s.n === n);
    if (!flow || !step) continue;
    seen.add(ref);
    for (const b of step.branches) if (b.goto !== "exit") queue.push([record, b.goto]);
    if (typeof step.next === "number") queue.push([record, step.next]);
    for (const [from, toRecord, to] of extraEdges(flow)) if (from === n) queue.push([toRecord ?? record, to]);
  }
  return seen;
}

/** Steps no path reaches, as printed in the manual. */
export function unreachableSteps(data: ProgramData): StepRef[] {
  const seen = reachableSteps(data);
  const out: StepRef[] = [];
  for (const flow of Object.values(data.flows)) {
    if (!flow) continue;
    for (const s of flow.steps) {
      const ref: StepRef = `${flow.record}:${s.n}`;
      if (!seen.has(ref)) out.push(ref);
    }
  }
  return out;
}

/** Known gaps in the printed flows; the tests hold the engine to exactly this list. */
export const KNOWN_UNREACHABLE: StepRef[] = ["drawing-eo:131"];
