import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";

/**
 * The night lens: bloom on anything burning bright, a vignette, and film grain. Tone mapping is
 * applied here because the composer renders the scene into a buffer, where three skips the
 * renderer's own tone mapping.
 */
export default function SceneEffects({ animate }: { animate: boolean }) {
  return (
    <EffectComposer multisampling={4}>
      {[
        <Bloom key="bloom" mipmapBlur luminanceThreshold={0.75} luminanceSmoothing={0.25} intensity={0.85} radius={0.7} />,
        <ToneMapping key="tone" mode={ToneMappingMode.ACES_FILMIC} />,
        <Vignette key="vignette" offset={0.3} darkness={0.65} />,
        // Animated grain flickers; with reduced motion it would be the only thing moving.
        ...(animate ? [<Noise key="noise" premultiply blendFunction={BlendFunction.ADD} opacity={0.3} />] : []),
      ]}
    </EffectComposer>
  );
}
