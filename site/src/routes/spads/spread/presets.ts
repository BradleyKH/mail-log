import { etcUpdate } from "@/spads/finance/etc";
import { formatMonth, monthCount, tryParseMonth } from "@/spads/finance/months";
import { spread, type MonthRow, type SpreadRow } from "@/spads/finance/spread";
import type { DocId } from "@/content/types";

export const SPADS_DOC: DocId = "cr-177949";

export interface SpreadParams {
  first: string;
  last: string;
  firstHours: number;
  firstDollars: number;
  lastHours: number;
  lastDollars: number;
  abnormal: boolean;
  hoursPct: number;
  dollarsPct: number;
}

export type PresetId = "manual" | "etc" | "custom";

export const MANUAL_PARAMS: SpreadParams = {
  first: "AUG75",
  last: "DEC76",
  firstHours: 10,
  firstDollars: 1000,
  lastHours: 100,
  lastDollars: 77000,
  abnormal: true,
  hoursPct: 25,
  dollarsPct: 20,
};

export const PRESETS: { id: Exclude<PresetId, "custom">; label: string; fromPdf: number; toPdf: number }[] = [
  { id: "manual", label: "The manual's example", fromPdf: 44, toPdf: 45 },
  { id: "etc", label: "ETC update on W.A. 3005 HAA", fromPdf: 96, toPdf: 98 },
];

// Cap keeps a mistyped year from rendering thousands of rows.
const MAX_MONTHS = 120;

export type SpreadResult = { rows: SpreadRow[] } | { error: string };

export function computeSpread(p: SpreadParams): SpreadResult {
  const first = tryParseMonth(p.first);
  const last = tryParseMonth(p.last);
  if (first === null || last === null) return { error: "Enter months like AUG75." };
  if (last < first) return { error: "The last month must not come before the first month." };
  if (monthCount(first, last) > MAX_MONTHS) return { error: `Spreads are limited to ${MAX_MONTHS} months.` };
  const numbers = [p.firstHours, p.firstDollars, p.lastHours, p.lastDollars, p.hoursPct, p.dollarsPct];
  if (numbers.some((n) => !Number.isFinite(n))) return { error: "Hours, dollars and percents must be numbers." };
  return {
    rows: spread({
      first,
      firstHours: p.firstHours,
      firstDollars: p.firstDollars,
      last,
      lastHours: p.lastHours,
      lastDollars: p.lastDollars,
      abnormal: p.abnormal ? { hoursPct: p.hoursPct, dollarsPct: p.dollarsPct } : undefined,
    }),
  };
}

export const ETC_STATUS = "MAY84";
export const ETC_HOURS = 300;
export const ETC_DOLLARS = 15454;

/** Rows from APR 84 on, so the reset at the status month shows against the month before it. */
export function computeEtcPreset(months: MonthRow[]): { rows: SpreadRow[]; eacHours: number; eacDollars: number } {
  const result = etcUpdate(months, ETC_STATUS, ETC_HOURS, ETC_DOLLARS);
  const from = tryParseMonth("APR84")!;
  const rows = result.rows
    .filter((r) => tryParseMonth(r.month)! >= from)
    .map((r) => ({ month: formatMonth(tryParseMonth(r.month)!), hours: r.eacHours, dollars: r.eacDollars }));
  return { rows, eacHours: result.eacHours, eacDollars: result.eacDollars };
}

/** Terminal-style lines: month, then hours and dollars right-aligned to the widest value. */
export function formatSpreadLines(rows: SpreadRow[]): string[] {
  const hw = Math.max(...rows.map((r) => String(r.hours).length));
  const dw = Math.max(...rows.map((r) => String(r.dollars).length));
  return rows.map((r) => `${r.month}  ${String(r.hours).padStart(hw)}  ${String(r.dollars).padStart(dw)}`);
}
