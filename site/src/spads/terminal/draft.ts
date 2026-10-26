import { printHeaderAndJobs } from "./retrieve";
import type { Session } from "./session";
import { recordDate } from "./screens";

/** Fee-table percent for a task; the printed MOD (PDF 33) shows 0.000% once TASK becomes Z, which the table lacks. */
export function feeFor(s: Session, task: string): number {
  const row = s.store.tables().fee.find((f) => f.contract === "NAS1-16200" && f.task === task && f.subtask === "ALL");
  return row?.fee ?? 0;
}

/** Ends a MOD or INPUT: stores the record and returns to the program main menu. */
export function saveDraft(s: Session): void {
  const draft = s.ctx.draft;
  if (!draft) return s.go("analysis");
  draft.date = recordDate(s.now());
  if (s.ctx.modMethod === "replace") {
    s.store.replace(draft);
    s.hint(`Record ${draft.sysnum} is replaced in this session's data base.`);
  } else {
    const { sysnum: _omit, ...rest } = draft;
    void _omit;
    const added = s.store.add({ ...rest, origin: "session" });
    s.print("");
    s.show("itemAdded");
    s.print("");
    s.print(`${s.menu("systemItemNumber")[0]} ${added.sysnum.padStart(4)}`);
  }
  s.ctx.draft = undefined;
  s.ctx.modMethod = undefined;
  s.print("");
  s.go("analysis");
}

/** After job orders change: the redisplay, then the next prompt for MOD or INPUT. */
export function jobOrdersDone(s: Session): void {
  if (s.ctx.draft) printHeaderAndJobs(s, s.ctx.draft);
  s.go(s.ctx.modMethod === "input" ? "mod.dataChange" : "mod.section");
}

