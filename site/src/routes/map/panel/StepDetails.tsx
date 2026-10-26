import type { CodeIndex, RecordType, Step, Xref } from "@/content/types";
import { displayText } from "@/lib/display";
import { routinesForStep, topMatchLine } from "../graph/crossLinks";
import { isCoreStep } from "../graph/ids";
import { GROUP_LABELS, MODE_LABELS, modeOfStep, printedStepNumber } from "../graph/labels";
import type { Selection } from "../graph/selection";
import type { Layer } from "../graph/types";
import { OPERATING_INSTRUCTIONS, archivePageHref, routineHref, terminalHref } from "../links";
import PromptBlock from "../popover/PromptBlock";
import NodeButton from "./NodeButton";
import PanelLink from "./PanelLink";
import PanelSection from "./PanelSection";

interface Props {
  record: RecordType;
  step: Step;
  xref: Xref | undefined;
  index: CodeIndex | null;
  go: (selection: Selection, layer?: Layer) => void;
}

export default function StepDetails({ record, step, xref, index, go }: Props) {
  const mode = modeOfStep(step.n);
  const routines = routinesForStep(xref, record, step.n);
  const targetLabel = (n: number) => {
    const m = modeOfStep(n);
    return `Step #${printedStepNumber(n)}${m && m !== mode ? ` (${MODE_LABELS[m]})` : ""}`;
  };
  const exits = [...step.branches.map((b) => ({ when: b.when, goto: b.goto })), ...(step.next !== undefined ? [{ when: "Next", goto: step.next }] : [])];
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-mono text-lg font-semibold uppercase" data-testid="map-panel-title">
          Step #{printedStepNumber(step.n)}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isCoreStep(step.n) ? "Shared by all three records" : GROUP_LABELS[record]}
          {mode ? `, ${MODE_LABELS[mode]} mode` : ""}
          {step.title && !/^Step #/.test(step.title) ? `: ${displayText(step.title)}` : ""}
        </p>
      </header>
      <PromptBlock lines={step.prompt} />
      {step.response && <p className="text-sm">{displayText(step.response)}</p>}
      {step.input && (
        <p className="font-mono text-xs">
          Input {displayText(step.input.pattern)}
          {step.input.maxLength ? `, up to ${step.input.maxLength} characters` : ""}. {displayText(step.input.description)}
        </p>
      )}
      <PanelSection title="Go to">
        <ul className="space-y-1">
          <li>
            <PanelLink to={archivePageHref(OPERATING_INSTRUCTIONS, step.pdfPage)}>The manual, page {step.pdfPage}</PanelLink>
          </li>
          <li>
            <PanelLink to={terminalHref(record, step.n)}>This step in the Terminal</PanelLink>
          </li>
        </ul>
      </PanelSection>
      <PanelSection title="Code that prints it">
        {routines.length === 0 ? (
          <p className="text-sm text-muted-foreground">{index ? "No routine's printed text matches this step." : "Loading the code index..."}</p>
        ) : (
          <ul className="space-y-1">
            {routines.map((id) => (
              <li key={id} className="flex flex-wrap items-center gap-2">
                <PanelLink to={routineHref(id, topMatchLine(xref, record, step.n, id))}>{id}</PanelLink>
                <NodeButton onClick={() => go({ kind: "routine", id }, "code")}>Show in Code layer</NodeButton>
              </li>
            ))}
          </ul>
        )}
      </PanelSection>
      {exits.length > 0 && (
        <PanelSection title="Leads to">
          <ul className="space-y-1">
            {exits.map((x, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-2 text-sm">
                {x.goto === "exit" ? (
                  <NodeButton onClick={() => go({ kind: "exit" })}>Exit</NodeButton>
                ) : (
                  <NodeButton onClick={() => go({ kind: "step", record, n: x.goto as number })}>{targetLabel(x.goto as number)}</NodeButton>
                )}
                <span className="text-muted-foreground">{displayText(x.when)}</span>
              </li>
            ))}
          </ul>
        </PanelSection>
      )}
    </div>
  );
}
