import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type ComponentRef } from "react";
import { Vector3 } from "three";
import type { FocusRequest } from "../viewTypes";

const DEFAULT_DIRECTION = new Vector3(0, 0.78, 0.62).normalize();

/** Orbit, pan, and pinch controls, plus a short eased flight whenever a focus is requested. */
export default function CameraRig({ focus, instant }: { focus: FocusRequest | null; instant: boolean }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const goal = useRef<{ target: Vector3; camera: Vector3 } | null>(null);
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    const c = controls.current;
    if (!focus || !c) return;
    const target = new Vector3(...focus.target);
    const dir = focus.direction ? new Vector3(...focus.direction).normalize() : camera.position.clone().sub(c.target).normalize();
    if (dir.lengthSq() === 0 || dir.y < 0.2) dir.copy(DEFAULT_DIRECTION);
    // Narrow (portrait) viewports need more distance to fit the same width.
    const aspect = size.width / Math.max(size.height, 1);
    const distance = focus.distance * (aspect < 1 ? Math.min(1 / aspect, 2.2) : 1);
    const cam = target.clone().add(dir.multiplyScalar(distance));
    if (instant) {
      c.target.copy(target);
      camera.position.copy(cam);
      c.update();
      goal.current = null;
    } else {
      goal.current = { target, camera: cam };
    }
    // Only a new request (key) should move the camera, not a resize or a motion-preference change.
  }, [focus?.key]);

  useFrame((_, delta) => {
    const c = controls.current;
    const g = goal.current;
    if (!c || !g) return;
    const k = 1 - Math.exp(-delta * 4.5);
    c.target.lerp(g.target, k);
    camera.position.lerp(g.camera, k);
    if (camera.position.distanceTo(g.camera) < 0.05 && c.target.distanceTo(g.target) < 0.05) goal.current = null;
    c.update();
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.09}
      minDistance={6}
      maxDistance={480}
      maxPolarAngle={Math.PI * 0.49}
      onStart={() => {
        goal.current = null;
      }}
    />
  );
}
