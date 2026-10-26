export type FortranLine = { id: string; text: string };

/** Fixed-form comment cards start with C or * in column 1. */
export const isCommentLine = (text: string) => /^[Cc*]/.test(text);

/** `NNNN.k` ids show as `NNNN` (with `.k` only for repeats); `uN` ids have no printed sequence number. */
export function gutterLabel(id: string, mode: "id" | "printed"): string {
  const m = /^(\d+)\.(\d+)$/.exec(id);
  if (!m) return "";
  const label = m[2] === "1" ? m[1] : id;
  return mode === "printed" ? `(${label})` : label;
}

/** Resolves a `?line=NNNN` value to a line id: exact match first, then the first `NNNN.k` repeat. */
export function resolveLineId(lines: FortranLine[], wanted: string | null | undefined): string | undefined {
  if (!wanted) return undefined;
  if (lines.some((l) => l.id === wanted)) return wanted;
  return lines.find((l) => l.id === `${wanted}.1`)?.id;
}
