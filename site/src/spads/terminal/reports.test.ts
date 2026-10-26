import { beforeAll, describe, expect, it } from "vitest";
import { spadsMenus, spadsRecords, spadsReports, spadsTables } from "@/content/load";
import { reportDialogs, reportSteps } from "./reports";
import { dialogStep, Session, type Steps } from "./session";
import { spoolSteps } from "./spool";
import { createSpadsStore } from "./store";
import type { SpadsData, SpadsEnv, SpadsState } from "./types";

let env: SpadsEnv;

beforeAll(async () => {
  const [menus, records, tables, reports] = await Promise.all([spadsMenus(), spadsRecords(), spadsTables(), spadsReports()]);
  const data = { menus, records, tables, reports } as SpadsData;
  env = { data, store: createSpadsStore(data), now: () => new Date(1984, 5, 27, 9, 41) };
});

const stub = { enter: () => {}, input: () => {} };
const steps: Steps = { ...reportSteps, ...spoolSteps, dialog: dialogStep, contract: stub, analysis: stub };

function run(statusMonth: string, inputs: string[]) {
  let state: SpadsState = { step: "report.main", user: "DKH", terminal: 4, statusMonth, securityNoted: true, ctx: {} };
  const lines: string[] = [];
  for (const input of inputs) {
    const s = new Session(env, state, steps, reportDialogs);
    s.submit(input);
    state = s.state;
    lines.push(...s.output.filter((l) => l.kind === "program").map((l) => l.text));
  }
  return { state, lines };
}

describe("report generator", () => {
  it("refuses a 533 for status month OCT", () => {
    const { state, lines } = run("OCT84", ["2"]);
    expect(lines[0]).toBe("*** 533 REPORT CANNOT BE GENERATED FOR STATUS MONTH OCT ***");
    expect(state.step).toBe("report.main");
  });

  it("runs a JUN 533 through its prompts and spool", () => {
    const { state, lines } = run("JUN84", ["2", "123456", "654321", "98765", "56789", "3333333", "4444444", "1", "3", "1"]);
    expect(lines).toContain("*** 533 REPORT GENERATION NOW BEGINNING ... PLEASE STAND BY ***");
    expect(lines.filter((l) => l === "TASK J NOW BEING PROCESSED.")).toHaveLength(2);
    expect(lines).toContain("OUTPUT SPOOLED TO PRINTER");
    expect(lines.some((l) => l.startsWith("TOTAL CONTRACT"))).toBe(true);
    expect(state.step).toBe("report.main");
  });

  it("prints the yearly summary from the store and QUIT exits the spool", () => {
    const { state, lines } = run("MAY84", ["11", "5", "1 1 2 1", "1 1 1", "1 1", "1", "QUIT"]);
    expect(lines).toContain("SUMMARY BY FISCAL YEAR");
    expect(lines.some((l) => /^TOTAL\s+\$/.test(l))).toBe(true);
    expect(lines).toContain("EXIT.");
    expect(state.step).toBe("report.summary");
  });

  it("checks DOD vehicles", () => {
    const { lines } = run("MAY84", ["6", "3", "1", "2", "198", "199", "2", "1", "4", "1"]);
    expect(lines).toContain(" **** ERROR ****  198 IS NOT A DOD VEHICLE");
    expect(lines).toContain("Your report is being calculated by Phantom #70");
  });

  it("prints the POP1 sample after spooling", () => {
    const { lines } = run("MAY84", ["3", "1", "", "85", "1 1 1 1", "1 1 1", "1 1", "2", "1", "4", "1"]);
    expect(lines).toContain("Your report is being calculated by Phantom #70");
    expect(lines.length).toBeGreaterThan(30);
  });
});
