export const OPERATING_INSTRUCTIONS = "cr-159065";
export const PROGRAM_THEORY_VOL1 = "cr-159063";
export const PROGRAM_THEORY_VOL2 = "cr-159064";

export const archivePageHref = (docId: string, pdfPage: number) => `/archive/${docId}/page/${pdfPage}`;
export const terminalHref = (record: string, step: number) => `/terminal?record=${record}&step=${step}`;
export const routineHref = (id: string, line?: string) =>
  `/code/${encodeURIComponent(id)}${line ? `?line=${encodeURIComponent(line)}` : ""}`;
