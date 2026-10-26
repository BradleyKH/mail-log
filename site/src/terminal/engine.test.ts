import { describe, expect, it } from "vitest";
import { getSampleRecords } from "@/content/load";
import { createEngine, type Engine } from "./engine";
import { programData } from "./programData";
import { createRecordStore } from "./store";
import type { EngineState, RecordStore } from "./types";

const data = programData();

function setup(): { engine: Engine; store: RecordStore } {
  const store = createRecordStore(getSampleRecords, null);
  const engine = createEngine({ data, store, now: () => new Date(1978, 11, 7, 9, 41) });
  return { engine, store };
}

/** Types each input in turn and returns the final state plus everything printed. */
function type(engine: Engine, state: EngineState, inputs: string[]) {
  const lines: string[] = [];
  for (const input of inputs) {
    const r = engine.submit(state, input);
    state = r.state;
    lines.push(...r.output.map((l) => l.text));
  }
  return { state, text: lines.join("\n"), lines };
}

const toSearchMenu = ["LOGIN DKH", "MAIL", "COR", "SEA"];
const authorSearch = (name: string) => ["AUTH", "120778", "080178", "123178", "6", name];

describe("correspondence author/source search", () => {
  it("finds KEYNTON, R. J. six times and ends with the manual's message", () => {
    const { engine } = setup();
    const start = engine.start("correspondence");
    const { state, lines } = type(engine, start.state, [...toSearchMenu, ...authorSearch("KEYNTON, R. J.")]);
    expect(lines).toContain("THERE ARE 6 DOCUMENTS WITH AN AUTHOR/SOURCE OF KEYNTON, R. J.");
    expect(state.results).toHaveLength(6);
    expect(state.step).toBe(317);
    expect(state.history).toContain("correspondence:330");
    expect(state.history).toContain("correspondence:331");
  });

  it("finds BEAN, J. once", () => {
    const { engine } = setup();
    const { lines } = type(engine, engine.start().state, [...toSearchMenu, ...authorSearch("BEAN, J.")]);
    expect(lines).toContain("THERE ARE 1 DOCUMENTS WITH AN AUTHOR/SOURCE OF BEAN, J.");
  });

  it("matches a prefix: HORNE, R. finds six", () => {
    const { engine } = setup();
    const { lines } = type(engine, engine.start().state, [...toSearchMenu, ...authorSearch("HORNE, R.")]);
    expect(lines).toContain("THERE ARE 6 DOCUMENTS WITH AN AUTHOR/SOURCE OF HORNE, R.");
  });

  it("reports zero matches in the program's style", () => {
    const { engine } = setup();
    const { lines, state } = type(engine, engine.start().state, [...toSearchMenu, ...authorSearch("ZZZZ")]);
    expect(lines).toContain("THERE ARE 0 DOCUMENTS WITH AN AUTHOR/SOURCE OF ZZZZ");
    expect(state.results).toEqual([]);
  });

  it("returns to the search menu on RETURN", () => {
    const { engine } = setup();
    const { state } = type(engine, engine.start().state, [...toSearchMenu, ...authorSearch("BEAN, J."), ""]);
    expect(state.step).toBe(301);
  });
});

describe("input validation", () => {
  it("rejects an impossible date and repeats the step", () => {
    const { engine } = setup();
    const { state, lines } = type(engine, engine.start().state, [...toSearchMenu, "AUTH", "023078"]);
    expect(lines).toContain("ERROR IN DATES - PLEASE TRY AGAIN");
    expect(state.step).toBe(303);
    const next = type(engine, state, ["130178"]);
    expect(next.state.step).toBe(303);
    expect(type(engine, state, ["022878"]).state.step).toBe(304);
  });

  it("rejects a date range that runs backward", () => {
    const { engine } = setup();
    const { state, lines } = type(engine, engine.start().state, [...toSearchMenu, "AUTH", "120778", "123178", "080178"]);
    expect(lines).toContain("ERROR IN DATES - PLEASE TRY AGAIN");
    expect(state.step).toBe(304);
  });

  it("rejects keys that are not on a menu", () => {
    const { engine } = setup();
    const { state } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "COR", "SEA", "XYZ"]);
    expect(state.step).toBe(301);
  });

  it("enforces maxLength on text fields", () => {
    const { engine } = setup();
    const { state } = type(engine, engine.start().state, [...toSearchMenu, "AUTH", "120778", "080178", "123178", "6", "X".repeat(29)]);
    expect(state.step).toBe(330);
  });

  it("checks the mail status search's legal codes", () => {
    const { engine } = setup();
    const { lines, state } = type(engine, engine.start().state, [...toSearchMenu, "MS", "120778", "080178", "123178", "6", "ZZ"]);
    expect(lines).toContain("ERROR IN MAIL STATUS ZZ NOT ALLOWABLE. TRY AGAIN.");
    expect(state.step).toBe(346);
  });
});

describe("input mode and the session store", () => {
  const entry = [
    "INP", "NO", "NEW", "120778",
    "IM", "HARRIS, D. K.", "120678", "SCOUT PROJECT OFFICE", "MFX D-99", "MAIL LOG FIRST ENTRY", "DKH",
    "3526", "000000", "NONE", "682.1", "DKH", "",
    "COR", "2", "NO", "WAIT",
  ];

  it("stores an entered record and finds it later by author/source", () => {
    const { engine, store } = setup();
    const before = store.list("correspondence").length;
    const { state, text } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "COR", ...entry]);
    expect(text).toContain("CONTRACT NUMBER NAS1-15100");
    expect(state.step).toBe(4);
    expect(store.list("correspondence")).toHaveLength(before + 1);
    const found = type(engine, state, ["SEA", ...authorSearch("HARRIS")]);
    expect(found.lines).toContain("THERE ARE 1 DOCUMENTS WITH AN AUTHOR/SOURCE OF HARRIS");
    expect(found.state.results[0].values.subject).toBe("MAIL LOG FIRST ENTRY");
    expect(found.state.results[0].origin).toBe("session");
  });

  it("revises and archives the entered record by its input date-code", () => {
    const { engine, store } = setup();
    let { state } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "COR", ...entry]);
    const saved = store.list("correspondence").find((r) => r.origin === "session")!;
    const code = `120778${saved.values.dailyCounter!.padStart(4, "0")}`;
    ({ state } = type(engine, state, ["REV", code, "NO", "6", "YES", "REV", "1", "2", "HARRIS, DANNY K.", "COR"]));
    expect(state.step).toBe(4);
    expect(store.list("correspondence").find((r) => r.id === saved.id)?.values.authorSource).toBe("HARRIS, DANNY K.");
    ({ state } = type(engine, state, ["ARC", code, "2"]));
    // Archive returns to the data-type choice (program entry), not the mode menu.
    expect(state.step).toBe(3);
    expect(store.list("correspondence").some((r) => r.id === saved.id)).toBe(false);
  });
});

describe("flow switching and session control", () => {
  it("switches to the DIR flow at step 3 and searches its two records", () => {
    const { engine } = setup();
    const { state, lines } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "DIR", "SEA", "ALL", "2"]);
    expect(state.record).toBe("dir");
    expect(lines).toContain("THERE ARE 2 DOCUMENTS IN THE DIR FILE");
  });

  it("searches drawing fields the sample sheets do not carry and finds none", () => {
    const { engine } = setup();
    const { lines } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "DRAW", "SEA", "SYS", "NO", "ELEC"]);
    expect(lines).toContain("THERE ARE 0 DRAWINGS WITH A SYSTEM OF ELEC");
  });

  it("finds a drawing's E.O.s through the E.O. number search", () => {
    const { engine } = setup();
    const { lines } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "DRAW", "SEA", "EO", "NO", "V24818", "DR"]);
    expect(lines.some((l) => /THERE ARE 1 DRAWINGS WITH A TOTAL OF 1 SHEET/.test(l))).toBe(true);
  });

  it("logs out after QUIT twice", () => {
    const { engine } = setup();
    const { state, lines } = type(engine, engine.start().state, ["LOGIN DKH", "MAIL", "COR", "QUIT", "QU"]);
    expect(state.step).toBe("exit");
    expect(lines.at(-1)).toMatch(/^DKH \(4\) LOGGED OUT AT/);
  });

  it("deep-links to a step, rewinding a print-only step to the input that feeds it", () => {
    const { engine } = setup();
    expect(engine.goTo("dir", 315).state.step).toBe(315);
    expect(engine.goTo("correspondence", 331).state.step).toBe(330);
  });

  it("fails gracefully on a step that does not exist", () => {
    const { engine } = setup();
    const r = engine.goTo("dir", 999);
    expect(r.output.map((l) => l.text)).toContain("AN ERROR IN FILE MANAGEMENT SYSTEM HAS OCCURRED!");
    expect(r.state.step).toBe(4);
  });
});

describe("every step survives a visit", () => {
  const probes = ["", "YES", "NO", "1", "2", "120778", "QUIT", "ALL", "AAAA"];
  for (const flow of Object.values(data.flows)) {
    it(`${flow!.record}: deep link and probe inputs never throw or strand the session`, () => {
      const { engine } = setup();
      for (const step of flow!.steps) {
        let { state } = engine.goTo(flow!.record, step.n);
        for (const p of probes) {
          ({ state } = engine.submit(state, p));
          expect(state.step === "exit" || typeof state.step === "number").toBe(true);
        }
      }
    });
  }
});
