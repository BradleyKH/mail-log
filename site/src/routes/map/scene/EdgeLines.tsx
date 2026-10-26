import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, type RefObject } from "react";
import { BufferGeometry, Color, Float32BufferAttribute, NormalBlending, AdditiveBlending, ShaderMaterial } from "three";
import { arcPoints } from "../graph/geometry";
import { hashString } from "../graph/random";
import type { MapEdge, MapNode } from "../graph/types";

const SEGMENTS = 14;

const vertexShader = /* glsl */ `
  attribute float aT;
  attribute float aPhase;
  attribute float aDim;
  attribute vec3 color;
  varying float vT;
  varying float vPhase;
  varying float vDim;
  varying vec3 vColor;
  void main() {
    vT = aT;
    vPhase = aPhase;
    vDim = aDim;
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A bright head travels from each edge's source to its target with a fading tail behind it.
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPulse;
  uniform float uBase;
  varying float vT;
  varying float vPhase;
  varying float vDim;
  varying vec3 vColor;
  void main() {
    float f = fract(vT - uTime * 0.28 + vPhase);
    float pulse = uPulse * pow(f, 10.0) * (1.0 - vDim);
    float alpha = mix(uBase, 0.1, vDim) + pulse * 0.6;
    gl_FragColor = vec4(vColor * (1.0 + pulse * 0.8), alpha * uOpacity);
  }
`;

interface Props {
  nodes: MapNode[];
  edges: MapEdge[];
  colorOf: (edge: MapEdge) => string;
  dimmed: boolean;
  progress: RefObject<number>;
  pulse: boolean;
  additive: boolean;
}

/** Every edge of a layer as quadratic arcs in a single line-segment draw call. */
export default function EdgeLines({ nodes, edges, colorOf, dimmed, progress, pulse, additive }: Props) {
  const geometry = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const positions: number[] = [];
    const colors: number[] = [];
    const ts: number[] = [];
    const phases: number[] = [];
    const dims: number[] = [];
    const c = new Color();
    for (const e of edges) {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      if (!a || !b) continue;
      const pts = arcPoints(a.position, b.position, SEGMENTS);
      c.set(colorOf(e));
      const phase = (hashString(e.id) % 1000) / 1000;
      for (let s = 0; s < SEGMENTS; s++) {
        for (const k of [s, s + 1]) {
          positions.push(...pts[k]);
          colors.push(c.r, c.g, c.b);
          ts.push(k / SEGMENTS);
          phases.push(phase);
          dims.push(dimmed ? 1 : 0);
        }
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    g.setAttribute("color", new Float32BufferAttribute(colors, 3));
    g.setAttribute("aT", new Float32BufferAttribute(ts, 1));
    g.setAttribute("aPhase", new Float32BufferAttribute(phases, 1));
    g.setAttribute("aDim", new Float32BufferAttribute(dims, 1));
    return g;
  }, [nodes, edges, colorOf, dimmed]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 }, uPulse: { value: 1 }, uBase: { value: 0.4 } },
      }),
    [],
  );

  useEffect(() => {
    material.blending = additive ? AdditiveBlending : NormalBlending;
    material.uniforms.uBase.value = additive ? 0.35 : 0.5;
  }, [material, additive]);

  useFrame((state) => {
    material.uniforms.uTime.value = pulse ? state.clock.elapsedTime : 0;
    material.uniforms.uPulse.value = pulse ? 1 : 0;
    material.uniforms.uOpacity.value = progress.current ?? 1;
  });

  return <lineSegments geometry={geometry} material={material} raycast={() => {}} />;
}
