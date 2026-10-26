import { X } from "lucide-react";
import type { Selection } from "../graph/selection";
import type { Layer } from "../graph/types";
import { externalCallers, fileAccess, findExternal, findRoutine, findStep } from "../lookup";
import type { MapData } from "../useMapData";
import ExternalDetails from "./ExternalDetails";
import FileDetails from "./FileDetails";
import RoutineDetails from "./RoutineDetails";
import StepDetails from "./StepDetails";
import TraceDetails from "./TraceDetails";

interface Props {
  selection: Selection | null;
  data: MapData;
  layer: Layer;
  tracing: boolean;
  go: (selection: Selection, layer?: Layer) => void;
  onClear: () => void;
}

export default function SelectionPanel({ selection, data, layer, tracing, go, onClear }: Props) {
  let body = null;
  if (selection?.kind === "step") {
    const step = findStep(data.flows, selection.record, selection.n);
    body = step ? (
      <StepDetails record={selection.record} step={step} xref={data.xref} index={data.index} go={go} />
    ) : (
      <p className="text-sm">The manual has no Step {selection.n} for this record.</p>
    );
  } else if (selection?.kind === "routine") {
    const routine = findRoutine(data.index, selection.id);
    body = routine ? (
      <RoutineDetails routine={routine} xref={data.xref} go={go} />
    ) : (
      <p className="text-sm">{data.index ? `No routine named ${selection.id}.` : "Loading the code index..."}</p>
    );
  } else if (selection?.kind === "file") {
    body = <FileDetails unit={selection.unit} access={fileAccess(data.index, selection.unit)} go={go} />;
  } else if (selection?.kind === "external") {
    body = <ExternalDetails name={selection.name} entry={findExternal(data.index, selection.name)} callers={externalCallers(data.index, selection.name)} go={go} />;
  } else if (selection?.kind === "exit") {
    body = (
      <div className="space-y-1">
        <h2 className="font-mono text-lg font-semibold uppercase" data-testid="map-panel-title">
          Exit
        </h2>
        <p className="text-sm text-muted-foreground">Typing QU at the data-type choice (Step #3) leaves MAIL LOG.</p>
      </div>
    );
  }

  return (
    <aside aria-label="Selection details" className="relative space-y-5 rounded-md border bg-card p-4 text-card-foreground" data-testid="map-panel">
      {selection && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="absolute top-2 right-2 rounded-sm p-1 text-muted-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <X className="size-4" />
        </button>
      )}
      {tracing && <TraceDetails layer={layer} go={go} />}
      {body ?? (
        <p className="text-sm text-muted-foreground">
          {layer === "manual"
            ? "Each glowing point is a step in the operating manual. Hover for its prompt; click to see where it leads, the page it comes from, and the code that prints it."
            : "Each sphere is one of his routines, sized by its line count. Arcs are CALLs; the boxes overhead are the data files they open. Click a routine to see the manual steps it serves."}
        </p>
      )}
    </aside>
  );
}
