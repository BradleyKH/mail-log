import { describe, expect, it } from "vitest";
import {
  buildXref,
  extractCalls,
  extractFiles,
  extractLiterals,
  lineIds,
  matchStep,
  normalizePrompt,
  parseHeader,
  renameByCallSite,
  snapCall,
  splitRoutines,
  statements,
  type SourceLine,
  type SplitRoutine,
} from "./build-code-index.ts";
import type { Flow, RoutineEntry } from "../src/content/types.ts";

const card = (label: string, text: string, cont = " ") => `${label.padEnd(5)}${cont}${text}`;
const line = (code: string, over: Partial<SourceLine> = {}): SourceLine => ({
  pdfPage: 1,
  appendix: "B",
  sectionId: "B.MAIN",
  seq: null,
  code,
  reviewed: false,
  ...over,
});
const known = ["MAIN", "AUSEA", "SCRNHD", "SCRNPT", "HARDHD", "HARDPT", "JTIME", "OPEN", "SRCH$$", "COMI$$", "ARCDW", "ARCDR"];
const names = (rs: SplitRoutine[]) => rs.map((r) => `${r.name}:${r.lines.length}`);

describe("routine splitting", () => {
  it("splits at END, gives leading comments to the next routine, and names a headerless main from its section", () => {
    const rs = splitRoutines(
      [
        line(card("", "X=1")),
        line(card("", "END")),
        line("C     THE AUTHOR SEARCH", { pdfPage: 2, sectionId: "B.AUSEA" }),
        line(card("", "SUBROUTINE AUSEA"), { pdfPage: 2, sectionId: "B.AUSEA" }),
        line(card("", "RETURN"), { pdfPage: 2 }),
        line(card("", "END"), { pdfPage: 2 }),
      ],
      known,
    );
    expect(names(rs)).toEqual(["MAIN:2", "AUSEA:4"]);
    expect(rs[0].kind).toBe("main");
    expect(rs[1].kind).toBe("subroutine");
  });

  it("starts a routine at a header when OCR lost the END, carrying trailing comments forward", () => {
    const rs = splitRoutines(
      [line(card("", "SUBROUTINE SCRNHD(ITEM)")), line(card("", "RETURN")), line("C     NEXT"), line(card("", "SUBROUTINE SCRNPT(ITEM)"))],
      known,
    );
    expect(names(rs)).toEqual(["SCRNHD:2", "SCRNPT:2"]);
  });

  it("keeps a reprinted header in the same routine and snaps OCR'd header names", () => {
    const rs = splitRoutines(
      [line(card("", "SUBROUTINE JTIME(IYR)")), line(card("", "SUBROUTINE JTIME(IYR)")), line(card("", "END")), line(card("", "SUBROUTINE HAROHD(ITEM)"))],
      known,
    );
    expect(names(rs)).toEqual(["JTIME:3", "HARDHD:1"]);
  });

  it("reads END with right-margin speckle and a lost comment marker ahead of a header", () => {
    const rs = splitRoutines(
      [
        line(card("", "SUBROUTINE OPEN")),
        line(card("", "END") + " ".repeat(30) + "AN"),
        line(card("", "READ ONE LINE FROM CONSOLE")),
        line(card("", "SUBROUTINE AUSEA")),
      ],
      known,
    );
    expect(names(rs)).toEqual(["OPEN:2", "AUSEA:2"]);
  });

  it("starts a routine where an unnumbered appendix changes section between pages", () => {
    const rs = splitRoutines(
      [
        line(card("", "X=1"), { appendix: "F", sectionId: "F.PHASE2", pdfPage: 523 }),
        line(card("", "Y=2"), { appendix: "F", sectionId: "F.PHASE3", pdfPage: 524 }),
      ],
      known,
    );
    expect(names(rs)).toEqual(["PHASE2:1", "PHASE3:1"]);
  });

  it("renames a second same-named routine in one program to the near name the program calls", () => {
    const rs = splitRoutines(
      [
        line(card("", "CALL OPEN"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "END"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "SUBROUTINE OPEN"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "END"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "SUBROUTINE BSHT"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "CALL OPENN"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "END"), { appendix: "F", sectionId: "F.PHASE3" }),
        line(card("", "SUBROUTINE OPEN"), { appendix: "F", sectionId: "F.PHASE3" }),
      ],
      known,
    );
    const report: string[] = [];
    renameByCallSite(rs, report);
    expect(rs.map((r) => r.name)).toEqual(["PHASE3", "OPEN", "BSHT", "OPENN"]);
    expect(report).toHaveLength(1);
  });

  it("ignores comments that mention SUBROUTINE", () => {
    expect(parseHeader("C     SUBROUTINE CODE .")).toBeNull();
    expect(parseHeader(card("", "SUBROUTINE GETWRD (BUF sNAME,LEN)"))).toEqual({ keyword: "subroutine", name: "GETWRD" });
  });
});

describe("line ids", () => {
  it("numbers repeated $INSERT sequence numbers by ordinal and unnumbered lines as uN", () => {
    expect(lineIds([line("", { seq: 795 }), line("", { seq: 795 }), line("", { seq: 796 })])).toEqual(["0795.1", "0795.2", "0796.1"]);
    expect(lineIds([line(""), line("")])).toEqual(["u1", "u2"]);
  });
});

describe("extraction", () => {
  it("finds CALL targets, including one whose name sits on a continuation line", () => {
    const st = statements([
      { code: card("160", "CALL SCRNPT(ITEM)") },
      { code: card("", "IF(X.EQ.1) CALL") },
      { code: card("", "HARDHD(ITEM)", "1") },
      { code: "C     CALL NOTHIS" },
    ]);
    expect(extractCalls(st).map((c) => [c.name, c.index])).toEqual([
      ["SCRNPT", 0],
      ["HARDHD", 1],
    ]);
  });

  it("snaps OCR-mangled external calls by their leading part", () => {
    expect(snapCall("SKCHSSCK", known)).toBe("SRCH$$");
    expect(snapCall("COMI", known)).toBe("COMI$$");
    expect(snapCall("ARCDY", ["ARCDW", "SRCH$$"])).toBe("ARCDW");
  });

  it("extracts quoted and Hollerith text from FORMAT statements, one entry per printed line", () => {
    const [s] = statements([{ code: card("250", "FORMAT(' THERE ARE'I5' DOCUMENTS WITH A AUTHOR/SOURCE OF '/") }, { code: card("", "1 7A4,8HPAGE ONE)", "1") }]);
    expect(extractLiterals(s)).toEqual(["THERE ARE DOCUMENTS WITH A AUTHOR/SOURCE OF", "PAGE ONE"]);
    const [x] = statements([{ code: card("", "X=1") }]);
    expect(extractLiterals(x)).toEqual([]);
  });

  it("records file units and SRCH$$ file names", () => {
    const st = statements([{ code: card("", "READ(16,END=7000) DRW") }, { code: card("", "REWIND 16") }, { code: card("", "CALL SRCH$$(K$CLOS,'DRAW  ',6,0,0,0)") }]);
    expect(extractFiles(st).map((f) => `${f.kind}:${f.unit}:${f.op}`)).toEqual(["unit:16:read", "unit:16:rewind", "file:DRAW:close"]);
  });
});

describe("prompt matching", () => {
  it("drops the manual's input masks", () => {
    expect(normalizePrompt("THERE ARE XXX DOCUMENTS WITH AN AUTHOR/SOURCE OF AAAA")).toBe("THERE ARE DOCUMENTS WITH AN AUTHOR SOURCE OF");
  });

  it("matches a manual prompt to the routine that prints it despite A/AN and OCR noise", () => {
    const candidates = [
      { id: "AUSEA", prompts: [{ line: "0847.1", text: "THERE ARE DOCUMENTS WITH A AUTHOR/SOURCE OF %e" }] },
      { id: "SUBJ", prompts: [{ line: "0950.1", text: "THERE ARE DOCUMENTS CONTAINING THE WORD" }] },
      { id: "CNUM", prompts: [{ line: "0640.1", text: "WHAT IS THE CONTRACT NUMBER" }] },
    ];
    const m = matchStep(["THERE ARE XXX DOCUMENTS WITH AN AUTHOR/SOURCE OF AAAA"], candidates);
    expect(m[0]).toMatchObject({ routine: "AUSEA", line: "0847.1", promptLine: 0 });
    expect(m.some((x) => x.routine === "CNUM")).toBe(false);
  });

  it("builds both directions and lists unmatched steps and routines", () => {
    const entry = (id: string, prompts: string[]) =>
      ({ id, appendix: "B", prompts: prompts.map((text, i) => ({ line: `000${i + 1}.1`, text })) }) as unknown as RoutineEntry;
    const flow: Flow = {
      record: "correspondence",
      title: "t",
      entryStep: 330,
      steps: [
        { n: 330, mode: "search", prompt: ["THIS IS THE DOCUMENT AUTHOR/SOURCE SEARCH"], branches: [], next: "exit", figures: [], pdfPage: 1 },
        { n: 331, mode: "search", prompt: ["COMPLETELY UNRELATED WORDING HERE"], branches: [], next: "exit", figures: [], pdfPage: 1 },
      ],
    };
    const x = buildXref([flow], [entry("AUSEA", ["THIS IS THE DOCUMENT AUTHOR/SOURCE SEARCH"]), entry("OPEN", [])]);
    expect(x.stepToRoutines.map((s) => [s.step, s.matches[0].routine])).toEqual([[330, "AUSEA"]]);
    expect(x.routineToSteps).toEqual([{ routine: "AUSEA", steps: [{ record: "correspondence", step: 330, score: 1 }] }]);
    expect(x.unmatchedSteps).toEqual([{ record: "correspondence", step: 331 }]);
    expect(x.unmatchedRoutines).toEqual(["OPEN"]);
  });
});
