import type { RecordType, Step } from "@/content/types";
import { displayText } from "@/lib/display";
import { GROUP_LABELS, MODE_LABELS, modeOfStep, printedStepNumber } from "../graph/labels";
import PromptBlock from "./PromptBlock";

export default function StepPopover({ step, record }: { step: Step; record: RecordType | null }) {
  const mode = modeOfStep(step.n);
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-xs tracking-wider uppercase">
        <span data-testid="map-popover-title" className="font-semibold">
          Step #{printedStepNumber(step.n)}
        </span>
        <span className="text-muted-foreground">
          {" "}
          {record ? GROUP_LABELS[record] : "All records"}
          {mode ? `, ${MODE_LABELS[mode]}` : ""}
        </span>
      </p>
      {step.title && !/^Step #/.test(step.title) && <p className="text-xs font-medium">{displayText(step.title)}</p>}
      <PromptBlock lines={step.prompt} max={6} />
      {step.response && <p className="line-clamp-4 text-xs text-muted-foreground">{displayText(step.response)}</p>}
      {step.input && (
        <p className="font-mono text-xs">
          Input <span data-testid="map-input-pattern">{displayText(step.input.pattern)}</span>
          {step.input.maxLength ? `, up to ${step.input.maxLength} characters` : ""}
        </p>
      )}
    </div>
  );
}
