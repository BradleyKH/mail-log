import { formatMonth, parseMonth, toMonth, tryParseMonth } from "@/spads/finance/months";
import { budgetDollars, lookupRate, RATES_NOTE, type RateTable } from "@/spads/finance/rates";
import { DELETE_CMAA, manual, spread, type MonthRow } from "@/spads/finance/spread";
import { saveDraft } from "./draft";
import { answer, intOf, isYes, numOf, type Session, type Steps } from "./session";
import { monthRow, TEXT, ZERO_MANUAL_ROW } from "./screens";
import type { SpadsMonth, SpadsTables } from "./types";

// DATA CHANGE: RATETABLE, SPREAD, MANUAL, and DELETE on the hours and
// dollars data (PDF 41 to 45, 51), plus the main-menu RATETABLE calculator
// (PDF 117).

const compact = (month: string) => formatMonth(toMonth(month), "compact");

export function rateTable(tables: SpadsTables): RateTable {
  const table: RateTable = {};
  for (const r of tables.rates) {
    table[r.task] ??= {};
    table[r.task][Number(r.fy)] = { hourRate: r.hourRate, odcRate: r.dollarRate };
  }
  return table;
}

/** A two-digit or four-digit fiscal year as four digits. */
export function fourDigitYear(n: number): number {
  if (n >= 1000) return n;
  return n < 50 ? 2000 + n : 1900 + n;
}

const sortMonths = (rows: SpadsMonth[]) => [...rows].sort((a, b) => parseMonth(a.month) - parseMonth(b.month));

/** After a data change: INPUT stores the record, MOD asks for more. */
function afterData(s: Session): void {
  if (s.ctx.modMethod === "input") return saveDraft(s);
  s.go("mod.more");
}

function applySpread(s: Session): void {
  const sp = s.ctx.spread;
  const draft = s.ctx.draft;
  if (!sp || !draft || !sp.first || !sp.last) return;
  const rows = spread({
    first: sp.first,
    firstHours: sp.firstHours ?? 0,
    firstDollars: sp.firstDollars ?? 0,
    last: sp.last,
    lastHours: sp.lastHours ?? 0,
    lastDollars: sp.lastDollars ?? 0,
    abnormal: sp.hoursPct === undefined ? undefined : { hoursPct: sp.hoursPct, dollarsPct: s.ctx.scratch?.dollarsPct as number },
  });
  const byMonth = new Map(draft.months.map((m) => [m.month, m]));
  const spreadRows: SpadsMonth[] = rows.map((r) => {
    const month = compact(r.month);
    const existing = byMonth.get(month);
    return {
      month,
      cmaa: existing?.cmaa ?? "",
      eacHours: r.hours,
      eacDollars: r.dollars,
      actHours: existing?.actHours ?? 0,
      actDollars: existing?.actDollars ?? 0,
      compHours: existing?.compHours ?? 0,
      compDollars: existing?.compDollars ?? 0,
    };
  });
  const inSpread = new Set(spreadRows.map((r) => r.month));
  draft.months = sortMonths([...draft.months.filter((m) => !inSpread.has(m.month)), ...spreadRows]);
  s.ctx.spread = undefined;
  s.print("");
  s.lines(spreadRows.map(monthRow));
  s.print("");
  afterData(s);
}

function startSpread(s: Session, via?: { hours: number; dollars: number }): void {
  s.ctx.spread = via ? { viaRatetable: true, totalHours: via.hours, totalDollars: via.dollars } : {};
  s.go("sp.firstMonth");
}

/** One MANUAL line: `MMM YY [CMAA] hours dollars [act hours act dollars eac hours eac dollars]`. */
function parseManualLine(text: string): { month: string; cmaa: string; values: number[] } | null {
  const m = /^([A-Z]{3})[\s-]*(\d{2})\s*(.*)$/.exec(answer(text));
  if (!m || tryParseMonth(`${m[1]}${m[2]}`) === null) return null;
  const tokens = m[3].split(/[\s-]+/).filter(Boolean);
  let cmaa = "";
  if (tokens.length && numOf(tokens[0]) === null) cmaa = tokens.shift() ?? "";
  const values = tokens.map((t) => numOf(t));
  if (values.some((v) => v === null)) return null;
  return { month: `${m[1]}${m[2]}`, cmaa, values: values as number[] };
}

const monthPrompt = (key: string, next: string, check?: (s: Session, month: string) => boolean): Steps[string] => ({
  enter: (s) => {
    s.print("");
    s.show(key);
  },
  input: (s, text) => {
    const month = tryParseMonth(text);
    const sp = s.ctx.spread;
    if (month === null || !sp) return s.go(s.state.step);
    const value = formatMonth(month, "compact");
    if (check && !check(s, value)) return s.go(s.state.step);
    if (key === "spreadFirstMonth") sp.first = value;
    else sp.last = value;
    s.go(next);
  },
});

const numberPrompt = (key: string, set: (s: Session, n: number) => void, next: (s: Session) => void): Steps[string] => ({
  enter: (s) => {
    s.print("");
    s.show(key);
  },
  input: (s, text) => {
    const n = answer(text) === "" ? 0 : numOf(text);
    if (n === null) return s.go(s.state.step);
    set(s, n);
    next(s);
  },
});

function afterLastMonth(s: Session): void {
  const sp = s.ctx.spread;
  if (!sp) return;
  if (sp.viaRatetable) {
    sp.lastHours = sp.totalHours;
    sp.lastDollars = sp.totalDollars;
    return afterTotals(s);
  }
  s.go("sp.lastHours");
}

function afterTotals(s: Session): void {
  const sp = s.ctx.spread;
  if (!sp?.first || !sp.last) return;
  // A one-month spread has nothing to distribute, and the printed INPUT
  // session (PDF 51) goes straight to the row without the NORMAL SPREAD prompt.
  if (parseMonth(sp.first) === parseMonth(sp.last)) return applySpread(s);
  s.go("sp.normal");
}

function ratetableResult(s: Session): void {
  const rt = s.ctx.ratetable;
  if (!rt) return;
  const fy = s.ctx.scratch?.rateFy as number;
  const rate = lookupRate(rateTable(s.store.tables()), rt.task, fy);
  const hours = rt.hours ?? 0;
  const dollars = rate ? budgetDollars(hours, rt.dollars ?? 0, rate) : 0;
  const box = s.menu("ratetableResult");
  s.print("");
  s.print(box[0]);
  s.print(`TOTAL DOLLARS =${String(dollars).padStart(11)}`);
  s.print(`TOTAL HOURS =${String(hours).padStart(11)}`);
  s.print(box[box.length - 1]);
  s.hint(RATES_NOTE);
  if (!rate) s.hint(`The rate table has no task ${rt.task} rates for fiscal year ${fy}, so the dollars compute as 0.`);
  s.ctx.ratetable = undefined;
  if (rt.then === "main") {
    s.print("");
    return s.go("analysis");
  }
  startSpread(s, { hours, dollars });
}

export const dataChangeSteps: Steps = {
  "mod.dataChange": {
    enter: (s) => {
      s.print("");
      s.show("dataChange");
    },
    input: (s, text) => {
      const draft = s.ctx.draft;
      if (answer(text) === "" || !draft) return saveDraft(s);
      switch (intOf(text)) {
        case 1:
          // Tasks J, M, and R have no computed rates, so RATETABLE runs SPREAD (PDF 41).
          if (["J", "M", "R"].includes(draft.task)) return startSpread(s);
          s.ctx.ratetable = { task: draft.task, then: "spread" };
          s.print("");
          s.print(TEXT.ratetableTaskInput(draft.task));
          return s.go("rate.hours");
        case 2:
          return startSpread(s);
        case 3:
          return s.go("man.entry");
        case 4:
          return s.go("mod.delMonths");
        default:
          return s.go("mod.dataChange");
      }
    },
  },
  "mod.delMonths": {
    enter: (s) => {
      s.print("");
      s.show("deleteMonthlyData");
    },
    input: (s, text) => {
      if (isYes(text) && s.ctx.draft) {
        s.ctx.draft.months = [];
        s.print("");
        s.print(`        ${s.menu("dataDeleted")[0]}`);
      }
      s.go("mod.dataChange");
    },
  },
  "mod.more": {
    enter: (s) => s.show("moreModifications"),
    input: (s, text) => (isYes(text) ? s.go("mod.dataChange") : saveDraft(s)),
  },
  "sp.firstMonth": monthPrompt("spreadFirstMonth", "sp.firstHours"),
  "sp.firstHours": numberPrompt("spreadFirstHours", (s, n) => s.ctx.spread && (s.ctx.spread.firstHours = n), (s) => s.go("sp.firstDollars")),
  "sp.firstDollars": numberPrompt("spreadFirstDollars", (s, n) => s.ctx.spread && (s.ctx.spread.firstDollars = n), (s) => s.go("sp.lastMonth")),
  "sp.lastMonth": monthPrompt("spreadLastMonth", "sp.afterLast", (s, m) => parseMonth(m) >= parseMonth(s.ctx.spread?.first ?? m)),
  "sp.afterLast": { enter: afterLastMonth, input: () => {} },
  "sp.lastHours": numberPrompt("spreadLastHours", (s, n) => s.ctx.spread && (s.ctx.spread.lastHours = n), (s) => s.go("sp.lastDollars")),
  "sp.lastDollars": numberPrompt("spreadLastDollars", (s, n) => s.ctx.spread && (s.ctx.spread.lastDollars = n), afterTotals),
  "sp.normal": {
    enter: (s) => {
      s.print("");
      s.show("normalSpread");
    },
    input: (s, text) => {
      const a = answer(text);
      if (a.startsWith("N")) return s.go("sp.pctHours");
      if (a === "" || a.startsWith("Y")) return applySpread(s);
      s.go("sp.normal");
    },
  },
  "sp.pctHours": numberPrompt("spreadFirstHalfHours", (s, n) => s.ctx.spread && (s.ctx.spread.hoursPct = n), (s) => s.go("sp.pctDollars")),
  "sp.pctDollars": numberPrompt(
    "spreadFirstHalfDollars",
    (s, n) => (s.ctx.scratch = { ...s.ctx.scratch, dollarsPct: n }),
    applySpread,
  ),
  "man.entry": {
    enter: (s) => {
      s.print("");
      s.show("manualEntry");
    },
    input: (s, text) => {
      const draft = s.ctx.draft;
      if (!draft) return s.go("analysis");
      if (answer(text) === "") {
        // The printed session (PDF 45) shows this zero row before the listing.
        s.print(ZERO_MANUAL_ROW);
        s.print("");
        s.lines(draft.months.map(monthRow));
        s.print("");
        return afterData(s);
      }
      const line = parseManualLine(text);
      if (!line || (line.cmaa !== DELETE_CMAA && line.values.length < 2)) return s.go("man.entry");
      const [h = 0, d = 0, ah, ad, ch, cd] = line.values;
      let rows: MonthRow[] = manual(draft.months, line.month, h, d, line.cmaa);
      rows = rows.map((r) => ({ ...r, month: compact(r.month) }));
      const target = rows.find((r) => r.month === line.month);
      if (target) {
        if (ah !== undefined) target.actHours = ah;
        if (ad !== undefined) target.actDollars = ad;
        if (ch !== undefined) target.compHours = ch;
        if (cd !== undefined) target.compDollars = cd;
        s.print(monthRow(target));
      }
      draft.months = sortMonths(rows);
      s.go("man.entry");
    },
  },
  "rate.task": {
    enter: (s) => {
      s.print("");
      s.show("ratetableTask");
    },
    input: (s, text) => {
      const task = answer(text).slice(0, 1);
      if (!/^[A-Z]$/.test(task)) return s.go("analysis");
      s.ctx.ratetable = { task, then: "main" };
      s.print(TEXT.ratetableTaskMain(task));
      s.go("rate.hours");
    },
  },
  "rate.hours": numberPrompt("ratetableHours", (s, n) => s.ctx.ratetable && (s.ctx.ratetable.hours = n), (s) => s.go("rate.dollars")),
  "rate.dollars": numberPrompt("ratetableDollars", (s, n) => s.ctx.ratetable && (s.ctx.ratetable.dollars = n), (s) => s.go("rate.fy")),
  "rate.fy": numberPrompt(
    "ratetableFiscalYear",
    (s, n) => (s.ctx.scratch = { ...s.ctx.scratch, rateFy: fourDigitYear(n) }),
    ratetableResult,
  ),
};
