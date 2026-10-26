import { describe, expect, it } from "vitest";
import {
  DOC_IDS,
  docMetaSchema,
  spadsFieldSchema,
  spadsJobOrderSchema,
  spadsMonthSchema,
  spadsRecordSchema,
  spadsReportSchema,
  spadsTablesSchema,
  parsePageFile,
} from "./schema";

const page = (fm: string, body = "Body text.\n") => `---\n${fm}\n---\n${body}`;
const base = "pdfPage: 3\nfolio: \"iii\"\nsectionId: null\nkind: text\nsource: ocr\nconfidence: 82.5\nfigures: [\"1\", \"5.4.1-17\"]";

describe("parsePageFile", () => {
  it("splits frontmatter from the body", () => {
    const { frontmatter, body } = parsePageFile(page(base));
    expect(frontmatter).toMatchObject({ pdfPage: 3, folio: "iii", kind: "text", figures: ["1", "5.4.1-17"] });
    expect(body).toBe("Body text.\n");
  });

  it("accepts CRLF line endings", () => {
    expect(parsePageFile(page(base).replace(/\n/g, "\r\n")).frontmatter.pdfPage).toBe(3);
  });

  it("rejects unknown keys, bad kinds, and an unquoted numeric folio", () => {
    expect(() => parsePageFile(page(`${base}\nextra: 1`))).toThrow();
    expect(() => parsePageFile(page(base.replace("kind: text", "kind: prose")))).toThrow();
    expect(() => parsePageFile(page(base.replace('folio: "iii"', "folio: 3")))).toThrow();
  });

  it("requires a frontmatter block", () => {
    expect(() => parsePageFile("No frontmatter here.")).toThrow(/missing frontmatter/);
  });
});

describe("doc meta and page source", () => {
  const meta = { docId: "cr-177948", reportNumber: "CR-177948", title: "T", date: "1985-07", ntrsId: "19850024000", pdfPath: "a.pdf", stem: "a", pageCount: 3 };

  it("accepts the 1985 docIds and date, and rejects others", () => {
    expect(DOC_IDS).toHaveLength(7);
    expect(docMetaSchema.safeParse(meta).success).toBe(true);
    expect(docMetaSchema.safeParse({ ...meta, date: "1985-08" }).success).toBe(false);
    expect(docMetaSchema.safeParse({ ...meta, docId: "cr-177951" }).success).toBe(false);
  });

  it("accepts source ai and rejects unknown sources", () => {
    expect(parsePageFile(page(base.replace("source: ocr", "source: ai"))).frontmatter.source).toBe("ai");
    expect(() => parsePageFile(page(base.replace("source: ocr", "source: guess")))).toThrow();
  });
});

describe("SPADS schemas", () => {
  const field = { n: 1, name: "SYSNUM", label: "System number", description: "d", pdfPage: 5 };
  const jobOrder = { jo: "J1", sub: "A", progno: "P1", all: 100, fy: [50, 50] };
  const month = { month: "JUL85", cmaa: "X", eacHours: 1, eacDollars: 2, actHours: 3, actDollars: 4, compHours: 5, compDollars: 6 };
  const record = {
    sysnum: "S1", date: "850701", status: "AUT", title: "t", mods: [], contractor: "c", remarks: "", nr: "", cr: "", rbk: "", pr: "",
    contract: "NAS1", task: "1", taskas: "", tasksb: "", wan: "", wacode: "", complete: false, rtHours: 1, rtDollars: 2, totHours: 3,
    totDollars: 4, fee: 5, table: "SUST", jobOrders: [jobOrder], months: [month], sourcePages: [10],
  };
  const tables = {
    fee: [{ contract: "NAS1", task: "1", subtask: "A", fee: 1, pdfPage: 3 }],
    rates: [{ task: "1", fy: "85", hourRate: 1, dollarRate: 2, illustrative: true }],
    sustaining: [{ task: "1", jo: "J1", subtask: "A", fy: { "85": 10 } }],
    programNumbers: [{ jo: "J1", progno: "P1" }],
    time: [{ task: "1", start: "8501", end: "8512", contractValue: 1, baseFee: 2 }],
  };
  const report = { id: "O-4", title: "t", pdfPages: [9], options: ["A"], printout: "x", verified: [{ what: "total", result: "ok" }] };

  it("accepts valid samples", () => {
    expect(spadsFieldSchema.safeParse({ ...field, partial: true }).success).toBe(true);
    expect(spadsJobOrderSchema.safeParse(jobOrder).success).toBe(true);
    expect(spadsMonthSchema.safeParse(month).success).toBe(true);
    expect(spadsRecordSchema.safeParse(record).success).toBe(true);
    expect(spadsTablesSchema.safeParse(tables).success).toBe(true);
    expect(spadsReportSchema.safeParse(report).success).toBe(true);
  });

  it("accepts unprinted record status and table, and masked fees", () => {
    expect(spadsRecordSchema.safeParse({ ...record, status: "", table: "" }).success).toBe(true);
    const masked = { contract: "NAS1", task: "1", subtask: "ALL", fee: null, masked: "**.060", pdfPage: 3 };
    expect(spadsTablesSchema.safeParse({ ...tables, fee: [masked] }).success).toBe(true);
    expect(spadsRecordSchema.safeParse({ ...record, table: "AUTO" }).success).toBe(false);
    expect(spadsTablesSchema.safeParse({ ...tables, fee: [{ ...masked, fee: "**.060" }] }).success).toBe(false);
  });

  it("rejects invalid samples", () => {
    expect(spadsFieldSchema.safeParse({ ...field, extra: 1 }).success).toBe(false);
    expect(spadsJobOrderSchema.safeParse({ ...jobOrder, fy: Array(9).fill(1) }).success).toBe(false);
    expect(spadsMonthSchema.safeParse({ ...month, month: "July 1985" }).success).toBe(false);
    expect(spadsRecordSchema.safeParse({ ...record, status: "OLD" }).success).toBe(false);
    expect(spadsTablesSchema.safeParse({ ...tables, fee: [{ contract: "NAS1" }] }).success).toBe(false);
    expect(spadsReportSchema.safeParse({ ...report, pdfPages: [] }).success).toBe(false);
  });
});
