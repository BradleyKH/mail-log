import { loadCodeIndex, loadXref } from "@/content/load";
import type { CodeIndex, Xref } from "@/content/types";
import type { FortranLine } from "@/components/shared/fortranLines";

export const RECORD_LABELS: Record<string, string> = {
  correspondence: "Correspondence",
  dir: "DIR",
  "drawing-eo": "Drawing / E.O.",
  general: "General subroutines",
  support: "Support and test",
  external: "External",
};
export const RECORD_ORDER = ["correspondence", "dir", "drawing-eo", "general", "support", "external"];

export const routineHref = (id: string, line?: string) =>
  `/code/${encodeURIComponent(id)}${line ? `?line=${encodeURIComponent(line)}` : ""}`;
export const archivePageHref = (docId: string, pdfPage: number) => `/archive/${docId}/page/${pdfPage}`;
export const terminalHref = (record: string, step: number) => `/terminal?record=${record}&step=${step}`;
export const mapManualHref = (record: string, step: number) => `/map?layer=manual&record=${record}&step=${step}`;
export const mapCodeHref = (routine: string) => `/map?layer=code&routine=${encodeURIComponent(routine)}`;
export const scanSrc = (docId: string, pdfPage: number) => `${import.meta.env.BASE_URL}scans/${docId}/page-${String(pdfPage).padStart(3, "0")}.webp`;

/** Pairs each card of a routine's source with its line id; a count mismatch means the content is inconsistent. */
export function buildLines(source: string, lineIds: string[]): FortranLine[] {
  const texts = source.replace(/\r?\n$/, "").split(/\r?\n/);
  if (texts.length !== lineIds.length) throw new Error(`Routine has ${texts.length} lines but ${lineIds.length} line ids`);
  return texts.map((text, i) => ({ id: lineIds[i], text }));
}

export function findRoutine(index: CodeIndex, id: string) {
  return index.routines.find((r) => r.id === id) ?? index.routines.find((r) => r.id.toLowerCase() === id.toLowerCase());
}

export type CodeData = { index: CodeIndex; xref: Xref | undefined };
let cached: Promise<CodeData | undefined> | undefined;
export function loadCodeData(): Promise<CodeData | undefined> {
  cached ??= Promise.all([loadCodeIndex(), loadXref()]).then(([index, xref]) => (index ? { index, xref } : undefined));
  return cached;
}
