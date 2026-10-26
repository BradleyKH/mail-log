import type { Vec3 } from "../graph/types";

export interface ScreenAnchor {
  el: HTMLElement;
  position: Vec3;
}

/** DOM elements pinned to scene positions, moved every frame by ScreenProjector. */
export type AnchorRegistry = Map<string, ScreenAnchor>;

export function anchorRef(registry: AnchorRegistry, id: string, position: Vec3) {
  return (el: HTMLElement | null) => {
    if (el) registry.set(id, { el, position });
    else registry.delete(id);
  };
}
