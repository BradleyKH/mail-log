import { describe, expect, it } from "vitest";
import { buildFlowchartIndex, parseCaptionFigure, parseFigureId, parseSheet } from "./flowcharts.ts";

const known = ["INPTC", "REVSC", "SEAC", "ARCC"];

function fixture(): Map<number, string> {
  const pages = new Map<number, string>();
  pages.set(5, "TABLE OF CONTENTS\n4.1            MAIL CORRESPONDENCE   12\n4.1.1          INPTC     12\n4.1.2          REVSC   13\n");
  pages.set(6, "TABLE OF CONTENTS (Continued)\nSEAC\nARCC\n");
  pages.set(
    25,
    [
      "3.2       MAIL CORRESPONDENCE MAIN",
      "The program is called BFILE and is located within the F_MAIL UFD.",
      "Flowchart Figure 5.3-1 depicts the CORRESPONDENCE MAIN.",
    ].join("\n"),
  );
  pages.set(
    26,
    [
      "4.1       MAIL CORRESPONDENCE",
      "4.1.1     INPTC",
      "Input mode. Flowchart Figure 5.4.1-1 depicts the INPUT MODE.",
      "4.1.2]    REVSO",
      "Revise mode. Flowchart Figure 5.4,1-2 depicts the REVISE MODE.",
      "This subroutine searches; its heading was lost to OCR.",
      "Flowchart Figure 5.4.1-3 depicts the SEARCH MODE.",
      "4.1.4 ARCC",
      "Flowchart Figure 5.4.1-4 depicts the ARCHIVE MODE.",
    ].join("\n"),
  );
  pages.set(71, "B2 WRITE (1,100)\n‘Figure 5.4,1-1        ~ Page. (1 of 2)");
  pages.set(72, "Figure 5. 4. 1 ]\nPace (2 of 2)");
  pages.set(73, "Figure 5.4.1-2     Page (1 of 3)");
  pages.set(74, "C3 CALL OPEN\n(2 of 3)");
  pages.set(75, "Figure §.4.1-2.\n");
  pages.set(76, "A1 CALL CLOSE\nRETURN");
  pages.set(77, "Figure 5.4.1-3    Page (2 of 2)");
  pages.set(78, "Figure 5.4.1-4    Page (1 of 1)");
  pages.set(79, "Page (1 of 1)");
  return pages;
}

describe("caption parsing", () => {
  it("reads noisy figure ids", () => {
    expect(parseFigureId("5,4,1-3.")).toBe("5.4.1-3");
    expect(parseFigureId("5. 4. 1 ]")).toBe("5.4.1-1");
    expect(parseFigureId("53-2    .")).toBe("5.3-2");
    expect(parseFigureId("5,3.-1")).toBe("5.3-1");
    expect(parseCaptionFigure("‘gure 5.4.1-2         ,   “Page (12 of 12)")).toBe("5.4.1-2");
  });

  it("reads noisy sheet counters", () => {
    expect(parseSheet("~ Page. (9 of 12)")).toEqual({ k: 9, n: 12 });
    expect(parseSheet("Page (io of 21)")).toEqual({ k: 10, n: 21 });
    expect(parseSheet("Page (5° of 9)")).toEqual({ k: 5, n: 9 });
    expect(parseSheet("Page (3 of")).toEqual({ k: 3, n: null });
    expect(parseSheet("WRITE (1,100)")).toEqual({ k: null, n: null });
  });
});

describe("buildFlowchartIndex", () => {
  const idx = buildFlowchartIndex(fixture(), known);
  const byFig = new Map(idx.entries.map((e) => [e.figure, e]));

  it("maps section 4 headings to figures and snaps names", () => {
    expect(byFig.get("5.4.1-1")?.routine).toBe("INPTC");
    expect(byFig.get("5.4.1-2")?.routine).toBe("REVSC");
    expect(idx.notes).toContain("Figure 5.4.1-2: snapped REVSO to REVSC.");
    expect(byFig.get("5.3-1")?.routine).toBe("BFILE");
  });

  it("fills a dropped heading from TOC order", () => {
    expect(byFig.get("5.4.1-3")?.routine).toBe("SEAC");
    expect(idx.notes).toContain("Figure 5.4.1-3 heading not found; inferred SEAC from TOC order.");
  });

  it("places sheets by (1 of n) and by an exhausted count", () => {
    expect(byFig.get("5.4.1-1")?.pdfPages).toEqual([71, 72]);
    expect(byFig.get("5.4.1-2")?.pdfPages).toEqual([73, 74, 75]);
    expect(byFig.get("5.4.1-3")?.pdfPages).toEqual([76, 77]);
    expect(byFig.get("5.4.1-4")?.pdfPages).toEqual([78]);
    expect(byFig.get("5.4.1-2")?.caption).toBe("Figure 5.4.1-2, sheets 1 to 3");
    expect(byFig.get("5.4.1-4")?.caption).toBe("Figure 5.4.1-4, sheet 1");
    expect(idx.pageFigure.get(76)).toBe("5.4.1-3");
    expect(idx.notes).toContain("Figure 5.4.1-3 start at PDF 76 inferred (no caption; previous figure complete).");
  });

  it("records pages that cannot be placed", () => {
    expect(idx.misses).toContainEqual({ pdfPage: 79, reason: "no figure left in 5.4.1-1..5.4.1-4 (sheet 1)" });
    expect(idx.pageFigure.has(79)).toBe(false);
  });

  it("lists entries in figure order and is deterministic", () => {
    expect(idx.entries.map((e) => e.figure)).toEqual(["5.3-1", "5.3-2", "5.3-3", "5.4.1-1", "5.4.1-2", "5.4.1-3", "5.4.1-4"]);
    const again = buildFlowchartIndex(fixture(), known);
    expect(JSON.stringify({ ...again, pageFigure: [...again.pageFigure] })).toBe(JSON.stringify({ ...idx, pageFigure: [...idx.pageFigure] }));
  });
});
