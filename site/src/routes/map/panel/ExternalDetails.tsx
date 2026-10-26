import type { Selection } from "../graph/selection";
import { PROGRAM_THEORY_VOL1, archivePageHref } from "../links";
import NodeButton from "./NodeButton";
import PanelLink from "./PanelLink";
import PanelSection from "./PanelSection";

interface Props {
  name: string;
  entry: { group: string; sectionId: string; pdfPage: number } | undefined;
  callers: string[];
  go: (selection: Selection) => void;
}

export default function ExternalDetails({ name, entry, callers, go }: Props) {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="font-mono text-lg font-semibold uppercase" data-testid="map-panel-title">
          {name}
        </h2>
        <p className="text-sm text-muted-foreground">
          {entry ? `${entry.group === "system" ? "System" : "Miscellaneous"} external call, section ${entry.sectionId}` : "External call"}
        </p>
      </header>
      {entry && (
        <PanelLink to={archivePageHref(PROGRAM_THEORY_VOL1, entry.pdfPage)}>Described on page {entry.pdfPage}</PanelLink>
      )}
      <PanelSection title={`Called by ${callers.length}`}>
        <div className="flex flex-wrap gap-1.5">
          {callers.map((id) => (
            <NodeButton key={id} onClick={() => go({ kind: "routine", id })}>
              {id}
            </NodeButton>
          ))}
        </div>
      </PanelSection>
    </div>
  );
}
