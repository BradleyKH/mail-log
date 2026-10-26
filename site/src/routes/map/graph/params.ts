import type { RecordType } from "@/content/types";
import { RECORD_ORDER } from "./labels";
import type { Selection } from "./selection";
import type { Layer } from "./types";

export interface MapParams {
  layer: Layer;
  record: RecordType | null;
  selection: Selection | null;
}

const isRecord = (s: string | null): s is RecordType => s !== null && (RECORD_ORDER as readonly string[]).includes(s);

export function parseMapParams(params: URLSearchParams): MapParams {
  const layer: Layer = params.get("layer") === "code" ? "code" : "manual";
  const record = isRecord(params.get("record")) ? (params.get("record") as RecordType) : null;
  const routine = params.get("routine");
  const step = Number(params.get("step"));
  let selection: Selection | null = null;
  if (routine) selection = { kind: "routine", id: routine };
  else if (params.has("step") && Number.isInteger(step) && step > 0) selection = { kind: "step", record: record ?? "correspondence", n: step };
  return { layer, record, selection };
}

/** Writes the URL contract's params; files and externals have no URL form, so they keep only the layer. */
export function mapSearch(layer: Layer, selection: Selection | null, record: RecordType | null): URLSearchParams {
  const out = new URLSearchParams({ layer });
  if (selection?.kind === "step") {
    out.set("record", selection.record);
    out.set("step", String(selection.n));
  } else if (selection?.kind === "routine") {
    out.set("routine", selection.id);
  } else if (record) {
    out.set("record", record);
  }
  return out;
}
