import { describe, expect, it } from "vitest";
import { createAnnotator, stepContext } from "./annotate";
import { listingLines, routineForSeq } from "./listing";
import { parseBody } from "./parseBody";
import { formatDocDate, groupDocs } from "./shelfGroups";

describe("parseBody", () => {
  it("splits prose and fenced blocks in order", () => {
    const blocks = parseBody("Intro line\n\nSecond para\n```text\nA  B\n```\nTail");
    expect(blocks.map((b) => b.type)).toEqual(["prose", "prose", "code", "prose"]);
    expect(blocks[2]).toEqual({ type: "code", lang: "text", code: "A  B" });
  });
});

describe("listingLines", () => {
  it("keeps columns and numbers repeated sequence ids", () => {
    const lines = listingLines("(0793)       SUBROUTINE AUSEA\n(0795) C      NOTE\n(0795)      1     X\nnoise");
    expect(lines.map((l) => l.id)).toEqual(["0793.1", "0795.1", "0795.2", "x3"]);
    expect(lines[0].text).toBe("      SUBROUTINE AUSEA");
    expect(lines[1].text.startsWith("C")).toBe(true);
  });

  it("chooses the routine whose sequence range holds the line", () => {
    const a = { id: "A", firstSeq: 1, lastSeq: 10 };
    const b = { id: "B", firstSeq: 11, lastSeq: 20 };
    expect(routineForSeq([a, b] as never, 15)?.id).toBe("B");
    expect(routineForSeq([a, b] as never, 99)?.id).toBe("A");
  });
});

describe("annotator", () => {
  const glossary = [{ term: "DIR", definition: "Drawing index record", pdfPage: 150 }];

  it("links step references and Go to targets", () => {
    const segs = createAnnotator({ steps: true, glossary: [] })("Step #30 SEARCH. Go to #17");
    expect(segs.filter((s) => s.kind === "step").map((s) => (s.kind === "step" ? s.n : 0))).toEqual([30, 17]);
  });

  it("marks each glossary term once", () => {
    const annotate = createAnnotator({ steps: false, glossary });
    const first = annotate("the DIR file and another DIR");
    expect(first.filter((s) => s.kind === "term")).toHaveLength(1);
    expect(annotate("DIR again").some((s) => s.kind === "term")).toBe(false);
  });

  it("derives the record and numbering base from the section", () => {
    expect(stepContext("4.1.3.2")).toEqual({ record: "correspondence", base: 300 });
    expect(stepContext("4.3.1")).toEqual({ record: "drawing-eo", base: 100 });
    expect(stepContext("4.2")).toEqual({ record: "dir", base: 0 });
    expect(stepContext("5.1")).toBeUndefined();
  });
});

describe("shelf groups", () => {
  const doc = (docId: string, date: string) => ({ docId, date }) as never;

  it("formats a doc date as month and year", () => {
    expect(formatDocDate("1979-05")).toBe("May 1979");
    expect(formatDocDate("1985-07")).toBe("July 1985");
  });

  it("splits docs by date and drops empty groups", () => {
    const groups = groupDocs([doc("a", "1979-05"), doc("b", "1985-07"), doc("c", "1985-07")]);
    expect(groups.map((g) => g.docs.length)).toEqual([1, 2]);
    expect(groupDocs([doc("a", "1985-07")]).map((g) => g.group.date)).toEqual(["1985-07"]);
  });
});
