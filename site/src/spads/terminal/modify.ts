import { dataChangeSteps } from "./datachange";
import { jobOrderSteps } from "./joborders";
import { feeFor, saveDraft } from "./draft";
import { current, fieldLoop, printHeaderAndJobs } from "./retrieve";
import { answer, intOf, isYes, securityCheck, type Session, type Steps } from "./session";
import { TEXT } from "./screens";
import type { StoredSpadsRecord } from "./types";

const int = (value: string, fallback: number) => {
  const n = intOf(value);
  return n === null ? fallback : n;
};

function applyHeaderField(s: Session, r: StoredSpadsRecord, field: number, value: string): void {
  const v = value.toUpperCase();
  switch (field) {
    case 1: r.date = v; break;
    case 2: r.status = v === "AUT" || v === "FUT" ? v : r.status; break;
    case 6: r.title = v.slice(0, 72); break;
    case 7: r.mods = v.split(",").map((m) => m.trim()).slice(0, 4); break;
    case 8: r.contractor = v; break;
    case 9: r.remarks = v; break;
    case 10: r.nr = v; break;
    case 11: r.cr = v; break;
    case 12: r.rbk = v; break;
    case 13: r.pr = v; break;
    case 14: r.contract = v; break;
    case 15:
      r.task = v.slice(0, 1);
      r.fee = feeFor(s, r.task);
      break;
    case 16: r.taskas = v; break;
    case 17: r.tasksb = v; break;
    case 18: r.wan = v; break;
    case 19: r.wacode = v; break;
    case 20: r.complete = v.startsWith("Y"); break;
    case 21: r.rtHours = int(v, r.rtHours); break;
    case 22: r.rtDollars = int(v, r.rtDollars); break;
    case 24: r.table = v === "SUST" || v === "MANL" ? v : r.table; break;
    case 25: r.totHours = int(v, r.totHours); break;
    case 26: r.totDollars = int(v, r.totDollars); break;
    // NOJOS, RNTM, SYSNUM, and ACTBOM are kept by the program itself.
    default: break;
  }
}

export const modifySteps: Steps = {
  "mod.method": {
    enter: (s) => {
      s.print("");
      s.show("modMethod");
    },
    input: (s, text) => {
      const n = intOf(text);
      const r = current(s);
      if (answer(text) === "" || !r) return s.go("ret.actions");
      if (n !== 1 && n !== 2) return s.go("mod.method");
      if (n === 1) securityCheck(s);
      s.ctx.modMethod = n === 1 ? "add" : "replace";
      s.ctx.draft = r;
      s.go("mod.section");
    },
  },
  "mod.section": {
    enter: (s) => {
      s.print("");
      s.show("modSection");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a === "") return s.go("mod.dataDesired");
      const n = intOf(a);
      if (n === 1) return s.go("modh.list");
      if (n === 2) return s.go("jo.actions");
      s.go("mod.section");
    },
  },
  ...fieldLoop("modh", {
    list: "retrieveFields",
    max: 26,
    valuePrompt: (s, field) => (field === 6 ? ["", TEXT.inputTitle] : s.menu("enterValue")),
    accept: (s, field, value) => {
      if (s.ctx.draft) applyHeaderField(s, s.ctx.draft, field, value);
    },
    done: (s) => {
      if (s.ctx.draft) printHeaderAndJobs(s, s.ctx.draft);
      s.go("mod.section");
    },
  }),
  "mod.dataDesired": {
    enter: (s) => {
      s.print("");
      s.show("dataChangeDesired");
    },
    input: (s, text) => (isYes(text) ? s.go("mod.dataChange") : saveDraft(s)),
  },
  ...jobOrderSteps,
  ...dataChangeSteps,
};
