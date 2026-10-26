import type { CodeIndex, Flow, RecordType } from "@/content/types";
import { cn } from "@/lib/utils";
import type { MapNode } from "../graph/types";
import { externalCallers, fileAccess, findExternal, findRoutine, findStep } from "../lookup";
import ExternalPopover from "./ExternalPopover";
import FilePopover from "./FilePopover";
import RoutinePopover from "./RoutinePopover";
import StepPopover from "./StepPopover";

interface Props {
  node: MapNode;
  flows: Partial<Record<RecordType, Flow>>;
  index: CodeIndex | null;
  /** The record whose copy of a shared core step to describe. */
  record: RecordType;
  className?: string;
}

export default function NodePopover({ node, flows, index, record, className }: Props) {
  const ref = node.ref;
  let body = null;
  if (ref.kind === "step") {
    const step = findStep(flows, ref.record ?? record, ref.n);
    if (step) body = <StepPopover step={step} record={ref.record} />;
  } else if (ref.kind === "exit") {
    body = (
      <p className="font-mono text-xs uppercase">
        <span data-testid="map-popover-title" className="font-semibold">
          Exit
        </span>{" "}
        <span className="text-muted-foreground">leave MAIL LOG</span>
      </p>
    );
  } else if (ref.kind === "routine") {
    const routine = findRoutine(index, ref.id);
    if (routine) body = <RoutinePopover routine={routine} />;
  } else if (ref.kind === "file") {
    body = <FilePopover unit={ref.unit} access={fileAccess(index, ref.unit)} />;
  } else {
    body = <ExternalPopover name={ref.name} group={findExternal(index, ref.name)?.group ?? null} callers={externalCallers(index, ref.name)} />;
  }
  if (!body) return null;
  return (
    <div
      data-testid="map-popover"
      data-popover-node={node.id}
      className={cn("w-72 max-w-[80vw] rounded-md border bg-popover p-2.5 text-popover-foreground shadow-lg", className)}
    >
      {body}
    </div>
  );
}
