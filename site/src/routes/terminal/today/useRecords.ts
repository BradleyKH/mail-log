import { useMemo, useSyncExternalStore } from "react";
import { browserEnv } from "@/terminal/programData";
import type { RecordType } from "@/terminal/types";

/** The same environment and record store the 1979 terminal runs on. */
export const env = browserEnv();

/** The records of one type, refreshed whenever either view changes the shared store. */
export function useRecords(record: RecordType) {
  const version = useSyncExternalStore(env.store.subscribe, env.store.version);
  // `version` is the cache key: list() returns a fresh array on every call.
  return useMemo(() => (version >= 0 ? env.store.list(record) : []), [record, version]);
}
