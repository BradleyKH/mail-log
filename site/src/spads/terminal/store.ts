import type { SpadsRecord, SpadsStore, SpadsTables, StoredSpadsRecord } from "./types";

// The manual's printed sessions assign SYSTEM ITEM NUMBER 615 to the first
// record added (PDF 36, 40, 51), so numbering starts there however few
// sample records are seeded.
const FIRST_SESSION_SYSNUM = 615;

// The INPUT session (PDF 50) builds E7202G and E7206H by hand and is never
// asked for their program numbers, so the program-number table it ran
// against held both; the printed table excerpt (D-4) does not.
const SESSION_PROGRAM_NUMBERS: Record<string, string> = {
  E7202G: "49002023700000400",
  E7206H: "49001014700000400",
};

// SYS 125 prints J.O.S:16 (PDF 96, 98) but its job orders are not shown.
const PRINTED_JOB_ORDERS: Record<string, number> = { "125": 16 };

// The INPUT record prints TOTAL AUT HOURS and DOLLARS as 0 (PDF 50); the
// older samples leave them blank.
const PRINTED_ZERO_TOTALS = new Set(["615"]);

export type SpadsStoreOptions = {
  /** Sample system item numbers to leave out, e.g. to replay a session that creates one of them. */
  exclude?: string[];
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function seed(record: SpadsRecord): StoredSpadsRecord {
  const stored: StoredSpadsRecord = {
    ...clone(record),
    origin: "sample",
    showTotals: record.totHours !== 0 || record.totDollars !== 0 || PRINTED_ZERO_TOTALS.has(record.sysnum),
  };
  const printed = PRINTED_JOB_ORDERS[record.sysnum];
  if (printed !== undefined && record.jobOrders.length === 0) stored.printedJobOrders = printed;
  return stored;
}

/** An in-memory store seeded from `records.json`; session edits live only in memory. */
export function createSpadsStore(
  data: { records: SpadsRecord[]; tables: SpadsTables },
  options: SpadsStoreOptions = {},
): SpadsStore {
  const exclude = new Set(options.exclude ?? []);
  const records = new Map<string, StoredSpadsRecord>();
  for (const r of data.records) if (!exclude.has(r.sysnum)) records.set(r.sysnum, seed(r));
  const programNumbers = new Map<string, string>();
  for (const p of data.tables.programNumbers) programNumbers.set(p.jo, p.progno);
  for (const [jo, progno] of Object.entries(SESSION_PROGRAM_NUMBERS)) programNumbers.set(jo, progno);
  const tables = clone(data.tables);
  const listeners = new Set<() => void>();
  let version = 0;
  const changed = () => {
    version++;
    for (const l of listeners) l();
  };
  const sorted = () => [...records.values()].sort((a, b) => Number(a.sysnum) - Number(b.sysnum));

  const nextSysnum = () => {
    const highest = Math.max(0, ...[...records.keys()].map(Number).filter(Number.isFinite));
    return String(Math.max(FIRST_SESSION_SYSNUM, highest + 1));
  };

  return {
    list: () => sorted().map(clone),
    get: (sysnum) => {
      const r = records.get(sysnum.trim().replace(/^0+(?=\d)/, ""));
      return r ? clone(r) : undefined;
    },
    add(record) {
      const sysnum = nextSysnum();
      const stored = { ...clone(record), sysnum } as StoredSpadsRecord;
      records.set(sysnum, stored);
      changed();
      return clone(stored);
    },
    replace(record) {
      records.set(record.sysnum, clone(record));
      changed();
    },
    remove(sysnum) {
      const ok = records.delete(sysnum);
      if (ok) changed();
      return ok;
    },
    nextSysnum,
    programNumber(jo) {
      const key = jo.trim().toUpperCase();
      // The printed table keys drop the job order's leading letter (7000A for E7000A).
      return programNumbers.get(key) ?? programNumbers.get(key.slice(1));
    },
    addProgramNumber(jo, progno) {
      programNumbers.set(jo.trim().toUpperCase(), progno);
      changed();
    },
    tables: () => tables,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    version: () => version,
  };
}
