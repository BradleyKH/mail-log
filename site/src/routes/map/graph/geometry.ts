import type { Vec3 } from "./types";

export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export const deg = (d: number) => (d * Math.PI) / 180;

/** A point on the ground plane (x, z) at the given angle and radius from a center. */
export function polar(center: Vec3, angle: number, radius: number, y = center[1]): Vec3 {
  return [center[0] + Math.cos(angle) * radius, y, center[2] + Math.sin(angle) * radius];
}

/** Sunflower packing: item i of a cluster sits at radius spacing * sqrt(i), turning by the golden angle. */
export function phyllotaxis(center: Vec3, i: number, spacing: number, turn = 0): Vec3 {
  return polar(center, turn + i * GOLDEN_ANGLE, spacing * Math.sqrt(i), center[1]);
}

/** Outer radius of a phyllotaxis cluster of `count` items. */
export const phyllotaxisRadius = (count: number, spacing: number) => spacing * Math.sqrt(Math.max(count - 1, 0));

export function distance(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

/**
 * Samples a quadratic arc from a to b that bows upward by a share of its length, so edges read
 * as arcs over the flat clusters instead of lines through them.
 */
export function arcPoints(a: Vec3, b: Vec3, segments = 16, lift = 0.22): Vec3[] {
  const mid: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + distance(a, b) * lift + 0.5, (a[2] + b[2]) / 2];
  const out: Vec3[] = [];
  for (let s = 0; s <= segments; s++) {
    const t = s / segments;
    const u = 1 - t;
    out.push([
      u * u * a[0] + 2 * u * t * mid[0] + t * t * b[0],
      u * u * a[1] + 2 * u * t * mid[1] + t * t * b[1],
      u * u * a[2] + 2 * u * t * mid[2] + t * t * b[2],
    ]);
  }
  return out;
}
