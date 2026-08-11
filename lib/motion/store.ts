import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/**
 * THE MOTION STORE
 *
 * Split deliberately into two kinds of state:
 *
 *   CONTINUOUS — pointer, scrollVelocity, heat. Updated up to 120×/sec.
 *     React must NEVER subscribe to these. Read them with getState() inside
 *     rAF or useFrame, or consume them as CSS custom properties.
 *
 *   DISCRETE — qualityTier, reducedMotion, idleLevel, cursorVariant, webglEnabled.
 *     Safe for React to subscribe to; these change a handful of times per session.
 *
 * See CLAUDE.md §5. Getting this wrong costs ~60 re-renders/second and tanks INP.
 */

export type QualityTier = "high" | "low" | "static";
export type IdleLevel = 0 | 1 | 2;
export type CursorVariant = "default" | "hot" | "hidden";
export type Surface = "spectacle" | "reading" | "chrome";

interface Pointer {
  x: number;
  y: number;
  /** normalised 0..1 */
  nx: number;
  ny: number;
}

export interface MotionState {
  // ---- continuous (do not subscribe from React) ----
  pointer: Pointer;
  scrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  heat: number;

  // ---- discrete (safe to subscribe) ----
  qualityTier: QualityTier;
  reducedMotion: boolean;
  webglEnabled: boolean;
  idleLevel: IdleLevel;
  cursorVariant: CursorVariant;
  hasPointerFine: boolean;

  // ---- actions ----
  setPointer: (x: number, y: number) => void;
  setScroll: (y: number, velocity: number, progress: number) => void;
  setHeat: (heat: number) => void;
  setIdleLevel: (level: IdleLevel) => void;
  setQualityTier: (tier: QualityTier) => void;
  setReducedMotion: (v: boolean) => void;
  setWebglEnabled: (v: boolean) => void;
  setCursorVariant: (v: CursorVariant) => void;
  setHasPointerFine: (v: boolean) => void;
}

export const useMotionStore = create<MotionState>()(
  subscribeWithSelector((set) => ({
    pointer: { x: 0, y: 0, nx: 0.5, ny: 0.4 },
    scrollY: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    heat: 0.25,

    qualityTier: "high",
    reducedMotion: false,
    webglEnabled: false,
    idleLevel: 0,
    cursorVariant: "default",
    hasPointerFine: false,

    setPointer: (x, y) =>
      set({
        pointer: {
          x,
          y,
          nx: x / window.innerWidth,
          ny: y / window.innerHeight,
        },
      }),

    setScroll: (scrollY, scrollVelocity, scrollProgress) =>
      set({ scrollY, scrollVelocity, scrollProgress }),

    setHeat: (heat) => set({ heat }),

    setIdleLevel: (idleLevel) => set({ idleLevel }),
    setQualityTier: (qualityTier) => set({ qualityTier }),
    setReducedMotion: (reducedMotion) => set({ reducedMotion }),
    setWebglEnabled: (webglEnabled) => set({ webglEnabled }),
    setCursorVariant: (cursorVariant) => set({ cursorVariant }),
    setHasPointerFine: (hasPointerFine) => set({ hasPointerFine }),
  }))
);

/**
 * Non-reactive read. Use inside useFrame, rAF loops, GSAP callbacks,
 * event handlers — anywhere a re-render would be wasteful.
 */
export const motion = () => useMotionStore.getState();

/**
 * Derive the heat target from current state. Pure so it can be unit-tested.
 *
 *   idle 0 → 0.25   active
 *   idle 1 → 0.35   drowsy  (6s)
 *   idle 2 → 0.55   attract (16s)
 *   + scroll energy, capped at 0.5
 */
export function heatTarget(idleLevel: IdleLevel, velocity: number): number {
  const idleBase = idleLevel === 2 ? 0.55 : idleLevel === 1 ? 0.35 : 0.25;
  const scrollEnergy = Math.min(velocity * 0.5, 0.5);
  return Math.min(idleBase + scrollEnergy, 1);
}
