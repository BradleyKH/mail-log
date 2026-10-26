import { describe, expect, it } from "vitest";
import { getFields, getFlow } from "@/content/load";
import type { StoredRecord } from "@/terminal/types";
import { checkField, filterRecords, formFields, formatDate, isoToMmddyy, searchableFields, sortRecords, stampCorrespondence, toStoredValues, COLUMNS } from "./todayModel";

const fields = (r: "correspondence" | "dir" | "drawing-eo") => getFields(r);
const rec = (values: Record<string, string>, id = "x"): StoredRecord => ({ id, record: "correspondence", origin: "session", values });

describe("Today form rules", () => {
  it("leaves out the stamped fields and splits drawings from E.O.s", () => {
    const names = formFields(fields("correspondence"), "correspondence").map((f) => f.name);
    expect(names).not.toContain("inputDate");
    expect(names).not.toContain("dailyCounter");
    expect(formFields(fields("drawing-eo"), "drawing-eo", "eo").map((f) => f.name)).toEqual(["eoTitle", "eoNumber", "eoRevision", "eoDate", "eoRevisionDate", "eoVehicle"]);
    expect(formFields(fields("drawing-eo"), "drawing-eo", "drawing").map((f) => f.name)).not.toContain("eoNumber");
  });

  it("applies the terminal's length and pattern rules", () => {
    const flow = getFlow("correspondence");
    const status = fields("correspondence").find((f) => f.name === "mailStatus")!;
    expect(checkField(flow, "correspondence", status, "AB")).toBeUndefined();
    expect(checkField(flow, "correspondence", status, "ABC")).toBeTruthy();
    const subject = fields("correspondence").find((f) => f.name === "subject")!;
    expect(checkField(flow, "correspondence", subject, "x".repeat(70))).toBeUndefined();
    expect(checkField(flow, "correspondence", subject, "x".repeat(71))).toBeTruthy();
  });

  it("reads dates as the MMDDYY the prompt takes", () => {
    const flow = getFlow("correspondence");
    const docDate = fields("correspondence").find((f) => f.name === "documentDate")!;
    expect(isoToMmddyy("1978-12-06")).toBe("120678");
    expect(checkField(flow, "correspondence", docDate, "1978-12-06")).toBeUndefined();
    expect(checkField(flow, "correspondence", docDate, "1978-02-31")).toBeTruthy();
    expect(toStoredValues([docDate], { documentDate: "1978-12-06" })).toEqual({ documentDate: "12-6-78" });
  });

  it("stores entries in capitals and drops blanks", () => {
    const subject = fields("correspondence").find((f) => f.name === "subject")!;
    const status = fields("correspondence").find((f) => f.name === "mailStatus")!;
    expect(toStoredValues([subject, status], { subject: " magsat test ", mailStatus: "" })).toEqual({ subject: "MAGSAT TEST" });
  });

  it("numbers the day's records and builds the date-code the 1979 Revise step takes", () => {
    const now = new Date(1979, 4, 7);
    const first = stampCorrespondence({ subject: "A" }, [], now);
    expect(first.dateCode).toBe("0507790001");
    const second = stampCorrespondence({ subject: "B" }, [rec({ inputDate: first.values.inputDate })], now);
    expect(second.dateCode).toBe("0507790002");
  });
});

describe("Today table", () => {
  const rows = [
    rec({ subject: "BETA", authorSource: "ZED", inputDate: "12-6-78" }, "a"),
    rec({ subject: "ALPHA", authorSource: "ABE", inputDate: "1-3-79" }, "b"),
    rec({ subject: "GAMMA" }, "c"),
  ];

  it("filters on searchable items only, optionally one item", () => {
    const searchable = searchableFields(fields("correspondence"));
    expect(filterRecords(rows, searchable, "alp", "all").map((r) => r.id)).toEqual(["b"]);
    expect(filterRecords(rows, searchable, "zed", "subject")).toEqual([]);
    expect(filterRecords(rows, searchable, "zed", "authorSource").map((r) => r.id)).toEqual(["a"]);
  });

  it("sorts dates chronologically and keeps blanks last either way", () => {
    const col = COLUMNS.correspondence[0];
    expect(sortRecords(rows, col, "asc").map((r) => r.id)).toEqual(["a", "b", "c"]);
    expect(sortRecords(rows, col, "desc").map((r) => r.id)).toEqual(["b", "a", "c"]);
  });

  it("formats record dates for reading", () => {
    expect(formatDate("12-6-78")).toBe("Dec 6, 1978");
    expect(formatDate("0-0-0")).toBe("");
    expect(formatDate("10-25-26")).toBe("Oct 25, 2026");
    expect(formatDate("12-31-69")).toBe("Dec 31, 2069");
    expect(formatDate("1-1-70")).toBe("Jan 1, 1970");
  });
});
