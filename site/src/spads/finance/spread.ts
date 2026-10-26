import { formatMonth, monthCount, monthRange, toMonth, type MonthIndex } from './months';

/** Rounds half away from zero to `decimals` places, never returning -0. */
export function roundHalfAway(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  const rounded = (Math.sign(value) * Math.round(Math.abs(value) * factor)) / factor;
  return rounded === 0 ? 0 : rounded;
}

export interface SpreadRow {
  month: string;
  hours: number;
  dollars: number;
}

/** One month of a Contract Analysis record, as the record tables print it. */
export interface MonthRow {
  month: string;
  cmaa: string;
  eacHours: number;
  eacDollars: number;
  actHours: number;
  actDollars: number;
  compHours: number;
  compDollars: number;
}

export interface SpreadInput {
  first: MonthIndex | string;
  firstHours: number;
  firstDollars: number;
  last: MonthIndex | string;
  lastHours: number;
  lastDollars: number;
  /** First-half percents for an abnormal spread; omitted for a normal spread. */
  abnormal?: { hoursPct: number; dollarsPct: number };
}

// Each increment is rounded on its own and added cumulatively, so the last
// month can drift from the target (the printed example lands on 98 hours
// for a target of 100, and the user then corrects it with MANUAL).
function increments(delta: number, n: number, firstHalfPct?: number): number[] {
  if (n <= 0) return [];
  if (firstHalfPct === undefined) return Array.from({ length: n }, () => roundHalfAway(delta / n));
  const firstCount = Math.floor(n / 2);
  const restCount = n - firstCount;
  const firstInc = firstCount > 0 ? roundHalfAway((delta * firstHalfPct) / (100 * firstCount)) : 0;
  const restInc = roundHalfAway((delta * (100 - firstHalfPct)) / (100 * restCount));
  return Array.from({ length: n }, (_, i) => (i < firstCount ? firstInc : restInc));
}

/** Cumulative EAC spread from the first month to the last, inclusive. */
export function spread(input: SpreadInput): SpreadRow[] {
  const first = toMonth(input.first);
  const last = toMonth(input.last);
  if (last < first) throw new RangeError('last month precedes first month');
  const n = monthCount(first, last) - 1;
  const hourSteps = increments(input.lastHours - input.firstHours, n, input.abnormal?.hoursPct);
  const dollarSteps = increments(input.lastDollars - input.firstDollars, n, input.abnormal?.dollarsPct);
  let hours = input.firstHours;
  let dollars = input.firstDollars;
  return monthRange(first, last).map((month, i) => {
    if (i > 0) {
      hours += hourSteps[i - 1];
      dollars += dollarSteps[i - 1];
    }
    return { month: formatMonth(month), hours, dollars };
  });
}

export const DELETE_CMAA = '****';

export function emptyRow(month: MonthIndex | string): MonthRow {
  return {
    month: formatMonth(toMonth(month)),
    cmaa: '',
    eacHours: 0,
    eacDollars: 0,
    actHours: 0,
    actDollars: 0,
    compHours: 0,
    compDollars: 0,
  };
}

/** Record rows for a fresh spread, with actuals and completion zeroed. */
export function spreadToRows(rows: SpreadRow[]): MonthRow[] {
  return rows.map((row) => ({ ...emptyRow(row.month), eacHours: row.hours, eacDollars: row.dollars }));
}

/**
 * MANUAL: sets one month's EAC spread, adding the month in order if the
 * record lacks it. A CMAA of `****` deletes the month instead.
 */
export function manual(rows: MonthRow[], month: MonthIndex | string, hours: number, dollars: number, cmaa = ''): MonthRow[] {
  const target = toMonth(month);
  const others = rows.filter((row) => toMonth(row.month) !== target);
  if (cmaa === DELETE_CMAA) return others;
  const existing = rows.find((row) => toMonth(row.month) === target) ?? emptyRow(target);
  const updated: MonthRow = { ...existing, month: formatMonth(target), cmaa, eacHours: hours, eacDollars: dollars };
  return [...others, updated].sort((a, b) => toMonth(a.month) - toMonth(b.month));
}
