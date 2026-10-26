import { parseRecordDate } from "./dates";
import type { StoredRecord } from "./types";

const WIDTH = 79;

/** Dates as the output figures print them: `8- 3-78`, `10-10-78`. */
export function printDate(s: string | undefined): string {
  const ymd = parseRecordDate(s);
  if (!ymd) return s?.trim() ? " 0- 0- 0" : "";
  return `${String(ymd.m).padStart(2)}-${String(ymd.d).padStart(2)}-${String(ymd.y).padStart(2, "0")}`;
}

const boxLine = (text: string) => `* ${text.padEnd(WIDTH - 4)} *`;
const centered = (text: string) => {
  const pad = Math.max(0, Math.floor((WIDTH - 4 - text.length) / 2));
  return boxLine(" ".repeat(pad) + text);
};

/** The correspondence search header box (Figure 27 and its siblings). */
export function correspondenceHeader(title: string): string[] {
  const rule = "*".repeat(WIDTH);
  return [
    rule,
    centered(title),
    boxLine("SUBJECT"),
    boxLine("TYPE/LETTER NUMBER     FILE SYSTEM CODE        INPUT DATE-CODE"),
    boxLine("REFERENCED DOCUMENTS"),
    rule,
  ];
}

export function correspondenceEntry(r: StoredRecord): string[] {
  const v = r.values;
  const dln = (v.documentLetterNumber ?? "").padEnd(15);
  const fsc = (v.fileSystemCode ?? "").padEnd(9);
  const counter = (v.dailyCounter ?? "").padStart(5);
  return ["", v.subject ?? "", `${dln} ${fsc} /${" ".repeat(17)}${printDate(v.inputDate).padStart(9)}${counter}`, v.referencedDocuments || "NONE"];
}

/** A DIR/report record (Figure 39). */
export function dirEntry(r: StoredRecord): string[] {
  const v = r.values;
  const vehicle = (v.vehicle ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => x.padStart(3))
    .join("   ");
  return [
    "",
    "(1) TITLE",
    v.title ?? "",
    "(2) DIR/REPORT NUMBER   (8) REVISION",
    `${(v.dirReportNumber ?? "").padEnd(24)}${v.revision ?? ""}`,
    "(3) DOCUMENT DATE       (9) REVISION DATE",
    `${printDate(v.date).padEnd(24)}${printDate(v.revisionDate)}`,
    "(4) SYSTEM",
    v.system ?? "",
    "(5) W.A. NUMBER/ID CODE",
    v.waNumberIdCode ?? "",
    "(6) CONTRACT NUMBER",
    v.contractNumber ?? "",
    "(7) VEHICLE",
    vehicle,
  ];
}

/** One E.O. line (Figure 43). */
export function eoLine(r: StoredRecord, n: number): string {
  const v = r.values;
  return `${`${n}.`.padEnd(4)}${(v.eoNumber ?? "").padEnd(10)}REV ${(v.eoRevision ?? "").padEnd(6)} ${printDate(v.eoDate).padEnd(12)} ${v.eoVehicle ?? ""}`;
}

/** A drawing sheet with its referenced E.O.s (Figures 41 and 42). */
export function drawingEntry(r: StoredRecord, n: number, eos: StoredRecord[], brief: boolean): string[] {
  const v = r.values;
  const lines = [
    "",
    `${" ".repeat(6)}${n}. DRAWING TITLE`,
    v.title ?? "",
    `${" ".repeat(10)}DRAWING NUMBER ${(v.drawingNumber ?? "").padEnd(22)}DATE ${printDate(v.date)}`,
    `${" ".repeat(11)}SHEET# ${(v.sheetNumber ?? "").padStart(2)}          REV ${v.sheetRevision ?? ""}`,
  ];
  if (brief) return lines;
  referencedEos(v.eosReferenced).forEach((eo, i) => {
    const found = eos.find((e) => e.values.eoNumber === eo);
    const rev = found?.values.eoRevision ?? "";
    lines.push(`${" ".repeat(12)}${i + 1}. ${eo.padEnd(9)} REV ${rev.padEnd(5)} ${printDate(found?.values.eoDate)}`);
  });
  return lines;
}

export const referencedEos = (s: string | undefined) => (s ?? "").split(/[\s,;]+/).filter(Boolean);
