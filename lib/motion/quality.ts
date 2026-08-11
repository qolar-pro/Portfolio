import type { QualityTier } from "./store";

/**
 * DEVICE TIERING
 *
 *   high    — desktop / capable mobile with WebGL2. Full effects + shader.
 *   low     — WebGL present but weak device. CSS effects, no shader.
 *   static  — no WebGL, reduced motion, or save-data. Layout only.
 *
 * Called once on mount. Never re-evaluated mid-session (thrash).
 */

export function probeWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Release immediately — some mobile GPUs cap live contexts at 8
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function hasPointerFine(): boolean {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function detectQualityTier(): {
  tier: QualityTier;
  webgl: boolean;
  reduced: boolean;
  pointerFine: boolean;
} {
  const reduced = prefersReducedMotion();
  const webgl = probeWebGL();
  const pointerFine = hasPointerFine();

  // Respect Save-Data and low core counts
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const saveData = conn?.saveData === true;
  const slowNet = conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g";
  const cores = navigator.hardwareConcurrency ?? 4;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

  if (reduced || !webgl || saveData || slowNet) {
    return { tier: "static", webgl, reduced, pointerFine };
  }

  if (cores <= 4 || deviceMemory <= 4 || !pointerFine) {
    return { tier: "low", webgl, reduced, pointerFine };
  }

  return { tier: "high", webgl, reduced, pointerFine };
}
