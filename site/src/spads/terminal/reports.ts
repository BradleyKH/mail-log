import { error533, monthName, parseMonth, quarter533 } from "@/spads/finance/months";
import { lines533, varianceLines, yearlyLines } from "./reportCompute";
import { answer, intOf, type DialogPrompt, type Dialogs, type Session, type Steps } from "./session";
import { computedDate, spacedMonth } from "./screens";
import { spool } from "./spool";

// Screen text of the report generator not held in menus.json, with the
// CR-177949 PDF page each line is copied from.
const T = {
  // PDF 56 to 60: the table reports run the PRIMOS editor on each table file.
  tableEdit: (load: string, file: string) => ["EDIT", "B", `LOAD ${load}`, "EDIT", `FILE ${file}`],
  // PDF 61, 62.
  taskProcessed: (t: string) => `TASK ${t} NOW BEING PROCESSED.`,
  subTotals: "*** TABLE SUB-TOTALS & OUTPUT FILE FOR PRINTING NOW BEING BUILT ***",
  // PDF 66, 68.
  recordsComputed: (n: number) => `${n} RECORDS COMPUTED.`,
  // PDF 80.
  dodFiscalYears: "--- BEGINNING AND ENDING FISCAL YEARS (74-88) --->",
  // PDF 81.
  discrepancyTitle: "DISCREPANCY REPORT GENERATOR FOR CONTRACT NAS1-16200",
  discrepancySearch: "SEARCH NOW BEGINNING - STAND BY.",
  discrepancyFound: (sysnum: number) => `RECORD NO. ${sysnum} FOUND FOR SPOOL`,
  discrepancyCount: (n: number) => `${n} RECORDS FOUND WITH DISCREPANCIES.`,
  // PDF 82.
  balanceComputed: (n: number) => `${n} RECORDS COMPUTED`,
  // PDF 83.
  waStatusLine: (month: string, sysnum: string) => `${spacedMonth(month)}    SYS NO= ${sysnum}`,
  // PDF 84.
  processingRecord: (sysnum: string) => `RECORD NO. = ${sysnum}`,
  // PDF 86, 88.
  taskWorking: (t: string) => `TASK ${t} NOW WORKING`,
  // PDF 87, 88.
  waSummaryFound: (n: number) => `${n} RECORDS FOUND FOR W.A. SUMMARY REPORT`,
  waSummaryBook: ["WA SUMMARY REPORT WITH OR WITHOUT BOOK OF RECORDS", "( WITH OR OUT )"],
  waSummaryBookSpool: "BOOK LISTING OF RECORDS SHOULD BE SPOOLED TO SYSTEM PRINTER",
  waSummaryBrief: "BRIEF LISTING OF RECORDS BY ENGINEER",
  // PDF 90.
  yearlyTitle: "MIN-MAX-YEAR REPORT BY FISCAL YEAR",
  yearlyKind: "DOLLARS AND HOURS REPORT",
};

// The task list the 533, task summary, and variance runs print, J twice as printed (PDF 61, 62, 86, 88).
const PRINTED_TASKS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "J", "L", "M", "N", "P", "R", "T", "V", "W", "X"];
const VARIANCE_TASKS = [...new Set(PRINTED_TASKS)];

// The record numbers the printed discrepancy run found (PDF 81).
const PRINTED_DISCREPANCIES = [22, 23, 27, 32, 33, 48, 54, 72, 245];

// NASA and United Kingdom vehicles in the proration printouts (PDF 150 to 160); the rest are DOD.
const NON_DOD_VEHICLES = new Set(["198", "201", "202", "203", "206"]);

const TABLES: { load: string; file: string; appendix: string; page: number }[] = [
  { load: "FEETBL", file: "FEETABLE", appendix: "D-1", page: 122 },
  { load: "RATETC", file: "RATETABLE", appendix: "D-2", page: 123 },
  { load: "SSCST", file: "SUSTABLE", appendix: "D-3", page: 124 },
  { load: "F.ANAL>PRJO", file: "F.ANAL>PROJOTABLE", appendix: "D-4", page: 125 },
  { load: "TIMETBL", file: "TIMETABLE", appendix: "D-5", page: 126 },
];

type A = Record<string, string>;

const digits = (v: string | undefined) => (v ?? "").replace(/\D/g, "").split("");
const menu = (...keys: string[]) => (s: Session) => keys.flatMap((k) => s.menu(k));
const one = (key: string) => (s: Session) => s.menu(key).slice(-1);

/** Up to `max` repeated prompts that stop at a blank answer. */
function loop(prefix: string, first: DialogPrompt["lines"], next: DialogPrompt["lines"], when: (a: A) => boolean, max = 26): DialogPrompt[] {
  return Array.from({ length: max }, (_, i) => ({
    key: `${prefix}${i}`,
    lines: i === 0 ? first : next,
    when: (a: A) => when(a) && (i === 0 || (a[`${prefix}${i - 1}`] ?? "") !== ""),
  }));
}

const collected = (a: A, prefix: string) =>
  Object.keys(a)
    .filter((k) => k.startsWith(prefix) && /\d+$/.test(k.slice(prefix.length)))
    .sort((x, y) => Number(x.slice(prefix.length)) - Number(y.slice(prefix.length)))
    .map((k) => a[k])
    .filter(Boolean);

const statusPrompt: DialogPrompt = { key: "status", lines: menu("reportStatusMonth") };
const optionsPrompt = (key: string, menuKey: string): DialogPrompt => ({ key, lines: (s) => ["", ...s.menu(menuKey), "", s.menu("reportEnterOptions")[0]] });

/** Menus 1 to 3 with their CERTAIN follow-ups; `tasksAt` is the menu-1 position of TASKS, or -1. */
function menus123(menu1: string, tasksAt: number): DialogPrompt[] {
  return [
    optionsPrompt("m1", menu1),
    ...(tasksAt < 0 ? [] : loop("task", menu("reportTaskEntry"), one("reportEnterTask"), (a) => digits(a.m1)[tasksAt] === "2")),
    optionsPrompt("m2", "reportMenu2"),
    ...loop("prog", menu("reportProgramNumbers"), () => ["--->"], (a) => digits(a.m2)[2] === "2"),
    optionsPrompt("m3", "reportMenu3"),
    { key: "jo", lines: one("reportJoNumber"), when: (a) => digits(a.m3)[0] === "2" },
  ];
}

const computePrompt: DialogPrompt = { key: "mode", lines: (s) => ["", ...s.menu("reportComputeMode"), "", s.menu("reportEnterOption")[0]] };

/** The run header the program prints before a compute-while-I-wait report (PDF 65, 66, 90). */
function runHeader(s: Session, title: string[], a: A, feeAt = 2): string[] {
  const m1 = digits(a.m1);
  const m2 = digits(a.m2);
  const m3 = digits(a.m3);
  const tasks = collected(a, "task");
  const progs = collected(a, "prog");
  return [
    "CONTRACT: NAS1-16200",
    ...title,
    m1[1] === "2" ? "BASED ON ACTUALS" : "BASED ON EAC'S",
    m2[1] === "2" ? "MANUAL RECORDS ONLY" : m2[1] === "3" ? "SUSTAIN RECORDS ONLY" : "ALL RECORDS",
    tasks.length ? `TASK(S) ${tasks.join(" ")}` : "ALL TASKS",
    feeAt >= 0 && m1[feeAt] === "2" ? "REPORT WITHOUT FEE" : "REPORT WITH FEE",
    progs.length ? `PROGRAM NO: ${progs.join(" ")}` : "ALL PROGRAMS",
    a.jo ? `J.O.: ${a.jo}` : "ALL JOB ORDERS",
    m3[1] === "2" ? "ONLY COMPLETED W.A.'S" : m3[1] === "3" ? "ONLY OPEN W.A.'S" : "ALL W.A.'S",
    "DATE COMPUTED:",
    computedDate(s.now()),
    "",
    s.menu("reportSearchProgress")[0],
    ...recordsComputed(s, 25),
  ];
}

function recordsComputed(s: Session, every: number): string[] {
  const n = s.store.list().length;
  const out: string[] = [];
  for (let i = every; i <= n; i += every) out.push(T.recordsComputed(i));
  return out;
}

/** Ends a dashed-prompt report: option 1 prints the run header first, 2 and 3 submit it. */
function computeFinish(s: Session, a: A, then: string, sample: string, header: () => string[]): void {
  const mode = intOf(a.mode) ?? 1;
  if (mode === 1) s.lines(header());
  spool(s, { style: "dash", then, sample, computeMode: mode });
}

function printedTaskLines(s: Session, a: A, line: (t: string) => string): void {
  const tasks = collected(a, "t");
  const list = !tasks.length || tasks.some((t) => t.toUpperCase() === "ALL") ? PRINTED_TASKS : tasks.map((t) => t.toUpperCase());
  s.lines(list.map(line));
}

const taskListPrompts = loop("t", menu("reportSummaryTaskList"), menu("reportSummaryTaskList"), () => true).map((p, i) => ({
  ...p,
  when: (a: A) => i === 0 || (!!a[`t${i - 1}`] && a[`t${i - 1}`].toUpperCase() !== "ALL"),
}));

const selectedTasks = (a: A) => {
  const tasks = collected(a, "t").map((t) => t.toUpperCase());
  return !tasks.length || tasks.includes("ALL") ? VARIANCE_TASKS : tasks;
};

function costHourDialog(kind: "cost" | "hour", report: 1 | 2): Dialogs[string] {
  const then = kind === "cost" ? "report.cost" : "report.hour";
  const sample = `${kind === "cost" ? "G" : "H"}-${report}A`;
  return {
    quit: then,
    prompts: [
      statusPrompt,
      { key: "fys", lines: menu("reportFiscalYears") },
      ...menus123(kind === "cost" ? "reportMenu1" : "reportMenu1Hours", kind === "cost" ? 3 : 2),
      { key: "scope", lines: (s) => ["", ...s.menu(kind === "cost" ? "reportCostScope" : "reportHoursScope"), "", s.menu("reportEnterOption")[0]] },
      computePrompt,
    ],
    finish: (s, a) =>
      computeFinish(s, a, then, sample, () =>
        runHeader(
          s,
          [kind === "cost" ? "COST REPORT BY FISCAL YEAR" : "HOURLY REPORT BY FISCAL YEAR", report === 1 ? "PROGRAM REPORT" : "SUB-JOBORDER REPORT", "05 FISCAL YEARS 82-86 (ALL)"],
          a,
          kind === "cost" ? 2 : -1,
        ),
      ),
  };
}

function waDialog(kind: "cost" | "hour"): Dialogs[string] {
  const certainFrom = kind === "cost" ? 7 : 4;
  const opt = (a: A, key: string) => intOf(a[key] ?? "") ?? 1;
  return {
    quit: kind === "cost" ? "report.cost" : "report.hour",
    prompts: [
      { key: "status", lines: menu("reportWaStatusMonth") },
      { key: "fys", lines: menu("reportWaFiscalYears") },
      { key: "m1", lines: menu(kind === "cost" ? "reportWaMenu1Fee" : "reportWaMenu1") },
      { key: "wa", lines: menu("reportWaNumber"), when: (a) => opt(a, "m1") >= certainFrom },
      { key: "m2", lines: menu("reportWaMenu2") },
      { key: "task", lines: menu("reportWaTask"), when: (a) => opt(a, "m2") >= 5 },
      { key: "prog", lines: menu("reportWaProgramNumber"), when: (a) => [3, 4, 7, 8].includes(opt(a, "m2")) },
      { key: "jo", lines: one("reportJoNumber"), when: (a) => opt(a, "m2") % 2 === 0 },
      { key: "m3", lines: menu("reportWaMenu3") },
    ],
    finish: (s) => {
      s.lines(recordsComputed(s, 25));
      spool(s, { style: "record", then: kind === "cost" ? "report.cost" : "report.hour", sample: kind === "cost" ? "G-3A" : "H-3A" });
    },
  };
}

function prorationDialog(kind: "hours" | "cost"): Dialogs[string] {
  const then = "report.proration";
  return {
    quit: then,
    prompts: [
      { key: "which", lines: menu(kind === "hours" ? "reportProrationHours" : "reportProrationCost"), check: (t) => (intOf(t) !== null && intOf(t)! >= 1 && intOf(t)! <= 3 ? null : "") },
      { key: "status", lines: (s, a) => [...(a.which === "2" ? s.menu("reportTaskRNote") : []), ...s.menu("reportStatusMonth")] },
      ...(kind === "hours" ? menus123("reportMenu1Proration", -1) : menus123("reportMenu1", 3)),
      computePrompt,
    ],
    finish: (s, a) => {
      const which = intOf(a.which) ?? 1;
      const sample = `${kind === "hours" ? "I" : "J"}-${which}A`;
      const title = kind === "hours" ? ["PRORATION OF HOURS", "SPECIAL-R PRORATION OF HOURS", "SUB-PRORATION OF HOURS"] : ["PRORATION OF COSTS", "SPECIAL-R PRORATION OF COSTS", "SUB-PRORATION OF COSTS"];
      computeFinish(s, a, then, sample, () => runHeader(s, [title[which - 1]], a, kind === "cost" ? 2 : -1));
    },
  };
}

function dodHeader(s: Session, title: string, extra: string[]): string[] {
  return [title, ...extra, "REPORT WITH FEE", "DATE COMPUTED:", computedDate(s.now()), "", s.menu("reportSearchProgress")[0], "CONTRACT: NAS1-16200", ...recordsComputed(s, 50)];
}

function dodDialog(which: 1 | 2): Dialogs[string] {
  return {
    quit: "report.dod",
    prompts: [
      { key: "veh", lines: (s) => [...s.menu("reportVehicles"), "", s.menu("reportEnterOptions")[0]] },
      ...loop(
        "v",
        one("reportEnterVehicle"),
        one("reportEnterVehicle"),
        (a) => a.veh === "2",
        1,
      ).map((p) => ({
        ...p,
        check: (t: string) => (NON_DOD_VEHICLES.has(t.trim()) ? ` **** ERROR ****  ${t.trim()} IS NOT A DOD VEHICLE` : null),
      })),
      computePrompt,
    ],
    finish: (s, a) => {
      const title = which === 1 ? "DOD HARDWARE COST REPORT" : "DOD MISSION COST REPORT";
      computeFinish(s, a, "report.dod", which === 1 ? "K-1" : "K-2", () => dodHeader(s, title, [`TASK(S) ${a.v0 || "ALL"}`]));
    },
  };
}

export const reportDialogs: Dialogs = {
  "report.533": {
    prompts: [
      { key: "fpi4", lines: (s) => s.menu("report533Prompts").slice(0, 3) },
      { key: "cpff4", lines: (s) => s.menu("report533Prompts").slice(3, 4) },
      { key: "fpi5a", lines: (s) => s.menu("report533Prompts").slice(4, 9) },
      { key: "cpff5a", lines: (s) => s.menu("report533Prompts").slice(9, 10) },
      { key: "fpi5b", lines: (s) => s.menu("report533Prompts").slice(10, 13) },
      { key: "cpff5b", lines: (s) => s.menu("report533Prompts").slice(13, 14) },
    ],
    finish: (s) => {
      s.print("");
      s.show("report533Begin");
      s.lines(PRINTED_TASKS.map(T.taskProcessed));
      s.print(T.subTotals);
      spool(s, { style: "record", then: "report.533print" });
    },
  },
  "report.pop": {
    quit: "report.main",
    prompts: [
      { key: "pop", lines: menu("reportPopSelect"), check: (t) => (["1", "2"].includes(t.trim()) ? null : "") },
      statusPrompt,
      { key: "fy", lines: menu("reportFiscalYear") },
      ...menus123("reportMenu1", 3),
      computePrompt,
    ],
    finish: (s, a) => {
      const pop = a.pop === "2" ? 2 : 1;
      computeFinish(s, a, "report.main", pop === 1 ? "F-1A" : "F-2A", () =>
        runHeader(s, [`POP ${pop} REPORT (${pop === 1 ? "FIRST" : "SECOND"} HALF OF FISCAL YEAR)`], a),
      );
    },
  },
  "report.cost1": costHourDialog("cost", 1),
  "report.cost2": costHourDialog("cost", 2),
  "report.hour1": costHourDialog("hour", 1),
  "report.hour2": costHourDialog("hour", 2),
  "report.costWa": waDialog("cost"),
  "report.hourWa": waDialog("hour"),
  "report.prorHours": prorationDialog("hours"),
  "report.prorCost": prorationDialog("cost"),
  "report.dod1": dodDialog(1),
  "report.dod2": dodDialog(2),
  "report.dod3": {
    quit: "report.dod",
    prompts: [{ key: "fys", lines: [T.dodFiscalYears] }, computePrompt],
    finish: (s, a) => computeFinish(s, a, "report.dod", "K-3", () => dodHeader(s, "DOD ANNUAL COST REPORT", ["15 FISCAL YEARS 74-88 (ALL)"])),
  },
  "report.processing": {
    prompts: [
      { key: "status", lines: menu("reportProcessingStatusMonth") },
      { key: "basis", lines: menu("reportProcessingBasis") },
      { key: "fee", lines: menu("reportProcessingFee") },
      { key: "task", lines: menu("reportProcessingTask") },
    ],
    finish: (s, a) => {
      s.show("reportSearchProgress");
      const task = (a.task ?? "").toUpperCase();
      s.lines(s.store.list().filter((r) => r.task === task).map((r) => T.processingRecord(r.sysnum)));
      spool(s, { style: "record", then: "report.main", sample: "N-1" });
    },
  },
  "report.actual": {
    prompts: [{ key: "task", lines: menu("reportSummaryTask") }],
    finish: (s) => spool(s, { style: "record", then: "report.summary", sample: "O-1" }),
  },
  "report.taskSummary": {
    prompts: taskListPrompts,
    finish: (s, a) => {
      printedTaskLines(s, a, T.taskWorking);
      s.show("reportOutputFormatting");
      spool(s, { style: "record", then: "report.summary", sample: "O-2" });
    },
  },
  "report.waSummary": {
    prompts: [
      { key: "task", lines: menu("reportSummaryTask") },
      { key: "eng", lines: menu("reportSummaryEngineer") },
      {
        key: "book",
        lines: (s, a) => {
          const task = (a.task ?? "ALL").toUpperCase();
          const eng = (a.eng ?? "ALL").toUpperCase();
          const open = s.store
            .list()
            .filter((r) => r.status !== "" && !r.complete && (task === "ALL" || r.task === task) && (eng === "ALL" || r.nr === eng));
          return [T.waSummaryFound(open.length), ...T.waSummaryBook];
        },
      },
    ],
    finish: (s, a) => {
      s.show("reportOutputFormatting");
      if (/^W/.test(answer(a.book ?? ""))) {
        s.print(T.waSummaryBookSpool);
        spool(s, { style: "record", then: "report.waBrief" });
        return;
      }
      s.go("report.waBrief");
    },
  },
  "report.variance": {
    prompts: taskListPrompts,
    finish: (s, a) => {
      printedTaskLines(s, a, T.taskWorking);
      s.show("reportOutputFormatting");
      s.ctx.scratch = { ...s.ctx.scratch, varianceTasks: selectedTasks(a) };
      spool(s, { style: "record", then: "report.variancePrint" });
    },
  },
  "report.yearly": {
    prompts: [...menus123("reportMenu1", 3), computePrompt],
    finish: (s, a) => {
      const mode = intOf(a.mode) ?? 1;
      if (mode === 1) {
        const m1 = digits(a.m1);
        const header = runHeader(s, [T.yearlyTitle, T.yearlyKind], a);
        s.lines(header);
        s.lines(yearlyLines(s.store.list(), m1[1] === "2" ? "act" : "eac", m1[2] !== "2"));
        s.hint(
          "Computed from the store's sample records only. The manual's printed terminal run (CR-177949, PDF 90 to 91) covers the full 1985 data base: MAR 1981 to OCT 1986, $42,125,002 and 488,247 hours.",
        );
      }
      spool(s, { style: "dash", then: "report.summary", sample: mode === 1 ? undefined : "O-5A", computeMode: mode });
    },
  },
};

/** A submenu of the report generator: prints its menu, a return goes back to the generator. */
function submenu(key: string, choose: (s: Session, n: number) => boolean): Steps[string] {
  return {
    enter: (s) => {
      s.print("");
      s.show(key);
    },
    input: (s, text) => {
      if (answer(text) === "") return s.go("report.main");
      const n = intOf(text);
      if (n === null || !choose(s, n)) s.go(s.state.step);
    },
  };
}

export const reportSteps: Steps = {
  "report.main": {
    enter: (s) => {
      s.print("");
      s.show("reportMain");
    },
    input: (s, text) => {
      if (answer(text) === "") return s.go("contract");
      switch (intOf(text)) {
        case 1: return s.go("report.tables");
        case 2: return start533(s);
        case 3: return s.startDialog("report.pop");
        case 4: return s.go("report.cost");
        case 5: return s.go("report.hour");
        case 6: return s.go("report.proration");
        case 7: return discrepancy(s);
        case 8: return balanceSheet(s);
        case 9: return waStatus(s);
        case 10: return s.startDialog("report.processing");
        case 11: return s.go("report.summary");
        default: return s.go("report.main");
      }
    },
  },
  "report.tables": submenu("reportTables", (s, n) => {
    const t = TABLES[n - 1];
    if (!t) return false;
    s.lines(T.tableEdit(t.load, t.file));
    spool(s, {
      style: "record",
      then: "report.tables",
      sampleNote: `The manual reproduces this table report as Appendix ${t.appendix} (CR-177949, PDF ${t.page}), in the Archive.`,
    });
    return true;
  }),
  "report.cost": submenu("reportCost", (s, n) => {
    if (n < 1 || n > 3) return false;
    s.startDialog(n === 3 ? "report.costWa" : `report.cost${n}`);
    return true;
  }),
  "report.hour": submenu("reportHour", (s, n) => {
    if (n < 1 || n > 3) return false;
    s.startDialog(n === 3 ? "report.hourWa" : `report.hour${n}`);
    return true;
  }),
  "report.proration": submenu("reportProration", (s, n) => {
    if (n === 1) s.startDialog("report.prorHours");
    else if (n === 2) s.startDialog("report.prorCost");
    else if (n === 3) s.go("report.dod");
    else return false;
    return true;
  }),
  "report.dod": {
    ...submenu("reportDod", (s, n) => {
      if (n < 1 || n > 3) return false;
      s.startDialog(`report.dod${n}`);
      return true;
    }),
    input: (s, text) => {
      if (answer(text) === "") return s.go("report.proration");
      const n = intOf(text);
      if (n === null || n < 1 || n > 3) return s.go("report.dod");
      s.startDialog(`report.dod${n}`);
    },
  },
  "report.summary": submenu("reportSummary", (s, n) => {
    const ids = ["report.actual", "report.taskSummary", "report.waSummary", "report.variance", "report.yearly"];
    const id = ids[n - 1];
    if (!id) return false;
    s.startDialog(id);
    return true;
  }),
  "report.533print": {
    enter: (s) => {
      if (s.ctx.scratch?.spooled === false) {
        s.hint("Nothing was spooled, so there is no printout to show.");
        return s.go("report.main");
      }
      const q = quarter533(parseMonth(s.state.statusMonth)) ?? 1;
      s.hint(
        `Computed from the store's sample records, in dollars, as a reconstruction of the 533 columns. The manual's printed ${["1ST", "2ND", "3RD", "4TH"][q - 1]} QUARTER sample is Appendix E-${q} in the Archive.`,
      );
      s.lines(lines533(s.store.list(), s.store.tables(), s.state.statusMonth));
      s.go("report.main");
    },
    input: () => {},
  },
  "report.variancePrint": {
    enter: (s) => {
      if (s.ctx.scratch?.spooled === false) {
        s.hint("Nothing was spooled, so there is no printout to show.");
        return s.go("report.main");
      }
      const tasks = (s.ctx.scratch?.varianceTasks as string[] | undefined) ?? VARIANCE_TASKS;
      s.hint(
        "Computed from the store's sample records: contract values from the time table, committed EAC from each record's last month. The manual's printed sample is Appendix O-4 (CR-177949, PDF 170).",
      );
      s.lines(varianceLines(s.store.list(), s.store.tables(), tasks));
      s.go("report.summary");
    },
    input: () => {},
  },
  "report.waBrief": {
    enter: (s) => {
      s.print(T.waSummaryBrief);
      spool(s, { style: "record", then: "report.summary", sample: "O-3" });
    },
    input: () => {},
  },
};

function start533(s: Session): void {
  const status = parseMonth(s.state.statusMonth);
  if (quarter533(status) === null) {
    s.print(error533(status));
    s.hint(`The 533 runs only for status months SEP, DEC, MAR, and JUN. The status month is ${monthName(status)}; the DALLAS TAPE update (UPDATE option 1) sets it.`);
    return s.go("report.main");
  }
  s.print("");
  s.startDialog("report.533");
}

function discrepancy(s: Session): void {
  s.print(T.discrepancyTitle);
  s.print(T.discrepancySearch);
  s.hint("The record numbers below are the manual's printed run (CR-177949, PDF 81), not a search of this session's data.");
  s.lines(PRINTED_DISCREPANCIES.map(T.discrepancyFound));
  s.print(T.discrepancyCount(PRINTED_DISCREPANCIES.length));
  spool(s, {
    style: "record",
    then: "report.main",
    sampleNote: "Records the discrepancy report finds print as Entire Records; the manual's example is Appendix C-1 (CR-177949, PDF 121).",
  });
}

function balanceSheet(s: Session): void {
  s.print(spacedMonth(s.state.statusMonth));
  const n = s.store.list().length;
  for (let i = 30; i <= n; i += 30) s.print(T.balanceComputed(i));
  spool(s, { style: "record", then: "report.main", sample: "L-1" });
}

function waStatus(s: Session): void {
  const month = s.state.statusMonth;
  s.show("reportWaStatusSearch");
  for (const r of s.store.list()) {
    if (r.status === "" || r.complete) continue;
    if (r.months.some((m) => m.month === month)) continue;
    s.print(T.waStatusLine(month, r.sysnum));
  }
  spool(s, { style: "record", then: "report.main", sample: "M-1" });
}
