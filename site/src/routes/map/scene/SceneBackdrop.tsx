import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { BackSide, Color, ShaderMaterial } from "three";
import type { ScenePalette } from "../palette";

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Pinned to the far plane, so the dome never hides anything however far the camera pulls back.
    gl_Position = p.xyww;
  }
`;

// The map lies on the ground plane and the camera looks down on it, so "below" is behind the map.
const fragmentShader = /* glsl */ `
  uniform vec3 uCenter;
  uniform vec3 uEdge;
  uniform float uTime;
  uniform float uHaze;
  varying vec3 vDir;
  void main() {
    vec3 d = normalize(vDir);
    float glow = smoothstep(0.35, -0.95, d.y);
    vec3 col = mix(uEdge, uCenter, glow * glow);
    // Slow, low-frequency banks of haze so the sky is not a dead gradient.
    float t = uTime * 0.02;
    float haze = sin(d.x * 3.1 + t) * sin(d.z * 2.7 - t * 1.3) + sin((d.x + d.z) * 4.3 + t * 0.7) * 0.5;
    col += (uCenter - uEdge) * haze * uHaze * glow;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/** A sky dome around the map: a soft glow behind the graph that falls off to the horizon. */
export default function SceneBackdrop({ palette, animate }: { palette: ScenePalette; animate: boolean }) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: BackSide,
        depthWrite: false,
        uniforms: { uCenter: { value: new Color() }, uEdge: { value: new Color() }, uTime: { value: 0 }, uHaze: { value: 0.12 } },
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uCenter.value.set(palette.sky.center);
    material.uniforms.uEdge.value.set(palette.sky.edge);
  }, [material, palette]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    if (animate) material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh material={material} renderOrder={-1} frustumCulled={false} raycast={() => {}}>
      <sphereGeometry args={[1500, 48, 32]} />
    </mesh>
  );
}
