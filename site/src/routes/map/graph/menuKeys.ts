import type { Flow, Step } from "@/content/types";

export interface MenuKey {
  key: string;
  label: string;
  goto: number;
}

const MENU_STEP = 301;
const MENU_ROW = /^(.+?)\s{2,}([A-Z][A-Z.]{0,5})$/;

/** Key rows printed in the search menu's prompt, e.g. `AUTHOR/SOURCE   AUTH`. */
export function parseMenuRows(menu: Step): { key: string; label: string }[] {
  const rows: { key: string; label: string }[] = [];
  for (const line of menu.prompt) {
    const m = MENU_ROW.exec(line.trim());
    if (m && m[2] !== "KEY") rows.push({ label: m[1].trim(), key: m[2] });
  }
  return rows;
}

const mentions = (when: string, key: string) => new RegExp(`(^|[^A-Z])${key}([^A-Z]|$)`).test(when);

/**
 * The search menu routes by the typed key, which the flow records only as prose in later
 * "key selected is X" branches. Each key goes to the most specific branch naming it (fewest keys
 * named), preferring the dispatch step (the step whose branches name the most keys) and then the
 * step closest to the menu.
 */
export function deriveMenuKeys(flow: Flow): { keys: MenuKey[]; unmatched: string[] } {
  const menu = flow.steps.find((s) => s.n === MENU_STEP);
  if (!menu) return { keys: [], unmatched: [] };
  const rows = parseMenuRows(menu);
  const searchSteps = flow.steps.filter((s) => s.n > MENU_STEP && s.n < 400).sort((a, b) => a.n - b.n);
  const keysNamed = (when: string) => rows.filter((r) => mentions(when, r.key)).length;
  const score = (s: Step) => rows.filter((r) => s.branches.some((b) => mentions(b.when, r.key))).length;
  const dispatch = [...searchSteps].sort((a, b) => score(b) - score(a) || a.n - b.n)[0];

  const keys: MenuKey[] = [];
  const unmatched: string[] = [];
  for (const row of rows) {
    const names = (when: string) =>
      mentions(when, row.key) || (row.key.length >= 4 && when.toLowerCase().split(/[^a-z]+/).includes(row.key.toLowerCase()));
    const hits = searchSteps.flatMap((step) =>
      step.branches
        .filter((b) => typeof b.goto === "number" && names(b.when))
        .map((b) => ({ goto: b.goto as number, named: Math.max(1, keysNamed(b.when)), dispatch: step === dispatch ? 0 : 1, n: step.n })),
    );
    hits.sort((a, b) => a.named - b.named || a.dispatch - b.dispatch || a.n - b.n);
    if (hits[0]) keys.push({ key: row.key, label: row.label, goto: hits[0].goto });
    else unmatched.push(row.key);
  }
  return { keys, unmatched };
}
