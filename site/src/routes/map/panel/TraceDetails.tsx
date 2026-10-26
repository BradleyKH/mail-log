import { CODE_TRACE_ROUTINES, MANUAL_TRACE_STEPS } from "../graph/trace";
import { MODE_LABELS, modeOfStep, printedStepNumber } from "../graph/labels";
import type { Selection } from "../graph/selection";
import type { Layer } from "../graph/types";
import NodeButton from "./NodeButton";
import PanelSection from "./PanelSection";

/** The author/source search, step by step in the manual or call by call in the code. */
export default function TraceDetails({ layer, go }: { layer: Layer; go: (selection: Selection) => void }) {
  return (
    <PanelSection title="Trace: author/source search">
      {layer === "manual" ? (
        <>
          <p className="text-sm text-muted-foreground">
            From login to the search menu, past the date and subfile prompts, to the AUTH search and back to the menu.
          </p>
          <ol className="flex flex-wrap gap-1.5" data-testid="map-trace">
            {MANUAL_TRACE_STEPS.map((n, i) => (
              <li key={i}>
                <NodeButton onClick={() => go({ kind: "step", record: "correspondence", n })}>
                  {modeOfStep(n) ? `${MODE_LABELS[modeOfStep(n)!]} ` : ""}#{printedStepNumber(n)}
                </NodeButton>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            SEAC hands the search to AUSEA, which prints what it finds through the screen and hard-copy routines.
          </p>
          <ol className="flex flex-wrap gap-1.5" data-testid="map-trace">
            {CODE_TRACE_ROUTINES.map((id) => (
              <li key={id}>
                <NodeButton onClick={() => go({ kind: "routine", id })}>{id}</NodeButton>
              </li>
            ))}
          </ol>
        </>
      )}
    </PanelSection>
  );
}
