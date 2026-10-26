import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import { AdditiveBlending, Color, NormalBlending, ShaderMaterial } from "three";
import type { MapNode } from "../graph/types";

const MAX_RINGS = 12;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// An inner solid ring, and an outer one broken into dashes that turn slowly.
const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  float band(float r, float center, float width) {
    float d = (r - center) / width;
    return exp(-d * d);
  }
  void main() {
    vec2 c = vUv * 2.0 - 1.0;
    float r = length(c);
    if (r > 1.0) discard;
    float a = atan(c.y, c.x) / 6.2831853;
    float inner = band(r, 0.62, 0.035);
    float dashes = smoothstep(0.35, 0.5, abs(fract(a * 18.0 - uTime * 0.12) - 0.5) * 2.0 - 0.15);
    float outer = band(r, 0.84, 0.03) * dashes;
    float breathe = 0.8 + 0.2 * sin(uTime * 1.6);
    gl_FragColor = vec4(uColor, (inner * 0.9 + outer * 0.75) * breathe * uOpacity);
    #include <colorspace_fragment>
  }
`;

interface Props {
  nodes: MapNode[];
  color: string;
  additive: boolean;
  animate: boolean;
  progress: RefObject<number>;
}

/** Rings that face the camera around each focused node, so the selection reads from any angle. */
export default function FocusRings({ nodes, color, additive, animate, progress }: Props) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: { uColor: { value: new Color() }, uTime: { value: 0 }, uOpacity: { value: 1 } },
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uColor.value.set(color);
    material.blending = additive ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  }, [material, color, additive]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    if (animate) material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uOpacity.value = progress.current ?? 1;
  });

  return (
    <>
      {nodes.slice(0, MAX_RINGS).map((n) => (
        <Billboard key={n.id} position={n.position}>
          <mesh material={material} scale={n.size * 7} raycast={() => {}}>
            <planeGeometry />
          </mesh>
        </Billboard>
      ))}
    </>
  );
}
