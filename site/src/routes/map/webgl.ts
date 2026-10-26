let cached: boolean | undefined;

/** True when the browser can create a WebGL context; the Map falls back to its 2D view otherwise. */
export function supportsWebGL(): boolean {
  if (cached !== undefined) return cached;
  try {
    const canvas = document.createElement("canvas");
    cached = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}
