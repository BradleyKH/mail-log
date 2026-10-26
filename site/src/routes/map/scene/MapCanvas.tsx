import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { Highlight } from "../graph/selection";
import type { Layer, MapGraph } from "../graph/types";
import type { MapViewProps } from "../viewTypes";
import type { AnchorRegistry } from "./anchors";
import CameraRig from "./CameraRig";
import LayerScene from "./LayerScene";
import SceneBackdrop from "./SceneBackdrop";
import SceneDust from "./SceneDust";
import SceneEffects from "./SceneEffects";
import SceneOverlay from "./SceneOverlay";
import ScreenProjector from "./ScreenProjector";

const EMPTY: Highlight = { nodes: new Set(), edges: new Set(), focus: [] };

/** The three.js view; loaded lazily so three and the R3F stack stay out of every other room's bundle. */
export default function MapCanvas(props: MapViewProps) {
  const { data, layer, palette, theme } = props;
  const registry = useMemo<AnchorRegistry>(() => new Map(), []);
  const layers: [Layer, MapGraph | null][] = [
    ["manual", data.manual],
    ["code", data.code],
  ];
  const active = layer === "code" ? data.code : data.manual;
  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 45, near: 0.5, far: 3000, position: [0, 160, 128] }}
        gl={{ antialias: true }}
        role="img"
        aria-label={`Three-dimensional map, ${layer} layer`}
      >
        <SceneBackdrop palette={palette} animate={!props.reducedMotion} />
        <ambientLight intensity={theme === "dark" ? 1.5 : 1.9} />
        <directionalLight position={[60, 120, 80]} intensity={theme === "dark" ? 1.4 : 1.1} />
        <CameraRig focus={props.focus} instant={props.reducedMotion} />
        <ScreenProjector registry={registry} />
        {layers.map(([id, graph]) =>
          graph ? (
            <LayerScene
              key={id}
              graph={graph}
              active={id === layer}
              palette={palette}
              glow={theme === "dark" ? "additive" : "normal"}
              highlight={id === layer ? props.highlight : EMPTY}
              trace={id === layer ? props.trace : null}
              hidden={props.hidden}
              hovered={id === layer ? props.hovered : null}
              reducedMotion={props.reducedMotion}
              onHover={props.onHover}
              onSelect={props.onSelect}
            />
          ) : null,
        )}
        {active && <SceneDust graph={active} color={palette.dust} additive={theme === "dark"} animate={!props.reducedMotion} />}
        {/* Bloom and an ACES pass gray the paper, so the light theme draws straight to the screen. */}
        {theme === "dark" && <SceneEffects animate={!props.reducedMotion} />}
      </Canvas>
      <SceneOverlay
        registry={registry}
        labels={active?.labels ?? []}
        hidden={props.hidden}
        popoverNode={props.popoverNode}
        flows={data.flows}
        index={data.index}
        record={props.record}
      />
    </div>
  );
}
