import { Footprints, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Layer } from "./graph/types";

interface Props {
  layer: Layer;
  onLayer: (layer: Layer) => void;
  tracing: boolean;
  onTrace: (on: boolean) => void;
  onReset: () => void;
  view: "3d" | "2d";
  onView: (view: "3d" | "2d") => void;
  webgl: boolean;
}

export default function MapToolbar(props: Props) {
  const { layer } = props;
  return (
    <div className="flex items-center justify-between gap-2" role="toolbar" aria-label="Map controls">
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

      <div className="flex justify-end gap-1">
        <Toggle size="sm" variant="outline" pressed={props.tracing} onPressedChange={props.onTrace} className="hidden h-7 px-2 text-xs sm:inline-flex">
          <Footprints className="size-3.5" />
          Trace author search
        </Toggle>
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
        <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={props.onReset}>
          <RotateCcw className="size-3.5" />
          Reset view
        </Button>
      </div>
    </div>
  );
}
