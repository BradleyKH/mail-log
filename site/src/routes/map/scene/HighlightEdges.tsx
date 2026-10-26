import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import type { Group } from "three";
import { arcPoints } from "../graph/geometry";
import type { MapEdge, MapNode } from "../graph/types";

const MAX_EDGES = 80;

interface Props {
  nodes: MapNode[];
  edges: MapEdge[];
  colorOf: (edge: MapEdge) => string;
  progress: RefObject<number>;
  animate: boolean;
}

/** Selected and traced edges drawn wide and dashed; the dashes march from source to target. */
export default function HighlightEdges({ nodes, edges, colorOf, progress, animate }: Props) {
  const group = useRef<Group>(null);
  const arcs = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n]));
    return edges.slice(0, MAX_EDGES).flatMap((e) => {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      return a && b ? [{ id: e.id, color: colorOf(e), points: arcPoints(a.position, b.position, 24) }] : [];
    });
  }, [nodes, edges, colorOf]);

  useFrame((_, delta) => {
    for (const child of group.current?.children ?? []) {
      const material = (child as unknown as { material: { dashOffset: number; opacity: number } }).material;
      if (animate) material.dashOffset -= delta * 2.4;
      material.opacity = progress.current ?? 1;
    }
  });

  return (
    <group ref={group}>
      {arcs.map((a) => (
        <Line key={a.id} points={a.points} color={a.color} lineWidth={2.4} dashed dashSize={1.4} gapSize={0.7} transparent raycast={() => null} />
      ))}
    </group>
  );
}
