import type { Flow, Step } from "@/content/types";
import type { Validation } from "./patterns";
import type { EngineEnv, EngineState, StoredRecord, Target } from "./types";

export type HookCtx = {
  state: EngineState;
  env: EngineEnv;
  flow: Flow;
  step: Step;
  print(...lines: string[]): void;
  hint(text: string): void;
  /** Prints the step's own prompt, optionally with placeholders filled. */
  printPrompt(fill?: Record<string, string>): void;
  records(): StoredRecord[];
  today(): string;
};

/**
 * Per-step behavior the flow data can't express: prose branch conditions, searches, and the
 * record bookkeeping the manual describes in its responses.
 */
export type Hook = {
  /** Runs on entering the step and prints its output. Return a step to move on, or "wait" for input. */
  enter?(c: HookCtx): Target | "wait" | undefined;
  /** Replaces the pattern check for steps whose valid entries live in prose or tables. */
  validate?(c: HookCtx, input: string): Validation;
  /** Runs after valid input. Return a step, `{ retry }` to repeat the step, or undefined for the generic branches. */
  submit?(c: HookCtx, input: string): Target | { retry: string[] } | undefined;
};

export type HookTable = Record<number, Hook>;

const TOKEN_EDGE = "(?<![A-Z0-9-])";
const TOKEN_END = "(?![A-Z0-9-])";

/** Fills the manual's placeholders (`XXX`, `AAAA`, `MM-DD-YY`, ...) as whole words, longest first. */
export function fill(lines: string[], map: Record<string, string>): string[] {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length);
  if (keys.length === 0) return lines;
  const re = new RegExp(`${TOKEN_EDGE}(${keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})${TOKEN_END}`, "g");
  return lines.map((l) => l.replace(re, (m) => map[m] ?? m));
}
