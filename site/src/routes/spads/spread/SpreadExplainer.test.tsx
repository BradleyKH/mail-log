// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import SpreadExplainer from "./SpreadExplainer";

afterEach(cleanup);

const renderExplainer = () =>
  render(
    <MemoryRouter>
      <SpreadExplainer />
    </MemoryRouter>,
  );

describe("SpreadExplainer", () => {
  it("renders the manual's 17 rows ending 98  77000", () => {
    renderExplainer();
    const rows = screen.getAllByTestId("spread-row");
    expect(rows).toHaveLength(17);
    expect(rows[0].textContent).toBe("AUG 75  10   1000");
    expect(rows[16].textContent).toBe("DEC 76  98  77000");
    expect(screen.getByRole("link", { name: /PDF page 44/ }).getAttribute("href")).toBe("/archive/cr-177949/page/44");
  });

  it("shows the ETC update with 47502 then 47500", async () => {
    renderExplainer();
    fireEvent.click(screen.getByRole("button", { name: "ETC update on W.A. 3005 HAA" }));
    await waitFor(() => expect(screen.getAllByTestId("spread-row").length).toBeGreaterThan(0));
    const text = screen.getAllByTestId("spread-row").map((r) => r.textContent ?? "");
    expect(text.find((t) => t.startsWith("SEP 84"))).toContain("47502");
    expect(text.find((t) => t.startsWith("OCT 84"))).toContain("47500");
    expect(screen.getByRole("link", { name: /PDF page 96/ }).getAttribute("href")).toBe("/archive/cr-177949/page/96");
  });

  it("recomputes when an input changes and reports a reversed range", () => {
    renderExplainer();
    fireEvent.change(screen.getByLabelText("Last month"), { target: { value: "FEB76" } });
    expect(screen.getAllByTestId("spread-row")).toHaveLength(7);
    fireEvent.change(screen.getByLabelText("Last month"), { target: { value: "JUL75" } });
    expect(screen.getByRole("alert").textContent).toMatch(/before/);
  });
});
