import type { Step } from "@/content/types";
import { keyMatches } from "./patterns";
import type { Target } from "./types";

type Condition =
  | { kind: "key"; key: string }
  | { kind: "number"; op: "=" | "!="; value: number }
  | { kind: "otherwise" }
  | { kind: "prose" };

/**
 * Reads a branch's `when` as the manual prints it: a key (`COR`, `Yes`, `Del, record deleted`),
 * a count test (`X=6`, `XX not 0`, `N = 1 (TITLE)`), a catch-all, or prose only a hook can judge.
 */
export function parseCondition(when: string): Condition {
  const w = when.replace(/^Step #\d+[a-z]?:\s*/, "").replace(/^If\s+/i, "").trim();
  if (/^(otherwise|any other)\b/i.test(w)) return { kind: "otherwise" };
  const num = /^(?:X|XX|N|NN)\s*(=|≠|not)\s*(\d+)/i.exec(w);
  if (num) return { kind: "number", op: num[1] === "=" ? "=" : "!=", value: Number(num[2]) };
  const key = /^([A-Za-z]+)(?=$|[,:;]|\s+and\b)/.exec(w);
  if (key && (key[1] === key[1].toUpperCase() || /^(yes|no|rev|del|new|last|data|now|wait|quit)$/i.test(key[1]))) {
    return { kind: "key", key: key[1].toUpperCase() };
  }
  return { kind: "prose" };
}

/** The first branch whose condition the typed input satisfies, then a catch-all if the step has one. */
export function matchBranch(step: Step, input: string): Target | undefined {
  let fallback: Target | undefined;
  for (const b of step.branches) {
    const c = parseCondition(b.when);
    if (c.kind === "key" && keyMatches(c.key, input)) return b.goto;
    if (c.kind === "number" && /^\d+$/.test(input)) {
      const n = Number(input);
      if (c.op === "=" ? n === c.value : n !== c.value) return b.goto;
    }
    if (c.kind === "otherwise") fallback ??= b.goto;
  }
  return fallback;
}
