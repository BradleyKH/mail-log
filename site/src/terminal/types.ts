import type { Field, Flow, RecordType, SampleRecord } from "@/content/types";

export type { RecordType };

export type Target = number | "exit";

/** One line of terminal output. `hint` lines are the site speaking, not the program. */
export type OutputLine = { text: string; kind: "program" | "echo" | "hint" };

/** A record as the session sees it: the samples from the manual's figures plus anything entered this session. */
export type StoredRecord = {
  id: string;
  record: RecordType;
  origin: "sample" | "session";
  sourceFigure?: string;
  values: Record<string, string>;
};

/** Working memory a run of the program carries between steps (search key, loop counters, choices made earlier). */
export type EngineVars = {
  user?: string;
  terminal?: number;
  loginAt?: string;
  key?: string;
  today?: string;
  firstDate?: string;
  lastDate?: string;
  lastInput?: string;
  count?: number;
  remaining?: number;
  option?: string;
  flag?: string;
  subfile?: number;
  editingId?: string;
  candidates?: string[];
  itemReturn?: number;
  vehicleFirst?: number;
  vehicleLast?: number;
};

export type EngineState = {
  record: RecordType;
  /** The step waiting for input, or `exit` once the visitor has logged out. */
  step: Target;
  /** The record being entered or revised, keyed by field name. */
  fields: Record<string, string>;
  /** The last search's matches. */
  results: StoredRecord[];
  /** Every step entered, in order, as `record:n`. */
  history: string[];
  vars: EngineVars;
};

export type EngineResult = { state: EngineState; output: OutputLine[] };

export interface RecordStore {
  list(record: RecordType): StoredRecord[];
  add(record: RecordType, values: Record<string, string>): StoredRecord;
  update(record: RecordType, id: string, values: Record<string, string>): void;
  remove(record: RecordType, id: string): void;
  subscribe(listener: () => void): () => void;
  /** Bumps on every change so UI hooks can cheaply detect updates. */
  version(): number;
}

export type ProgramData = {
  flows: Partial<Record<RecordType, Flow>>;
  fields: Partial<Record<RecordType, Field[]>>;
  samples: Partial<Record<RecordType, SampleRecord[]>>;
};

export type EngineEnv = {
  data: ProgramData;
  store: RecordStore;
  now?: () => Date;
};
