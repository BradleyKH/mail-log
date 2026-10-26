import type { Layer } from "./graph/types";
import type { ScenePalette } from "./palette";

const swatch = "inline-block size-3 shrink-0";

export default function MapLegend({ layer, palette }: { layer: Layer; palette: ScenePalette }) {
  const ink = palette.groups.core;
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-label="Legend">
      {layer === "manual" ? (
        <>
          <li className="flex items-center gap-1.5">
            <span className={`${swatch} rounded-full`} style={{ background: ink }} /> Step
          </li>
          <li className="flex items-center gap-1.5">
            <span className={`${swatch} rotate-45`} style={{ background: ink }} /> Menu or hub
          </li>
          <li>Arcs run from a step to where it leads; the bright pulse travels in that direction.</li>
        </>
      ) : (
        <>
          <li className="flex items-center gap-1.5">
            <span className={`${swatch} rounded-full`} style={{ background: ink }} /> Routine, sized by lines
          </li>
          <li className="flex items-center gap-1.5">
            <span className={`${swatch}`} style={{ background: palette.groups.file }} /> Data file
          </li>
          <li className="flex items-center gap-1.5">
            <span className={`${swatch} rotate-45`} style={{ background: palette.groups.external }} /> External call
          </li>
          <li>Arcs are CALLs and file opens, pulsing from caller to callee.</li>
        </>
      )}
    </ul>
  );
}
