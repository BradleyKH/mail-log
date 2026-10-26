import { useEffect, useState } from "react";
import { loadCodeIndex, loadRoutineLines, loadRoutineSource, loadXref } from "@/content/load";
import type { CodeIndex, Xref } from "@/content/types";
import type { FortranLine } from "@/components/shared/fortranLines";
import { excerptAround, routinesForStep, type HoodMatch } from "@/terminal/hood";
import type { RecordType } from "@/terminal/types";

let codeData: Promise<[Xref | undefined, CodeIndex | undefined]> | undefined;
const loadCodeData = () => (codeData ??= Promise.all([loadXref(), loadCodeIndex()]));

/** The routines that print this step's prompt, loaded lazily so the code index stays out of the Terminal's first paint. */
export function useHoodMatches(record: RecordType, step: number | undefined): HoodMatch[] | undefined {
  const [data, setData] = useState<[Xref | undefined, CodeIndex | undefined]>();
  useEffect(() => {
    let live = true;
    void loadCodeData().then((d) => live && setData(d));
    return () => {
      live = false;
    };
  }, []);
  if (!data) return undefined;
  const [xref, index] = data;
  if (!xref || step === undefined) return [];
  return routinesForStep(xref, index, record, step);
}

/** A few lines of a routine's real FORTRAN around one line id. */
export function useExcerpt(routine: string | undefined, lineId: string | undefined, radius = 4): FortranLine[] | undefined {
  const [state, setState] = useState<{ key: string; lines: FortranLine[] }>();
  const key = `${routine}:${lineId}`;
  useEffect(() => {
    if (!routine || !lineId) return;
    let live = true;
    void Promise.all([loadRoutineSource(routine), loadRoutineLines(routine)]).then(([source, meta]) => {
      if (!live || source === undefined || !meta) return;
      const text = source.split("\n");
      const all = meta.lineIds.map((id, i) => ({ id, text: text[i] ?? "" }));
      setState({ key: `${routine}:${lineId}`, lines: excerptAround(all, lineId, radius) });
    });
    return () => {
      live = false;
    };
  }, [routine, lineId, radius]);
  return state?.key === key ? state.lines : undefined;
}
