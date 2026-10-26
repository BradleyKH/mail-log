import type { RecordType } from "./types";

/**
 * Which record field each data-entry step fills, read from the step prompts' `(N) LABEL` lines
 * and the field layouts (cr-159065 Figures 3, 6, 8, 9).
 */
export const FIELD_STEPS: Record<RecordType, Record<number, string>> = {
  correspondence: {
    106: "mailStatus",
    108: "authorSource",
    109: "documentDate",
    110: "toAddressee",
    111: "documentLetterNumber",
    112: "subject",
    113: "routing",
    115: "waNumberIdCode",
    117: "contractNumber",
    118: "actionDueDate",
    119: "referencedDocuments",
    120: "fileSystemCode",
    121: "responsibleEngineer",
    122: "description",
    212: "authorSource",
    213: "documentLetterNumber",
    214: "actionDueDate",
    215: "fileSystemCode",
    216: "responsibleEngineer",
  },
  dir: {
    101: "dirReportNumber",
    106: "title",
    107: "dirReportNumber",
    108: "date",
    109: "system",
    110: "waNumberIdCode",
    112: "vehicle",
    113: "revision",
    114: "revisionDate",
  },
  "drawing-eo": {
    102: "title",
    103: "drawingNumber",
    104: "date",
    105: "system",
    106: "vehicle",
    107: "section",
    108: "numberOfSheets",
    109: "sheetRevision",
    110: "numberOfEos",
    115: "sheetRevision",
    116: "numberOfEos",
    120: "eoTitle",
    121: "eoNumber",
    122: "eoRevision",
    123: "eoDate",
    124: "eoRevisionDate",
    125: "eoVehicle",
    218: "sheetRevision",
  },
};

/** Date fields, stored as the samples print them (`M-D-YY`). */
export const DATE_FIELDS = new Set(["documentDate", "actionDueDate", "inputDate", "date", "revisionDate", "eoDate", "eoRevisionDate"]);

/** Revise-by-item-number targets: the manual numbers each record's items `(1)` to `(N)` in input mode. */
export const ITEM_STEPS: Record<string, Record<number, number>> = {
  correspondence: { 1: 106, 2: 108, 3: 109, 4: 110, 5: 111, 6: 112, 7: 113, 8: 114, 9: 115, 10: 117, 11: 118, 12: 119, 13: 120, 14: 121 },
  dir: { 1: 106, 2: 107, 3: 108, 4: 109, 5: 110, 6: 112, 7: 113, 8: 114 },
  drawing: { 1: 102, 2: 103, 3: 104, 4: 105, 5: 106, 6: 107, 7: 108, 8: 109, 9: 111 },
  eo: { 1: 120, 2: 121, 3: 122, 4: 123, 5: 124, 6: 125 },
};

export const fieldForStep = (record: RecordType, n: number): string | undefined => FIELD_STEPS[record][n];
