import type { RoutineEntry } from "@/content/types";

export type ListingLine = { id: string; text: string; seq: string | null };

const LINE = /^\((\d{4})\) ?(.*)$/;

/** Turns `(NNNN) code` rows into FortranBlock lines; repeated sequence numbers get an ordinal so ids stay unique. */
export function listingLines(code: string): ListingLine[] {
  const seen = new Map<string, number>();
  return code.split("\n").map((raw, i) => {
    const m = LINE.exec(raw);
    if (!m) return { id: `x${i}`, text: raw, seq: null };
    const k = (seen.get(m[1]) ?? 0) + 1;
    seen.set(m[1], k);
    return { id: `${m[1]}.${k}`, text: m[2], seq: m[1] };
  });
}

/** Picks the routine a sequence number belongs to when one listing page prints several routines. */
export function routineForSeq(candidates: RoutineEntry[], seq: number): RoutineEntry | undefined {
  return (
    candidates.find((r) => r.firstSeq !== null && r.lastSeq !== null && seq >= r.firstSeq && seq <= r.lastSeq) ?? candidates[0]
  );
}
