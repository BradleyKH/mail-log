import { Footprints, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GROUP_LABELS } from "./graph/labels";
import type { Layer, NodeGroup } from "./graph/types";
import type { ScenePalette } from "./palette";

interface Props {
  layer: Layer;
  onLayer: (layer: Layer) => void;
  groups: readonly NodeGroup[];
  hidden: Set<NodeGroup>;
  onToggleGroup: (group: NodeGroup) => void;
  palette: ScenePalette;
  tracing: boolean;
  onTrace: (on: boolean) => void;
  onReset: () => void;
  view: "3d" | "2d";
  onView: (view: "3d" | "2d") => void;
  webgl: boolean;
}

export default function MapToolbar(props: Props) {
  const { layer, groups, hidden, palette } = props;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2" role="toolbar" aria-label="Map controls">
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={layer}
        onValueChange={(v) => v && props.onLayer(v as Layer)}
        aria-label="Layer"
      >
        <ToggleGroupItem value="manual" className="px-3 font-mono text-xs uppercase">
          Manual
        </ToggleGroupItem>
        <ToggleGroupItem value="code" className="px-3 font-mono text-xs uppercase">
          Code
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex flex-wrap gap-1" aria-label="Show groups" role="group">
        {groups.map((g) => (
          <Toggle
            key={g}
            size="sm"
            variant="outline"
            pressed={!hidden.has(g)}
            onPressedChange={() => props.onToggleGroup(g)}
            className="h-7 gap-1.5 px-2 text-xs data-[state=off]:opacity-55"
          >
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: palette.groups[g] }} />
            {GROUP_LABELS[g]}
          </Toggle>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        <Toggle size="sm" variant="outline" pressed={props.tracing} onPressedChange={props.onTrace} className="h-7 px-2 text-xs">
          <Footprints className="size-3.5" />
          Trace author search
        </Toggle>
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={props.onReset}>
          <RotateCcw className="size-3.5" />
          Reset view
        </Button>
        {props.webgl && (
          <Toggle
            size="sm"
            variant="outline"
            pressed={props.view === "2d"}
            onPressedChange={(on) => props.onView(on ? "2d" : "3d")}
            className="h-7 px-2 text-xs"
          >
            <Square className="size-3.5" />
            Flat view
          </Toggle>
        )}
      </div>
    </div>
  );
}
