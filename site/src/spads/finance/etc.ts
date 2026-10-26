import { addMonths, fiscalYear, fiscalYearEnd, formatMonth, toMonth, type MonthIndex } from './months';
import { budgetDollars, type Rate } from './rates';
import { spread, type MonthRow } from './spread';

export interface EtcUpdateOptions {
  /** Last month of the new spread; defaults to the end of the status month's fiscal year. */
  spreadEnd?: MonthIndex | string;
}

export interface EtcUpdateResult {
  rows: MonthRow[];
  eacHours: number;
  eacDollars: number;
}

/**
 * ETC/EAC update for one record. The status month's EAC spread resets to the
 * cumulative actuals, a normal spread runs from there to the spread end, and
 * later months carry the exact EAC (EAC = actuals + ETC).
 */
export function etcUpdate(
  rows: MonthRow[],
  statusMonth: MonthIndex | string,
  etcHours: number,
  etcDollars: number,
  options: EtcUpdateOptions = {},
): EtcUpdateResult {
  const status = toMonth(statusMonth);
  const statusRow = rows.find((row) => toMonth(row.month) === status);
  if (!statusRow) throw new Error(`record has no row for status month ${formatMonth(status)}`);
  const lastMonth = Math.max(...rows.map((row) => toMonth(row.month)));
  // The update session asks for an ETC per fiscal year, and the printed
  // example spreads the status year's ETC only through SEP, leaving the
  // following OCT row at the exact EAC.
  const spreadEnd = Math.min(
    options.spreadEnd === undefined ? fiscalYearEnd(fiscalYear(status)) : toMonth(options.spreadEnd),
    lastMonth,
  );
  const eacHours = statusRow.actHours + etcHours;
  const eacDollars = statusRow.actDollars + etcDollars;

  const spreadByMonth = new Map<MonthIndex, { hours: number; dollars: number }>();
  if (spreadEnd > status) {
    for (const row of spread({
      first: status,
      firstHours: statusRow.actHours,
      firstDollars: statusRow.actDollars,
      last: spreadEnd,
      lastHours: eacHours,
      lastDollars: eacDollars,
    })) {
      spreadByMonth.set(toMonth(row.month), row);
    }
  } else {
    spreadByMonth.set(status, { hours: eacHours, dollars: eacDollars });
  }

  // The printout after the update carries the new EAC in the completion
  // column for the status month and the month after it, and zeros beyond.
  const completionThrough = addMonths(status, 1);

  const updated = rows.map((row): MonthRow => {
    const month = toMonth(row.month);
    if (month < status) return row;
    const spreadRow = spreadByMonth.get(month);
    const next: MonthRow = {
      ...row,
      eacHours: spreadRow ? spreadRow.hours : eacHours,
      eacDollars: spreadRow ? spreadRow.dollars : eacDollars,
      compHours: month <= completionThrough ? eacHours : 0,
      compDollars: month <= completionThrough ? eacDollars : 0,
    };
    return next;
  });
  return { rows: updated, eacHours, eacDollars };
}

/** NEW TOTAL DOLLAR ETC from ETC hours and material/ODC dollars at a task's rates. */
export function eacFromRates(etcHours: number, etcOdc: number, rate: Rate): number {
  return budgetDollars(etcHours, etcOdc, rate);
}
