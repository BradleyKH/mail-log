import { spool } from "./spool";
import { answer, intOf, isYes, securityCheck, type Session, type Steps } from "./session";
import { headerLines, jobOrdersBlock, monthRow, TEXT } from "./screens";
import type { StoredSpadsRecord } from "./types";

// Field numbers 1 to 26 as the RETRIEVE list prints them (PDF 21); BOOK adds 27 and 28 (PDF 52).
const PARTIAL_FIELDS = new Set([6, 7, 9]);

export type Criterion = { field: number; value: string };

/** A record field as text, for matching. */
export function fieldValue(r: StoredSpadsRecord, field: number): string {
  switch (field) {
    case 1: return r.date;
    case 2: return r.status;
    case 3: return String(r.jobOrders.length || r.printedJobOrders || 0);
    case 4: return String(r.months.length);
    case 5: return r.sysnum;
    case 6: return r.title;
    case 7: return r.mods.join(",");
    case 8: return r.contractor;
    case 9: return r.remarks;
    case 10: return r.nr;
    case 11: return r.cr;
    case 12: return r.rbk;
    case 13: return r.pr;
    case 14: return r.contract;
    case 15: return r.task;
    case 16: return r.taskas;
    case 17: return r.tasksb;
    case 18: return r.wan;
    case 19: return r.wacode;
    case 20: return r.complete ? "YES" : "NO";
    case 21: return String(r.rtHours);
    case 22: return String(r.rtDollars);
    case 23: return "0";
    case 24: return r.table;
    case 25: return String(r.totHours);
    case 26: return String(r.totDollars);
    default: return "";
  }
}

function sameValue(have: string, want: string): boolean {
  const a = have.trim().toUpperCase();
  const b = want.trim().toUpperCase();
  if (/^-?\d+(\.\d+)?$/.test(a) && /^-?\d+(\.\d+)?$/.test(b)) return Number(a) === Number(b);
  return a === b;
}

export function matches(r: StoredSpadsRecord, criteria: Criterion[]): boolean {
  return criteria.every(({ field, value }) => {
    const want = value.trim().toUpperCase();
    if (field === 27) return r.jobOrders.some((j) => j.jo.startsWith(want));
    if (field === 28) return r.jobOrders.some((j) => j.progno.startsWith(want));
    if (field === 20) return (r.complete ? "Y" : "N") === want.slice(0, 1);
    if (field === 1) return r.date.toUpperCase().includes(want);
    if (PARTIAL_FIELDS.has(field)) return fieldValue(r, field).toUpperCase().includes(want);
    return sameValue(fieldValue(r, field), want);
  });
}

export function search(s: Session, criteria: Criterion[]): StoredSpadsRecord[] {
  return s.store.list().filter((r) => matches(r, criteria));
}

/** The hours-and-dollars table: column heads and one row per month. */
export function monthTable(s: Session, r: StoredSpadsRecord): string[] {
  return [...s.menu("hoursDollarsHeader"), ...r.months.map(monthRow)];
}

/** Header and job orders, as the MOD routines redisplay a record (PDF 33). */
export function printHeaderAndJobs(s: Session, r: StoredSpadsRecord): void {
  s.print("");
  s.lines(headerLines(r));
  s.print("");
  s.lines(jobOrdersBlock(r));
  s.print("");
}

/** Header, job orders, and months with no MORE pauses (PDF 96, 98). */
export function printRecord(s: Session, r: StoredSpadsRecord): void {
  s.print("");
  s.lines(headerLines(r));
  if (r.jobOrders.length) {
    s.print("");
    s.lines(jobOrdersBlock(r));
  }
  s.lines(monthTable(s, r));
  s.print("");
}

export type FieldLoopOptions = {
  /** menus.json key of the field list. */
  list: string;
  max: number;
  /** Lines that ask for a field's value. */
  valuePrompt?: (s: Session, field: number) => string[];
  accept: (s: Session, field: number, value: string) => void;
  done: (s: Session) => void;
};

/**
 * The ENTER FIELD # loop shared by RETRIEVE, BOOK, MOD header, and QUICKIE
 * HEADER: a field number asks for its value, any letters show the HELP list
 * (PDF 32), and a return ends the loop. Steps: `<p>.list`, `<p>.field`,
 * `<p>.value`, `<p>.help`.
 */
export function fieldLoop(p: string, o: FieldLoopOptions): Steps {
  return {
    [`${p}.list`]: {
      enter: (s) => {
        s.print("");
        s.show(o.list);
        s.print("");
        s.go(`${p}.field`);
      },
      input: () => {},
    },
    [`${p}.field`]: {
      enter: (s) => s.show("enterField"),
      input: (s, text) => {
        const a = answer(text);
        if (a === "") return o.done(s);
        const n = intOf(a);
        if (n === null) return s.go(`${p}.help`);
        if (n < 1 || n > o.max) return s.go(`${p}.field`);
        s.ctx.pendingField = n;
        s.go(`${p}.value`);
      },
    },
    [`${p}.value`]: {
      enter: (s) => s.lines(o.valuePrompt ? o.valuePrompt(s, s.ctx.pendingField ?? 0) : s.menu("enterValue")),
      input: (s, text) => {
        const field = s.ctx.pendingField ?? 0;
        s.ctx.pendingField = undefined;
        o.accept(s, field, text.trim());
        s.go(`${p}.field`);
      },
    },
    [`${p}.help`]: {
      // The help list stops after field 19 and asks MORE? (PDF 33).
      enter: (s) => {
        s.print("");
        s.lines(s.menu("retrieveFieldHelp").slice(0, 22));
        s.print("");
        s.print(TEXT.helpMore);
      },
      input: (s, text) => {
        if (!/^N/.test(answer(text))) s.lines(s.menu("retrieveFieldHelp").slice(22));
        s.print("");
        s.go(`${p}.field`);
      },
    },
  };
}

const addCriterion = (s: Session, field: number, value: string) => {
  s.ctx.criteria = [...(s.ctx.criteria ?? []), { field, value }];
};

export function current(s: Session): StoredSpadsRecord | undefined {
  const sysnum = s.ctx.results?.[s.ctx.resultIndex ?? 0];
  return sysnum ? s.store.get(sysnum) : undefined;
}

function leaveRetrieve(s: Session): void {
  if (s.ctx.spoolPending) {
    s.ctx.spoolPending = false;
    spool(s, { style: "record", then: "analysis", sampleNote: "The manual's sample of a spooled record is the Entire Record printout, Appendix C-1 (CR-177949, PDF 121), in the Archive." });
    return;
  }
  s.go("analysis");
}

export const retrieveSteps: Steps = {
  "ret.start": {
    enter: (s) => {
      s.ctx.criteria = [];
      s.ctx.spoolPending = false;
      s.go("ret.list");
    },
    input: () => {},
  },
  ...fieldLoop("ret", {
    list: "retrieveFields",
    max: 26,
    accept: addCriterion,
    done: (s) => {
      const criteria = s.ctx.criteria ?? [];
      if (!criteria.length) return s.go("analysis");
      const found = search(s, criteria);
      if (!found.length) {
        s.hint("No record in the data base matches, so the program returns to its main menu.");
        return s.go("analysis");
      }
      s.ctx.results = found.map((r) => r.sysnum);
      s.ctx.resultIndex = 0;
      s.go("ret.show");
    },
  }),
  "ret.show": {
    enter: (s) => {
      const r = current(s);
      if (!r) return s.go("analysis");
      s.print("");
      s.lines(headerLines(r));
      s.print("");
      s.show("more");
    },
    input: (s, text) => {
      const r = current(s);
      if (!r) return s.go("analysis");
      if (/^N/.test(answer(text))) return s.go("ret.actions");
      if (r.jobOrders.length) {
        s.print("");
        s.lines(jobOrdersBlock(r));
        s.print("");
        s.show("more");
        s.state.step = "ret.more";
        return;
      }
      s.print("");
      s.lines(monthTable(s, r));
      s.go("ret.actions");
    },
  },
  "ret.more": {
    input: (s, text) => {
      const r = current(s);
      if (!r) return s.go("analysis");
      if (!/^N/.test(answer(text))) {
        s.print("");
        s.lines(monthTable(s, r));
      }
      s.go("ret.actions");
    },
  },
  "ret.actions": {
    enter: (s) => {
      s.print("");
      s.show("recordActions");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a === "") return leaveRetrieve(s);
      switch (intOf(a)) {
        case 1:
          return s.go("mod.method");
        case 2: {
          const next = (s.ctx.resultIndex ?? 0) + 1;
          if (next < (s.ctx.results?.length ?? 0)) {
            s.ctx.resultIndex = next;
            return s.go("ret.show");
          }
          s.hint("No further record matches the search.");
          return leaveRetrieve(s);
        }
        case 3:
          s.show("spoolRecordPut");
          s.ctx.spoolPending = true;
          return s.go("ret.actions");
        case 4:
          securityCheck(s);
          return s.go("ret.delete");
        default:
          return s.go("ret.actions");
      }
    },
  },
  "ret.delete": {
    enter: (s) => s.show("deleteRecordConfirm"),
    input: (s, text) => {
      const r = current(s);
      if (!r || !isYes(text)) return s.go("ret.actions");
      s.store.remove(r.sysnum);
      s.print("");
      s.print(TEXT.recordDeleted(r.sysnum));
      s.go("analysis");
    },
  },
};
