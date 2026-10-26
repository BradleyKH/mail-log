// @vitest-environment happy-dom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import FortranBlock from "./FortranBlock";
import { gutterLabel, resolveLineId } from "./fortranLines";

const lines = [
  { id: "0010.1", text: "C     READ THE RECORD" },
  { id: "0020.1", text: "      CALL SCRNHD" },
  { id: "0020.2", text: "      CALL SCRNHD" },
  { id: "u1", text: "      END" },
];

afterEach(cleanup);

const renderBlock = (props: Partial<React.ComponentProps<typeof FortranBlock>> = {}) =>
  render(
    <MemoryRouter>
      <FortranBlock lines={lines} {...props} />
    </MemoryRouter>,
  );

describe("fortranLines", () => {
  it("formats gutter labels", () => {
    expect(gutterLabel("0020.1", "id")).toBe("0020");
    expect(gutterLabel("0020.2", "id")).toBe("0020.2");
    expect(gutterLabel("0020.1", "printed")).toBe("(0020)");
    expect(gutterLabel("u1", "id")).toBe("");
  });
  it("resolves a bare sequence number to its first occurrence", () => {
    expect(resolveLineId(lines, "0020")).toBe("0020.1");
    expect(resolveLineId(lines, "0020.2")).toBe("0020.2");
    expect(resolveLineId(lines, "9999")).toBeUndefined();
  });
});

describe("FortranBlock", () => {
  it("renders one row per line with its gutter id aligned to the text", () => {
    const { container } = renderBlock();
    const rows = [...container.querySelectorAll("[data-line-id]")];
    expect(rows.map((r) => r.getAttribute("data-line-id"))).toEqual(lines.map((l) => l.id));
    rows.forEach((row, i) => {
      expect(row.textContent).toContain(lines[i].text.trim());
      const gutter = gutterLabel(lines[i].id, "id");
      if (gutter) expect(row.firstElementChild?.textContent).toBe(gutter);
    });
  });

  it("marks the highlighted line and styles comments distinctly", () => {
    const { container } = renderBlock({ highlightId: "0020" });
    expect(container.querySelectorAll("[data-active]")).toHaveLength(1);
    expect(container.querySelector("[data-active]")?.getAttribute("data-line-id")).toBe("0020.1");
    expect(container.querySelector("[data-comment]")?.getAttribute("data-line-id")).toBe("0010.1");
  });

  it("hides the gutter and builds links on request", () => {
    const { container, unmount } = renderBlock({ gutter: "none" });
    expect(container.querySelector("a")).toBeNull();
    unmount();
    renderBlock({ gutter: "printed", lineHref: (id) => `/code/X?line=${id}` });
    expect(screen.getByText("(0010)").closest("a")?.getAttribute("href")).toBe("/code/X?line=0010.1");
  });

  it("highlights tokens once the grammar loads", async () => {
    const { container } = renderBlock();
    await waitFor(() => expect(container.querySelector("code span")).not.toBeNull(), { timeout: 8000 });
  });
});
