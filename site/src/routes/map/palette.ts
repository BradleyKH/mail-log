import type { NodeGroup } from "./graph/types";

export type SceneTheme = "light" | "dark";

export interface ScenePalette {
  background: string;
  edge: string;
  selected: string;
  trace: string;
  /** The sky dome: brightest behind the map's center, falling off to the horizon. */
  sky: { center: string; edge: string };
  dust: string;
  groups: Record<NodeGroup, string>;
}

/**
 * Hex values because three.js does not parse the site's oklch tokens. Light colors are darkened
 * to hold contrast on the paper background; dark colors are brightened for the night scene.
 */
export const PALETTES: Record<SceneTheme, ScenePalette> = {
  light: {
    background: "#efe7d6",
    edge: "#7a6a58",
    selected: "#111111",
    trace: "#b4380f",
    sky: { center: "#f6efe0", edge: "#ddd0b4" },
    dust: "#6b5a46",
    groups: {
      core: "#4a3f33",
      correspondence: "#a4520c",
      dir: "#0d6e66",
      "drawing-eo": "#6a2fc9",
      general: "#3d7a1f",
      support: "#4f5d6b",
      external: "#b42318",
      file: "#866500",
    },
  },
  dark: {
    background: "#12100e",
    edge: "#8b7d6b",
    selected: "#ffffff",
    trace: "#ffb86b",
    sky: { center: "#241c15", edge: "#060608" },
    dust: "#ffd9a8",
    groups: {
      core: "#ece3cf",
      correspondence: "#f4a944",
      dir: "#4fd8cb",
      "drawing-eo": "#b79cff",
      general: "#8fdc72",
      support: "#a9b4c0",
      external: "#ff7a6e",
      file: "#f5df5d",
    },
  },
};
