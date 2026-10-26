// Replays of the UPDATE sessions printed in CR-177949 (PDF 92 to 98).
import { beforeAll, describe, expect, it } from "vitest";
import { spadsMenus, spadsRecords, spadsReports, spadsTables } from "@/content/load";
import { dialogStep, Session, type Steps } from "./session";
import { spoolSteps } from "./spool";
import { createSpadsStore } from "./store";
import type { SpadsData, SpadsState, SpadsStore } from "./types";
import { updateSteps } from "./update";

let data: SpadsData;

beforeAll(async () => {
  const [menus, records, tables, reports] = await Promise.all([spadsMenus(), spadsRecords(), spadsTables(), spadsReports()]);
  if (!menus || !records || !tables || !reports) throw new Error("SPADS content missing");
  data = { menus, records, tables, reports };
});

const steps: Steps = {
  ...spoolSteps,
  ...updateSteps,
  analysis: { enter: (s) => s.print("<analysis>"), input: () => {} },
  dialog: dialogStep,
};

const norm = (t: string) => t.replace(/\s*([:=])\s*/g, "$1").replace(/\s+/g, " ").trim();

function run(inputs: string[], store?: SpadsStore) {
  const st = store ?? createSpadsStore(data);
  const env = { data, store: st, now: () => new Date(1984, 5, 27, 9, 41) };
  let state: SpadsState = { step: "update.main", user: "DKH", terminal: 4, statusMonth: "MAY84", securityNoted: true, ctx: {} };
  const program: string[] = [];
  const hints: string[] = [];
  for (const input of inputs) {
    const s = new Session(env, state, steps, {});
    s.submit(input);
    state = s.state;
    for (const l of s.output) {
      if (l.kind === "program" && l.text.trim()) program.push(norm(l.text));
      if (l.kind === "hint") hints.push(l.text);
    }
  }
  return { state, program, hints, store: st };
}

describe("ETC EAC-BUDGET update (PDF 96 to 98)", () => {
  it("reproduces the printed prompts and the final hours and dollars table", () => {
    const { program, hints, store, state } = run(["3", "Y", "305HAA", "3005HAA", "300", "2220", "Y", "0", "0", ""]);
    const expected = [
      "WELCOME TO THE ETC / EAC UPDATE ROUTINE",
      "THE CURRENT STATUS DATE IS MAY 84",
      "CURRENT STATUS DATE OK (Y OR N) >",
      "ENTER WAN & WACODE (RETURN IF DONE)",
      "NNNNAAAA",
      "*** ERROR ***",
      "RECORD NOT FOUND FOR WA 305HAA",
      "ENTER WAN & WACODE (RETURN IF DONE)",
      "NNNNAAAA",
      "WA=3005HAA FOUND. RECORD NO.=125",
      "**********************************",
      "*** UPDATE FOR FISCAL YEAR '84 ***",
      "**********************************",
      "ENTER ETC HOURS >",
      "ENTER ETC MATERIAL / ODC >",
      "TASK=H",
      "HOURLY RATE=33.33 DOLLAR RATE=100.00",
      "NEW TOTAL DOLLAR ETC=15454",
      "*".repeat(70),
      "NEW EAC SPREAD HOURS=998 NEW EAC SPREAD DOLLARS=47500",
      "*".repeat(70),
      "NORMAL SPREAD (Y - N) >",
      "**********************************",
      "*** UPDATE FOR FISCAL YEAR '85 ***",
      "**********************************",
      "ENTER ETC HOURS >",
      "ENTER ETC MATERIAL / ODC >",
      "TASK=H",
      "HOURLY RATE=44.44 DOLLAR RATE=101.01",
      "NEW TOTAL DOLLAR ETC=0",
      "*".repeat(70),
      "NEW EAC SPREAD HOURS=998 NEW EAC SPREAD DOLLARS=47500",
      "*".repeat(70),
      "ENTER WAN & WACODE (RETURN IF DONE)",
      "NNNNAAAA",
      "DATE:THU, MAY 10 1984 STATUS:AUT J.O.S:16 MONTHS:14 SYS ITEM NO:125",
      "TITLE:PROCUREMENT & SHIPMENT OF MISCELLANEOUS ITEMS, VEHICLE PROCESSING",
    ];
    expect(program.slice(0, expected.length)).toEqual(expected);
    const table = [
      "SEP 83 538 22541 538 22541 1676 68755",
      "OCT 83 633 26392 538 22541 1676 68755",
      "NOV 83 728 30243 538 23095 1676 68755",
      "DEC 83 564 24089 564 24089 1509 65764",
      "JAN 84 669 28720 589 25107 1509 65764",
      "FEB 84 774 33351 622 27953 1509 65764",
      "MAR 84 879 37982 647 29187 1509 65764",
      "APR 84 984 42613 656 30257 1509 65764",
      "MAY 84 698 32046 698 32046 998 47500",
      "JUN 84 773 35910 0 0 998 47500",
      "JUL 84 848 39774 0 0 0 0",
      "AUG 84 923 43638 0 0 0 0",
      "SEP 84 998 47502 0 0 0 0",
      "OCT 84 998 47500 0 0 0 0",
    ];
    const start = program.indexOf(table[0]);
    expect(program.slice(start, start + table.length)).toEqual(table);
    expect(hints.some((h) => h.includes("231999"))).toBe(true);
    expect(store.get("125")?.months.find((m) => m.month === "SEP84")?.eacDollars).toBe(47502);
    expect(state.step).toBe("update.main");
  });
});

describe("DALLAS TAPE update", () => {
  it("sets the session's status month", () => {
    const { state, program } = run(["1", "OCT 84", "0", "0"]);
    expect(state.statusMonth).toBe("OCT84");
    expect(program).toContain("9 UNDEFINED WA RECORDS WERE FOUND");
    expect(program).toContain("NO OUTPUT SPOOLED !!!!!");
    expect(program[program.length - 1]).toBe("<analysis>");
  });
});

describe("QUICKIE HEADER update", () => {
  it("modifies every record that matches", () => {
    const { program, store } = run(["4", "15", "B", "", "2", "FUT", "", ""]);
    expect(program).toContain("RECORD NO. 7 MATCH FOUND");
    expect(program).toContain("RECORD NO. 8 MATCH FOUND AND MODIFIED");
    expect(program).toContain("NO MATCH FOUND END OF FILE");
    expect(store.list().filter((r) => r.task === "B").every((r) => r.status === "FUT")).toBe(true);
  });
});

describe("other update options", () => {
  it("replays edit tables, re-sorts, and books all outputs", () => {
    const tables = run(["5", "6", ""]);
    expect(tables.program).toContain("USER:ID CODE=CCC DELETED");
    expect(tables.hints.some((h) => h.includes("security table"))).toBe(true);
    const resort = run(["6"]);
    expect(resort.program).toContain("REBUILDING NOW IN PROGRESS -- STAND BY");
    const book = run(["7", "1", "4", "1", "0"]);
    expect(book.program).toContain("OUTPUT SPOOLED TO PRINTER");
    expect(book.program).toContain("NO OUTPUT SPOOLED !!!!!");
    expect(book.state.step).toBe("update.main");
  });
});
