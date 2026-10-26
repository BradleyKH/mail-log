import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  IcosahedronGeometry,
  InstancedMesh,
  NormalBlending,
  Object3D,
  OctahedronGeometry,
  SphereGeometry,
  type BufferGeometry,
  type MeshBasicMaterial,
  type MeshLambertMaterial,
} from "three";
import type { MapNode, NodeShape } from "../graph/types";

export interface NodeStyle {
  color: string;
  scale: number;
}

function geometryFor(shape: NodeShape): BufferGeometry {
  switch (shape) {
    case "hub":
      return new OctahedronGeometry(1.25, 0);
    case "file":
      return new BoxGeometry(1.7, 1.1, 1.7);
    case "external":
      return new IcosahedronGeometry(1.1, 0);
    default:
      return new SphereGeometry(1, 20, 14);
  }
}

interface Props {
  nodes: MapNode[];
  shape: NodeShape;
  styles: Map<string, NodeStyle>;
  progress: RefObject<number>;
  active: boolean;
  glow: "additive" | "normal";
  onHover: (id: string | null) => void;
  onSelect: (node: MapNode) => void;
}

const noRaycast = () => {};
const dummy = new Object3D();
const color = new Color();

/** One draw call per shape: the nodes plus a soft halo shell that makes them read as glowing. */
export default function NodeInstances({ nodes, shape, styles, progress, active, glow, onHover, onSelect }: Props) {
  const mesh = useRef<InstancedMesh>(null);
  const halo = useRef<InstancedMesh>(null);
  const geometry = useMemo(() => geometryFor(shape), [shape]);
  const haloGeometry = useMemo(() => new SphereGeometry(1, 12, 8), []);

  useLayoutEffect(() => {
    const m = mesh.current;
    const h = halo.current;
    if (!m || !h) return;
    nodes.forEach((n, i) => {
      const style = styles.get(n.id) ?? { color: "#888888", scale: 1 };
      const s = n.size * style.scale;
      dummy.position.set(...n.position);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      dummy.scale.setScalar(s * 1.55);
      dummy.updateMatrix();
      h.setMatrixAt(i, dummy.matrix);
      color.set(style.color);
      m.setColorAt(i, color);
      h.setColorAt(i, color);
    });
    for (const x of [m, h]) {
      x.instanceMatrix.needsUpdate = true;
      if (x.instanceColor) x.instanceColor.needsUpdate = true;
    }
    m.computeBoundingSphere();
  }, [nodes, styles]);

  useLayoutEffect(() => {
    if (mesh.current) mesh.current.raycast = active ? InstancedMesh.prototype.raycast : noRaycast;
  }, [active]);

  useFrame(() => {
    const p = progress.current ?? 1;
    if (mesh.current) (mesh.current.material as MeshLambertMaterial).opacity = p;
    if (halo.current) (halo.current.material as MeshBasicMaterial).opacity = p * (glow === "additive" ? 0.16 : 0.12);
  });

  const nodeAt = (e: ThreeEvent<PointerEvent | MouseEvent>) => (e.instanceId === undefined ? undefined : nodes[e.instanceId]);

  return (
    <group>
      <instancedMesh
        key={`n${nodes.length}`}
        ref={mesh}
        args={[geometry, undefined, nodes.length]}
        onPointerMove={(e) => {
          const n = nodeAt(e);
          if (!n) return;
          e.stopPropagation();
          onHover(n.id);
        }}
        onPointerOut={() => onHover(null)}
        onClick={(e) => {
          const n = nodeAt(e);
          if (!n) return;
          e.stopPropagation();
          onSelect(n);
        }}
      >
        <meshLambertMaterial transparent />
      </instancedMesh>
      <instancedMesh key={`h${nodes.length}`} ref={halo} args={[haloGeometry, undefined, nodes.length]} raycast={noRaycast}>
        <meshBasicMaterial transparent depthWrite={false} blending={glow === "additive" ? AdditiveBlending : NormalBlending} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
