import { fiscalQuarter, fiscalYear, fiscalYearStart, monthOf, toMonth, addMonths, type MonthIndex } from './months';
import { largestRemainder } from './rates';
import { roundHalfAway, type MonthRow } from './spread';

/**
 * numerator / denominator x 100 to `decimals` places, either rounded half
 * away from zero or truncated toward zero; 0 for a zero denominator.
 */
export function percent(numerator: number, denominator: number, decimals: number, mode: 'round' | 'trunc' = 'round'): number {
  if (denominator === 0) return 0;
  const factor = 10 ** decimals;
  // One division keeps halfway cases exact before rounding.
  const scaled = (Math.abs(numerator) * 100 * factor) / Math.abs(denominator);
  const magnitude = mode === 'round' ? Math.round(scaled) : Math.floor(scaled);
  const result = (Math.sign(numerator) * Math.sign(denominator) * magnitude) / factor;
  return result === 0 ? 0 : result;
}

// ---------------------------------------------------------------- O-4 variance

export interface VarianceInput {
  cvHours: number;
  cvDollars: number;
  eacHours: number;
  eacDollars: number;
}

export interface VarianceRow {
  varianceHours: number;
  varianceDollars: number;
  pctHours: number;
  pctDollars: number;
}

/** Variance = committed EAC - contract value; % variance/CV to one decimal, 0.0 for a zero CV. */
export function varianceRow(input: VarianceInput): VarianceRow {
  const varianceHours = input.eacHours - input.cvHours;
  const varianceDollars = input.eacDollars - input.cvDollars;
  return {
    varianceHours,
    varianceDollars,
    pctHours: percent(varianceHours, input.cvHours, 1),
    pctDollars: percent(varianceDollars, input.cvDollars, 1),
  };
}

// ------------------------------------------------------------ O-2 task summary

export interface TaskSummaryInput {
  actHours: number;
  actDollars: number;
  etcHours: number;
  etcDollars: number;
  uncommittedHours: number;
  uncommittedDollars: number;
}

export interface TaskSummaryRow {
  committedHours: number;
  committedDollars: number;
  authorizedHours: number;
  authorizedDollars: number;
  pctHours: number;
  pctDollars: number;
}

/** % ACTUALS/EAC is against the authorized EAC, one decimal, 0.0 for a zero divisor. */
export function taskSummaryRow(input: TaskSummaryInput): TaskSummaryRow {
  const committedHours = input.actHours + input.etcHours;
  const committedDollars = input.actDollars + input.etcDollars;
  const authorizedHours = committedHours + input.uncommittedHours;
  const authorizedDollars = committedDollars + input.uncommittedDollars;
  return {
    committedHours,
    committedDollars,
    authorizedHours,
    authorizedDollars,
    pctHours: percent(input.actHours, authorizedHours, 1),
    pctDollars: percent(input.actDollars, authorizedDollars, 1),
  };
}

// -------------------------------------------------------------- O-3 W.A. summary

export interface WaSummaryRow {
  eacHours: number;
  eacDollars: number;
  pctHours: number;
  pctDollars: number;
}

/** EAC = actuals + ETC; % OF EAC to two decimals, 0.00 for a zero EAC. */
export function waSummaryRow(input: { actHours: number; actDollars: number; etcHours: number; etcDollars: number }): WaSummaryRow {
  const eacHours = input.actHours + input.etcHours;
  const eacDollars = input.actDollars + input.etcDollars;
  return {
    eacHours,
    eacDollars,
    pctHours: percent(input.actHours, eacHours, 2),
    pctDollars: percent(input.actDollars, eacDollars, 2),
  };
}

// --------------------------------------------------------- C-1 entire record

export interface EntireRecordPercents {
  eacSpentHours: number;
  eacSpentDollars: number;
  autSpentHours: number;
  autSpentDollars: number;
}

/** The entire-record deviation columns are truncated, not rounded. */
export function entireRecordPercents(row: MonthRow, totalAutHours: number, totalAutDollars: number): EntireRecordPercents {
  return {
    eacSpentHours: percent(row.actHours, row.compHours, 0, 'trunc'),
    eacSpentDollars: percent(row.actDollars, row.compDollars, 0, 'trunc'),
    autSpentHours: percent(row.actHours, totalAutHours, 0, 'trunc'),
    autSpentDollars: percent(row.actDollars, totalAutDollars, 0, 'trunc'),
  };
}

/** % TIME PASSED on the entire record: month k of n, truncated to an integer. */
export function timePassed(monthNumber: number, totalMonths: number): number {
  return percent(monthNumber, totalMonths, 0, 'trunc');
}

/** % TIME PASSED on the summary reports: elapsed / total months, two decimals. */
export function timePassed2(elapsedMonths: number, totalMonths: number): number {
  return percent(elapsedMonths, totalMonths, 2);
}

// ---------------------------------------------------------------- 533 report

export const COLUMNS_533 = ['7A', '7B', '7C', '8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I', '8J', '9A', '9B'] as const;
export type Column533 = (typeof COLUMNS_533)[number];
export type Row533 = Record<Column533, number>;
export type Input533 = Omit<Row533, '7C' | '8J' | '9A'>;

export const FPI_TASKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'L', 'N', 'P', 'T', 'V'] as const;
export const CPFF_TASKS = ['J', 'M', 'R'] as const;

const TO_COMPLETE_533: Column533[] = ['8A', '8B', '8C', '8D', '8E', '8F', '8G', '8H', '8I'];

/** 7C = 7A + 7B; 8J = months A to C + quarters D to F + G + H + I; 9A = 7C + 8J. 9B is the contract value. */
export function row533(input: Input533): Row533 {
  const c7 = input['7A'] + input['7B'];
  const j8 = TO_COMPLETE_533.reduce((sum, col) => sum + (input as Row533)[col], 0);
  return { ...input, '7C': c7, '8J': j8, '9A': c7 + j8 };
}

export function zeroRow533(): Row533 {
  return Object.fromEntries(COLUMNS_533.map((col) => [col, 0])) as Row533;
}

export function sum533(rows: Row533[]): Row533 {
  const total = zeroRow533();
  for (const row of rows) for (const col of COLUMNS_533) total[col] += row[col];
  return total;
}

export interface FpiFees {
  incentiveFee: Row533;
  profit: Row533;
  award: Row533;
}

/** TOTAL FPI THRU G & A, then TOTAL FPI with the fee rows; the hours form has no fee rows. */
export function rollup533Fpi(tasks: Row533[], fees?: FpiFees): { thruGA: Row533; total: Row533 } {
  const thruGA = sum533(tasks);
  const total = fees ? sum533([thruGA, fees.incentiveFee, fees.profit, fees.award]) : thruGA;
  return { thruGA, total };
}

/** TOTAL COST, then TOTAL CPFF with the fixed fee; the hours form has no fee row. */
export function rollup533Cpff(tasks: Row533[], fixedFee?: Row533): { totalCost: Row533; total: Row533 } {
  const totalCost = sum533(tasks);
  return { totalCost, total: fixedFee ? sum533([totalCost, fixedFee]) : totalCost };
}

/** TOTAL CONTRACT = TOTAL FPI + TOTAL CPFF + RETRANSFER OF PERSONNEL (dollars) or category S (hours). */
export function totalContract533(totalFpi: Row533, totalCpff: Row533, other: Row533): Row533 {
  return sum533([totalFpi, totalCpff, other]);
}

// ---------------------------------------------------------------- POP reports

export type MonthlyValues = Map<MonthIndex, number> | Record<string, number>;

function monthlyEntries(values: MonthlyValues): [MonthIndex, number][] {
  if (values instanceof Map) return [...values.entries()];
  return Object.entries(values).map(([month, value]) => [toMonth(month), value]);
}

function sumWhere(entries: [MonthIndex, number][], keep: (month: MonthIndex) => boolean): number {
  return entries.reduce((sum, [month, value]) => (keep(month) ? sum + value : sum), 0);
}

interface PopFrame {
  entries: [MonthIndex, number][];
  inFy: (month: MonthIndex, offset: number) => boolean;
  start: MonthIndex;
}

function popFrame(values: MonthlyValues, fy: number): PopFrame {
  const entries = monthlyEntries(values);
  return { entries, inFy: (m, offset) => fiscalYear(m) === fy + offset, start: fiscalYearStart(fy) };
}

function popTail(frame: PopFrame, fy: number) {
  const { entries, inFy } = frame;
  return {
    prior: sumWhere(entries, (m) => fiscalYear(m) < fy),
    fyTotal: sumWhere(entries, (m) => inFy(m, 0)),
    nextTotal: sumWhere(entries, (m) => inFy(m, 1)),
    fy2Total: sumWhere(entries, (m) => inFy(m, 2)),
    fy3Total: sumWhere(entries, (m) => fiscalYear(m) >= fy + 3),
    grand: sumWhere(entries, () => true),
  };
}

export interface Pop1Row {
  prior: number;
  q1: number;
  /** JAN to JUN of the report fiscal year. */
  months: number[];
  q4: number;
  fyTotal: number;
  nextQuarters: [number, number, number, number];
  nextTotal: number;
  fy2Total: number;
  fy3Total: number;
  grand: number;
}

/** POP1: FY 1st quarter, JAN to JUN by month, 4th quarter, then next FY by quarter. */
export function pop1(values: MonthlyValues, fy: number): Pop1Row {
  const frame = popFrame(values, fy);
  const { entries, inFy, start } = frame;
  const at = (month: MonthIndex) => sumWhere(entries, (m) => m === month);
  const quarter = (offset: number, q: number) => sumWhere(entries, (m) => inFy(m, offset) && fiscalQuarter(m) === q);
  const tail = popTail(frame, fy);
  return {
    prior: tail.prior,
    q1: quarter(0, 1),
    months: [3, 4, 5, 6, 7, 8].map((i) => at(addMonths(start, i))),
    q4: quarter(0, 4),
    fyTotal: tail.fyTotal,
    nextQuarters: [quarter(1, 1), quarter(1, 2), quarter(1, 3), quarter(1, 4)],
    nextTotal: tail.nextTotal,
    fy2Total: tail.fy2Total,
    fy3Total: tail.fy3Total,
    grand: tail.grand,
  };
}

export interface Pop2Row {
  prior: number;
  thruJune: number;
  /** JUL, AUG, SEP of the report fiscal year. */
  months: [number, number, number];
  fyTotal: number;
  /** OCT to MAR of the next fiscal year. */
  nextMonths: number[];
  nextQ3: number;
  nextQ4: number;
  nextTotal: number;
  fy2Total: number;
  fy3Total: number;
  grand: number;
}

/** POP2: FY through JUNE, JUL to SEP, next FY OCT to MAR by month, then its 3rd and 4th quarters. */
export function pop2(values: MonthlyValues, fy: number): Pop2Row {
  const frame = popFrame(values, fy);
  const { entries, inFy, start } = frame;
  const at = (month: MonthIndex) => sumWhere(entries, (m) => m === month);
  const nextStart = addMonths(start, 12);
  const tail = popTail(frame, fy);
  return {
    prior: tail.prior,
    thruJune: sumWhere(entries, (m) => inFy(m, 0) && (monthOf(m) >= 10 || monthOf(m) <= 6)),
    months: [at(addMonths(start, 9)), at(addMonths(start, 10)), at(addMonths(start, 11))],
    fyTotal: tail.fyTotal,
    nextMonths: [0, 1, 2, 3, 4, 5].map((i) => at(addMonths(nextStart, i))),
    nextQ3: sumWhere(entries, (m) => inFy(m, 1) && fiscalQuarter(m) === 3),
    nextQ4: sumWhere(entries, (m) => inFy(m, 1) && fiscalQuarter(m) === 4),
    nextTotal: tail.nextTotal,
    fy2Total: tail.fy2Total,
    fy3Total: tail.fy3Total,
    grand: tail.grand,
  };
}

// ---------------------------------------------------------- N-1 processing report

export interface VehicleCost {
  waCode: string;
  vehicle: string;
  cost: number;
}

export interface ProcessingRow extends VehicleCost {
  percentage: number;
  /** Sustaining job order to its rounded share. */
  sustaining: Record<string, number>;
  sust: number;
  waTotal: number;
}

export interface ProcessingReport {
  rows: ProcessingRow[];
  totalCost: number;
  totalSust: number;
  totalWa: number;
  /** The pools being allocated, as the TOTAL line prints them. */
  sustainingTotals: Record<string, number>;
}

/**
 * Prorates each sustaining job order's total over the vehicles by cost.
 * Cells are rounded separately, so a pool's cells can sum to a unit or two
 * off its printed total.
 */
export function processingReport(vehicles: VehicleCost[], sustainingPools: Record<string, number>): ProcessingReport {
  const totalCost = vehicles.reduce((sum, v) => sum + v.cost, 0);
  const rows = vehicles.map((v): ProcessingRow => {
    const sustaining = Object.fromEntries(
      Object.entries(sustainingPools).map(([jo, pool]) => [jo, totalCost === 0 ? 0 : roundHalfAway((v.cost * pool) / totalCost)]),
    );
    const sust = Object.values(sustaining).reduce((sum, x) => sum + x, 0);
    return { ...v, percentage: percent(v.cost, totalCost, 3), sustaining, sust, waTotal: v.cost + sust };
  });
  const totalSust = rows.reduce((sum, r) => sum + r.sust, 0);
  return { rows, totalCost, totalSust, totalWa: totalCost + totalSust, sustainingTotals: { ...sustainingPools } };
}

// ------------------------------------------------------------- L-1 balance sheet

export interface BalanceInput {
  authHours: number;
  authDollars: number;
  balanceHours: number;
  balanceDollars: number;
  futureHours: number;
  futureDollars: number;
}

/** AUTHOR. + BALANCE = BUDGETED; BUDGETED + FUTURE = TOTAL. */
export function balanceRow(input: BalanceInput) {
  const budgetedHours = input.authHours + input.balanceHours;
  const budgetedDollars = input.authDollars + input.balanceDollars;
  return {
    budgetedHours,
    budgetedDollars,
    totalHours: budgetedHours + input.futureHours,
    totalDollars: budgetedDollars + input.futureDollars,
  };
}

// ---------------------------------------------------------------- G cost reports

/** A job order's line: its fiscal-year percent of the W.A. amount, to whole dollars. */
export function jobOrderShare(pct: number, waAmount: number): number {
  return roundHalfAway((pct * waAmount) / 100);
}

export interface ProgramCosts {
  dod493: number;
  navy492: number;
  foreign483: number;
  nasa400: number;
}

/** Task total = DOD 493 + Navy 492 + foreign reimbursable 483 + NASA 400. */
export function programTotal(costs: ProgramCosts): number {
  return costs.dod493 + costs.navy492 + costs.foreign483 + costs.nasa400;
}

// ---------------------------------------------------------------- proration

/**
 * Splits a shared cost in fixed ratios to whole dollars. Any odd unit goes
 * to the later share on a tie, as the sub-job order report prints 9917
 * split 50/50 as 4958 and 4959.
 */
export function prorate(amount: number, weights: number[]): number[] {
  return largestRemainder(amount, weights);
}
