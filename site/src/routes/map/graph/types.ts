import type { RecordType } from "@/content/types";

export type Layer = "manual" | "code";
export const LAYERS: readonly Layer[] = ["manual", "code"];

export type ManualGroup = "core" | RecordType;
export type CodeGroup = RecordType | "general" | "support" | "external" | "file";
export type NodeGroup = ManualGroup | CodeGroup;

export type NodeShape = "step" | "hub" | "routine" | "file" | "external";

export type NodeRef =
  | { kind: "step"; record: RecordType | null; n: number }
  | { kind: "exit" }
  | { kind: "routine"; id: string }
  | { kind: "file"; unit: string }
  | { kind: "external"; name: string };

export type Vec3 = [number, number, number];

export interface MapNode {
  id: string;
  layer: Layer;
  shape: NodeShape;
  group: NodeGroup;
  label: string;
  position: Vec3;
  /** Sphere radius (or half extent) in scene units. */
  size: number;
  ref: NodeRef;
}

export type EdgeKind = "flow" | "menu" | "call" | "file";

export interface MapEdge {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
  label?: string;
}

export interface ClusterLabel {
  id: string;
  text: string;
  group: NodeGroup;
  position: Vec3;
  minor?: boolean;
}

export interface MapGraph {
  layer: Layer;
  nodes: MapNode[];
  edges: MapEdge[];
  labels: ClusterLabel[];
  /** Center of each top-level group, for focusing the camera on a record. */
  groupCenters: Partial<Record<NodeGroup, Vec3>>;
}
