// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { getDoc, getSections } from "@/content/load";
import type { DocId } from "@/content/types";
import MailLog1985 from "./MailLog1985";
import MailLogCompare from "./MailLogCompare";
import SpadsMenuMap from "./SpadsMenuMap";
import SpadsOverview from "./SpadsOverview";
import { compareRows, menuDocs, overviewFacts, parseMainMenu } from "./overviewData";

afterEach(cleanup);

const renderIn = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

function expectLinksResolve(container: HTMLElement) {
  const hrefs = [...container.querySelectorAll("a")].map((a) => a.getAttribute("href") ?? "");
  const archive = hrefs.filter((h) => h.startsWith("/archive/cr-"));
  expect(archive.length).toBeGreaterThan(0);
  for (const href of archive) {
    const parts = href.split("/");
    const docId = parts[2] as DocId;
    const doc = getDoc(docId);
    expect(doc, href).toBeDefined();
    if (parts[3] === "page") {
      const n = Number(parts[4]);
      expect(n, href).toBeGreaterThanOrEqual(1);
      expect(n, href).toBeLessThanOrEqual(doc!.pageCount);
    } else if (parts[3] === "section") {
      expect(
        getSections(docId).some((s) => s.id === parts[4]),
        href,
      ).toBe(true);
    }
  }
  for (const href of hrefs) {
    if (href.startsWith("/archive")) expect(href).toMatch(/^\/archive\/cr-\d+(\/(page|section)\/[\w.]+)?$/);
  }
}

describe("overview data", () => {
  it("cites sections that exist and start on or before the cited page", () => {
    const facts = [...overviewFacts, ...compareRows.flatMap((r) => [...r.y1979, ...r.vol1, ...r.vol3])];
    for (const { cite } of facts) {
      expect(cite.pdfPage).toBeLessThanOrEqual(getDoc(cite.docId)!.pageCount);
      if (!cite.sectionId) continue;
      const section = getSections(cite.docId).find((s) => s.id === cite.sectionId);
      expect(section, `${cite.docId} ${cite.sectionId}`).toBeDefined();
      expect(section!.pdfPage, `${cite.docId} ${cite.sectionId}`).toBeLessThanOrEqual(cite.pdfPage);
    }
  });

  it("points each menu option at a section whose page matches", () => {
    for (const doc of Object.values(menuDocs)) {
      const section = getSections(doc!.docId).find((s) => s.id === doc!.sectionId);
      expect(section?.pdfPage).toBe(doc!.pdfPage);
    }
  });

  it("parses the two-column menu", () => {
    const opts = parseMainMenu(["( 0)  Logout Menu                      ( 1)  Change Request", "(10)  Property Inventory"]);
    expect(opts).toEqual([
      { n: 0, label: "Logout Menu" },
      { n: 1, label: "Change Request" },
      { n: 10, label: "Property Inventory" },
    ]);
  });
});

describe("SpadsMenuMap", () => {
  it("lists 17 program options plus Logout and highlights options 8 and 9", async () => {
    const { container } = renderIn(<SpadsMenuMap />);
    await screen.findByText("Contracts Analysis");
    expect(container.querySelectorAll("li")).toHaveLength(18);
    const highlighted = [...container.querySelectorAll("[data-highlight]")].map((li) => li.textContent);
    expect(highlighted).toHaveLength(2);
    expect(highlighted[0]).toContain("Contracts Analysis");
    expect(highlighted[1]).toContain("Mail Log Correspondence");
    expectLinksResolve(container);
  });
});

describe("SpadsOverview", () => {
  it("renders the facts, menu, and parts transfer paths with resolving links", async () => {
    const { container } = renderIn(<SpadsOverview />);
    await screen.findByText("Contracts Analysis");
    expect(screen.getAllByText(/PRIME 750/).length).toBeGreaterThan(0);
    expect(screen.getByText("Spare to test expended")).toBeTruthy();
    expectLinksResolve(container);
  });
});

describe("MailLogCompare and MailLog1985", () => {
  it("renders every comparison row", () => {
    const { container } = renderIn(<MailLogCompare />);
    for (const row of compareRows) expect(screen.getByText(row.topic)).toBeTruthy();
    expectLinksResolve(container);
  });

  it("links to the 1979 terminal and report", () => {
    const { container } = renderIn(<MailLog1985 />);
    expect(container.querySelector('a[href="/terminal"]')).not.toBeNull();
    expect(container.querySelector('a[href="/archive/cr-159065"]')).not.toBeNull();
    expect(container.querySelector("#mail-log-1985")).not.toBeNull();
    expectLinksResolve(container);
  });
});
