import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { arcPoints } from "../graph/geometry";
import type { MapEdge, MapNode, Vec3 } from "../graph/types";

/** A bright bead that runs the traced path end to end, one edge per second. */
export default function TraceTraveler({ nodes, edges, color }: { nodes: MapNode[]; edges: MapEdge[]; color: string }) {
  const mesh = useRef<Mesh>(null);
  const path = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const out: Vec3[][] = [];
    for (const e of edges) {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      if (a && b) out.push(arcPoints(a.position, b.position, 24));
    }
    return out;
  }, [nodes, edges]);

  useFrame((state) => {
    if (!mesh.current || path.length === 0) return;
    const t = state.clock.elapsedTime % path.length;
    const arc = path[Math.floor(t) % path.length];
    const local = (t % 1) * (arc.length - 1);
    const i = Math.floor(local);
    const f = local - i;
    const a = arc[i];
    const b = arc[Math.min(i + 1, arc.length - 1)];
    mesh.current.position.set(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
  });

  if (path.length === 0) return null;
  return (
    <mesh ref={mesh} raycast={() => null}>
      <sphereGeometry args={[0.9, 16, 12]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}
