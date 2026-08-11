import type { Surface } from "./store";

/**
 * MOTION BUDGET
 *
 * Per-surface allowlists from MOTION_SPEC §3. Adding an effect to a surface
 * means removing one — the constraint is the point. In dev, a violation throws
 * so it can't be ignored; in prod the effect silently no-ops rather than
 * breaking the page for a visitor.
 */

export const EFFECTS = [
  "emberBloom",
  "gridMask",
  "grain",
  "floatWord",
  "forgedGlow",
  "velocitySkew",
  "magnetic",
  "spotlight",
  "reveal",
  "ignite",
  "underlineDraw",
  "marquee",
  "cursorHot",
  "shader",
] as const;

export type Effect = (typeof EFFECTS)[number];

const BUDGET: Record<Surface, readonly Effect[]> = {
  spectacle: [
    "emberBloom",
    "gridMask",
    "velocitySkew",
    "magnetic",
    "cursorHot",
    "floatWord",
    "forgedGlow",
    "reveal",
    "shader",
  ],
  reading: ["reveal", "ignite", "spotlight", "cursorHot"],
  chrome: ["underlineDraw", "marquee", "cursorHot", "magnetic"],
};

export function isAllowed(surface: Surface, effect: Effect): boolean {
  return BUDGET[surface].includes(effect);
}

export function assertAllowed(surface: Surface, effect: Effect): boolean {
  const ok = isAllowed(surface, effect);
  if (!ok && process.env.NODE_ENV !== "production") {
    throw new Error(
      `[motion budget] "${effect}" is not permitted on a "${surface}" surface.\n` +
        `Permitted: ${BUDGET[surface].join(", ")}\n` +
        `If this effect belongs here, remove one from the list in ` +
        `lib/motion/budget.ts and log the trade as a Director Decision.`
    );
  }
  return ok;
}
