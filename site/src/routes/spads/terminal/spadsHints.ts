import { getSections } from "@/content/load";
import { RATES_NOTE } from "@/spads/finance/rates";
import type { SpadsState } from "@/spads/terminal/types";

/** Contract Analysis is documented in Vol. II. */
export const SPADS_DOC = "cr-177949";

/** Engine steps whose `?screen=` name is the menus.json key of the menu they print. */
const SCREEN_NAMES: Record<string, string> = {
  password: "login",
  password2: "login",
  contract: "contractSelect",
  analysis: "analysisMain",
  "report.main": "reportMain",
  "update.main": "updateMain",
};

/** The screen id written to `?screen=` and used for hood lookup; undefined once logged out. */
export function screenOf(state: SpadsState): string | undefined {
  if (state.step === "exit") return undefined;
  if (state.step === "dialog" && state.ctx.dialog) return `dialog:${state.ctx.dialog.id}`;
  return SCREEN_NAMES[state.step] ?? state.step;
}

const LOGIN_INPUTS = ["LOGIN DKH", "", ""];

/** Menu screens a `?screen=` link can open, and the input that reaches each from a fresh login. */
export const RESTORE_INPUTS: Record<string, string[]> = {
  spadsMain: LOGIN_INPUTS,
  contractSelect: [...LOGIN_INPUTS, "8"],
  analysisMain: [...LOGIN_INPUTS, "8", "10"],
  reportMain: [...LOGIN_INPUTS, "8", "10", "4"],
  updateMain: [...LOGIN_INPUTS, "8", "10", "5"],
};

export type FormulaKey = "spread" | "etc" | "533" | "variance" | "yearly" | "waStatus" | "ratetable";

type HoodEntry = { section: string; label: string; formula?: FormulaKey };

const EXACT: Record<string, HoodEntry> = {
  login: { section: "2.1", label: "PRIMOS login" },
  spadsMain: { section: "2.2", label: "SPADS main menu" },
  logout: { section: "2.8", label: "Logout menu" },
  contractSelect: { section: "2.4", label: "Contract selection" },
  "contract.continue": { section: "2.4", label: "Contract selection lookups" },
  analysisMain: { section: "2.4", label: "Analysis main menu" },
  reportMain: { section: "7.0", label: "Report generator" },
  "report.tables": { section: "7.1", label: "Table reports" },
  "report.533": { section: "7.2", label: "533 report", formula: "533" },
  "report.533print": { section: "7.2", label: "533 report", formula: "533" },
  "dialog:report.533": { section: "7.2", label: "533 report", formula: "533" },
  "dialog:report.pop": { section: "7.3", label: "POP's report" },
  "report.cost": { section: "7.4", label: "Program cost reports" },
  "report.hour": { section: "7.5", label: "Program hour reports" },
  "report.proration": { section: "7.6", label: "Proration reports" },
  "dialog:report.processing": { section: "7.10", label: "Processing report" },
  "report.summary": { section: "7.11", label: "Summary reports" },
  "dialog:report.actual": { section: "7.11.1", label: "Actual summary report" },
  "dialog:report.taskSummary": { section: "7.11.2", label: "Task summary report" },
  "dialog:report.waSummary": { section: "7.11.3", label: "W.A. summary report" },
  "report.waBrief": { section: "7.11.3", label: "W.A. summary report" },
  "dialog:report.variance": { section: "7.11.4", label: "Variance summary report", formula: "variance" },
  "report.variancePrint": { section: "7.11.4", label: "Variance summary report", formula: "variance" },
  "dialog:report.yearly": { section: "7.11.5", label: "Yearly report", formula: "yearly" },
  updateMain: { section: "8.0", label: "Update menu" },
  "dialog:report.costWa": { section: "7.4.3", label: "W.A. cost report" },
  "dialog:report.hourWa": { section: "7.5.3", label: "W.A. hour report" },
};

/** Fallbacks by step-id prefix, most specific first. */
const PREFIXES: [string, HoodEntry][] = [
  ["dialog:report.cost", { section: "7.4", label: "Program cost reports" }],
  ["dialog:report.hour", { section: "7.5", label: "Program hour reports" }],
  ["dialog:report.dod", { section: "7.6.3", label: "DOD reports" }],
  ["report.dod", { section: "7.6.3", label: "DOD reports" }],
  ["ret.delete", { section: "4.2", label: "Delete option" }],
  ["ret.", { section: "4.0", label: "Retrieve option" }],
  ["mod.", { section: "4.1", label: "MOD option" }],
  ["jo.", { section: "4.1.2", label: "Job order changes" }],
  ["sp.", { section: "4.1.3", label: "Hours and dollars spread", formula: "spread" }],
  ["abnormal", { section: "4.1.3", label: "Hours and dollars spread", formula: "spread" }],
  ["man.", { section: "4.1.3", label: "Manual hours and dollars entry", formula: "spread" }],
  ["spool.", { section: "3.1", label: "Printout spooling" }],
  ["input.", { section: "5.0", label: "Input option" }],
  ["book.", { section: "6.0", label: "Book part option" }],
  ["ua.", { section: "6.1", label: "Entire record option" }],
  ["ud.", { section: "8.1", label: "Dallas tape update" }],
  ["ub.", { section: "8.2", label: "Balance sheet update" }],
  ["etc.", { section: "8.3", label: "ETC EAC-budget update", formula: "etc" }],
  ["uq", { section: "8.4", label: "Quickie header update" }],
  ["ut.", { section: "8.5", label: "Edit tables option" }],
  ["uj.", { section: "8.8", label: "Job orders update" }],
  ["rate.", { section: "9.0", label: "RATETABLE option", formula: "ratetable" }],
  ["dialog:report.", { section: "7.0", label: "Report generator" }],
  ["report.", { section: "7.0", label: "Report generator" }],
  ["dialog:", { section: "8.0", label: "Update option" }],
];

function entryFor(screen: string): HoodEntry | undefined {
  return EXACT[screen] ?? PREFIXES.find(([p]) => screen.startsWith(p))?.[1];
}

export type HoodInfo = { label: string; sectionId: string; sectionTitle: string; pdfPage: number };

/** The manual section behind a screen, with its page from the Vol. II table of contents. */
export function hoodFor(screen: string | undefined): HoodInfo | undefined {
  if (!screen) return undefined;
  const entry = entryFor(screen);
  if (!entry) return undefined;
  const section = getSections(SPADS_DOC).find((s) => s.id === entry.section);
  if (!section) return undefined;
  return { label: entry.label, sectionId: section.id, sectionTitle: section.title, pdfPage: section.pdfPage };
}

/** The calculation a state's flow runs, so the hood can keep showing it after the flow returns to a menu. */
export function formulaOf(state: SpadsState): FormulaKey | undefined {
  const screen = screenOf(state);
  if (!screen) return undefined;
  const spool = state.ctx.spool;
  if (spool?.sample === "M-1") return "waStatus";
  if (spool?.then === "report.533print") return "533";
  if (spool?.then === "report.variancePrint") return "variance";
  return entryFor(screen)?.formula;
}

export type FormulaNote = {
  title: string;
  formula: string;
  /** Whether the manual states the formula or it was worked out from the printed figures. */
  reconstructed: boolean;
  evidence: string;
  pdfPage: number;
};

export const FORMULAS: Record<FormulaKey, FormulaNote> = {
  spread: {
    title: "Month spread",
    formula:
      "The spread runs from the first month to the last, inclusive, in n = months - 1 increments added cumulatively. A normal spread makes each increment round(total change / n). An abnormal spread gives the first floor(n / 2) increments the first-half percent of the change, shared equally, and the rest the remainder; each increment is rounded.",
    reconstructed: true,
    evidence:
      "Reproduces all 17 printed rows of the manual's abnormal spread, AUG75 10 hours and $1,000 to DEC76 100 hours and $77,000 with 25% of the hours and 20% of the dollars in the first half: hours 10, 13, 16 ... 90, 98 and dollars 1000, 2900, 4800 ... 69400, 77000.",
    pdfPage: 44,
  },
  etc: {
    title: "ETC EAC-budget update",
    formula:
      "EAC = cumulative actuals + ETC. The status month's EAC spread resets to the cumulative actuals, then a normal spread runs to the end of that month's fiscal year (October to September); later months carry the exact EAC.",
    reconstructed: true,
    evidence:
      "Record SYS 125, W.A. 3005 HAA, status MAY84: actuals 698 hours and $32,046 plus ETC 300 hours and $15,454 give EAC 998 hours and $47,500. Printed rows MAY84 698/32046, JUN84 773/35910, JUL84 848/39774, AUG84 923/43638, SEP84 998/47502 (the $2 rounding drift is in the print), then OCT84 998/47500.",
    pdfPage: 96,
  },
  "533": {
    title: "533 report",
    formula:
      "7C cumulative cost = 7A (through the prior month) + 7B (current month). 8J estimate to complete = the three months + quarters D, E, F + G (balance of fiscal year) + H (next fiscal year) + I (balance of contract). 9A estimated final cost = 7C + 8J. FPI and CPFF tasks roll up separately into TOTAL CONTRACT. The report runs only for status months SEP, DEC, MAR, and JUN.",
    reconstructed: true,
    evidence: "Worked out from the printed quarterly 533 forms E-2 to E-3A, whose columns and rollups add up this way.",
    pdfPage: 128,
  },
  variance: {
    title: "Variance summary",
    formula: "Variance = committed EAC - contract value. % variance / CV = variance / contract value x 100, to one decimal.",
    reconstructed: true,
    evidence: "Reproduces the printed variance summary O-4: task A, -3,942 on a contract value of 115,000, prints -3.4; the total, -669,133 on 7,805,000, prints -8.6.",
    pdfPage: 88,
  },
  yearly: {
    title: "Yearly report",
    formula:
      "Each record's EAC (or actual) spread is summed by fiscal year (October to September) and by calendar year; both sets of years add to the same total.",
    reconstructed: true,
    evidence:
      "Here it runs on the site's sample records only, so the totals are smaller than the manual's run over the full 1985 data base: MAR 1981 to OCT 1986, $42,125,002 and 488,247 hours. The printed sample O-5A also sums to one total both ways ($69,908,629).",
    pdfPage: 89,
  },
  waStatus: {
    title: "W.A. status report",
    formula: "Lists every open record (a status set and not complete) that has no row for the current status month.",
    reconstructed: true,
    evidence: "Computed from the session's records; the transcribed sample M-1 shows a printed run of the report.",
    pdfPage: 82,
  },
  ratetable: {
    title: "RATETABLE",
    formula:
      "BUDGET DOLLARS = HRS X RATE + ODC.DOL X RATE, with an hour rate and an ODC rate for each task and fiscal year. The rate table prints this formula, so it is not a reconstruction; the rates are.",
    reconstructed: false,
    evidence: RATES_NOTE,
    pdfPage: 123,
  },
};

/** What the visitor is expected to type at a screen, for the line under the terminal. */
export function inputHint(state: SpadsState): string {
  const screen = screenOf(state);
  if (!screen) return "Type LOGIN and your initials to start again";
  switch (screen) {
    case "login":
      return state.step === "login" ? "LOGIN and your initials, for example LOGIN DKH" : "any password; it is not checked or shown";
    case "spadsMain":
      return "8 for Contracts Analysis, 9 for MAIL LOG, or 0 to log out";
    case "logout":
      return "1 to log out, or 0 to return to the SPADS main menu";
    case "contractSelect":
      return "10 for NAS1-16200, 33, 44, or 55 for the lookups, or 0 to log out";
    case "contract.continue":
      return "Return to continue";
    case "analysisMain":
      return "an option from 0 to 6, such as 1 for RETRIEVE or 4 for REPORT";
    case "reportMain":
      return "a report from 1 to 11, or Return to go back";
    case "updateMain":
      return "an update option number, or Return to go back";
  }
  if (screen.startsWith("dialog:")) return "an answer to the prompt above, or QUIT to leave";
  return "an answer to the prompt above";
}
