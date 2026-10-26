import { fiscalYear, fiscalYearEnd, monthName, parseMonth, yearOf, type MonthIndex } from "@/spads/finance/months";
import {
  CPFF_TASKS,
  FPI_TASKS,
  row533,
  rollup533Cpff,
  rollup533Fpi,
  totalContract533,
  varianceRow,
  zeroRow533,
  type Row533,
} from "@/spads/finance/reports";
import { roundHalfAway } from "@/spads/finance/spread";
import type { SpadsTables, StoredSpadsRecord } from "./types";

// Reports the terminal computes from the store's records rather than
// printing the manual's sample. The store holds only the manual's sample
// records, so these are small next to the printed runs.

const CONTRACT = "NAS1-16200";

export function contractRecords(records: StoredSpadsRecord[]): StoredSpadsRecord[] {
  return records.filter((r) => r.contract === CONTRACT && r.months.length > 0);
}

type Basis = "eac" | "act";

/** Cumulative value at month `m`: EAC is the latest row on or before it; actuals the largest, since future rows print 0. */
export function cumAt(r: StoredSpadsRecord, m: MonthIndex, basis: Basis, what: "hours" | "dollars"): number {
  let value = 0;
  for (const row of r.months) {
    const month = parseMonth(row.month);
    if (month > m) continue;
    if (basis === "eac") value = what === "hours" ? row.eacHours : row.eacDollars;
    else value = Math.max(value, what === "hours" ? row.actHours : row.actDollars);
  }
  return value;
}

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const count = (n: number) => Math.round(n).toLocaleString("en-US");
const longMonth = (m: MonthIndex) => `${monthName(m)} ${yearOf(m)}`;

/** The terminal part of the yearly report (PDF 90 to 91). */
export function yearlyLines(records: StoredSpadsRecord[], basis: Basis, withFee: boolean): string[] {
  const recs = contractRecords(records);
  const months = recs.flatMap((r) => r.months.map((row) => parseMonth(row.month)));
  if (!months.length) return ["NO RECORDS FOUND FOR CONTRACT NAS1-16200"];
  const first = Math.min(...months);
  const last = Math.max(...months);
  const lines = [
    `FIRST MONTH IN CONTRACT ${CONTRACT}     ${longMonth(first)}`,
    `LAST MONTH IN CONTRACT ${CONTRACT}      ${longMonth(last)}`,
    "",
    "SUMMARY BY FISCAL YEAR",
    "",
    "YEAR           DOLLARS              HOURS",
  ];
  let totalDollars = 0;
  let totalHours = 0;
  for (let fy = fiscalYear(first); fy <= fiscalYear(last); fy++) {
    let dollars = 0;
    let hours = 0;
    for (const r of recs) {
      const fee = withFee ? 1 + r.fee / 100 : 1;
      const end = fiscalYearEnd(fy);
      dollars += roundHalfAway((cumAt(r, end, basis, "dollars") - cumAt(r, end - 12, basis, "dollars")) * fee);
      hours += cumAt(r, end, basis, "hours") - cumAt(r, end - 12, basis, "hours");
    }
    totalDollars += dollars;
    totalHours += hours;
    lines.push(`${fy}  ${money(dollars).padStart(16)}  ${count(hours).padStart(17)}`);
  }
  lines.push(`TOTAL ${money(totalDollars).padStart(16)}  ${count(totalHours).padStart(17)}`);
  return lines;
}

/** The variance summary's rows (Appendix O-4 columns), committed EAC from each record's last month. */
export function varianceLines(records: StoredSpadsRecord[], tables: SpadsTables, tasks: string[]): string[] {
  const recs = contractRecords(records);
  const lines = [
    "TASK   CONTRACT VALUE       COMMITTED EAC          VARIANCE        % VAR/CV",
    "        HOURS  DOLLARS      HOURS  DOLLARS      HOURS  DOLLARS   HOURS DOLLARS",
  ];
  for (const task of tasks) {
    const cvDollars = (tables.time.find((t) => t.task === task)?.contractValue ?? 0) * 1000;
    let eacHours = 0;
    let eacDollars = 0;
    for (const r of recs.filter((x) => x.task === task)) {
      const lastRow = r.months[r.months.length - 1];
      eacHours += lastRow.eacHours;
      eacDollars += lastRow.eacDollars;
    }
    const v = varianceRow({ cvHours: 0, cvDollars, eacHours, eacDollars });
    const n = (x: number, w: number) => String(x).padStart(w);
    lines.push(
      `  ${task}  ${n(0, 9)}${n(cvDollars, 9)}  ${n(eacHours, 9)}${n(eacDollars, 9)}  ${n(v.varianceHours, 9)}${n(v.varianceDollars, 9)}  ${v.pctHours.toFixed(1).padStart(6)}${v.pctDollars.toFixed(1).padStart(8)}`,
    );
  }
  return lines;
}

function inc(r: StoredSpadsRecord, from: MonthIndex, to: MonthIndex): number {
  if (to < from) return 0;
  return cumAt(r, to, "eac", "dollars") - cumAt(r, from - 1, "eac", "dollars");
}

/**
 * A reconstructed 533 in dollars: 7A actuals through the prior month, 7B the
 * status month's actuals, 8A to 8C the next three months of EAC spread, 8D to
 * 8F the three quarters after, 8G the rest of that fiscal year, 8H the next
 * fiscal year, 8I the balance; 9B the time table's contract value.
 */
export function row533For(recs: StoredSpadsRecord[], status: MonthIndex, contractValue: number): Row533 {
  const input = { ...zeroRow533() } as Row533;
  for (const r of recs) {
    const before = cumAt(r, status - 1, "act", "dollars");
    input["7A"] += before;
    input["7B"] += Math.max(0, cumAt(r, status, "act", "dollars") - before);
    input["8A"] += inc(r, status + 1, status + 1);
    input["8B"] += inc(r, status + 2, status + 2);
    input["8C"] += inc(r, status + 3, status + 3);
    input["8D"] += inc(r, status + 4, status + 6);
    input["8E"] += inc(r, status + 7, status + 9);
    input["8F"] += inc(r, status + 10, status + 12);
    const fyEnd = fiscalYearEnd(fiscalYear(status + 12));
    input["8G"] += inc(r, status + 13, fyEnd);
    input["8H"] += inc(r, fyEnd + 1, fyEnd + 12);
    input["8I"] += inc(r, fyEnd + 13, fyEnd + 12 * 20);
  }
  input["9B"] = contractValue;
  return row533(input);
}

export function lines533(records: StoredSpadsRecord[], tables: SpadsTables, statusMonth: string): string[] {
  const status = parseMonth(statusMonth);
  const recs = contractRecords(records);
  const cv = (task: string) => (tables.time.find((t) => t.task === task)?.contractValue ?? 0) * 1000;
  const rowOf = (task: string) => row533For(recs.filter((r) => r.task === task), status, cv(task));
  const n = (x: number) => String(Math.round(x)).padStart(11);
  const fmt = (label: string, r: Row533) =>
    `${label.padEnd(24)}${n(r["7A"])}${n(r["7B"])}${n(r["7C"])}${n(r["8J"])}${n(r["9A"])}${n(r["9B"])}`;
  const fpiRows = FPI_TASKS.map(rowOf);
  const cpffRows = CPFF_TASKS.map(rowOf);
  const fpi = rollup533Fpi(fpiRows);
  const cpff = rollup533Cpff(cpffRows);
  return [
    `${"".padEnd(24)}${["7A", "7B", "7C", "8J", "9A", "9B"].map((c) => c.padStart(11)).join("")}`,
    ...FPI_TASKS.map((t, i) => fmt(`TASK ${t}`, fpiRows[i])),
    fmt("TOTAL FPI THRU G & A", fpi.thruGA),
    ...CPFF_TASKS.map((t, i) => fmt(`TASK ${t}`, cpffRows[i])),
    fmt("TOTAL COST", cpff.totalCost),
    fmt("TOTAL CONTRACT", totalContract533(fpi.total, cpff.total, zeroRow533())),
  ];
}
