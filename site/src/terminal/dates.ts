export type Ymd = { m: number; d: number; y: number };

const DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** `MMDDYY` as typed at the terminal. Years are 19YY. */
export function parseMmddyy(s: string): Ymd | undefined {
  const m = /^(\d\d)(\d\d)(\d\d)$/.exec(s);
  if (!m) return undefined;
  return { m: Number(m[1]), d: Number(m[2]), y: Number(m[3]) };
}

export function isRealDate({ m, d, y }: Ymd): boolean {
  if (m < 1 || m > 12 || d < 1) return false;
  const leap = (1900 + y) % 4 === 0;
  const max = m === 2 && !leap ? 28 : DAYS[m - 1];
  return d <= max;
}

/** The samples print dates as `M-D-YY`, sometimes padded (`0- 0- 0` for none). */
export function parseRecordDate(s: string | undefined): Ymd | undefined {
  if (!s) return undefined;
  const m = /^\s*(\d{1,2})-\s*(\d{1,2})-\s*(\d{1,2})\s*$/.exec(s);
  if (!m) return undefined;
  const ymd = { m: Number(m[1]), d: Number(m[2]), y: Number(m[3]) };
  return ymd.m === 0 && ymd.d === 0 && ymd.y === 0 ? undefined : ymd;
}

export const toRecordDate = ({ m, d, y }: Ymd) => `${m}-${d}-${String(y).padStart(2, "0")}`;

export const ordinal = ({ m, d, y }: Ymd) => y * 10000 + m * 100 + d;

export function mmddyyToRecordDate(s: string): string {
  const ymd = parseMmddyy(s);
  if (!ymd) return s;
  return ymd.m === 0 && ymd.d === 0 && ymd.y === 0 ? "0-0-0" : toRecordDate(ymd);
}

/** `MM-DD-YY` as the program echoes a searched date. */
export const echoDate = (s: string) => (s.length === 6 ? `${s.slice(0, 2)}-${s.slice(2, 4)}-${s.slice(4)}` : s);

export function mmddyyOf(date: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(date.getMonth() + 1)}${p(date.getDate())}${p(date.getFullYear() % 100)}`;
}
