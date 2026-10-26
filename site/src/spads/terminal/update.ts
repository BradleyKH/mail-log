import { formatMonth, tryParseMonth } from "@/spads/finance/months";
import { fieldLoop, search, type Criterion } from "./retrieve";
import { answer, intOf, type Dialogs, type Session, type Steps } from "./session";
import { spacedMonth } from "./screens";
import { spool } from "./spool";
import type { StoredSpadsRecord } from "./types";
import { etcSteps } from "./updateEtc";
import {
  BALANCE_SHEET,
  DALLAS_CONVERSION,
  DALLAS_FOUND,
  PROGRAM_NUMBER_RECORDS,
  REBUILD_JOB_ORDERS,
  TABLE_REPLAYS,
} from "./updateReplays";

const replayHint = (s: Session, pages: string) =>
  s.hint(`These lines replay the manual's printed run (CR-177949, PDF ${pages}); this site does not hold the data behind them.`);

const sysno = (sysnum: string) => `RECORD NO. ${sysnum.padStart(4)}`;

/** Sets one header field from QUICKIE HEADER input; fields the program derives are left alone. */
function setField(r: StoredSpadsRecord, field: number, value: string): void {
  const v = value.trim().toUpperCase();
  const n = Number(v);
  switch (field) {
    case 2: if (v === "AUT" || v === "FUT") r.status = v; break;
    case 6: r.title = v; break;
    case 7: r.mods = v.split(",").map((m) => m.trim()).slice(0, 4); break;
    case 8: r.contractor = v; break;
    case 9: r.remarks = v; break;
    case 10: r.nr = v; break;
    case 11: r.cr = v; break;
    case 12: r.rbk = v; break;
    case 13: r.pr = v; break;
    case 14: r.contract = v; break;
    case 15: r.task = v.slice(0, 1); break;
    case 16: r.taskas = v; break;
    case 17: r.tasksb = v; break;
    case 18: r.wan = v; break;
    case 19: r.wacode = v; break;
    case 20: r.complete = v.startsWith("Y"); break;
    case 21: if (Number.isFinite(n)) r.rtHours = n; break;
    case 22: if (Number.isFinite(n)) r.rtDollars = n; break;
    case 24: if (v === "SUST" || v === "MANL") r.table = v; break;
    case 25: if (Number.isFinite(n)) r.totHours = n; break;
    case 26: if (Number.isFinite(n)) r.totDollars = n; break;
  }
}

const scratch = (s: Session) => (s.ctx.scratch ??= {});

function quickieMatches(s: Session): StoredSpadsRecord[] {
  return search(s, s.ctx.criteria ?? []);
}

function quickieApply(s: Session): void {
  const changes = ((scratch(s).quickieChanges as string[] | undefined) ?? []).map((c) => {
    const i = c.indexOf("=");
    return { field: Number(c.slice(0, i)), value: c.slice(i + 1) };
  });
  const found = quickieMatches(s);
  found.forEach((r, i) => {
    for (const c of changes) setField(r, c.field, c.value);
    s.store.replace(r);
    if (i > 0) s.print(`${sysno(r.sysnum)} MATCH FOUND AND MODIFIED`);
  });
  s.print("NO MATCH FOUND END OF FILE");
  s.print("");
  s.go("uq.start");
}

export const updateSteps: Steps = {
  "update.main": {
    enter: (s) => {
      s.print("");
      s.show("updateMain");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a === "") return s.go("analysis");
      switch (intOf(a)) {
        case 1: return s.go("ud.month");
        case 2: return s.go("ub.date");
        case 3: return s.go("etc.start");
        case 4: return s.go("uq.start");
        case 5: return s.go("ut.menu");
        case 6:
          s.print("PLEASE STAND BY. PRE-SORT NOW IN PROGRESS");
          s.print("REBUILDING NOW IN PROGRESS -- STAND BY");
          return s.go("analysis");
        case 7:
          s.print("OUTPUT FORMATTING IN PROGRESS - PLEASE STAND BY");
          s.print("*** SPOOLING LISTING OF BOOK ALL RECORDS ***");
          return spool(s, {
            style: "basic",
            allSites: true,
            then: "ua.entire",
            sampleNote: "The manual's sample of this listing is the Book All brief listing, Appendix B-1 (CR-177949), in the Archive.",
          });
        case 8: return s.go("uj.menu");
        default: return s.go("update.main");
      }
    },
  },
  "ua.entire": {
    enter: (s) => {
      s.print("");
      s.print("*** SPOOLING ENTIRE RECORD FILE ***");
      spool(s, {
        style: "basic",
        allSites: true,
        then: "update.main",
        sampleNote: "The manual's sample of this file is the Entire Record printout, Appendix C-1 (CR-177949, PDF 121), in the Archive.",
      });
    },
    input: () => {},
  },

  // DALLAS TAPE, PDF 92 and 93.
  "ud.month": {
    enter: (s) => {
      s.print("");
      s.show("updateStatusMonthName");
      s.print("!MMM!YY!");
    },
    input: (s, text) => {
      const m = tryParseMonth(text);
      if (m === null) return s.go("ud.month");
      s.state.statusMonth = formatMonth(m, "compact");
      s.hint(`The status date is now ${spacedMonth(s.state.statusMonth)}. Reports and the ETC update use it for the rest of this session.`);
      s.print("");
      replayHint(s, "93");
      s.lines(DALLAS_FOUND);
      spool(s, { style: "basic", allSites: true, then: "ud.conversion" });
    },
  },
  "ud.conversion": {
    enter: (s) => {
      s.lines(DALLAS_CONVERSION);
      spool(s, { style: "basic", allSites: true, then: "analysis" });
    },
    input: () => {},
  },

  // BALANCE SHEET, PDF 94 and 95.
  "ub.date": {
    enter: (s) => {
      s.print("");
      s.show("updateBalanceStatusDate");
      s.print("!   !  !");
    },
    input: (s, text) => (tryParseMonth(text) === null ? s.go("ub.date") : s.go("ub.task")),
  },
  "ub.task": {
    enter: (s) => {
      s.print("");
      s.show("updateBalanceTask");
    },
    input: (s) => {
      replayHint(s, "95");
      s.lines(BALANCE_SHEET);
      s.go("update.main");
    },
  },

  ...etcSteps,

  // QUICKIE HEADER, PDF 98 to 100.
  "uq.start": {
    enter: (s) => {
      s.ctx.criteria = [];
      scratch(s).quickieChanges = [];
      s.show("updateQuickieSelect");
      s.print("RECORDS TO BE MODIFIED. RETURN IF FINISHED.");
      s.go("uq.list");
    },
    input: () => {},
  },
  ...fieldLoop("uq", {
    list: "retrieveFields",
    max: 26,
    accept: (s, field, value) => {
      s.ctx.criteria = [...(s.ctx.criteria ?? []), { field, value } satisfies Criterion];
    },
    done: (s) => {
      if (!(s.ctx.criteria ?? []).length) return s.go("update.main");
      const found = quickieMatches(s);
      if (!found.length) {
        s.print("NO MATCH FOUND END OF FILE");
        s.print("");
        return s.go("uq.start");
      }
      s.print(`${sysno(found[0].sysnum)} MATCH FOUND`);
      s.print("");
      s.show("updateQuickieModify");
      s.print("RECORDS TO BE MODIFIED. RETURN IF FINISHED.");
      s.go("uqm.list");
    },
  }),
  ...fieldLoop("uqm", {
    list: "retrieveFields",
    max: 26,
    accept: (s, field, value) => {
      const sc = scratch(s);
      sc.quickieChanges = [...((sc.quickieChanges as string[] | undefined) ?? []), `${field}=${value}`];
    },
    done: quickieApply,
  }),

  // EDIT TABLES, PDF 100 to 111.
  "ut.menu": {
    enter: (s) => {
      s.print("");
      s.show("updateTables");
    },
    input: (s, text) => {
      const n = answer(text) === "" ? 0 : intOf(text);
      if (n === 0) return s.go("update.main");
      const replay = n === null ? undefined : TABLE_REPLAYS[n];
      if (!replay) return s.go("ut.menu");
      s.hint(
        `Replaying the manual's printed ${replay.name} session (CR-177949, PDF ${replay.pages}). The values are the manual's examples, and the tables are not edited here.`,
      );
      s.lines(replay.lines);
      s.go("ut.menu");
    },
  },

  // JOB ORDERS, PDF 113 to 116.
  "uj.menu": {
    enter: (s) => {
      s.print("");
      s.show("updateJobOrders");
    },
    input: (s, text) => {
      const n = intOf(text);
      if (n === 1) return s.go("uj.task");
      if (n === 2) return s.go("uj.prog");
      s.go("update.main");
    },
  },
  "uj.task": {
    enter: (s) => s.show("updateRebuildTask"),
    input: (s, text) => {
      if (answer(text) === "") return s.go("update.main");
      replayHint(s, "115 and 116");
      s.lines(REBUILD_JOB_ORDERS);
      s.go("uj.task");
    },
  },
  "uj.prog": {
    enter: (s) => {
      s.print("");
      s.show("updateProgramNumbers");
    },
    input: (s, text) => {
      const n = intOf(text);
      if (n === null || n < 1 || n > 3) return s.go("update.main");
      s.go("uj.jo");
    },
  },
  "uj.jo": {
    enter: (s) => s.show("updateJoborderToUpdate"),
    input: (s, text) => {
      if (answer(text) === "") return s.go("update.main");
      replayHint(s, "116");
      s.lines(PROGRAM_NUMBER_RECORDS);
      s.go("uj.jo");
    },
  },
};

export const updateDialogs: Dialogs = {};
