import type { SpadsJobOrder, SpadsMonth, SpadsRecord, SpadsReport, SpadsTables } from "@/content/types";

export type { SpadsJobOrder, SpadsMonth, SpadsRecord, SpadsReport, SpadsTables };

/** One line of terminal output. `hint` lines are the site speaking, not the program. */
export type OutputLine = { text: string; kind: "program" | "echo" | "hint" };

export type Menus = Record<string, string | string[]>;

/** Everything the engine reads from `content/spads/`, already loaded. */
export type SpadsData = {
  menus: Menus;
  records: SpadsRecord[];
  tables: SpadsTables;
  reports: SpadsReport[];
};

/** A Contract Analysis record as the session sees it. */
export type StoredSpadsRecord = SpadsRecord & {
  origin: "sample" | "session";
  /** TOTAL AUT HOURS / DOLLARS print blank on the older sample records and as numbers on input records. */
  showTotals: boolean;
  /** J.O.S count the manual prints for a record whose job orders were not transcribed. */
  printedJobOrders?: number;
};

export interface SpadsStore {
  list(): StoredSpadsRecord[];
  get(sysnum: string): StoredSpadsRecord | undefined;
  /** Adds a record under the next system item number and returns it. */
  add(record: Omit<StoredSpadsRecord, "sysnum">): StoredSpadsRecord;
  replace(record: StoredSpadsRecord): void;
  remove(sysnum: string): boolean;
  nextSysnum(): string;
  /** Program number for a job order such as `E7000A`, from the program-number table plus session additions. */
  programNumber(jo: string): string | undefined;
  addProgramNumber(jo: string, progno: string): void;
  tables(): SpadsTables;
  subscribe(listener: () => void): () => void;
  /** Bumps on every change so UI hooks can cheaply detect updates. */
  version(): number;
}

/** Working memory a run carries between prompts. Plain data, so a state can be stored and replayed. */
export type SessionCtx = {
  /** Retrieve, book, and quickie criteria: field number and value. */
  criteria?: { field: number; value: string }[];
  pendingField?: number;
  /** System item numbers matching the last search, and the one on screen. */
  results?: string[];
  resultIndex?: number;
  /** The record being modified or entered. */
  draft?: StoredSpadsRecord;
  modMethod?: "add" | "replace" | "input";
  /** Job-order CHANGE: the field and value waiting for a job order. */
  joField?: number;
  joValue?: string;
  /** Job orders still to enter during INPUT, and the one waiting for a subcode or program number. */
  joRemaining?: number;
  joPending?: SpadsJobOrder;
  joQueue?: SpadsJobOrder[];
  /** Spread prompts answered so far. */
  spread?: {
    viaRatetable?: boolean;
    totalHours?: number;
    totalDollars?: number;
    first?: string;
    firstHours?: number;
    firstDollars?: number;
    last?: string;
    lastHours?: number;
    lastDollars?: number;
    hoursPct?: number;
  };
  ratetable?: { task: string; hours?: number; dollars?: number; then: "main" | "spread" };
  /** Header form answers during INPUT. */
  inputForm?: number;
  spoolPending?: boolean;
  spool?: SpoolCtx;
  /** A linear prompt sequence and its answers (report and update dialogs). */
  dialog?: { id: string; index: number; answers: Record<string, string> };
  /** Free scratch for report and update flows. */
  scratch?: Record<string, string | number | boolean | string[]>;
};

export type SpoolStyle = "record" | "basic" | "dash";

export type SpoolCtx = {
  style: SpoolStyle;
  /** Offer the third site (Projects Directorate). */
  allSites: boolean;
  site?: number;
  /** Step to enter once spooling ends. */
  then: string;
  /** reports.json id of the transcribed printout to offer afterward. */
  sample?: string;
  /** Hint pointing at a printout that is not in reports.json. */
  sampleNote?: string;
  /** dash style: how the report was submitted (1 wait, 2 phantom, 3 batch). */
  computeMode?: number;
};

export type SpadsState = {
  /** The prompt waiting for input, or `exit` after logout. */
  step: string;
  user: string;
  terminal: number;
  /** Current status month as `MMMYY`; the DALLAS TAPE update sets it. */
  statusMonth: string;
  securityNoted: boolean;
  ctx: SessionCtx;
};

export type SpadsResult = { state: SpadsState; output: OutputLine[] };

export type SpadsEnv = {
  data: SpadsData;
  store: SpadsStore;
  now?: () => Date;
};

export type SpadsEngine = {
  /** A fresh session at the PRIMOS login prompt. */
  start(): SpadsResult;
  submit(state: SpadsState, input: string): SpadsResult;
};
