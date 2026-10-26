import type { CodeIndex, RoutineEntry, Xref } from "@/content/types";
import type { RecordType } from "./types";

export type HoodMatch = {
  routine: string;
  name: string;
  /** Line id (`NNNN.k`) of the matching prompt in the listing. */
  line: string;
  /** The printed sequence number, for `/code/<routine>?line=NNNN`. */
  seq: string;
  score: number;
  description: string | null;
};

/** The routines whose printed prompts match a step, best first, from the code cross-reference. */
export function routinesForStep(xref: Xref, index: CodeIndex | undefined, record: RecordType, step: number): HoodMatch[] {
  const entry = xref.stepToRoutines.find((s) => s.record === record && s.step === step);
  if (!entry) return [];
  const byId = new Map<string, RoutineEntry>(index?.routines.map((r) => [r.id, r]) ?? []);
  return [...entry.matches]
    .sort((a, b) => b.score - a.score)
    .map((m) => {
      const r = byId.get(m.routine);
      return {
        routine: m.routine,
        name: r?.name ?? m.routine,
        line: m.line,
        seq: m.line.split(".")[0],
        score: m.score,
        description: r?.description ?? null,
      };
    });
}

/** A few lines either side of a line id, for the panel's excerpt. */
export function excerptAround<T extends { id: string }>(lines: T[], lineId: string, radius = 4): T[] {
  const i = lines.findIndex((l) => l.id === lineId);
  if (i < 0) return lines.slice(0, radius * 2 + 1);
  return lines.slice(Math.max(0, i - radius), i + radius + 1);
}
