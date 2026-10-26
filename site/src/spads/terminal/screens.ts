import type { MonthRow } from "@/spads/finance/spread";
import type { SpadsJobOrder, StoredSpadsRecord } from "./types";

// Screen text the manual prints that menus.json does not hold. Each entry
// cites the CR-177949 PDF page it is copied from.
export const TEXT = {
  // PRIMOS login, PDF 12.
  loginPlease: "OK, LOGIN PLEASE",
  password: "Password?",
  enterPassword: "ENTER PASSWORD >",
  // MOD field prompts and job-order value prompts, PDF 33, 35, 36, 39.
  inputTitle: "INPUT TITLE (UP TO 72 CHARACTERS)",
  joValue: ["ENTER JO VALUE AS:", "ANNNNA"],
  joPercent: ["!NNN.NNN!"],
  joSubcodeMod: ["JO-SUBCODE", "!!"],
  helpMore: "MORE? >",
  // INPUT, PDF 51; main-menu RATETABLE, PDF 117.
  ratetableTaskInput: (task: string) => ` TASK= ${task}`,
  ratetableTaskMain: (task: string) => `TASK=${task}`,
  // Record delete, PDF 46.
  recordDeleted: (sysnum: string) => `RECORD ${sysnum} DELETED FROM DATA BASE`,
  joNotFound: (jo: string) => ` JO: ${jo} NOT FOUND.`,
  joFound: (jo: string) => `JOB ORDER ${jo} FOUND.`,
  joAutoNotFound: (jo: string) => `JOB ORDER ${jo} NOT FOUND.`,
  // Book, PDF 52 to 54.
  bookRecordNo: (sysnum: string) => `RECORD NO. ${sysnum}`,
  bookItems: (n: number) => `${n} ITEMS IN BOOK`,
  bookBeginning: "BEGINNING SEARCH",
  bookFound: (n: number) => `${n} ITEMS FOUND`,
  bookSortBegin: (what: string) => `${what} SORT NOW BEGINNING: PLEASE STAND BY`,
  bookSorted: (what: string) => `RECORDS FOUND AND SORTED FOR ${what}`,
  bookEngineerBegin: "ENGINEER SORT NOW BEGINNING: PLEASE STAND BY",
  bookEngineerSorted: "RECORDS FOUND AND SORTED FOR ENGINEERS",
  allDone: "ALL DONE",
  outputSpooled: "OUTPUT SPOOLED TO PRINTER",
  enterOption: "ENTER OPTION >",
} as const;

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/** Record DATE field form, e.g. `WED, JUN 27 1984`. */
export function recordDate(d: Date): string {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")} ${d.getFullYear()}`;
}

/** Report DATE COMPUTED form, e.g. `FRI, SEP 28 1984 01:08:02 PM`. */
export function computedDate(d: Date): string {
  const h = d.getHours() % 12 === 0 ? 12 : d.getHours() % 12;
  const time = [h, d.getMinutes(), d.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":");
  return `${recordDate(d)} ${time} ${d.getHours() < 12 ? "AM" : "PM"}`;
}

/** `JUN84` to `JUN 84`. */
export function spacedMonth(month: string): string {
  return `${month.slice(0, 3)} ${month.slice(3)}`;
}

const num = (n: number, width: number) => String(n).padStart(width);
const pct = (n: number) => n.toFixed(3).padStart(9);

/** The header block every record display starts with (PDF 31, 50, 98). */
export function headerLines(r: StoredSpadsRecord): string[] {
  const nojos = r.jobOrders.length || r.printedJobOrders || 0;
  const months = r.months.length ? num(r.months.length, 2) : "  ";
  const mods = [0, 1, 2, 3].map((i) => (r.mods[i] ?? "").padStart(2)).join(",");
  const totals = (n: number) => (r.showTotals ? num(n, 10) : " ".repeat(10));
  const subtask = `${r.taskas.padStart(3)}.${r.tasksb}`;
  return [
    `DATE:  ${r.date} STATUS:${r.status.padEnd(3)}  J.O.S:${num(nojos, 2)} MONTHS:${months} SYS ITEM NO:${num(Number(r.sysnum), 4)}`,
    `TITLE:${r.title}`,
    `MOD: ${mods}           CONTRACTOR:${r.contractor}`,
    `REMRK:${r.remarks}`,
    `NASA RESPONSIBLE ENGR:${r.nr.padEnd(14)}KTR RESPONSIBLE ENGR:${r.cr}`,
    `RBK:${r.rbk.padEnd(16)}PURCHASE REQUEST:${r.pr}`,
    `CONTRACT/PURCHASE ORDER:${r.contract}  TASK:${r.task}  SUBTASK:${subtask}`,
    `WORK AUTHORITY:${r.wan}   WA CODE:${r.wacode.padEnd(4)}   COMPLETED TASK:${r.complete ? "YES" : "NO "}    TABLE:${r.table}`,
    `R.T. HRS:${num(r.rtHours, 10)} R.T. DOLLARS:${num(r.rtDollars, 10)}`,
    `TOTAL AUT HOURS:${totals(r.totHours)}   TOTAL AUT DOLLARS:${totals(r.totDollars)}   FEE:${r.fee.toFixed(3).padStart(7)}%`,
  ];
}

/** Two lines per job order: ALL and FY1 to FY4, then FY5 to FY8 (PDF 31). */
export function jobOrderLines(jo: SpadsJobOrder): string[] {
  const fy = [...jo.fy, 0, 0, 0, 0, 0, 0, 0, 0].slice(0, 8);
  return [
    `  ${jo.jo.padEnd(6)} ${jo.sub.padEnd(2)} ${jo.progno.padEnd(17)}${[jo.all, ...fy.slice(0, 4)].map(pct).join("")}`,
    `${" ".repeat(29)}${fy.slice(4).map(pct).join("")}`,
  ];
}

export function jobOrdersBlock(r: StoredSpadsRecord): string[] {
  return r.jobOrders.flatMap(jobOrderLines);
}

/** One hours-and-dollars row: month, CMAA, then EAC, actuals, and completion. */
export function monthRow(m: MonthRow): string {
  const values = [m.eacHours, m.eacDollars, m.actHours, m.actDollars, m.compHours, m.compDollars];
  return `  ${spacedMonth(m.month.replace(" ", ""))}  ${m.cmaa.padEnd(4)}${values.map((v) => num(v, 10)).join("")}`;
}

/** The row the MANUAL routine prints when the visitor returns without data (PDF 45). */
export const ZERO_MANUAL_ROW = `   0${" ".repeat(10)}${Array.from({ length: 6 }, () => num(0, 10)).join("")}`;
