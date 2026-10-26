import type { SampleRecord } from "@/content/types";
import type { RecordStore, RecordType, StoredRecord } from "./types";

type SessionLayer = {
  added: StoredRecord[];
  updated: Record<string, Record<string, string>>;
  removed: string[];
  nextId: number;
};

const STORAGE_KEY = "maillog.session.v1";

const emptyLayer = (): SessionLayer => ({ added: [], updated: {}, removed: [], nextId: 1 });

function sampleValues(sample: SampleRecord): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [k, v] of Object.entries(sample)) {
    if (k === "sourceFigure" || v === null || v === undefined) continue;
    values[k] = String(v);
  }
  return values;
}

function readLayer(storage: Storage | null | undefined): SessionLayer {
  if (!storage) return emptyLayer();
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return emptyLayer();
    const parsed = JSON.parse(raw) as Partial<SessionLayer>;
    return { ...emptyLayer(), ...parsed };
  } catch {
    return emptyLayer();
  }
}

/**
 * The records a session works with: the manual's sample records with this session's
 * additions, revisions, deletions, and archivals layered on top. Shared by every view of
 * the program, so a record entered in one view is found in the other.
 */
export function createRecordStore(
  samples: (record: RecordType) => SampleRecord[],
  storage?: Storage | null,
): RecordStore {
  let layer = readLayer(storage);
  let version = 0;
  const listeners = new Set<() => void>();
  const sampleCache = new Map<RecordType, StoredRecord[]>();

  const samplesOf = (record: RecordType) => {
    let cached = sampleCache.get(record);
    if (!cached) {
      cached = samples(record).map((s, i) => ({
        id: `${record}:sample:${i}`,
        record,
        origin: "sample" as const,
        sourceFigure: s.sourceFigure,
        values: sampleValues(s),
      }));
      sampleCache.set(record, cached);
    }
    return cached;
  };

  const changed = () => {
    version += 1;
    if (storage) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(layer));
      } catch {
        // Storage can be full or blocked; the session still works in memory.
      }
    }
    for (const l of listeners) l();
  };

  return {
    list(record) {
      const removed = new Set(layer.removed);
      return [...samplesOf(record), ...layer.added.filter((r) => r.record === record)]
        .filter((r) => !removed.has(r.id))
        .map((r) => (layer.updated[r.id] ? { ...r, values: layer.updated[r.id] } : r));
    },
    add(record, values) {
      const rec: StoredRecord = { id: `${record}:session:${layer.nextId}`, record, origin: "session", values: { ...values } };
      layer = { ...layer, added: [...layer.added, rec], nextId: layer.nextId + 1 };
      changed();
      return rec;
    },
    update(_record, id, values) {
      layer = { ...layer, updated: { ...layer.updated, [id]: { ...values } } };
      changed();
    },
    remove(_record, id) {
      if (layer.removed.includes(id)) return;
      layer = { ...layer, removed: [...layer.removed, id] };
      changed();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    version: () => version,
  };
}

function browserStorage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

let shared: RecordStore | undefined;

/** The one store every view of the program shares in the browser, mirrored to localStorage. */
export function sharedRecordStore(samples: (record: RecordType) => SampleRecord[]): RecordStore {
  shared ??= createRecordStore(samples, browserStorage());
  return shared;
}
