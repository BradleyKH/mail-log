import { isRealDate, parseMmddyy } from "../dates";
import type { Hook, HookCtx } from "../hook";
import type { StoredRecord, Target } from "../types";

/** The record on screen as `LABEL value` lines, in the field layout's order. */
export function recordLines(c: HookCtx, values: Record<string, string>): string[] {
  const fields = c.env.data.fields[c.state.record] ?? [];
  return fields.filter((f) => values[f.name]).map((f) => `${f.label.padEnd(24)}${values[f.name]}`);
}

/** Saves the record being entered or revised to the session store. */
export function commit(c: HookCtx, values: Record<string, string> = c.state.fields): StoredRecord | undefined {
  const id = c.state.vars.editingId;
  if (id) {
    c.env.store.update(c.state.record, id, values);
    return c.env.store.list(c.state.record).find((r) => r.id === id);
  }
  return c.env.store.add(c.state.record, values);
}

export function beginEdit(c: HookCtx, rec: StoredRecord) {
  c.state.vars.editingId = rec.id;
  c.state.fields = { ...rec.values };
}

export const candidates = (c: HookCtx): StoredRecord[] => {
  const ids = c.state.vars.candidates ?? [];
  const all = c.records();
  return ids.flatMap((id) => all.filter((r) => r.id === id));
};

export const setCandidates = (c: HookCtx, found: StoredRecord[]) => {
  c.state.vars.candidates = found.map((r) => r.id);
};

/** Step that records how many times a following step repeats (`HOW MANY ... (MAX OF N)`). */
export const countStep = (): Hook => ({
  submit(c, input) {
    c.state.vars.remaining = Number(input);
    return undefined;
  },
});

/**
 * An item-number step: jumps to the input step for item N, then comes back here until the
 * count from the previous step runs out, then goes on to `after`.
 */
export const itemStep = (items: Record<number, number>, here: number, after: Target, jumpFrom?: "lastInput"): Hook => {
  const route = (c: HookCtx, n: number): Target | { retry: string[] } => {
    const target = items[n];
    if (!target) return { retry: [] };
    const left = (c.state.vars.remaining ?? 1) - 1;
    c.state.vars.remaining = left;
    c.state.vars.itemReturn = left > 0 ? here : (after as number);
    return target;
  };
  return jumpFrom
    ? {
        enter(c) {
          c.printPrompt();
          const r = route(c, Number(c.state.vars.lastInput));
          return typeof r === "object" ? after : r;
        },
      }
    : { submit: (c, input) => route(c, Number(input)) };
};

/** A `DO YOU WANT SUBFILE NUMBER N` style step that repeats, counting N up, until the count is met. */
export const subfileLoop = (here: number, after: number): Hook => ({
  enter(c) {
    c.state.vars.subfile = (c.state.vars.subfile ?? 0) + 1;
    c.printPrompt({ N: String(c.state.vars.subfile) });
    return "wait";
  },
  submit(c, input) {
    if (input.startsWith("Y")) c.state.vars.remaining = (c.state.vars.remaining ?? 1) - 1;
    const more = (c.state.vars.remaining ?? 0) > 0 && (c.state.vars.subfile ?? 6) < 6;
    if (more) return here;
    c.state.vars.subfile = undefined;
    return after;
  },
});

export const validDate = (s: string | undefined) => {
  const ymd = s ? parseMmddyy(s) : undefined;
  return !!ymd && isRealDate(ymd);
};

/** A step that only shows its prompt and goes on (pauses, "stand by" messages). */
export const showAndGo = (target: Target): Hook => ({
  enter(c) {
    c.printPrompt();
    return target;
  },
});
