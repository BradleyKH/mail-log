import { describe, expect, it } from "vitest";
import { reflowProse } from "./reflow";

describe("reflowProse", () => {
  it("joins wrapped lines and rejoins hyphenated words", () => {
    expect(reflowProse("The pro-\ngram tracks\ncorrespondence.")).toBe("The program tracks correspondence.");
  });

  it("keeps breaks before list items and all-caps lines", () => {
    expect(reflowProse("Choose one:\n(1) INPUT\n(2) REVISE")).toBe("Choose one:\n(1) INPUT\n(2) REVISE");
    expect(reflowProse("MAIL LOG\nPROGRAM OPERATING INSTRUCTIONS")).toBe("MAIL LOG\nPROGRAM OPERATING INSTRUCTIONS");
  });

  it("keeps a heading on its own line", () => {
    expect(reflowProse("4.1 INPUT MODE\nThe user must\nhave clearance")).toBe("4.1 INPUT MODE\nThe user must have clearance");
  });

  it("leaves column layouts alone", () => {
    expect(reflowProse("| A | B |\n| 1 | 2 |")).toBe("| A | B |\n| 1 | 2 |");
  });
});
