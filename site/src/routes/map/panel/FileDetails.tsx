import { displayText } from "@/lib/display";
import type { Selection } from "../graph/selection";
import NodeButton from "./NodeButton";
import PanelSection from "./PanelSection";

interface Props {
  unit: string;
  access: { routine: string; mode: string; purpose: string | null }[];
  go: (selection: Selection) => void;
}

export default function FileDetails({ unit, access, go }: Props) {
  const purposes = [...new Set(access.flatMap((a) => (a.purpose ? [displayText(a.purpose)] : [])))];
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-mono text-lg font-semibold uppercase" data-testid="map-panel-title">
          {unit}
        </h2>
        <p className="text-sm text-muted-foreground">Data file opened by name in the code</p>
      </header>
      {purposes.length > 0 && (
        <PanelSection title="From the comments">
          <ul className="list-disc space-y-0.5 pl-4 font-mono text-xs">
            {purposes.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </PanelSection>
      )}
      <PanelSection title="Routines">
        <ul className="space-y-1">
          {access.map((a) => (
            <li key={`${a.routine}:${a.mode}`} className="flex items-center gap-2 text-sm">
              <NodeButton onClick={() => go({ kind: "routine", id: a.routine })}>{a.routine}</NodeButton>
              <span className="font-mono text-xs text-muted-foreground">{a.mode}</span>
            </li>
          ))}
        </ul>
      </PanelSection>
    </div>
  );
}
