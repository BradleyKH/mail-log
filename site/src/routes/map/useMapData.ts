import { useEffect, useMemo, useState } from "react";
import { getFlow, loadCodeIndex, loadXref } from "@/content/load";
import type { CodeIndex, Flow, RecordType, Xref } from "@/content/types";
import { buildCodeGraph } from "./graph/codeLayout";
import { RECORD_ORDER } from "./graph/labels";
import { buildManualGraph } from "./graph/manualLayout";
import type { MapGraph } from "./graph/types";

export interface MapData {
  flows: Partial<Record<RecordType, Flow>>;
  manual: MapGraph;
  code: MapGraph | null;
  index: CodeIndex | null;
  xref: Xref | undefined;
  codeError: boolean;
}

export function useMapData(): MapData {
  const flows = useMemo(() => {
    const out: Partial<Record<RecordType, Flow>> = {};
    for (const r of RECORD_ORDER) out[r] = getFlow(r);
    return out;
  }, []);
  const manual = useMemo(() => buildManualGraph(flows), [flows]);
  const [code, setCode] = useState<{ index: CodeIndex; xref: Xref | undefined; graph: MapGraph } | null>(null);
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([loadCodeIndex(), loadXref()])
      .then(([index, xref]) => {
        if (!live) return;
        if (!index) setCodeError(true);
        else setCode({ index, xref, graph: buildCodeGraph(index) });
      })
      .catch(() => live && setCodeError(true));
    return () => {
      live = false;
    };
  }, []);

  return { flows, manual, code: code?.graph ?? null, index: code?.index ?? null, xref: code?.xref, codeError };
}
