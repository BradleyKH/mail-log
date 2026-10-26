import type { RecordType } from "@/content/types";
import type { Highlight } from "./graph/selection";
import type { TracePath } from "./graph/trace";
import type { Layer, MapNode, NodeGroup, Vec3 } from "./graph/types";
import type { ScenePalette, SceneTheme } from "./palette";
import type { MapData } from "./useMapData";

export interface FocusRequest {
  key: number;
  target: Vec3;
  distance: number;
  /** View direction from the target; defaults to the current one. */
  direction?: Vec3;
}

/** Everything the 3D scene and the 2D fallback both draw from. */
export interface MapViewProps {
  data: MapData;
  layer: Layer;
  theme: SceneTheme;
  palette: ScenePalette;
  highlight: Highlight;
  trace: TracePath | null;
  hidden: Set<NodeGroup>;
  hovered: string | null;
  popoverNode: MapNode | null;
  record: RecordType;
  reducedMotion: boolean;
  focus: FocusRequest | null;
  onHover: (id: string | null) => void;
  onSelect: (node: MapNode) => void;
}
