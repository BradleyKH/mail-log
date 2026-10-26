import type { SpadsReport } from "@/content/types";

export type FormulaBasis = "stated" | "reconstructed";

export function checkTally(report: SpadsReport) {
  const pass = report.verified.filter((v) => v.result.startsWith("pass")).length;
  const fail = report.verified.filter((v) => v.result.startsWith("fail")).length;
  return { pass, fail, total: report.verified.length };
}

export interface FormulaSpec {
  name: string;
  expression: string;
  basis: FormulaBasis;
  /** The printed rows or manual pages the formula was checked on. */
  evidence: string;
}

export interface ReportNote {
  /** Section id in the Vol. II manual (cr-177949) that describes the report. */
  sectionId: string;
  /** Short excerpt of the manual's description of what the report is for. */
  purpose: string;
  /** PDF page the excerpt comes from. */
  purposePage: number;
  formulas: FormulaSpec[];
  /** Subtotals that are wrong in the original printout and are reproduced as printed. */
  printedErrors?: string[];
}

const quarterRule: FormulaSpec = {
  name: "Quarter by status month",
  expression:
    "Status month SEP prints the 1st quarter, DEC the 2nd, MAR the 3rd, JUN the 4th. Any other month prints *** 533 REPORT CANNOT BE GENERATED FOR STATUS MONTH OCT *** (with the month).",
  basis: "stated",
  evidence: "Manual text and terminal example, PDF 60 and 61.",
};

const columnRule: FormulaSpec = {
  name: "533 columns",
  expression:
    "7C = 7A + 7B. 8J = the three months + quarters D, E, F + G (balance of fiscal year) + H (next fiscal year) + I (balance of contract). 9A = 7C + 8J.",
  basis: "reconstructed",
  evidence: "Held on every row of this printout, including the profit, award, and total rows.",
};

const cpffRule: FormulaSpec = {
  name: "CPFF roll-up",
  expression:
    "TOTAL COST = task J + task M + task R, plus FIXED FEE. TOTAL CONTRACT = TOTAL FPI + TOTAL CPFF + retransfer of personnel (dollars) or category S (hours).",
  basis: "reconstructed",
  evidence: "TOTAL COST equals the sum of J, M, and R in every column of the printout.",
};

const proration = (pdf: string): FormulaSpec => ({
  name: "Proration columns",
  expression: "A row's vehicle and support columns add up to its phase SUBTOTAL; GRAND TOTAL = phase 7 + phase 8.",
  basis: "reconstructed",
  evidence: `Checked on the detail rows of the printout at ${pdf}.`,
});

const hourSum = (name: string, evidence: string): FormulaSpec => ({
  name,
  expression: "TOTAL HOURS = sum of the program columns (NASA 400, DOD 493, Navy 492, foreign 483).",
  basis: "reconstructed",
  evidence,
});

const dodRule: FormulaSpec = {
  name: "DOD report totals",
  expression:
    "Each TOTAL row = its (N) + (H) + (I) suffix rows; the TOTAL column = the sum of the fiscal-year columns. The hardware, mission, and annual reports print identical figures.",
  basis: "reconstructed",
  evidence: "All 24 data and total rows of K-1 reproduce; K-2 and K-3 match it cell for cell.",
};

export const reportNotes: Record<string, ReportNote> = {
  "E-1": {
    sectionId: "7.2",
    purpose:
      "The 533 report is a standardized contractor report used by the government to monitor management contracts. It displays dollar and hourly summaries for fixed price incentive (FPI) and cost plus fixed fee (CPFF) tasks.",
    purposePage: 60,
    formulas: [quarterRule],
  },
  "E-2": {
    sectionId: "7.2",
    purpose: "One of four quarterly 533 reports, chosen by the status month. This is the 2nd quarter FPI dollars form.",
    purposePage: 60,
    formulas: [
      quarterRule,
      columnRule,
      {
        name: "FPI roll-up",
        expression: "TOTAL FPI = TOTAL FPI THRU G & A + INCENTIVE FEE + PROFIT + AWARD.",
        basis: "reconstructed",
        evidence:
          "Every column: 7A 23102 + 2078 + 60 = 25240; 9A 30756 + 844 + 3070 + 600 = 35270; contract value 34135 + 3070 + 900 = 38105.",
      },
    ],
  },
  "E-2A": {
    sectionId: "7.2",
    purpose: "The CPFF page of the 2nd quarter 533 report.",
    purposePage: 60,
    formulas: [quarterRule, columnRule, cpffRule],
  },
  "E-3": {
    sectionId: "7.2",
    purpose: "The 3rd quarter 533 report, hours form. Hours forms carry no fee lines.",
    purposePage: 60,
    formulas: [quarterRule, columnRule],
  },
  "E-3A": {
    sectionId: "7.2",
    purpose: "The CPFF page of the 3rd quarter 533 report, in hours.",
    purposePage: 60,
    formulas: [quarterRule, cpffRule],
  },
  "E-4": {
    sectionId: "7.2",
    purpose: "The 4th quarter 533 report. The printout shows the form header only, with no data rows.",
    purposePage: 60,
    formulas: [quarterRule],
  },
  "F-1A": {
    sectionId: "7.3",
    purpose:
      "A POP1 report contains months for the first half of the year only. It displays dollar summaries according to program assignments, such as 400 (NASA) and 493 (DOD).",
    purposePage: 62,
    formulas: [
      {
        name: "POP halves",
        expression:
          "POP1 covers the first half of the fiscal year and POP2 the second half. The fiscal year runs October to September.",
        basis: "stated",
        evidence: "Manual text, PDF 62.",
      },
      {
        name: "POP1 layout",
        expression:
          "Amounts are in thousands of dollars through May 1985: FY85 1st QTR, Jan to Jun by month, 4th QTR, then FY86 by quarter. COSTS = sum of the program rows.",
        basis: "reconstructed",
        evidence: "COSTS row in all 18 columns; the grand total 45714 matches POP2 on PDF 136.",
      },
    ],
  },
  "F-2A": {
    sectionId: "7.3",
    purpose: "A POP2 report contains only the months for the second half of the year, with the same program-assignment dollar summaries as POP1.",
    purposePage: 62,
    formulas: [
      {
        name: "POP halves",
        expression:
          "POP1 covers the first half of the fiscal year and POP2 the second half. The fiscal year runs October to September.",
        basis: "stated",
        evidence: "Manual text, PDF 62.",
      },
      {
        name: "POP2 layout",
        expression:
          "THRU JUNE, Jul, Aug, Sep, then Oct 1985 to Mar 1986 by month, then 3rd and 4th QTR. POP1 and POP2 tie exactly.",
        basis: "reconstructed",
        evidence:
          "POP1 1st QTR + Jan to Jun = POP2 THRU JUNE; POP1 4th QTR = POP2 Jul + Aug + Sep; grand total 45714 in both.",
      },
    ],
  },
  "G-1A": {
    sectionId: "7.4.1",
    purpose:
      "The Program cost report displays dollar summaries by fiscal year for each task and program assignment, such as 400 (NASA) and 492 (DOD).",
    purposePage: 64,
    formulas: [
      {
        name: "Task total",
        expression: "TOTAL COST = DOD 493 + Navy 492 + foreign reimbursable 483 + NASA 400.",
        basis: "reconstructed",
        evidence:
          "Rows R and T: 1,908,538 + 1,255 + 2,996 = 1,912,789 for R; the TOTAL row equals R + T in every column (2,404,212).",
      },
    ],
  },
  "G-2A": {
    sectionId: "7.4.2",
    purpose:
      "The Sub-job order cost report displays dollar summaries by fiscal year for each sub-job order and program assignment, such as 400 (NASA) and 493 (DOD).",
    purposePage: 67,
    formulas: [
      {
        name: "Sub-job order split",
        expression:
          "G-2 splits the G-1 task totals by sub-job order letter; each row's TOTAL COST = the sum of its program columns.",
        basis: "reconstructed",
        evidence: "R sub-job rows RB to RZ sum to 1,912,789, identical to the R row of G-1A.",
      },
    ],
  },
  "G-3A": {
    sectionId: "7.4.3",
    purpose:
      "The Work Authorization (W.A.) cost report displays dollar summaries by fiscal year for each W.A. and program assignment, such as 400 (NASA) and 493 (DOD).",
    purposePage: 67,
    formulas: [
      {
        name: "Job-order share",
        expression:
          "Each job order's line = its fiscal-year percent x the W.A. amount; the NASA total is the sum over job orders.",
        basis: "reconstructed",
        evidence:
          "10.000% of 2,820 = 282; job orders E8 0Z and E7206Z each print 282 + 577 = 859, giving a NASA total of 1,718 for EPAB.",
      },
    ],
  },
  "H-1A": {
    sectionId: "7.5.1",
    purpose:
      "The Program hourly report displays hourly summaries by fiscal year for each task and program assignment, such as 400 (NASA) and 492 (DOD).",
    purposePage: 69,
    formulas: [hourSum("Task hours", "Task M row: 91 = NASA 400 91.")],
  },
  "H-2A": {
    sectionId: "7.5.2",
    purpose: "The Sub-job order hourly report displays hourly summaries for fiscal years by sub-job order.",
    purposePage: 70,
    formulas: [hourSum("Sub-job order hours", "Sub-job order row M M: 91 = NASA 400 91.")],
  },
  "H-3A": {
    sectionId: "7.5.3",
    purpose:
      "The Work Authorization (W.A.) hourly report displays hourly summaries by fiscal year for each W.A. and program assignment, such as 400 (NASA) and 493 (DOD).",
    purposePage: 71,
    formulas: [
      {
        name: "W.A. total",
        expression: "W.A. TOTAL = FY 82 + ... + FY 87.",
        basis: "reconstructed",
        evidence: "Every W.A. code on the printout sums to its TOTAL column.",
      },
    ],
  },
  "I-1A": {
    sectionId: "7.6.1",
    purpose:
      "The proration hourly report displays hourly data by vehicle, phase, and program. The regular form shows tasks by mod.",
    purposePage: 73,
    formulas: [proration("PDF 150")],
    printedErrors: [
      "PDF 150: the phase 7 NRL-0492 row prints a subtotal of 1879 on all-zero detail, and its grand total of 1,879 is not the sum of the two phases. The numbers are shown as printed.",
    ],
  },
  "I-2A": {
    sectionId: "7.6.1",
    purpose: "The Special R form of the proration hourly report shows task R only, by subtask number.",
    purposePage: 73,
    formulas: [proration("PDF 152")],
    printedErrors: [
      "PDF 152: every R subtask row prints zeros, yet the SUBTOTAL row prints nonzero values (990, 115, 689, 736, 4798, 788; 8116 in all). The numbers are shown as printed.",
    ],
  },
  "I-3A": {
    sectionId: "7.6.1",
    purpose: "The Sub-job order form of the proration hourly report shows each task by job order and alpha subtask.",
    purposePage: 73,
    formulas: [proration("PDF 154")],
  },
  "J-1A": {
    sectionId: "7.6.2",
    purpose:
      "The cost proration report displays dollar data by vehicle, phase, and program. The regular form shows tasks by mod.",
    purposePage: 74,
    formulas: [
      proration("PDF 156"),
      {
        name: "Task J placement",
        expression: "All of task J's cost lands in the range column.",
        basis: "reconstructed",
        evidence: "Row J of phase 7 prints 32095 under RANGE only.",
      },
    ],
  },
  "J-2A": {
    sectionId: "7.6.2",
    purpose: "The Special R form of the cost proration report shows task R only, by subtask.",
    purposePage: 74,
    formulas: [
      proration("PDF 158"),
      {
        name: "Shared R sub-job costs",
        expression:
          "RZ (R-49) splits one quarter to Navy home support, one quarter to Air Force home support, and one half to vehicle 218 (326883, 326883, 653766). R-53 splits 50/50 (4959 and 4959). The odd unit goes to one side.",
        basis: "reconstructed",
        evidence: "R-49: 326883 + 326883 + 653766 = 1,307,532; R-53: 4959 + 4959 = 9,918.",
      },
    ],
    printedErrors: [
      "PDF 158: the phase 8 total prints 2,929,319 while the subtask rows above it sum to 1,557,747; the engineering support amounts (35842 and 1335730) have no detail row. The numbers are shown as printed.",
    ],
  },
  "J-3A": {
    sectionId: "7.6.2",
    purpose: "The Sub-job order form of the cost proration report shows each task by job order and alpha subtask.",
    purposePage: 74,
    formulas: [proration("PDF 160")],
    printedErrors: [
      "PDF 160: the phase 8 total (5,584,758) is 66,095 short of J-1A (5,650,853), all in vehicle 218. Every other column agrees cell for cell with J-1A. The numbers are shown as printed.",
    ],
  },
  "K-1": {
    sectionId: "7.6.3.1",
    purpose:
      "The DOD Hardware Costs report displays costs for multiple contracts by each hardware task and sub-job order for DOD vehicles only, with a subtotal for each branch.",
    purposePage: 77,
    formulas: [dodRule],
  },
  "K-2": {
    sectionId: "7.6.3.2",
    purpose:
      "The DOD Mission Costs report displays costs for multiple contracts by each mission task and sub-job order for DOD vehicles only, with a subtotal for each branch.",
    purposePage: 78,
    formulas: [dodRule],
  },
  "K-3": {
    sectionId: "7.6.3.3",
    purpose:
      "The DOD Annual Costs report displays costs for tasks that are not hardware or mission type, with fiscal year costs and a subtotal for each branch.",
    purposePage: 79,
    formulas: [dodRule],
  },
  "L-1": {
    sectionId: "7.8",
    purpose:
      "The Balance Sheet report displays the authorized and estimate-to-complete dollars and hours for each task. The contract must have EAC balance sheet records.",
    purposePage: 82,
    formulas: [
      {
        name: "Balance sheet columns",
        expression:
          "AUTHOR. + BALANCE = BUDGETED. BUDGETED + FUTURE = TOTAL. TOTAL WITH FEE varies by task; tasks J, M, and R are exactly x 1.078 and S, W, and X carry no fee.",
        basis: "reconstructed",
        evidence:
          "All 19 tasks in hours and dollars, for example A 7,135,867 + 133 = 7,136,000; the TOTAL row reproduces in all 11 columns. The fee ratio for the other tasks is unexplained.",
      },
    ],
  },
  "M-1": {
    sectionId: "7.9",
    purpose:
      "The Work Authorization Status report searches the financial data base for open records which do not have the status month or the current month. These are typically in need of extending the time of performance or closing.",
    purposePage: 82,
    formulas: [],
  },
  "N-1": {
    sectionId: "7.10",
    purpose:
      "The Processing report computes the sustaining job order percents for each fiscal year. It is usually based upon task H, but can be run on any contract task.",
    purposePage: 83,
    formulas: [
      {
        name: "Sustaining proration",
        expression:
          "PERCENTAGE = vehicle cost / total vehicle cost x 100 (3 decimals). Each sustaining cell = that share x the sustaining job order's total, rounded to whole dollars. SUST. = the sum of the row's rounded cells. WA TOTAL = vehicle cost + SUST.",
        basis: "reconstructed",
        evidence:
          "All 10 rows and all 60 cells; for example 132000 / 312170 = 42.285. The printed column totals are the allocated pool amounts, so they differ by 1 or 2 from the sum of the rounded cells (125220 against 125216); they are shown as printed.",
      },
    ],
  },
  "O-1": {
    sectionId: "7.11.1",
    purpose:
      "The Actual summary report computes the total actual ODC-material dollars for all tasks or any one selected task.",
    purposePage: 85,
    formulas: [
      {
        name: "ODC total",
        expression: "TOTAL = the sum of the task ODC dollar values.",
        basis: "reconstructed",
        evidence: "The 16 task values sum to 9,265,565, as printed.",
      },
    ],
  },
  "O-2": {
    sectionId: "7.11.2",
    purpose:
      "The Task summary report displays all committed and authorized dollars and hours with estimates to complete by percentage for each task.",
    purposePage: 85,
    formulas: [
      {
        name: "Task summary columns",
        expression:
          "Committed EAC = actuals + ETC. Authorized EAC = committed EAC + uncommitted EAC. % ACTUALS/EAC = actuals / authorized EAC x 100, one decimal; 0.0 when the divisor is zero. The parenthesized second line is the contract value.",
        basis: "reconstructed",
        evidence:
          "19 of 19 task rows in hours and dollars; the TOTALS row (83.3 and 76.6 percent) reproduces. The contract values match O-4.",
      },
    ],
  },
  "O-3": {
    sectionId: "7.11.3",
    purpose:
      "The Work Authorization summary report displays all open W.A.'s for each responsible engineer with budgeted, actual, and estimate-to-complete dollars and hours.",
    purposePage: 87,
    formulas: [
      {
        name: "W.A. summary columns",
        expression: "EAC = actuals + ETC. % OF EAC = actuals / EAC x 100, two decimals; 0.00 for a zero divisor.",
        basis: "reconstructed",
        evidence: "3 of 3 rows: 33,067 + 6,930 = 39,997 dollars; 82.67, 83.30, and 60.34 percent in dollars.",
      },
    ],
  },
  "O-4": {
    sectionId: "7.11.4",
    purpose:
      "The Variance report displays all committed and contract values on dollars and hours by percentage for each task.",
    purposePage: 88,
    formulas: [
      {
        name: "Variance",
        expression:
          "EST. VARIANCE = committed EAC - contract value. % VARIANCE/CV = variance / contract value x 100, one decimal; tasks with a zero contract value print 0.0.",
        basis: "reconstructed",
        evidence:
          "19 of 19 task rows in hours and dollars, plus TOTALS. Task A: -3,942 / 115,000 = -3.4 percent in hours and -669,133 / 7,805,000 = -8.6 percent in dollars; the TOTALS row (-14.3 percent) reproduces.",
      },
      {
        name: "Percent time passed",
        expression: "84.62 fits 11 of 13 months for 18 tasks; task S prints 26.09 (6 of 23).",
        basis: "reconstructed",
        evidence: "The task spans are not printed, so the month counts are inferred from the percentages.",
      },
    ],
  },
  "O-5A": {
    sectionId: "7.11.5",
    purpose:
      "The Yearly report displays all the fiscal year costs and hours for an entire contract. Printer output also includes a calendar year cost and hourly summary.",
    purposePage: 89,
    formulas: [
      {
        name: "Fiscal and calendar year totals",
        expression: "The fiscal-year table and the calendar-year table sum to the same grand total.",
        basis: "stated",
        evidence:
          "Manual text, PDF 89. The printed sample totals $69,908,629 and 808,299 hours in both tables (fiscal years 1982 to 1987, calendar years 1981 to 1986). The manual's terminal example on PDF 90 and 91 is a different run, $42,125,002 and 488,247 hours.",
      },
    ],
  },
};
