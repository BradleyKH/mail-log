// Replays the terminal sessions printed in CR-177949 (SPADS Vol. II,
// Contract Analysis) and checks the program's lines against the print.
// PDF page numbers are noted on each session.
import { beforeAll, describe, expect, it } from "vitest";
import { spadsMenus, spadsRecords, spadsReports, spadsTables } from "@/content/load";
import { createSpadsEngine } from "./engine";
import { createSpadsStore } from "./store";
import type { SpadsData, SpadsEngine, SpadsState, SpadsStore } from "./types";

let data: SpadsData;

beforeAll(async () => {
  const [menus, records, tables, reports] = await Promise.all([spadsMenus(), spadsRecords(), spadsTables(), spadsReports()]);
  if (!menus || !records || !tables || !reports) throw new Error("SPADS content missing");
  data = { menus, records, tables, reports };
});

// The printed sessions were run on Wednesday, June 27 1984 (the date the added records carry).
const NOW = () => new Date(1984, 5, 27, 9, 41, 0);

/** Comparison form: spacing around colons and equals signs and runs of spaces ignored, star rules shortened. */
const norm = (text: string) =>
  text
    .replace(/\s*([:=])\s*/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\*{10,}$/, "*****");

const m = (key: string): string[] => {
  const v = data.menus[key];
  return typeof v === "string" ? [v] : v;
};

function setup(exclude: string[] = []): { engine: SpadsEngine; store: SpadsStore } {
  const store = createSpadsStore(data, { exclude });
  return { engine: createSpadsEngine({ data, store, now: NOW }), store };
}

/** Types each input in turn; returns the state and the non-blank program lines in comparison form. */
function type(engine: SpadsEngine, state: SpadsState, inputs: string[]) {
  const program: string[] = [];
  const hints: string[] = [];
  for (const input of inputs) {
    const r = engine.submit(state, input);
    state = r.state;
    for (const line of r.output) {
      if (line.kind === "program" && line.text.trim()) program.push(norm(line.text));
      if (line.kind === "hint") hints.push(line.text);
    }
  }
  return { state, program, hints };
}

const LOGIN = ["LOGIN DKH", "", ""];
const TO_ANALYSIS = [...LOGIN, "8", "10"];

function atAnalysis(engine: SpadsEngine): SpadsState {
  return type(engine, engine.start().state, TO_ANALYSIS).state;
}

/** Expected lines in comparison form, blank lines dropped. */
const expected = (...parts: (string | string[])[]) => parts.flat().filter((l) => l.trim()).map(norm);

const jo = (code: string, progno: string, ...values: number[]) => {
  const v = [...values, 0, 0, 0, 0, 0, 0, 0, 0, 0].slice(0, 9).map((n) => n.toFixed(3));
  return [`${code} ${progno} ${v.slice(0, 5).join(" ")}`, v.slice(5).join(" ")];
};

const SYS6_JOBS: [string, string, number][] = [
  ["E6000A", "49002026600000400", 11.063],
  ["E7000A", "49002027700000400", 30.583],
  ["E6186A", "49004080600000483", 4.431],
  ["E6188A", "49004160600000700", 2.683],
  ["E6189A", "49002020600000400", 7.211],
  ["E6191A", "49002021600000400", 6.876],
  ["E7193A", "49002023700000400", 14.537],
  ["E7194A", "49002025700000400", 6.767],
  ["E7196A", "49002021700000400", 9.578],
  ["E7198A", "49004172700000483", 6.271],
];

const header = (o: { date: string; jos: string; months: string; sys: string; title: string; task: string; fee: string }) => [
  `DATE: ${o.date} STATUS:AUT J.O.S:${o.jos} MONTHS:${o.months} SYS ITEM NO: ${o.sys}`,
  `TITLE:${o.title}`,
  "MOD: , , , CONTRACTOR:VOUGHT",
  "REMRK:",
  "NASA RESPONSIBLE ENGR: KTR RESPONSIBLE ENGR:",
  "RBK: PURCHASE REQUEST:",
  `CONTRACT/PURCHASE ORDER:NAS1-12500 TASK:${o.task} SUBTASK: .`,
  "WORK AUTHORITY:3381 WA CODE:AE COMPLETED TASK:YES TABLE:SUST",
  "R.T. HRS: 0 R.T. DOLLARS: 0",
  `TOTAL AUT HOURS: TOTAL AUT DOLLARS: FEE: ${o.fee}%`,
];

// After the MOD/ADD session: E7194A and E7196A deleted, E7198A renamed E7200A with 100% in FY2.
const MODADD_JOBS = (fy2: number) => [
  ...SYS6_JOBS.filter(([c]) => c !== "E7194A" && c !== "E7196A" && c !== "E7198A").flatMap(([c, p, v]) => jo(c, p, 0, v)),
  ...jo("E7200A", "49004172700000483", 0, 6.271, fy2),
];

const MOD_ADD_INPUTS = [
  "1", "5", "6", "", "", "",
  "1", "1", "1", "15", "Z", "TITLE", "NO", "6", "TEST ENTRY FOR SAMPLE MOD / ADD", "",
  "2", "2", "PART", "E7149A", "E7194A", "E7196A", "",
  "3", "JO", "1", "E7200A", "E7200A", "E7198A", "",
  "2", "3", "6", "100.000", "E7200A", "",
  "", "N",
];

const SPREAD_ROWS: [string, number, number][] = [
  ["AUG 75", 10, 1000], ["SEP 75", 13, 2900], ["OCT 75", 16, 4800], ["NOV 75", 19, 6700], ["DEC 75", 22, 8600],
  ["JAN 76", 25, 10500], ["FEB 76", 28, 12400], ["MAR 76", 31, 14300], ["APR 76", 34, 16200], ["MAY 76", 42, 23800],
  ["JUN 76", 50, 31400], ["JUL 76", 58, 39000], ["AUG 76", 66, 46600], ["SEP 76", 74, 54200], ["OCT 76", 82, 61800],
  ["NOV 76", 90, 69400], ["DEC 76", 98, 77000],
];
const spreadRow = ([month, h, d]: [string, number, number]) => `${month} ${h} ${d} 0 0 0 0`;

const REPLACE_INPUTS = [
  "1", "5", "615", "", "", "",
  "1", "2", "", "Y", "4", "Y", "2",
  "AUG75", "10", "1000", "DEC76", "100", "77000", "N", "25", "20",
  "Y", "3", "DEC 76 100 77000", "", "N",
];

describe("login and menus (PDF 12 to 20)", () => {
  it("logs in through PRIMOS to the SPADS main menu", () => {
    const { engine } = setup();
    const start = engine.start();
    expect(start.output.map((l) => l.text)).toEqual(["OK, LOGIN PLEASE"]);
    const { state, program } = type(engine, start.state, LOGIN);
    expect(program).toContain("Password?");
    expect(program).toContain(norm("DKH (USER 4) LOGGED IN WED, 27 06 84 09:41:00"));
    expect(program).toContain("ENTER PASSWORD >");
    expect(program).toEqual(expect.arrayContaining(expected(m("systemNews"))));
    expect(program).toContain(norm("Welcome DKH       to the PRIME 750  SPADS Main Menu"));
    expect(program[program.length - 1]).toBe("Enter Option Number >");
    expect(state.step).toBe("spadsMain");
    expect(state.user).toBe("DKH");
  });

  it("does not echo either password", () => {
    const { engine } = setup();
    let state = type(engine, engine.start().state, ["LOGIN DKH"]).state;
    const r = engine.submit(state, "SECRET");
    state = r.state;
    expect(r.output.some((l) => l.text.includes("SECRET"))).toBe(false);
    expect(engine.submit(state, "SECRET2").output.some((l) => l.text.includes("SECRET2"))).toBe(false);
  });

  it("navigates SPADS main, contract selection, and the analysis menu", () => {
    const { engine } = setup();
    const { state, program } = type(engine, type(engine, engine.start().state, LOGIN).state, ["8", "10"]);
    expect(program.slice(0, m("contractSelect").filter((l) => l.trim()).length)).toEqual(expected(m("contractSelect")));
    expect(program.slice(-expected(m("analysisMain")).length)).toEqual(expected(m("analysisMain")));
    expect(state.step).toBe("analysis");
    const back = type(engine, state, ["0", "99"]);
    expect(back.program).toEqual(expect.arrayContaining(expected(m("systemNews"))));
    expect(back.state.step).toBe("spadsMain");
  });

  it("hints for other contracts and main-menu programs, and logs out", () => {
    const { engine } = setup();
    const main = type(engine, engine.start().state, LOGIN).state;
    const other = type(engine, main, ["9", "1", "8", "3"]);
    expect(other.hints.some((h) => h.includes("MAIL LOG"))).toBe(true);
    expect(other.hints.some((h) => h.includes("CR-177948"))).toBe(true);
    expect(other.hints.some((h) => h.includes("NAS1-16200"))).toBe(true);
    expect(other.state.step).toBe("contract");
    const queue = type(engine, other.state, ["33", ""]);
    expect(queue.program).toContain(norm("SMH    002  9:46  TWO.1                2           COMP  11:00  A"));
    expect(queue.program).toContain(norm("Return to Continue:"));
    const out = type(engine, queue.state, ["0"]);
    expect(out.program).toEqual([norm("DKH    (4) LOGGED OUT  062784    09:41:00")]);
    expect(out.state.step).toBe("exit");
  });

  it("redisplays the analysis menu after an invalid option", () => {
    const { engine } = setup();
    const { state, program, hints } = type(engine, atAnalysis(engine), ["7"]);
    expect(program).toEqual(expected(m("analysisMain")));
    expect(hints).toEqual(["That is not one of this menu's options."]);
    expect(state.step).toBe("analysis");
  });
});

describe("the printed MOD, delete, and input sessions (PDF 31 to 51)", () => {
  // The four sessions run in the manual's order against one data base, so the
  // record MOD/ADD creates is the one REPLACE and DELETE retrieve, and INPUT
  // then reuses its number. The INPUT sample record is left out of the seed.
  let engine: SpadsEngine;
  let store: SpadsStore;
  let state: SpadsState;

  beforeAll(() => {
    ({ engine, store } = setup(["615"]));
    state = atAnalysis(engine);
  });

  it("MOD/ADD (PDF 31 to 36) ends with SYSTEM ITEM NUMBER = 615", () => {
    const run = type(engine, state, MOD_ADD_INPUTS);
    state = run.state;
    expect(run.hints.filter((h) => h.startsWith("Site choice:"))).toHaveLength(1);
    const original = header({ date: "SAT, OCT 16 1982", jos: "10", months: " 1", sys: "6", title: "PROGRAM MANAGEMENT (SPAC)", task: "A", fee: "7.190" });
    const retitled = header({ date: "SAT, OCT 16 1982", jos: "10", months: " 1", sys: "6", title: "TEST ENTRY FOR SAMPLE MOD / ADD", task: "Z", fee: "0.000" });
    const eight = header({ date: "SAT, OCT 16 1982", jos: " 8", months: " 1", sys: "6", title: "TEST ENTRY FOR SAMPLE MOD / ADD", task: "Z", fee: "0.000" });
    const deletePrompt = m("jobOrderDeletePrompt");
    const changePrompt = m("jobOrderChangePrompt");
    expect(run.program).toEqual(
      expected(
        m("retrieveFields"), m("enterField"), m("enterValue"), m("enterField"),
        original, m("more"), SYS6_JOBS.flatMap(([c, p, v]) => jo(c, p, 0, v)), m("more"),
        m("hoursDollarsHeader"), "OCT 76 0 67500 0 67426 0 67426",
        m("recordActions"), m("modMethod"), m("modSection"),
        m("retrieveFields"), m("enterField"), m("enterValue"), m("enterField"),
        m("retrieveFieldHelp").slice(0, 22), "MORE? >", m("enterField"),
        "INPUT TITLE (UP TO 72 CHARACTERS)", m("enterField"),
        retitled, SYS6_JOBS.flatMap(([c, p, v]) => jo(c, p, 0, v)),
        m("modSection"), m("jobOrderActions"), m("jobOrderDeleteScope"),
        deletePrompt, "JO: E7149A NOT FOUND.", deletePrompt, deletePrompt, deletePrompt,
        m("jobOrderActions"), m("jobOrderFieldList"), m("enterField"), m("jobOrderFieldHelp"), m("enterField"),
        "ENTER JO VALUE AS:", "ANNNNA", changePrompt, "JO: E7200A NOT FOUND.", changePrompt, m("enterField"),
        eight, MODADD_JOBS(0),
        m("modSection"), m("jobOrderActions"), m("jobOrderFieldList"), m("enterField"),
        "!NNN.NNN!", changePrompt, m("enterField"),
        eight, MODADD_JOBS(100),
        m("modSection"), m("dataChangeDesired"),
        "ITEM ADDED TO DATA BASE", "SYSTEM ITEM NUMBER = 615",
        m("analysisMain"),
      ),
    );
    expect(store.get("6")?.title).toBe("PROGRAM MANAGEMENT (SPAC)");
  });

  it("MOD/REPLACE with an abnormal spread (PDF 42 to 45) prints all 17 rows", () => {
    const run = type(engine, state, REPLACE_INPUTS);
    state = run.state;
    const added = header({ date: "WED, JUN 27 1984", jos: " 8", months: " 1", sys: "615", title: "TEST ENTRY FOR SAMPLE MOD / ADD", task: "Z", fee: "0.000" });
    const corrected = SPREAD_ROWS.map((r) => (r[0] === "DEC 76" ? spreadRow(["DEC 76", 100, 77000]) : spreadRow(r)));
    const replaced = expected(
      m("retrieveFields"), m("enterField"), m("enterValue"), m("enterField"),
      added, m("more"), MODADD_JOBS(100), m("more"),
      m("hoursDollarsHeader"), "OCT 76 0 67500 0 67426 0 67426",
      m("recordActions"), m("modMethod"), m("modSection"), m("dataChangeDesired"),
      m("dataChange"), m("deleteMonthlyData"), "DATA DELETED", m("dataChange"),
      m("spreadFirstMonth"), m("spreadFirstHours"), m("spreadFirstDollars"),
      m("spreadLastMonth"), m("spreadLastHours"), m("spreadLastDollars"),
      m("normalSpread"), m("spreadFirstHalfHours"), m("spreadFirstHalfDollars"),
      SPREAD_ROWS.map(spreadRow),
      m("moreModifications"), m("dataChange"),
      m("manualEntry"), "DEC 76 100 77000 0 0 0 0",
      m("manualEntry"), "0 0 0 0 0 0 0",
      corrected,
      m("moreModifications"),
    );
    expect(run.program.slice(0, replaced.length)).toEqual(replaced);
    const months = store.get("615")?.months ?? [];
    expect(months).toHaveLength(17);
    expect(months.map((x) => x.eacHours)).toEqual([10, 13, 16, 19, 22, 25, 28, 31, 34, 42, 50, 58, 66, 74, 82, 90, 100]);
  });

  it("DELETE (PDF 46) removes record 615", () => {
    const run = type(engine, state, ["1", "5", "615", "", "N", "4", "Y"]);
    state = run.state;
    const shown = header({ date: "WED, JUN 27 1984", jos: " 8", months: "17", sys: "615", title: "TEST ENTRY FOR SAMPLE MOD / ADD", task: "Z", fee: "0.000" });
    expect(run.program).toEqual(
      expected(
        m("retrieveFields"), m("enterField"), m("enterValue"), m("enterField"),
        shown, m("more"), m("recordActions"), m("deleteRecordConfirm"),
        "RECORD 615 DELETED FROM DATA BASE", m("analysisMain"),
      ),
    );
    expect(store.get("615")).toBeUndefined();
  });

  it("INPUT (PDF 49 to 51) builds the printed record as SYSTEM ITEM NUMBER 615", () => {
    const run = type(engine, state, [
      "2", "3333 ZXY", "TEST ENTRY FOR SAMPLE OF INPUT MODE", "NONE", " WINTERS", " Z", "", "AUT", "LTV",
      "1", "2", "E7202G 50.000", "", "E7206H 50.000", "G",
      "1", "3", "333", "80", "JAN80", "", "", "JAN80",
    ]);
    state = run.state;
    expect(run.program).toEqual(
      expected(
        m("inputWaPrompt"), m("inputHeaderForm"), m("inputStatusError"), m("inputContractorError"),
        m("inputJobOrdersBuilt"), m("inputJobOrderCount"),
        m("jobOrderForm"), m("jobOrderSubcode"), m("jobOrderForm"), m("jobOrderSubcode"),
        "DATE: WED, JUN 27 1984 STATUS:AUT J.O.S: 2 MONTHS: SYS ITEM NO: 615",
        "TITLE:TEST ENTRY FOR SAMPLE OF INPUT MODE",
        "MOD: , , , CONTRACTOR:LTV",
        "REMRK:NONE",
        "NASA RESPONSIBLE ENGR:WINTERS KTR RESPONSIBLE ENGR:",
        "RBK: PURCHASE REQUEST:",
        "CONTRACT/PURCHASE ORDER:NAS1-12500 TASK:Z SUBTASK: .",
        "WORK AUTHORITY:3333 WA CODE:ZXY COMPLETED TASK:NO TABLE:MANL",
        "R.T. HRS: 0 R.T. DOLLARS: 0",
        "TOTAL AUT HOURS: 0 TOTAL AUT DOLLARS: 0 FEE: 0.000%",
        jo("E7202G", "49002023700000400", 50),
        jo("E7206H G", "49001014700000400", 50),
        m("dataChange"), "TASK= Z", m("ratetableHours"), m("ratetableDollars"), m("ratetableFiscalYear"),
        "*****", "TOTAL DOLLARS = 0", "TOTAL HOURS = 3", "*****",
        m("spreadFirstMonth"), m("spreadFirstHours"), m("spreadFirstDollars"), m("spreadLastMonth"),
        "JAN 80 0 0 0 0 0 0",
        "ITEM ADDED TO DATA BASE", "SYSTEM ITEM NUMBER = 615",
        m("analysisMain"),
      ),
    );
    const printed = data.records.find((r) => r.sysnum === "615");
    const made = store.get("615");
    expect(made).toBeDefined();
    for (const key of ["date", "status", "title", "mods", "contractor", "remarks", "nr", "contract", "task", "wan", "wacode", "complete", "fee", "table", "jobOrders", "months"] as const) {
      expect(made?.[key], key).toEqual(printed?.[key]);
    }
  });
});

describe("UPDATE and REPORT", () => {
  it("ETC EAC-BUDGET update (PDF 96 to 98) leaves the printed final table", () => {
    const { engine, store } = setup();
    const run = type(engine, atAnalysis(engine), ["5", "3", "Y", "305HAA", "3005HAA", "300", "2220", "Y", "0", "0", ""]);
    const fyBlock = (fy: string, rates: string, etc: string) => [
      "*****", `*** UPDATE FOR FISCAL YEAR '${fy} ***`, "*****",
      m("updateEtcHours"), m("updateEtcMaterial"), "TASK = H", rates, `NEW TOTAL DOLLAR ETC = ${etc}`,
      "*****", "NEW EAC SPREAD HOURS= 998 NEW EAC SPREAD DOLLARS= 47500", "*****",
    ];
    const rows = [
      "SEP 83 538 22541 538 22541 1676 68755", "OCT 83 633 26392 538 22541 1676 68755",
      "NOV 83 728 30243 538 23095 1676 68755", "DEC 83 564 24089 564 24089 1509 65764",
      "JAN 84 669 28720 589 25107 1509 65764", "FEB 84 774 33351 622 27953 1509 65764",
      "MAR 84 879 37982 647 29187 1509 65764", "APR 84 984 42613 656 30257 1509 65764",
      "MAY 84 698 32046 698 32046 998 47500", "JUN 84 773 35910 0 0 998 47500",
      "JUL 84 848 39774 0 0 0 0", "AUG 84 923 43638 0 0 0 0",
      "SEP 84 998 47502 0 0 0 0", "OCT 84 998 47500 0 0 0 0",
    ];
    const etc = expected(
      "WELCOME TO THE ETC / EAC UPDATE ROUTINE", "THE CURRENT STATUS DATE IS MAY 84", m("updateStatusDateOk"),
      m("updateWanWacode"), "NNNNAAAA", "*** ERROR ***", "RECORD NOT FOUND FOR WA 305HAA",
      m("updateWanWacode"), "NNNNAAAA", "WA = 3005HAA FOUND. RECORD NO. = 125",
      ...fyBlock("84", "HOURLY RATE = 33.33 DOLLAR RATE = 100.00", "15454"), m("normalSpread"),
      ...fyBlock("85", "HOURLY RATE = 44.44 DOLLAR RATE = 101.01", "0"),
      m("updateWanWacode"), "NNNNAAAA",
      "DATE: THU, MAY 10 1984 STATUS:AUT J.O.S:16 MONTHS:14 SYS ITEM NO: 125",
      "TITLE:PROCUREMENT & SHIPMENT OF MISCELLANEOUS ITEMS, VEHICLE PROCESSING",
      "MOD: , , , CONTRACTOR:VOUGHT",
      "REMRK:",
      "NASA RESPONSIBLE ENGR:RLD KTR RESPONSIBLE ENGR:SHAW",
      "RBK: PURCHASE REQUEST:",
      "CONTRACT/PURCHASE ORDER:NAS1-16200 TASK:H SUBTASK: .",
      "WORK AUTHORITY:3005 WA CODE:HAA COMPLETED TASK:NO TABLE:SUST",
      "R.T. HRS:1952 R.T. DOLLARS:15348",
      "TOTAL AUT HOURS:1960 TOTAL AUT DOLLARS:97020 FEE:15.927%",
      m("hoursDollarsHeader"), rows,
    );
    const start = run.program.indexOf(etc[0]);
    expect(run.program.slice(start, start + etc.length)).toEqual(etc);
    expect(run.hints.some((h) => h.includes("231999"))).toBe(true);
    const sys125 = store.get("125");
    expect(sys125?.months.find((x) => x.month === "SEP84")).toMatchObject({ eacHours: 998, eacDollars: 47502 });
    expect(sys125?.date).toBe("THU, MAY 10 1984");
  });

  it("refuses a 533 for status month OCT after the Dallas tape sets it (PDF 60 to 61, 93)", () => {
    const { engine } = setup();
    const tape = type(engine, atAnalysis(engine), ["5", "1", "OCT 84", "0", "0"]);
    expect(tape.state.statusMonth).toBe("OCT84");
    expect(tape.state.step).toBe("analysis");
    const run = type(engine, tape.state, ["4", "2"]);
    expect(run.program).toContain("*** 533 REPORT CANNOT BE GENERATED FOR STATUS MONTH OCT ***");
    expect(run.program.slice(-expected(m("reportMain")).length)).toEqual(expected(m("reportMain")));
    expect(run.state.step).toBe("report.main");
  });

  it("runs the main-menu RATETABLE calculator (PDF 117)", () => {
    const { engine } = setup();
    const run = type(engine, atAnalysis(engine), ["6", "Z", "3", "333", "80"]);
    expect(run.program.slice(0, 9)).toEqual(
      expected(m("ratetableTask"), "TASK=Z", m("ratetableHours"), m("ratetableDollars"), m("ratetableFiscalYear"), "*****", "TOTAL DOLLARS = 0", "TOTAL HOURS = 3", "*****"),
    );
    expect(run.hints.some((h) => h.includes("illustrative"))).toBe(true);
  });

  it("spools a retrieved record and reports nothing spooled (PDF 47 to 48)", () => {
    const { engine } = setup();
    const run = type(engine, atAnalysis(engine), ["1", "5", "3", "", "N", "3", "", "1", "3", "0"]);
    expect(run.program).toContain("**** RECORD PUT INTO OUTPUT FILE ****");
    expect(run.program).toEqual(expect.arrayContaining(expected(m("spoolSite"), m("spoolRecordScout"), m("spoolRecordCopies"))));
    expect(run.program).toContain(norm("NO OUTPUT SPOOLED TO PRINTER !!!!"));
    expect(run.state.step).toBe("analysis");
  });
});

describe("hard content rules", () => {
  it("never prints the replaced user IDs", () => {
    const { engine } = setup();
    const main = type(engine, engine.start().state, LOGIN).state;
    const lists = type(engine, main, ["8", "33", "", "44", "", "55", "", "66", "77"]);
    const text = lists.program.join("\n");
    expect(text).not.toMatch(/\bCGH\b|\bDCM\b/);
    expect(text).toContain("DKH");
  });
});
