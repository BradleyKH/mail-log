import type { RecordType } from "@/content/types";
import type { NodeGroup } from "./types";

export const RECORD_ORDER: readonly RecordType[] = ["correspondence", "dir", "drawing-eo"];

export const GROUP_LABELS: Record<NodeGroup, string> = {
  core: "Login and entry",
  correspondence: "Correspondence",
  dir: "DIR/Report",
  "drawing-eo": "Drawing/E.O.",
  general: "General subroutines",
  support: "Support programs",
  external: "Shared externals",
  file: "Data files",
};

export type StepMode = "input" | "revise" | "search" | "archive";
export const STEP_MODES: readonly StepMode[] = ["input", "revise", "search", "archive"];

export const MODE_LABELS: Record<StepMode, string> = {
  input: "Input",
  revise: "Revise",
  search: "Search",
  archive: "Archive",
};

/** The manual numbers each mode's steps from #1, stored as 100+N, 200+N, 300+N, 400+N. */
export function modeOfStep(n: number): StepMode | null {
  return STEP_MODES[Math.floor(n / 100) - 1] ?? null;
}

/** The step number as printed in the manual (`Step #30` for 330). */
export const printedStepNumber = (n: number) => (n >= 100 ? n % 100 : n);
