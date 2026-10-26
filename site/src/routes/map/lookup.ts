import type { CodeIndex, Flow, RecordType, RoutineEntry, Step } from "@/content/types";

export function findStep(flows: Partial<Record<RecordType, Flow>>, record: RecordType, n: number): Step | undefined {
  return flows[record]?.steps.find((s) => s.n === n);
}

export function findRoutine(index: CodeIndex | null, id: string): RoutineEntry | undefined {
  return index?.routines.find((r) => r.id === id);
}

export function fileAccess(index: CodeIndex | null, unit: string): { routine: string; mode: string; purpose: string | null }[] {
  if (!index) return [];
  return index.routines.flatMap((r) =>
    r.files.filter((f) => f.kind === "file" && f.unit === unit).map((f) => ({ routine: r.id, mode: f.mode, purpose: f.purpose })),
  );
}

export function externalCallers(index: CodeIndex | null, name: string): string[] {
  if (!index) return [];
  return index.routines.filter((r) => r.calls.some((c) => c.kind === "external" && c.name === name)).map((r) => r.id);
}

export function findExternal(index: CodeIndex | null, name: string) {
  return index?.externals.find((e) => e.name === name);
}
