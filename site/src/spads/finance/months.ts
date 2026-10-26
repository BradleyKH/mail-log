// Month arithmetic for the Contract Analysis records. A month is an integer
// index (year * 12 + zero-based month) so ranges and differences are plain
// subtraction; text forms are "MAY84" (prompt input) and "MAY 84" (printouts).

export const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

export type MonthName = (typeof MONTH_NAMES)[number];

/** year * 12 + (month - 1), with a four-digit year. */
export type MonthIndex = number;

export type MonthStyle = 'compact' | 'spaced';

// Two-digit years in the manuals span the 1970s and 1980s.
const CENTURY_PIVOT = 50;

export function makeMonth(year: number, month: number): MonthIndex {
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError(`month out of range: ${month}`);
  return year * 12 + (month - 1);
}

export function tryParseMonth(text: string): MonthIndex | null {
  const match = /^\s*([A-Za-z]{3})[\s-]*(\d{2}|\d{4})\s*$/.exec(text);
  if (!match) return null;
  const index = MONTH_NAMES.indexOf(match[1].toUpperCase() as MonthName);
  if (index < 0) return null;
  let year = Number(match[2]);
  if (match[2].length === 2) year += year < CENTURY_PIVOT ? 2000 : 1900;
  return makeMonth(year, index + 1);
}

/** Parses "MAY84", "MAY 84" or "MAY 1984". Throws on anything else. */
export function parseMonth(text: string): MonthIndex {
  const month = tryParseMonth(text);
  if (month === null) throw new Error(`not a month: ${JSON.stringify(text)}`);
  return month;
}

/** Accepts either a MonthIndex or month text. */
export function toMonth(value: MonthIndex | string): MonthIndex {
  return typeof value === 'number' ? value : parseMonth(value);
}

export function yearOf(month: MonthIndex): number {
  return Math.floor(month / 12);
}

/** 1 to 12. */
export function monthOf(month: MonthIndex): number {
  return (month % 12) + 1;
}

export function monthName(month: MonthIndex): MonthName {
  return MONTH_NAMES[month % 12];
}

export function formatMonth(month: MonthIndex, style: MonthStyle = 'spaced'): string {
  const yy = String(yearOf(month) % 100).padStart(2, '0');
  return style === 'compact' ? `${monthName(month)}${yy}` : `${monthName(month)} ${yy}`;
}

export function addMonths(month: MonthIndex, count: number): MonthIndex {
  return month + count;
}

/** Number of months from first to last, inclusive. */
export function monthCount(first: MonthIndex, last: MonthIndex): number {
  return last - first + 1;
}

export function monthRange(first: MonthIndex, last: MonthIndex): MonthIndex[] {
  const months: MonthIndex[] = [];
  for (let m = first; m <= last; m++) months.push(m);
  return months;
}

/** Four-digit fiscal year; the fiscal year starts in October (OCT84 is FY1985). */
export function fiscalYear(month: MonthIndex): number {
  return monthOf(month) >= 10 ? yearOf(month) + 1 : yearOf(month);
}

export function fiscalYearStart(fy: number): MonthIndex {
  return makeMonth(fy - 1, 10);
}

export function fiscalYearEnd(fy: number): MonthIndex {
  return makeMonth(fy, 9);
}

/** 1 (OCT to DEC) through 4 (JUL to SEP). */
export function fiscalQuarter(month: MonthIndex): 1 | 2 | 3 | 4 {
  return (Math.floor((month - fiscalYearStart(fiscalYear(month))) / 3) + 1) as 1 | 2 | 3 | 4;
}

/** 1 for OCT to MAR (POP1), 2 for APR to SEP (POP2). */
export function fiscalHalf(month: MonthIndex): 1 | 2 {
  return fiscalQuarter(month) <= 2 ? 1 : 2;
}

const QUARTER_533: Partial<Record<MonthName, 1 | 2 | 3 | 4>> = { SEP: 1, DEC: 2, MAR: 3, JUN: 4 };

/** The 533 quarter a status month produces, or null when it produces none. */
export function quarter533(statusMonth: MonthIndex): 1 | 2 | 3 | 4 | null {
  return QUARTER_533[monthName(statusMonth)] ?? null;
}

export function error533(statusMonth: MonthIndex): string {
  return `*** 533 REPORT CANNOT BE GENERATED FOR STATUS MONTH ${monthName(statusMonth)} ***`;
}
