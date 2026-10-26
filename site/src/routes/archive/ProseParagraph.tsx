import { Link } from "react-router";
import GlossaryTerm from "@/components/shared/GlossaryTerm";
import { getFlow } from "@/content/load";
import type { DocId, RecordType } from "@/content/types";
import type { Segment } from "./annotate";

export type StepTarget = { record: RecordType; base: number };

/** The manual restarts numbering in each mode, so try the mode's range first, then the shared common steps. */
function resolveStep(target: StepTarget, n: number): number | undefined {
  const steps = getFlow(target.record)?.steps ?? [];
  return [target.base + n, n].find((candidate) => steps.some((s) => s.n === candidate));
}

type Props = { segments: Segment[]; docId: DocId; steps?: StepTarget };

export default function ProseParagraph({ segments, docId, steps }: Props) {
  const nowrap = segments.some((s) => s.kind === "text" && /^\|/m.test(s.text));
  return (
    <p className={nowrap ? "overflow-x-auto font-mono text-sm whitespace-pre" : "whitespace-pre-line"}>
      {segments.map((s, i) => {
        if (s.kind === "term") return <GlossaryTerm key={i} entry={s.entry} docId={docId} />;
        if (s.kind === "step" && steps) {
          const n = resolveStep(steps, s.n);
          if (n !== undefined) {
            const q = `record=${steps.record}&step=${n}`;
            return (
              <span key={i} className="whitespace-nowrap">
                <Link to={`/terminal?${q}`} className="font-medium text-primary underline-offset-2 hover:underline">
                  {s.text}
                </Link>
                <Link
                  to={`/map?layer=manual&${q}`}
                  aria-label={`${s.text} on the Map`}
                  title="Show on the Map"
                  className="ml-0.5 align-super text-[0.65em] text-muted-foreground underline-offset-2 hover:underline"
                >
                  map
                </Link>
              </span>
            );
          }
        }
        return <span key={i}>{s.text}</span>;
      })}
    </p>
  );
}
