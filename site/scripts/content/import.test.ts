import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { parsePageFile } from "../../src/content/schema.ts";
import { repairStatement, type RepairContext } from "./fortran.ts";
import { estimateX1 } from "./geometry.ts";
import { routinesForPage, runImport, sectionFor, serializePage } from "./import.ts";
import { assignSequence, buildCard, seqSimilarity, type ListingPage } from "./listing.ts";
import { classifyProse, detectFolio, normalizeProse } from "./prose.ts";
import { snapJoint, snapRoutine } from "./routines.ts";
import type { Word } from "./tsv.ts";

const known = ["AUSEA", "SCRNHD", "SCRNPT", "HARDHD", "HARDPT", "BRAKET", "JTIME", "SRCH$$", "CLEAR", "MAIN"];
const ctx: RepairContext = { known, labels: new Set(["300", "250"]) };
const fix = (s: string) => repairStatement(s, ctx);

describe("FORTRAN statement repair", () => {
  it("restores dotted operators, the IF paren, and the paren misread as I before GO TO", () => {
    const r = fix("IFCTEVDeLEoTIMeANDsTIMeLEeTLVDIGO TO 890");
    expect(r.text).toBe("IF(TEVD.LE.TIM.AND.TIM.LE.TLVD)GO TO 890");
    expect(r.rules).toEqual(expect.arrayContaining(["rel-op", "goto-paren", "if-paren"]));
    expect(r.unresolved).toEqual([]);
  });

  it("opens a CALL's arguments after the routine name", () => {
    expect(fix("CALL SCRNHDCITEM)").text).toBe("CALL SCRNHD(ITEM)");
    expect(fix("CALL JTIMECTYeIMe ID)").text).toBe("CALL JTIME(TY,IM, ID)");
  });

  it("closes subscripts before the statement's own paren", () => {
    expect(fix("IF CATHRCI) eNESDACI)) GO TO 100").text).toBe("IF (ATHR(I).NE.DA(I)) GO TO 100");
  });

  it("puts the comma back in an I/O control list only when the format label exists", () => {
    expect(fix("WRITEC19300)").text).toBe("WRITE(1,300)");
    expect(fix("WRITE(19400)").text).toBe("WRITE(19400)");
    expect(fix("WRITEC1 e250) KNTsDA").text).toBe("WRITE(1,250) KNT,DA");
  });

  it("snaps misspelled keywords but never an assignment target", () => {
    expect(fix("RF TURN").text).toBe("RETURN");
    expect(fix("SUHROUTINE AUSEA").text).toBe("SUBROUTINE AUSEA");
    expect(fix("RETRUN=1").text).toBe("RETRUN=1");
    expect(fix("00 101 I=1,97").text).toBe("DO 101 I=1,97");
  });

  it("snaps routine names to the known list and reports unknown ones", () => {
    const r = fix("CALL HAROHDCITEM)");
    expect(r.text).toBe("CALL HARDHD(ITEM)");
    expect(r.rules).toContain("routine-snap");
    expect(fix("CALL ZZTOP").unresolved).toContain("routine ZZTOP");
  });

  it("fixes O and 0 by context", () => {
    expect(fix("GO TO 1O0").text).toBe("GO TO 100");
    expect(fix("IPRINT=O").text).toBe("IPRINT=0");
    expect(fix("C0NTINUE").text).toBe("CONTINUE");
  });

  it("leaves FORMAT text alone apart from the paren and misread apostrophes", () => {
    expect(fix("FORMATC* THERE ARE*I5* DOCUMENTS*)").text).toBe("FORMAT(' THERE ARE'I5' DOCUMENTS')");
  });

  it("reports unbalanced parentheses it cannot place", () => {
    expect(fix("X=A(B").unresolved).toContain("unbalanced parentheses");
  });
});

describe("routine names", () => {
  it("snaps within two edits and refuses ties", () => {
    expect(snapRoutine("HAROHD", known)).toBe("HARDHD");
    expect(snapRoutine("8RAKET", known)).toBe("BRAKET");
    expect(snapRoutine("SRCHSS", known)).toBe("SRCH$$");
    expect(snapRoutine("QQQQQQ", known)).toBeNull();
  });

  it("combines header and statement readings", () => {
    expect(snapJoint(["SCRNPO", "SCRNHO"], known)).toBe("SCRNHD");
  });
});

describe("sequence reconstruction", () => {
  it("scores OCR'd sequence tokens tolerantly", () => {
    expect(seqSimilarity("(0820)", 820)).toBe(4);
    expect(seqSimilarity("ce81.5)", 815)).toBeGreaterThan(3);
    expect(seqSimilarity("(OF25)", 823)).toBeGreaterThan(seqSimilarity("(OF25)", 900));
  });

  it("follows consecutive numbers through misreads and a dropped line", () => {
    const rows = [
      { seqRaw: "ce81.5)", slot: 0 },
      { seqRaw: "(0517)", slot: 1 },
      { seqRaw: "(C0610)", slot: 2 },
      { seqRaw: "coe19)", slot: 3 },
      { seqRaw: "(0820)", slot: 4 },
      { seqRaw: null, slot: 6 },
      { seqRaw: "(0823)", slot: 7 },
    ];
    expect(assignSequence(rows, null)).toEqual([816, 817, 818, 819, 820, 822, 823]);
  });

  it("repeats the number across $INSERT lines", () => {
    const rows = ["(0304)", "(0305)", "(0305)", "(6305)", "(0305)", "(0365)", "(0306)", "(0307)"].map((seqRaw, slot) => ({ seqRaw, slot }));
    expect(assignSequence(rows, 303)).toEqual([304, 305, 305, 305, 305, 305, 306, 307]);
  });

  it("uses continuity from the previous page as a prior", () => {
    expect(assignSequence([{ seqRaw: "(OO6l)", slot: 0 }, { seqRaw: null, slot: 1 }], 60)).toEqual([61, 62]);
  });
});

const word = (text: string, left: number, conf = 90): Word => ({ block: 1, par: 1, line: 1, left, top: 100, width: text.length * 20, height: 25, conf, text });

describe("card columns", () => {
  const grid = { pitch: 22.8, x1: 1274, seqX: 1097, linePitch: 38 };
  const col = (c: number) => 1274 + (c - 1) * 22.8;

  it("puts comments in column 1, labels in 1 to 5, and statements from 7", () => {
    expect(buildCard([word("¢", col(1)), word("SET", col(8)), word("UP", col(12))], grid, ctx).card).toBe("C      SET UP");
    expect(buildCard([word("890", col(1)), word("CONTINUE", col(7))], grid, ctx).card).toBe("890   CONTINUE");
  });

  it("marks continuation lines in column 6 and leaves them unrepaired", () => {
    expect(buildCard([word("1", col(6)), word("7A4)", col(12))], grid, ctx).card).toBe("     1     7A4)");
  });

  it("drops anything past column 72", () => {
    const c = buildCard([word("GO", col(7)), word("TO", col(10)), word("100", col(13)), word("Se", col(80), 30)], grid, ctx);
    expect(c.card).toBe("      GO TO 100");
  });

  it("anchors column 7 where most statements start", () => {
    const lefts = [1411, 1412, 1411, 1274, 1412, 1275, 1410];
    expect(Math.round(estimateX1(lefts, 22.8))).toBe(1274);
  });
});

describe("prose", () => {
  it("detects printed folios", () => {
    expect(detectFolio(["Some text", "", "- 18 -"])).toEqual({ folio: "18", index: 2 });
    expect(detectFolio(["-iii-", "text"]).folio).toBe("iii");
    expect(detectFolio(["text", "B-25"]).folio).toBe("B-25");
    expect(detectFolio(["text", "K-12"]).folio).toBe("K-12");
    expect(detectFolio(["text", "", "- page 11 -"])).toEqual({ folio: "11", index: 2 });
    expect(detectFolio(["text", "~- page 42 -"]).folio).toBe("42");
    expect(detectFolio(["text", "more text"]).folio).toBeNull();
  });

  it("drops junk lines, rejoins hyphenation, and fences aligned columns", () => {
    const text = ["The program sub-", "routine runs.", "|", "", "", "1.0   INTRODUCTION     1", "2.0   DEFINITIONS      4", "", "- 3 -"].join("\n");
    const r = normalizeProse(text, []);
    expect(r.folio).toBe("3");
    expect(r.body).toBe(["The program subroutine", "runs.", "", "```text", "1.0   INTRODUCTION     1", "2.0   DEFINITIONS      4", "```"].join("\n"));
  });

  it("escapes leading Markdown syntax without rewording", () => {
    expect(normalizeProse("# of records\n> 5 items", []).body).toBe("\\# of records\n\\> 5 items");
  });

  it("classifies by the share of confident words", () => {
    expect(classifyProse({ total: 2, good: 1, conf: 10 }, "")).toBe("blank");
    expect(classifyProse({ total: 100, good: 90, conf: 90 }, "")).toBe("text");
    expect(classifyProse({ total: 100, good: 45, conf: 60 }, "")).toBe("mixed");
    expect(classifyProse({ total: 100, good: 10, conf: 30 }, "")).toBe("figure");
    const banner = Array.from({ length: 5 }, () => "*".repeat(30)).join("\n");
    expect(classifyProse({ total: 100, good: 90, conf: 90 }, banner)).toBe("figure");
  });
});

describe("page assembly", () => {
  it("serializes frontmatter that parses back", () => {
    const raw = serializePage(
      { pdfPage: 87, folio: null, sectionId: "B.AUSEA", kind: "listing", source: "ocr", confidence: 72.2, figures: [], listing: { appendix: "B", routines: ["AUSEA"], listingPage: 71 } },
      "```fortran\n(0817)       GO TO 100\n```",
    );
    const { frontmatter, body } = parsePageFile(raw);
    expect(frontmatter.listing).toEqual({ appendix: "B", routines: ["AUSEA"], listingPage: 71 });
    expect(body).toBe("```fortran\n(0817)       GO TO 100\n```\n");
  });

  it("assigns the last section starting on or before the page", () => {
    const sections = [
      { id: "1.0", title: "A", level: 1, pdfPage: 3 },
      { id: "2.0", title: "B", level: 1, pdfPage: 5 },
      { id: "2.1", title: "C", level: 2, pdfPage: 5 },
    ];
    expect(sectionFor(sections, 2)).toBeNull();
    expect(sectionFor(sections, 6)).toBe("2.1");
    expect(sectionFor(null, 6)).toBeNull();
  });

  it("carries the current routine and switches on declarations", () => {
    const page = (p: Partial<ListingPage>): ListingPage => ({
      type: "code", body: [], listingPage: null, declared: [], declaredRaw: [], endBeforeFirstDeclared: false,
      headerRoutine: null, headerRaw: null, firstSeq: null, lastSeq: null, confidence: 0, problems: [], repairs: [], ...p,
    });
    const state = { current: "MAIN" as string | null };
    expect(routinesForPage(page({}), state, known)).toEqual(["MAIN"]);
    expect(routinesForPage(page({ declared: ["SCRNPT"], declaredRaw: ["SCRNPO"], headerRaw: "SCRNHO" }), state, known)).toEqual(["SCRNHD"]);
    expect(routinesForPage(page({ declared: ["CLEAR"], declaredRaw: ["CLEAR"], endBeforeFirstDeclared: true }), state, known)).toEqual(["SCRNHD", "CLEAR"]);
    expect(state.current).toBe("CLEAR");
  });
});

describe("runImport", () => {
  let dir: string;
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("copies an override verbatim in place of the OCR page and stays deterministic", () => {
    dir = mkdtempSync(path.join(tmpdir(), "import-"));
    const content = path.join(dir, "content");
    const build = path.join(dir, "build");
    const docDir = path.join(content, "docs", "cr-159065");
    mkdirSync(path.join(docDir, "overrides"), { recursive: true });
    writeFileSync(
      path.join(docDir, "doc.json"),
      JSON.stringify({ docId: "cr-159065", reportNumber: "NASA CR-159065", title: "T", date: "1979-05", ntrsId: "19810023338", pdfPath: "x.pdf", stem: "stem", pageCount: 2 }),
    );
    mkdirSync(path.join(build, "stem", "text"), { recursive: true });
    writeFileSync(path.join(build, "stem", "text", "page-001.txt"), "MAIL LOG\nProgram Operating Instructions\n\n- 1 -\n");
    writeFileSync(path.join(build, "stem", "text", "page-002.txt"), "garbled ocr text here\n");
    const override = "---\npdfPage: 2\nfolio: \"2\"\nsectionId: null\nkind: text\nsource: reviewed\nconfidence: 100\nfigures: []\n---\nReviewed text.\n";
    writeFileSync(path.join(docDir, "overrides", "page-002.md"), override);

    runImport({ contentDir: content, buildDir: build });
    const first = readFileSync(path.join(docDir, "pages", "page-001.md"), "utf8");
    expect(readFileSync(path.join(docDir, "pages", "page-002.md"), "utf8")).toBe(override);
    expect(parsePageFile(first).frontmatter).toMatchObject({ kind: "cover", source: "ocr", folio: "1", sectionId: null });

    runImport({ contentDir: content, buildDir: build });
    expect(readFileSync(path.join(docDir, "pages", "page-001.md"), "utf8")).toBe(first);
    expect(JSON.parse(readFileSync(path.join(content, "reports", "flags.json"), "utf8")).counts).toEqual({ "cr-159065": 0 });
  });
});
