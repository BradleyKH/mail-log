import type { Step } from "@/content/types";
import { inputRule } from "./engine";
import { MENU_KEYS } from "./menuKeys";
import { describeRule } from "./patterns";
import type { RecordType } from "./types";

/** What a step accepts, in plain words, including the menus whose keys live in tables rather than the pattern. */
export function inputHint(record: RecordType, step: Step): string | undefined {
  if (step.n === 3) return "One of: COR, DIR, DRAW, or QU to log out";
  if (step.n === 4) return "One of: INP, REV, SEA, ARC, QUIT";
  if (step.mode === "menu") return `One of: ${Object.keys(MENU_KEYS[record]).join(", ")}`;
  return describeRule(inputRule(record, step));
}
