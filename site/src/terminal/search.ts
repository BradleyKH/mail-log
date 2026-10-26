import { echoDate, ordinal, parseMmddyy, parseRecordDate } from "./dates";
import { fill, type HookCtx } from "./hook";
import type { StoredRecord } from "./types";

export const field = (r: StoredRecord, name: string) => (r.values[name] ?? "").toUpperCase();

/** The manual's searches match from the start of the field, so a full name or its first letters both work. */
export const prefixMatch = (name: string, value: string) => (r: StoredRecord) => value !== "" && field(r, name).startsWith(value);

/** Any of a multi-entry field's entries (`JDD`, `GUID TRAJ PERF`, `FOSTER, L. R.; WINTERS, C. W.`). */
export const entryMatch = (name: string, value: string, separator: RegExp) => (r: StoredRecord) =>
  value !== "" &&
  field(r, name)
    .split(separator)
    .map((s) => s.trim())
    .some((s) => s.startsWith(value));

export const wordMatch = (name: string, word: string) => (r: StoredRecord) =>
  word !== "" && field(r, name).split(/[^A-Z0-9/.'-]+/).some((w) => w.startsWith(word));

/** Matches a typed `MMDDYY`; `00` for the month or day widens the search to a whole year or month. */
export const dateMatch = (names: string[], mmddyy: string) => (r: StoredRecord) => {
  const want = parseMmddyy(mmddyy);
  if (!want) return false;
  return names.some((n) => {
    const got = parseRecordDate(r.values[n]);
    if (!got) return false;
    return got.y === want.y && (want.m === 0 || got.m === want.m) && (want.d === 0 || got.d === want.d);
  });
};

/** Keeps records whose input date falls within the first and last valid dates, when the visitor gave them. */
export function inDateRange(c: HookCtx, records: StoredRecord[]): StoredRecord[] {
  const first = c.state.vars.firstDate ? parseMmddyy(c.state.vars.firstDate) : undefined;
  const last = c.state.vars.lastDate ? parseMmddyy(c.state.vars.lastDate) : undefined;
  if (!first || !last) return records;
  return records.filter((r) => {
    const d = parseRecordDate(r.values.inputDate);
    return !d || (ordinal(d) >= ordinal(first) && ordinal(d) <= ordinal(last));
  });
}

/** Placeholder values for a message that echoes what the visitor searched for. */
export const valueTokens = (value: string): Record<string, string> => ({
  AAAA: value,
  AAA: value,
  AA: value,
  NNNNIIII: value,
  NNNNNN: value,
  NNNN: value,
  NNN: value,
  "MM-DD-YY": echoDate(value),
});

/** Prints a found set and the step's closing message, as the terminal output figures do. */
export function printListing(
  c: HookCtx,
  matches: StoredRecord[],
  opts: { header?: string[]; entry: (r: StoredRecord, i: number) => string[]; tokens: Record<string, string> },
) {
  c.state.results = matches;
  if (matches.length > 0) {
    if (opts.header) c.print(...opts.header);
    matches.forEach((r, i) => c.print(...opts.entry(r, i)));
    c.print("");
  }
  c.print(...fill(c.step.prompt, { XXX: String(matches.length), ...opts.tokens }));
}
