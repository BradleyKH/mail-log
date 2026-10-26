import { etcUpdate } from "@/spads/finance/etc";
import { fiscalYear, fiscalYearEnd, formatMonth, parseMonth, tryParseMonth, type MonthIndex } from "@/spads/finance/months";
import { budgetDollars, lookupRate, type Rate, type RateTable } from "@/spads/finance/rates";
import { spread, type MonthRow } from "@/spads/finance/spread";
import { printRecord } from "./retrieve";
import { answer, isYes, numOf, type Session, type Steps } from "./session";
import { spacedMonth } from "./screens";
import type { SpadsMonth, StoredSpadsRecord } from "./types";

// Example rates the printed ETC session shows for task H (PDF 97). They are
// session-local replay data: the store's rate table holds D-2's entries.
const REPLAY_RATES: RateTable = {
  H: { 1984: { hourRate: 33.33, odcRate: 100 }, 1985: { hourRate: 44.44, odcRate: 101.01 } },
};

// The printed NEW TOTAL DOLLAR ETC for SYS 125, FY84, 300 hours and 2220
// ODC (PDF 97). It is what makes the printed EAC 47500, but it does not
// follow from the printed rates.
const PRINTED_ETC = { sysnum: "125", fy: 1984, hours: 300, odc: 2220, dollars: 15454 };

const SHORT_STARS = "*".repeat(34);
const LONG_STARS = "*".repeat(70);

const compact = (m: string) => formatMonth(parseMonth(m), "compact");
const monthIndex = (m: string) => parseMonth(m);

function rateFor(s: Session, task: string, fy: number): Rate {
  const replay = lookupRate(REPLAY_RATES, task, fy);
  if (replay) return replay;
  const row = s.store.tables().rates.find((r) => r.task === task && Number(r.fy) === fy);
  return row ? { hourRate: row.hourRate, odcRate: row.dollarRate } : { hourRate: 0, odcRate: 0 };
}

function scratch(s: Session) {
  return (s.ctx.scratch ??= {});
}

const num = (s: Session, key: string) => Number(scratch(s)[key] ?? 0);

function statusMonth(s: Session): string {
  return String(scratch(s).etcStatus ?? s.state.statusMonth);
}

const toRows = (months: SpadsMonth[]): MonthRow[] => months.map((m) => ({ ...m }));
const fromRows = (rows: MonthRow[]): SpadsMonth[] => rows.map((r) => ({ ...r, month: compact(r.month) }));

/** Spreads one later fiscal year from the prior year's end value to the new EAC. */
function spreadLaterYear(rows: MonthRow[], fy: number, eacHours: number, eacDollars: number, pct?: { h: number; d: number }): MonthRow[] {
  const last = Math.max(...rows.map((r) => monthIndex(r.month)));
  const start = fiscalYearEnd(fy - 1);
  const end = Math.min(fiscalYearEnd(fy), last);
  const base = [...rows].filter((r) => monthIndex(r.month) <= start).pop();
  if (!base || end <= start) return rows;
  const spreadRows = spread({
    first: start,
    firstHours: base.eacHours,
    firstDollars: base.eacDollars,
    last: end,
    lastHours: eacHours,
    lastDollars: eacDollars,
    abnormal: pct ? { hoursPct: pct.h, dollarsPct: pct.d } : undefined,
  });
  const byMonth = new Map(spreadRows.map((r) => [monthIndex(r.month), r]));
  return rows.map((r) => {
    const m = monthIndex(r.month);
    if (m <= start) return r;
    const sr = byMonth.get(m);
    return { ...r, eacHours: sr ? sr.hours : eacHours, eacDollars: sr ? sr.dollars : eacDollars };
  });
}

/** Applies the cumulative ETC entered so far to the working record. */
function apply(s: Session, pct?: { h: number; d: number }): void {
  const draft = s.ctx.draft;
  if (!draft) return;
  const status: MonthIndex = parseMonth(statusMonth(s));
  const fy = num(s, "etcFy");
  const statusRow = draft.months.find((m) => monthIndex(m.month) === status);
  if (!statusRow) return;
  const eacHours = statusRow.actHours + num(s, "etcHours");
  const eacDollars = statusRow.actDollars + num(s, "etcDollars");
  let rows = toRows(draft.months);
  if (fy === fiscalYear(status)) {
    rows = etcUpdate(rows, status, num(s, "etcHours"), num(s, "etcDollars")).rows;
    if (pct) {
      const last = Math.max(...rows.map((r) => monthIndex(r.month)));
      const end = Math.min(fiscalYearEnd(fy), last);
      if (end > status) {
        const sr = spread({
          first: status,
          firstHours: statusRow.actHours,
          firstDollars: statusRow.actDollars,
          last: end,
          lastHours: eacHours,
          lastDollars: eacDollars,
          abnormal: { hoursPct: pct.h, dollarsPct: pct.d },
        });
        const byMonth = new Map(sr.map((r) => [monthIndex(r.month), r]));
        rows = rows.map((r) => {
          const x = byMonth.get(monthIndex(r.month));
          return x ? { ...r, eacHours: x.hours, eacDollars: x.dollars } : r;
        });
      }
    }
  } else {
    rows = spreadLaterYear(rows, fy, eacHours, eacDollars, pct);
    const completionThrough = status + 1;
    rows = rows.map((r) => {
      const m = monthIndex(r.month);
      if (m < status) return r;
      const inWindow = m <= completionThrough;
      return { ...r, compHours: inWindow ? eacHours : 0, compDollars: inWindow ? eacDollars : 0 };
    });
  }
  draft.months = fromRows(rows);
}

function nextYear(s: Session): void {
  const sc = scratch(s);
  sc.etcFy = num(s, "etcFy") + 1;
  if (num(s, "etcFy") > num(s, "etcLastFy")) {
    const draft = s.ctx.draft;
    if (draft) {
      s.store.replace(draft);
      const updated = (sc.etcUpdated as string[] | undefined) ?? [];
      sc.etcUpdated = [...updated.filter((x) => x !== draft.sysnum), draft.sysnum];
    }
    s.ctx.draft = undefined;
    return s.go("etc.wan");
  }
  s.go("etc.year");
}

function finish(s: Session): void {
  const updated = (scratch(s).etcUpdated as string[] | undefined) ?? [];
  for (const sysnum of updated) {
    const r = s.store.get(sysnum);
    if (r) printRecord(s, r);
  }
  s.ctx.scratch = undefined;
  s.go("update.main");
}

function findRecord(s: Session, text: string): StoredSpadsRecord | undefined {
  const m = /^(\d+)\s*([A-Z0-9]+)$/.exec(answer(text));
  if (!m) return undefined;
  return s.store.list().find((r) => r.wan === m[1] && r.wacode.toUpperCase() === m[2]);
}

export const etcSteps: Steps = {
  "etc.start": {
    enter: (s) => {
      s.ctx.scratch = {};
      s.print("WELCOME TO THE ETC / EAC UPDATE ROUTINE");
      s.print("");
      s.print(`THE CURRENT STATUS DATE IS ${spacedMonth(s.state.statusMonth)}`);
      s.print("");
      s.go("etc.ok");
    },
    input: () => {},
  },
  "etc.ok": {
    enter: (s) => s.show("updateStatusDateOk"),
    input: (s, text) => (isYes(text) || answer(text) === "" ? s.go("etc.wan") : s.go("etc.newDate")),
  },
  "etc.newDate": {
    enter: (s) => {
      s.show("updateNewStatusDate");
      s.print("!MMM!YY!");
    },
    input: (s, text) => {
      const m = tryParseMonth(text);
      if (m === null) return s.go("etc.newDate");
      scratch(s).etcStatus = formatMonth(m, "compact");
      s.go("etc.wan");
    },
  },
  "etc.wan": {
    enter: (s) => {
      s.print("");
      s.lines(s.menu("updateWanWacode").map((l) => ` ${l}`));
      s.print("NNNNAAAA");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a === "") return finish(s);
      const r = findRecord(s, a);
      if (!r) {
        s.print("");
        s.print(" *** ERROR ***");
        s.print(` RECORD NOT FOUND FOR WA ${a}`);
        return s.go("etc.wan");
      }
      const status = parseMonth(statusMonth(s));
      if (!r.months.some((m) => monthIndex(m.month) === status)) {
        s.hint(`Record ${r.sysnum} has no ${spacedMonth(statusMonth(s))} row, so the ETC update has nothing to start from.`);
        return s.go("etc.wan");
      }
      s.print("");
      s.print(` WA = ${a}  FOUND.  RECORD NO. =  ${r.sysnum}`);
      s.ctx.draft = r;
      const sc = scratch(s);
      sc.etcFy = fiscalYear(status);
      sc.etcLastFy = fiscalYear(Math.max(...r.months.map((m) => monthIndex(m.month))));
      sc.etcHours = 0;
      sc.etcDollars = 0;
      s.go("etc.year");
    },
  },
  "etc.year": {
    enter: (s) => {
      s.print("");
      s.print(SHORT_STARS);
      s.print(`*** UPDATE FOR FISCAL YEAR '${String(num(s, "etcFy") % 100).padStart(2, "0")} ***`);
      s.print(SHORT_STARS);
      s.print("");
      s.print(` ${s.menu("updateEtcHours")[0]}`);
    },
    input: (s, text) => {
      const n = answer(text) === "" ? 0 : numOf(text);
      if (n === null) return s.go("etc.year");
      scratch(s).yearHours = n;
      s.go("etc.material");
    },
  },
  "etc.material": {
    enter: (s) => {
      s.print("");
      s.print(` ${s.menu("updateEtcMaterial")[0]}`);
    },
    input: (s, text) => {
      const odc = answer(text) === "" ? 0 : numOf(text);
      const draft = s.ctx.draft;
      if (odc === null || !draft) return s.go("etc.material");
      const sc = scratch(s);
      const fy = num(s, "etcFy");
      const hours = num(s, "yearHours");
      const rate = rateFor(s, draft.task, fy);
      const printed =
        draft.sysnum === PRINTED_ETC.sysnum && fy === PRINTED_ETC.fy && hours === PRINTED_ETC.hours && odc === PRINTED_ETC.odc;
      const dollars = printed ? PRINTED_ETC.dollars : budgetDollars(hours, odc, rate);
      sc.yearDollars = dollars;
      sc.etcHours = num(s, "etcHours") + hours;
      sc.etcDollars = num(s, "etcDollars") + dollars;
      const statusRow = draft.months.find((m) => monthIndex(m.month) === parseMonth(statusMonth(s)));
      const eacHours = (statusRow?.actHours ?? 0) + num(s, "etcHours");
      const eacDollars = (statusRow?.actDollars ?? 0) + num(s, "etcDollars");
      s.print("");
      s.print(` TASK = ${draft.task}`);
      s.print(` HOURLY RATE = ${rate.hourRate.toFixed(2).padStart(6)}             DOLLAR RATE = ${rate.odcRate.toFixed(2).padStart(6)}`);
      s.print(` NEW TOTAL DOLLAR ETC = ${String(dollars).padStart(10)}`);
      if (printed) {
        s.hint(
          "The manual prints 15454 here. It does not follow from the printed example rates (300 x 33.33 + 2220 x 100.00 is 231999), but it is the figure that makes the printed EAC of 47500, so the replay keeps it.",
        );
      }
      s.print(LONG_STARS);
      s.print(` NEW EAC SPREAD HOURS=${String(eacHours).padStart(7)}      NEW EAC SPREAD DOLLARS=${String(eacDollars).padStart(9)}`);
      s.print(LONG_STARS);
      if (hours !== 0 || dollars !== 0) return s.go("etc.normal");
      nextYear(s);
    },
  },
  "etc.normal": {
    enter: (s) => {
      s.print("");
      s.show("normalSpread");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a !== "Y" && a !== "N") return s.go("etc.normal");
      if (a === "N") return s.go("etc.pctHours");
      apply(s);
      nextYear(s);
    },
  },
  "etc.pctHours": {
    enter: (s) => s.show("spreadFirstHalfHours"),
    input: (s, text) => {
      const n = numOf(text);
      if (n === null) return s.go("etc.pctHours");
      scratch(s).pctHours = n;
      s.go("etc.pctDollars");
    },
  },
  "etc.pctDollars": {
    enter: (s) => s.show("spreadFirstHalfDollars"),
    input: (s, text) => {
      const n = numOf(text);
      if (n === null) return s.go("etc.pctDollars");
      apply(s, { h: num(s, "pctHours"), d: n });
      nextYear(s);
    },
  },
};
