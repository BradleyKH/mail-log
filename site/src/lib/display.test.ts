import { describe, expect, it } from "vitest";
import { displayText } from "./display";

const dash = (code: number) => String.fromCodePoint(code);

describe("displayText", () => {
  it("maps em, en, figure, bar, and minus dashes to a hyphen", () => {
    const input = ["a", dash(0x2014), "b", dash(0x2013), "c", dash(0x2012), "d", dash(0x2212), "e", dash(0x2015), "f"].join("");
    expect(displayText(input)).toBe("a-b-c-d-e-f");
  });
  it("leaves plain text and hyphens alone", () => {
    expect(displayText("OPEN@F-PHASE1 prints 3 lines")).toBe("OPEN@F-PHASE1 prints 3 lines");
  });
});
