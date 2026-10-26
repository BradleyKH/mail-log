// @vitest-environment happy-dom
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import FortranBlock from "@/components/shared/FortranBlock";
import { loadRoutineLines, loadRoutineSource } from "@/content/load";
import { buildLines, routineHref } from "./codeLinks";

afterEach(cleanup);

describe("buildLines", () => {
  it("pairs cards with ids and tolerates a trailing newline", () => {
    expect(buildLines("A\nB\n", ["0001.1", "0002.1"])).toEqual([
      { id: "0001.1", text: "A" },
      { id: "0002.1", text: "B" },
    ]);
  });
  it("rejects a count mismatch", () => {
    expect(() => buildLines("A\nB", ["0001.1"])).toThrow();
  });
});

describe("routineHref", () => {
  it("encodes ids with @", () => {
    expect(routineHref("TINPUT@C", "0010.2")).toBe("/code/TINPUT%40C?line=0010.2");
  });
});

describe("AUSEA gutter", () => {
  it("shows each line's printed sequence number beside its own code", async () => {
    const [source, meta] = await Promise.all([loadRoutineSource("AUSEA"), loadRoutineLines("AUSEA")]);
    const lines = buildLines(source!, meta!.lineIds);
    const { container } = render(
      <MemoryRouter>
        <FortranBlock lines={lines} gutter="printed" />
      </MemoryRouter>,
    );
    const rows = [...container.querySelectorAll("[data-line-id]")];
    expect(rows).toHaveLength(lines.length);
    rows.forEach((row, i) => {
      expect(row.getAttribute("data-line-id")).toBe(lines[i].id);
      expect(row.querySelector("code")?.textContent?.trim()).toBe(lines[i].text.trim());
      const seq = lines[i].id.split(".")[0];
      expect(row.firstElementChild?.textContent).toMatch(new RegExp(`^\\(${seq}\\)$|^\\(${lines[i].id}\\)$`));
    });
  });
});
