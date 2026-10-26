import { getFields, getFlow, getSampleRecords } from "@/content/load";
import { RECORDS } from "@/content/schema";
import { sharedRecordStore } from "./store";
import type { EngineEnv, ProgramData, RecordType } from "./types";

export const RECORD_TYPES = RECORDS as readonly RecordType[];

export function programData(): ProgramData {
  const data: ProgramData = { flows: {}, fields: {}, samples: {} };
  for (const r of RECORD_TYPES) {
    data.flows[r] = getFlow(r);
    data.fields[r] = getFields(r);
    data.samples[r] = getSampleRecords(r);
  }
  return data;
}

/** The engine environment every browser view shares: the program's data and one session record store. */
export function browserEnv(): EngineEnv {
  return { data: programData(), store: sharedRecordStore(getSampleRecords) };
}

export const isRecordType = (s: string | null | undefined): s is RecordType => !!s && (RECORD_TYPES as readonly string[]).includes(s);
