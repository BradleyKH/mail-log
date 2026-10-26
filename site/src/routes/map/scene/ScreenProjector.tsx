import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { Vector3 } from "three";
import type { AnchorRegistry } from "./anchors";

/** Moves each registered overlay element to its node's spot on screen, hiding it when behind the camera. */
export default function ScreenProjector({ registry }: { registry: AnchorRegistry }) {
  const v = useMemo(() => new Vector3(), []);
  useFrame(({ camera, size }) => {
    for (const { el, position } of registry.values()) {
      v.set(position[0], position[1], position[2]).project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.visibility = v.z > 1 ? "hidden" : "visible";
    }
  });
  return null;
}
