import { describe, expect, it } from "vitest";
import { loadCodeIndex, loadXref } from "@/content/load";
import { parseCondition } from "./branches";
import { ITEM_STEPS } from "./fieldSteps";
import { KNOWN_UNREACHABLE, unreachableSteps } from "./graph";
import { routinesForStep } from "./hood";
import { DISPATCH_STEP, MENU_KEYS } from "./menuKeys";
import { programData } from "./programData";
import type { RecordType } from "./types";

const data = programData();
const step = (record: RecordType, n: number) => data.flows[record]!.steps.find((s) => s.n === n)!;

/** The KEY column of the search menu as printed in step 301's prompt. */
function printedMenuKeys(record: RecordType): string[] {
  const lines = step(record, 301).prompt;
  const start = lines.findIndex((l) => /^MODE\s+KEY/.test(l.trim()));
  return lines
    .slice(start + 1)
    .filter((l) => /\S\s{2,}\S+$/.test(l))
    .map((l) => l.trim().split(/\s+/).at(-1)!);
}

describe("search menu key table", () => {
  for (const record of ["correspondence", "dir", "drawing-eo"] as const) {
    it(`${record}: covers exactly the keys step 301 prints`, () => {
      expect(Object.keys(MENU_KEYS[record]).sort()).toEqual(printedMenuKeys(record).sort());
    });

    it(`${record}: agrees with the dispatch step's printed branches`, () => {
      const dispatch = step(record, DISPATCH_STEP[record]);
      for (const b of dispatch.branches) {
        const key = /(?:key selected is\s+)?([A-Z]{2,5})$/.exec(b.when.trim())?.[1] ?? /^([A-Z]{2,5})$/.exec(b.when.trim())?.[1];
        if (!key || !(key in MENU_KEYS[record])) continue;
        expect(MENU_KEYS[record][key].goto, `${record} ${key}`).toBe(b.goto);
      }
    });
  }

  it("routes AUTH to step 330 in correspondence", () => {
    expect(MENU_KEYS.correspondence.AUTH.goto).toBe(330);
  });

  it("routes the keys handled before dispatch as the manual says", () => {
    expect(step("correspondence", 302).branches.find((b) => /quit/i.test(b.when))?.goto).toBe(MENU_KEYS.correspondence.QUIT.goto);
    expect(step("correspondence", 307).branches.find((b) => /ADD/.test(b.when))?.goto).toBe(MENU_KEYS.correspondence.ADD.goto);
    expect(step("drawing-eo", 302).branches.find((b) => /QUIT/.test(b.when))?.goto).toBe(MENU_KEYS["drawing-eo"].QUIT.goto);
  });
});

describe("item tables", () => {
  const segments: [RecordType, keyof typeof ITEM_STEPS][] = [
    ["correspondence", "correspondence"],
    ["dir", "dir"],
    ["drawing-eo", "drawing"],
    ["drawing-eo", "eo"],
  ];
  for (const [record, segment] of segments) {
    it(`${segment}: each item number points at the step that prints it`, () => {
      for (const [item, n] of Object.entries(ITEM_STEPS[segment])) {
        expect(step(record, n).prompt.join("\n"), `${segment} item ${item} -> ${n}`).toContain(`(${item})`);
      }
    });
  }
});

describe("reachability", () => {
  it("reaches every step except the known gaps in the printed flows", () => {
    expect(unreachableSteps(data).sort()).toEqual([...KNOWN_UNREACHABLE].sort());
  });
});

describe("branch conditions", () => {
  it("reads keys, counts, and prose", () => {
    expect(parseCondition("Del, record deleted; exit revise mode")).toEqual({ kind: "key", key: "DEL" });
    expect(parseCondition("If Yes")).toEqual({ kind: "key", key: "YES" });
    expect(parseCondition("X≠6")).toEqual({ kind: "number", op: "!=", value: 6 });
    expect(parseCondition("N = 1 (TITLE)")).toEqual({ kind: "number", op: "=", value: 1 });
    expect(parseCondition("Data option taken in Step #2").kind).toBe("prose");
    expect(parseCondition("Five").kind).toBe("prose");
  });
});

describe("under the hood", () => {
  it("names AUSEA for the author/source search", async () => {
    const [xref, index] = await Promise.all([loadXref(), loadCodeIndex()]);
    expect(routinesForStep(xref!, index, "correspondence", 330)[0].routine).toBe("AUSEA");
    const result = routinesForStep(xref!, index, "correspondence", 331)[0];
    expect(result.routine).toBe("AUSEA");
    expect(result.seq).toBe("0847");
  });
});
