import { jobOrdersDone } from "./draft";
import { answer, intOf, numOf, type Session, type Steps } from "./session";
import { TEXT } from "./screens";
import type { SpadsJobOrder } from "./types";

// Job-order ADD, DELETE, CHANGE, and AUTO (PDF 33 to 40), shared by MOD and
// INPUT; INPUT asks for a fixed count of job orders (PDF 50).

const JO_PATTERN = /^[A-Z]\d{4}[A-Z0-9]$/;

/**
 * One line typed under the job-order form. The form is fixed-column (an
 * 8-column slot per percent after the 7-column job order), so a line with
 * runs of spaces is read by column; a line with single spaces by token.
 */
export function parseJobOrderLine(text: string): SpadsJobOrder | null {
  const raw = text.replace(/!/g, " ").replace(/\s+$/, "").toUpperCase();
  const jo = raw.trim().split(/\s+/)[0] ?? "";
  if (!JO_PATTERN.test(jo)) return null;
  let values: number[];
  if (/\S\s{2,}\S/.test(raw.trim())) {
    const line = raw.trimStart();
    values = Array.from({ length: 9 }, (_, i) => numOf(line.slice(7 + 8 * i, 15 + 8 * i)) ?? 0);
  } else {
    values = raw.trim().split(/\s+/).slice(1).map((t) => numOf(t) ?? 0);
  }
  const padded = [...values, 0, 0, 0, 0, 0, 0, 0, 0, 0].slice(0, 9);
  return { jo, sub: "", progno: "", all: padded[0], fy: padded.slice(1) };
}

const findJo = (s: Session, jo: string) => s.ctx.draft?.jobOrders.findIndex((j) => j.jo === answer(jo)) ?? -1;

function pushJobOrder(s: Session, jo: SpadsJobOrder): void {
  s.ctx.draft?.jobOrders.push(jo);
  s.ctx.joPending = undefined;
  if (s.ctx.modMethod === "input") {
    s.ctx.joRemaining = (s.ctx.joRemaining ?? 1) - 1;
    if ((s.ctx.joRemaining ?? 0) <= 0) return jobOrdersDone(s);
  }
  s.go("jo.add");
}

/** The AUTO build from the sustaining table for the record's task and subtask (PDF 37 to 39). */
export function startAuto(s: Session): void {
  const draft = s.ctx.draft;
  if (!draft) return;
  const subtask = draft.taskas ? `${draft.taskas}${draft.tasksb}` : "ALL";
  const rows = s.store.tables().sustaining.filter((r) => r.task === draft.task && (r.subtask === "ALL" || r.subtask === subtask));
  draft.jobOrders = [];
  draft.table = "SUST";
  s.ctx.joQueue = rows.map((r) => {
    const years = Object.keys(r.fy).sort();
    return { jo: r.jo, sub: "", progno: "", all: 0, fy: years.map((y) => r.fy[y]).slice(0, 8) };
  });
  if (!rows.length) s.hint(`The sustaining table has no job orders for task ${draft.task || "(blank)"}.`);
  s.go("jo.auto");
}

const PERCENT_FIELDS = 4;

function changeJobOrder(jo: SpadsJobOrder, field: number, value: string): void {
  const v = value.replace(/!/g, "").trim().toUpperCase();
  if (field === 1) jo.jo = v;
  else if (field === 2) jo.sub = v.slice(0, 2);
  else if (field === 3) jo.progno = v;
  else if (field === PERCENT_FIELDS) jo.all = numOf(v) ?? jo.all;
  else if (field > PERCENT_FIELDS && field <= 12) jo.fy[field - 5] = numOf(v) ?? jo.fy[field - 5];
}

export const jobOrderSteps: Steps = {
  "jo.actions": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderActions");
    },
    input: (s, text) => {
      if (answer(text) === "") return jobOrdersDone(s);
      switch (intOf(text)) {
        case 1:
          return s.go("jo.add");
        case 2:
          return s.go("jo.delScope");
        case 3:
          return s.go("jo.change");
        case 4:
          return startAuto(s);
        default:
          return s.go("jo.actions");
      }
    },
  },
  "jo.delScope": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderDeleteScope");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a === "ALL") {
        if (s.ctx.draft) s.ctx.draft.jobOrders = [];
        s.print("");
        s.show("jobOrderDeleted");
        return s.go("jo.actions");
      }
      if (a === "PART") return s.go("jo.delPart");
      s.go("jo.actions");
    },
  },
  "jo.delPart": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderDeletePrompt");
    },
    input: (s, text) => {
      if (answer(text) === "") return s.go("jo.actions");
      const i = findJo(s, text);
      if (i < 0) {
        s.print("");
        s.print(TEXT.joNotFound(answer(text)));
      } else {
        s.ctx.draft?.jobOrders.splice(i, 1);
      }
      s.go("jo.delPart");
    },
  },
  "jo.change": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderFieldList");
      s.print("");
      s.go("jo.cfield");
    },
    input: () => {},
  },
  "jo.cfield": {
    enter: (s) => s.show("enterField"),
    input: (s, text) => {
      const a = answer(text);
      if (a === "") return jobOrdersDone(s);
      const n = intOf(a);
      if (n === null) {
        s.print("");
        s.show("jobOrderFieldHelp");
        s.print("");
        return s.go("jo.cfield");
      }
      if (n < 1 || n > 12) return s.go("jo.cfield");
      s.ctx.joField = n;
      s.go("jo.cvalue");
    },
  },
  "jo.cvalue": {
    enter: (s) => {
      const f = s.ctx.joField ?? 1;
      s.print("");
      s.lines(f === 1 ? [...TEXT.joValue] : f === 2 ? s.menu("jobOrderSubcode") : f === 3 ? s.menu("jobOrderProgramNo") : [...TEXT.joPercent]);
    },
    input: (s, text) => {
      s.ctx.joValue = text;
      s.go("jo.cwhich");
    },
  },
  "jo.cwhich": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderChangePrompt");
    },
    input: (s, text) => {
      if (answer(text) === "") return s.go("jo.cfield");
      const i = findJo(s, text);
      if (i < 0) {
        s.print("");
        s.print(TEXT.joNotFound(answer(text)));
        return s.go("jo.cwhich");
      }
      const jo = s.ctx.draft?.jobOrders[i];
      if (jo) changeJobOrder(jo, s.ctx.joField ?? 0, s.ctx.joValue ?? "");
      s.ctx.joField = undefined;
      s.ctx.joValue = undefined;
      s.print("");
      s.go("jo.cfield");
    },
  },
  "jo.add": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderForm");
    },
    input: (s, text) => {
      if (answer(text) === "") {
        if (s.ctx.modMethod === "input") s.ctx.joRemaining = 0;
        return jobOrdersDone(s);
      }
      const jo = parseJobOrderLine(text);
      if (!jo) return s.go("jo.add");
      s.ctx.joPending = jo;
      s.go("jo.sub");
    },
  },
  "jo.sub": {
    enter: (s) => {
      s.print("");
      s.lines(s.ctx.modMethod === "input" ? s.menu("jobOrderSubcode") : [...TEXT.joSubcodeMod]);
    },
    input: (s, text) => {
      const jo = s.ctx.joPending;
      if (!jo) return s.go("jo.add");
      jo.sub = text.replace(/!/g, "").trim().toUpperCase().slice(0, 2);
      const progno = s.store.programNumber(jo.jo);
      if (progno) {
        jo.progno = progno;
        return pushJobOrder(s, jo);
      }
      s.go("jo.progno");
    },
  },
  "jo.progno": {
    enter: (s) => {
      s.print("");
      s.show("jobOrderProgramNo");
    },
    input: (s, text) => {
      const jo = s.ctx.joPending;
      if (!jo) return s.go("jo.add");
      const progno = text.replace(/!/g, "").trim();
      if (!/^\d{1,17}$/.test(progno)) return s.go("jo.progno");
      jo.progno = progno;
      s.store.addProgramNumber(jo.jo, progno);
      pushJobOrder(s, jo);
    },
  },
  "jo.auto": {
    enter: (s) => {
      const queue = s.ctx.joQueue ?? [];
      while (queue.length) {
        const jo = queue[0];
        const progno = s.store.programNumber(jo.jo);
        if (!progno) {
          s.print(TEXT.joAutoNotFound(jo.jo));
          s.ctx.joQueue = queue;
          s.go("jo.autoProgno");
          return;
        }
        queue.shift();
        s.print(TEXT.joFound(jo.jo));
        s.ctx.draft?.jobOrders.push({ ...jo, progno });
      }
      s.ctx.joQueue = undefined;
      jobOrdersDone(s);
    },
    input: () => {},
  },
  "jo.autoProgno": {
    enter: (s) => s.show("jobOrderProgramNo"),
    input: (s, text) => {
      const queue = s.ctx.joQueue ?? [];
      const progno = text.replace(/!/g, "").trim();
      if (!queue.length) return jobOrdersDone(s);
      if (!/^\d{1,17}$/.test(progno)) return s.go("jo.autoProgno");
      s.store.addProgramNumber(queue[0].jo, progno);
      s.go("jo.auto");
    },
  },
};
