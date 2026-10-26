import type { Field, Flow } from "@/content/types";
import { mmddyyOf, mmddyyToRecordDate, ordinal, parseMmddyy, parseRecordDate } from "@/terminal/dates";
import { inputRule } from "@/terminal/engine";
import { DATE_FIELDS, fieldForStep } from "@/terminal/fieldSteps";
import { describeRule, normalizeInput, validate } from "@/terminal/patterns";
import type { RecordType, StoredRecord } from "@/terminal/types";

export type Column = { key: string; label: string; text(r: StoredRecord): string; sort(r: StoredRecord): string | number };
export type DrawingKind = "drawing" | "eo";

/** Drawing and E.O. records share one data base; an E.O. is a record with an E.O. number and no drawing number. */
export const isEo = (r: StoredRecord) => !!r.values.eoNumber && !r.values.drawingNumber;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The program keeps two-digit years; reading them as 1970 to 2069 keeps a record entered today from showing as 1926. */
const fullYear = (y: number) => (y < 70 ? 2000 + y : 1900 + y);

export function formatDate(s: string | undefined): string {
  const d = parseRecordDate(s);
  return d ? `${MONTHS[d.m - 1] ?? d.m} ${d.d}, ${fullYear(d.y)}` : "";
}

const dateSort = (s: string | undefined) => {
  const d = parseRecordDate(s);
  return d ? ordinal({ ...d, y: fullYear(d.y) - 1900 }) : "";
};

const text = (name: string): Pick<Column, "text" | "sort"> => ({
  text: (r) => r.values[name] ?? "",
  sort: (r) => (r.values[name] ?? "").toUpperCase(),
});
const date = (name: string): Pick<Column, "text" | "sort"> => ({
  text: (r) => formatDate(r.values[name]),
  sort: (r) => dateSort(r.values[name]),
});
const either = (drawing: string, eo: string): Pick<Column, "text" | "sort"> => ({
  text: (r) => r.values[isEo(r) ? eo : drawing] ?? "",
  sort: (r) => (r.values[isEo(r) ? eo : drawing] ?? "").toUpperCase(),
});
const eitherDate = (drawing: string, eo: string): Pick<Column, "text" | "sort"> => ({
  text: (r) => formatDate(r.values[isEo(r) ? eo : drawing]),
  sort: (r) => dateSort(r.values[isEo(r) ? eo : drawing]),
});

export const COLUMNS: Record<RecordType, Column[]> = {
  correspondence: [
    { key: "inputDate", label: "Input date", ...date("inputDate") },
    { key: "authorSource", label: "Author/source", ...text("authorSource") },
    { key: "subject", label: "Subject", ...text("subject") },
    { key: "documentLetterNumber", label: "Letter number", ...text("documentLetterNumber") },
    { key: "documentDate", label: "Document date", ...date("documentDate") },
  ],
  dir: [
    { key: "dirReportNumber", label: "DIR/report number", ...text("dirReportNumber") },
    { key: "title", label: "Title", ...text("title") },
    { key: "date", label: "Date", ...date("date") },
    { key: "system", label: "System", ...text("system") },
    { key: "vehicle", label: "Vehicle", ...text("vehicle") },
  ],
  "drawing-eo": [
    { key: "kind", label: "Type", text: (r) => (isEo(r) ? "E.O." : "Drawing"), sort: (r) => (isEo(r) ? "E.O." : "Drawing") },
    { key: "number", label: "Number", ...either("drawingNumber", "eoNumber") },
    { key: "title", label: "Title", ...either("title", "eoTitle") },
    { key: "date", label: "Date", ...eitherDate("date", "eoDate") },
    { key: "vehicle", label: "Vehicle", ...either("vehicle", "eoVehicle") },
  ],
};

export const RECORD_LABELS: Record<RecordType, { nav: string; singular: string; plural: string }> = {
  correspondence: { nav: "Correspondence", singular: "correspondence record", plural: "correspondence records" },
  dir: { nav: "DIR / Reports", singular: "DIR or report", plural: "DIRs and reports" },
  "drawing-eo": { nav: "Drawings / E.O.", singular: "drawing or E.O.", plural: "drawings and E.O.s" },
};

/** The record's own identifier, for headings. */
export function recordTitle(record: RecordType, r: StoredRecord): string {
  const v = r.values;
  if (record === "correspondence") return v.subject || v.documentLetterNumber || "Correspondence record";
  if (record === "dir") return v.dirReportNumber || v.title || "DIR or report";
  return isEo(r) ? `E.O. ${v.eoNumber}` : `Drawing ${v.drawingNumber ?? ""}`.trim();
}

const AUTO_FIELDS = new Set(["inputDate", "dailyCounter"]);
const EO_FIELDS = new Set(["eoTitle", "eoNumber", "eoRevision", "eoDate", "eoRevisionDate", "eoVehicle"]);

/** The fields a new record asks for, in the field layout's order. Dates and counters the program stamps itself are left out. */
export function formFields(fields: Field[], record: RecordType, kind: DrawingKind = "drawing"): Field[] {
  return fields.filter((f) => {
    if (AUTO_FIELDS.has(f.name)) return false;
    if (record !== "drawing-eo") return true;
    return kind === "eo" ? EO_FIELDS.has(f.name) : !EO_FIELDS.has(f.name);
  });
}

/** The field a record cannot be filed without; Search and Archive find the record by it. */
export function requiredField(record: RecordType, kind: DrawingKind = "drawing"): string {
  if (record === "correspondence") return "subject";
  if (record === "dir") return "dirReportNumber";
  return kind === "eo" ? "eoNumber" : "drawingNumber";
}

export const isDateField = (name: string) => DATE_FIELDS.has(name);

const WORDS = /(\d+) characters per word, (\d+) words/;

/** Longest value the field holds: its printed length, times the word count for multi-word fields like TITLE. */
export function fieldMax(f: Field): number | undefined {
  const m = WORDS.exec(f.description);
  return m ? Number(m[1]) * Number(m[2]) : f.length;
}

/** `yyyy-mm-dd` from a date input as the `MMDDYY` the 1979 prompts take. */
export function isoToMmddyy(iso: string): string {
  const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(iso);
  return m ? `${m[2]}${m[3]}${m[1].slice(2)}` : "";
}

/** The input step that fills a field, so the form can apply the rule the terminal applies to it. */
function stepFor(flow: Flow | undefined, record: RecordType, name: string) {
  return flow?.steps.find((s) => s.n >= 100 && s.n < 200 && s.input && fieldForStep(record, s.n) === name);
}

/**
 * Checks one form value with the same rule the 1979 prompt applies to that item.
 * Returns the problem in plain words, or undefined when the value is acceptable.
 */
export function checkField(flow: Flow | undefined, record: RecordType, f: Field, raw: string): string | undefined {
  if (raw.trim() === "") return undefined;
  if (isDateField(f.name)) {
    const value = isoToMmddyy(raw);
    return parseMmddyy(value) && validate({ kind: "date" }, value).ok ? undefined : "Enter a real date";
  }
  const value = normalizeInput(raw);
  const step = stepFor(flow, record, f.name);
  const rule = step ? inputRule(record, step) : undefined;
  if (rule && !validate(rule, value, { allowBlank: true }).ok) return describeRule(rule);
  const max = fieldMax(f);
  if (max !== undefined && value.length > max) return `Up to ${max} characters`;
  return undefined;
}

/** The values to store: uppercase as the terminal stores them, dates as `M-D-YY`, blanks dropped. */
export function toStoredValues(fields: Field[], form: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    const raw = form[f.name] ?? "";
    if (raw.trim() === "") continue;
    out[f.name] = isDateField(f.name) ? mmddyyToRecordDate(isoToMmddyy(raw)) : normalizeInput(raw);
  }
  return out;
}

/** Stamps a new correspondence record the way the program does: input date today, next daily counter. */
export function stampCorrespondence(values: Record<string, string>, existing: StoredRecord[], now: Date) {
  const inputDate = mmddyyToRecordDate(mmddyyOf(now));
  const sameDay = existing.filter((r) => r.values.inputDate === inputDate).length;
  const dailyCounter = String(sameDay + 1);
  return {
    values: { ...values, inputDate, dailyCounter },
    dateCode: `${mmddyyOf(now)}${dailyCounter.padStart(4, "0")}`,
  };
}

export const searchableFields = (fields: Field[]): Field[] => fields.filter((f) => f.searchable && !AUTO_FIELDS.has(f.name));

/** Keeps records whose searchable items contain the query (or the one chosen item, when `scope` is not "all"). */
export function filterRecords(records: StoredRecord[], searchable: Field[], query: string, scope: string): StoredRecord[] {
  const q = query.trim().toUpperCase();
  if (!q) return records;
  const names = scope === "all" ? searchable.map((f) => f.name) : [scope];
  return records.filter((r) => names.some((n) => (r.values[n] ?? "").toUpperCase().includes(q)));
}

export function sortRecords(records: StoredRecord[], column: Column | undefined, dir: "asc" | "desc"): StoredRecord[] {
  if (!column) return records;
  const sign = dir === "asc" ? 1 : -1;
  return [...records].sort((a, b) => {
    const x = column.sort(a);
    const y = column.sort(b);
    // Blanks sort last in both directions.
    if (x === "" || y === "") return x === y ? 0 : x === "" ? 1 : -1;
    return x < y ? -sign : x > y ? sign : 0;
  });
}
