import type { RecordType } from "@/content/types";

/** Steps 1-3 (login, program entry, data-type choice) are one shared core for every record. */
export const CORE_STEPS = [1, 2, 3] as const;

export const isCoreStep = (n: number) => n >= 1 && n <= 3;

export const EXIT_NODE_ID = "step:exit";

export function stepNodeId(record: RecordType, n: number): string {
  return isCoreStep(n) ? `step:core:${n}` : `step:${record}:${n}`;
}

export const routineNodeId = (id: string) => `routine:${id}`;
export const fileNodeId = (unit: string) => `file:${unit}`;
export const externalNodeId = (name: string) => `external:${name}`;
