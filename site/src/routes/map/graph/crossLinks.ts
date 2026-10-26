import type { RecordType, Xref } from "@/content/types";
import { isCoreStep } from "./ids";

export interface StepKey {
  record: RecordType;
  step: number;
}

/** The routine that prints a step's prompt: the top xref match, per the code index's own ranking. */
export function routinesForStep(xref: Xref | undefined, record: RecordType, step: number): string[] {
  const records: readonly RecordType[] = isCoreStep(step) ? ["correspondence", "dir", "drawing-eo"] : [record];
  const out = new Set<string>();
  for (const r of records) {
    const top = xref?.stepToRoutines.find((s) => s.record === r && s.step === step)?.matches[0];
    if (top && top.score >= (xref?.threshold ?? 0)) out.add(top.routine);
  }
  return [...out];
}

export function topMatchLine(xref: Xref | undefined, record: RecordType, step: number, routine: string): string | undefined {
  return xref?.stepToRoutines.find((s) => s.record === record && s.step === step)?.matches.find((m) => m.routine === routine)?.line;
}

/** Steps whose top match is this routine, so a routine never claims a step another routine prints. */
export function stepsForRoutine(xref: Xref | undefined, routine: string): StepKey[] {
  if (!xref) return [];
  const entry = xref.routineToSteps.find((r) => r.routine === routine);
  return (entry?.steps ?? [])
    .filter((s) => routinesForStep(xref, s.record, s.step).includes(routine))
    .map(({ record, step }) => ({ record, step }));
}
