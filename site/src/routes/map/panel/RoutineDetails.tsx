import type { RoutineEntry, Xref } from "@/content/types";
import { displayText } from "@/lib/display";
import { stepsForRoutine } from "../graph/crossLinks";
import { GROUP_LABELS, printedStepNumber } from "../graph/labels";
import type { Selection } from "../graph/selection";
import type { Layer } from "../graph/types";
import { PROGRAM_THEORY_VOL1, PROGRAM_THEORY_VOL2, archivePageHref, routineHref, terminalHref } from "../links";
import NodeButton from "./NodeButton";
import PanelLink from "./PanelLink";
import PanelSection from "./PanelSection";

interface Props {
  routine: RoutineEntry;
  xref: Xref | undefined;
  go: (selection: Selection, layer?: Layer) => void;
}

export default function RoutineDetails({ routine, xref, go }: Props) {
  const steps = stepsForRoutine(xref, routine.id);
  const calls = routine.calls.filter((c) => c.kind !== "unresolved");
  const files = routine.files.filter((f) => f.kind === "file");
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-mono text-lg font-semibold uppercase" data-testid="map-panel-title">
          {routine.name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {GROUP_LABELS[routine.record]}, {routine.kind}, {routine.lines} lines ({routine.commentLines} comments), Appendix {routine.appendix}
        </p>
      </header>
      {routine.description && <p className="text-sm">{displayText(routine.description)}</p>}
      <PanelSection title="Go to">
        <ul className="space-y-1">
          <li>
            <PanelLink to={routineHref(routine.id)}>Read the FORTRAN in the Code room</PanelLink>
          </li>
          {routine.listingPages[0] !== undefined && (
            <li>
              <PanelLink to={archivePageHref(PROGRAM_THEORY_VOL2, routine.listingPages[0])}>Listing scan, page {routine.listingPages[0]}</PanelLink>
            </li>
          )}
          {routine.flowchartPages[0] !== undefined && (
            <li>
              <PanelLink to={archivePageHref(PROGRAM_THEORY_VOL1, routine.flowchartPages[0])}>Flowchart, page {routine.flowchartPages[0]}</PanelLink>
            </li>
          )}
        </ul>
      </PanelSection>
      <PanelSection title="Manual steps it serves">
        {steps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No manual step's prompt matches this routine's printed text.</p>
        ) : (
          <ul className="space-y-1">
            {steps.map((s) => (
              <li key={`${s.record}:${s.step}`} className="flex flex-wrap items-center gap-2 text-sm">
                <NodeButton onClick={() => go({ kind: "step", record: s.record, n: s.step }, "manual")}>
                  Step #{printedStepNumber(s.step)}
                </NodeButton>
                <span className="text-muted-foreground">{GROUP_LABELS[s.record]}</span>
                <PanelLink to={terminalHref(s.record, s.step)}>Terminal</PanelLink>
              </li>
            ))}
          </ul>
        )}
      </PanelSection>
      {calls.length > 0 && (
        <PanelSection title="Calls">
          <div className="flex flex-wrap gap-1.5">
            {calls.map((c) => (
              <NodeButton
                key={c.name}
                onClick={() => go(c.kind === "routine" && c.target ? { kind: "routine", id: c.target } : { kind: "external", name: c.name })}
              >
                {c.target ?? c.name}
              </NodeButton>
            ))}
          </div>
        </PanelSection>
      )}
      {routine.calledBy.length > 0 && (
        <PanelSection title="Called by">
          <div className="flex flex-wrap gap-1.5">
            {routine.calledBy.map((id) => (
              <NodeButton key={id} onClick={() => go({ kind: "routine", id })}>
                {id}
              </NodeButton>
            ))}
          </div>
        </PanelSection>
      )}
      {files.length > 0 && (
        <PanelSection title="Data files">
          <div className="flex flex-wrap gap-1.5">
            {files.map((f) => (
              <NodeButton key={f.unit} onClick={() => go({ kind: "file", unit: f.unit })} title={f.purpose ? displayText(f.purpose) : undefined}>
                {f.unit} ({f.mode})
              </NodeButton>
            ))}
          </div>
        </PanelSection>
      )}
    </div>
  );
}
