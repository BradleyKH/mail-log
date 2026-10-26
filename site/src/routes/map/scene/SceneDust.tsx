import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { AdditiveBlending, BufferGeometry, Color, Float32BufferAttribute, NormalBlending, ShaderMaterial, Sphere, Vector3 } from "three";
import { seededRandom } from "../graph/random";
import type { MapGraph } from "../graph/types";

const COUNT = 1400;
// Floor and ceiling of the dust, around the map's ground plane.
const LOW = -50;
const HIGH = 110;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uViewportHeight;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float span = ${(HIGH - LOW).toFixed(1)};
    p.y = mod(p.y - ${LOW.toFixed(1)} + uTime * (0.8 + aSeed * 1.6), span) + ${LOW.toFixed(1)};
    p.x += sin(uTime * 0.21 + aSeed * 40.0) * 2.5;
    p.z += cos(uTime * 0.17 + aSeed * 31.0) * 2.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float px = (0.35 + aSeed * 0.55) * projectionMatrix[1][1] * uViewportHeight * 0.5 / -mv.z;
    gl_PointSize = clamp(px, 1.0, 24.0);
    float twinkle = 0.55 + 0.45 * sin(uTime * (0.4 + aSeed * 0.8) + aSeed * 90.0);
    // Faded in at the floor and out at the ceiling so the wrap-around never pops.
    float band = smoothstep(${LOW.toFixed(1)}, ${(LOW + 30).toFixed(1)}, p.y) * smoothstep(${HIGH.toFixed(1)}, ${(HIGH - 40).toFixed(1)}, p.y);
    // Motes brushing the lens would be big soft blobs; let them slip out of view instead.
    vAlpha = twinkle * band * min(1.0, px) * (1.0 - smoothstep(9.0, 20.0, px));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(uv, uv);
    if (r2 > 1.0) discard;
    float a = exp(-r2 * 3.5) * vAlpha * uStrength;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

interface Props {
  graph: MapGraph;
  color: string;
  additive: boolean;
  animate: boolean;
}

/** Motes drifting slowly upward through the map, scattered a little past the graph's footprint. */
export default function SceneDust({ graph, color, additive, animate }: Props) {
  const height = useThree((s) => s.size.height);

  const geometry = useMemo(() => {
    let reach = 60;
    for (const n of graph.nodes) reach = Math.max(reach, Math.abs(n.position[0]), Math.abs(n.position[2]));
    reach *= 1.3;
    const random = seededRandom(7919);
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (random() * 2 - 1) * reach;
      positions[i * 3 + 1] = LOW + random() * (HIGH - LOW);
      positions[i * 3 + 2] = (random() * 2 - 1) * reach;
      seeds[i] = random();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new Float32BufferAttribute(seeds, 1));
    g.boundingSphere = new Sphere(new Vector3(), reach * 2);
    return g;
  }, [graph]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uViewportHeight: { value: 1 }, uColor: { value: new Color() }, uStrength: { value: 1 } },
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uColor.value.set(color);
    material.blending = additive ? AdditiveBlending : NormalBlending;
    material.uniforms.uStrength.value = additive ? 0.55 : 0.3;
    material.needsUpdate = true;
  }, [material, color, additive]);

  useEffect(() => () => material.dispose(), [material]);

  useFrame((state) => {
    material.uniforms.uViewportHeight.value = height * state.viewport.dpr;
    if (animate) material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} raycast={() => {}} />;
}
