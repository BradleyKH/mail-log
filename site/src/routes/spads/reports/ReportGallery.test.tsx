// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { spadsReports } from "@/content/load";
import ReportGallery from "./ReportGallery";
import { reportNotes } from "./reportNotes";

afterEach(cleanup);

const renderGallery = () =>
  render(
    <MemoryRouter>
      <ReportGallery />
    </MemoryRouter>,
  );

const open = async (id: string) => {
  const cards = await screen.findAllByTestId("report-card");
  fireEvent.click(cards.find((c) => c.querySelector("span")?.textContent === id)!);
};

describe("ReportGallery", () => {
  it("has a note for every report in the data", async () => {
    const reports = (await spadsReports()) ?? [];
    expect(reports).toHaveLength(31);
    for (const r of reports) expect(reportNotes[r.id], r.id).toBeDefined();
  });

  it("lists every report as a card", async () => {
    renderGallery();
    expect(await screen.findAllByTestId("report-card")).toHaveLength(31);
  });

  it("opens O-4 with its variance formula note and scan link", async () => {
    renderGallery();
    await open("O-4");
    const notes = await screen.findAllByTestId("formula-note");
    const variance = notes.find((n) => n.textContent?.includes("EST. VARIANCE = committed EAC - contract value"));
    expect(variance).toBeDefined();
    expect(variance?.textContent).toContain("reconstructed from the printout");
    expect(screen.getByRole("link", { name: "PDF page 170" }).getAttribute("href")).toBe("/archive/cr-177949/page/170");
  });

  it("flags subtotals that are wrong in the original and returns to the grid", async () => {
    renderGallery();
    await open("J-3A");
    expect((await screen.findByTestId("printed-errors")).textContent).toContain("66,095");
    fireEvent.click(screen.getByRole("button", { name: "Back to all reports" }));
    expect(await screen.findAllByTestId("report-card")).toHaveLength(31);
  });

  it("marks the 533 quarter rule as stated in the manual", async () => {
    renderGallery();
    await open("E-2");
    const notes = await screen.findAllByTestId("formula-note");
    expect(notes[0].textContent).toContain("stated in the manual");
  });
});
