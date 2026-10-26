// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SpadsTerminal from "./SpadsTerminal";

// Reduced motion prints output instantly, so every line is on screen as soon as React renders.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    (query: string) =>
      ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderAt(search = "") {
  const router = createMemoryRouter([{ path: "/spads", element: createElement(SpadsTerminal) }], { initialEntries: [`/spads${search}`] });
  render(createElement(RouterProvider, { router }));
  return router;
}

const output = () => screen.getByRole("log", { name: "SPADS Contract Analysis terminal output" });

function type(text: string) {
  const input = screen.getByLabelText("Terminal input");
  fireEvent.change(input, { target: { value: text } });
  fireEvent.keyDown(input, { key: "Enter" });
}

describe("SpadsTerminal", () => {
  it("logs in and reaches the analysis main menu", async () => {
    const router = renderAt();
    expect(await screen.findByText("OK, LOGIN PLEASE")).toBeTruthy();
    expect(router.state.location.search).toBe("?screen=login");

    type("LOGIN DKH");
    expect(output().textContent).toContain("Password?");
    type("SECRET");
    expect(output().textContent).not.toContain("SECRET");
    type("SECRET");
    expect(router.state.location.search).toBe("?screen=spadsMain");
    type("8");
    expect(router.state.location.search).toBe("?screen=contractSelect");
    type("10");

    expect(router.state.location.search).toBe("?screen=analysisMain");
    expect(screen.getByTestId("spads-hood-screen").textContent).toBe("You are at the Analysis main menu");
    expect(output().textContent).toContain("RETRIEVE");
    expect(screen.getByRole("link", { name: /Read it in the manual \(page 14\)/ }).getAttribute("href")).toBe("/archive/cr-177949/page/14");
  });

  it("restores ?screen=analysisMain to that menu", async () => {
    const router = renderAt("?screen=analysisMain");
    expect(await screen.findByText(/returned to this screen/)).toBeTruthy();
    expect(output().textContent).toContain("RETRIEVE");
    expect(output().textContent).not.toContain("OK, LOGIN PLEASE");
    expect(screen.getByTestId("spads-hood-screen").textContent).toBe("You are at the Analysis main menu");
    expect(router.state.location.search).toBe("?screen=analysisMain");

    type("0");
    expect(router.state.location.search).toBe("?screen=contractSelect");
  });

  it.each(["?screen=NOSUCH", "?screen=ret.show"])("starts %s at login", async (search) => {
    const router = renderAt(search);
    expect(await screen.findByText("OK, LOGIN PLEASE")).toBeTruthy();
    expect(router.state.location.search).toBe("?screen=login");
  });

  it("shows the RATETABLE formula in the hood", async () => {
    renderAt("?screen=analysisMain");
    await screen.findByText(/returned to this screen/);
    type("6");
    expect(screen.getByTestId("spads-hood-formula").textContent).toContain("BUDGET DOLLARS = HRS X RATE + ODC.DOL X RATE");
  });
});
