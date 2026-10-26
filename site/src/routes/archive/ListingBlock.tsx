import { useMemo } from "react";
import FortranBlock from "@/components/shared/FortranBlock";
import type { RoutineEntry } from "@/content/types";
import { listingLines, routineForSeq } from "./listing";

type Props = { code: string; routines: RoutineEntry[] };

/** One printed listing page; each sequence number links to the same card in the Code room. */
export default function ListingBlock({ code, routines }: Props) {
  const lines = useMemo(() => listingLines(code), [code]);
  const seqById = useMemo(() => new Map(lines.map((l) => [l.id, l.seq])), [lines]);

  const lineHref = (id: string) => {
    const seq = seqById.get(id);
    const routine = seq ? routineForSeq(routines, Number(seq)) : undefined;
    return routine && seq ? `/code/${encodeURIComponent(routine.id)}?line=${seq}` : undefined;
  };

  return <FortranBlock lines={lines} gutter="id" lineHref={lineHref} />;
}
