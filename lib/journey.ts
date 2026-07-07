/**
 * Shared mutable state bridging the DOM world (Lenis / ScrollTrigger)
 * and the WebGL world (useFrame). Mutated imperatively every frame —
 * deliberately NOT React state, so nothing re-renders at 120fps.
 */

export type SectionId =
  | 'hero'
  | 'about'
  | 'services'
  | 'work'
  | 'experience'
  | 'stack'
  | 'contact';

export const SECTION_ORDER: SectionId[] = [
  'hero',
  'about',
  'services',
  'work',
  'experience',
  'stack',
  'contact',
];

export const journey = {
  /** 0..1 through the entire page scroll */
  progress: 0,
  /** smoothed scroll velocity, roughly -1..1 after normalization */
  velocity: 0,
  /** normalized pointer, -1..1 on both axes (0,0 = center) */
  pointer: { x: 0, y: 0 },
  /** 0..1 — drives the intro camera dolly after the preloader resolves */
  introProgress: 0,
  /** 0..1 — real WebGL asset/compile progress reported from inside the canvas */
  assetProgress: 0,
  /** true once the canvas has rendered its first frame (or static tier is active) */
  sceneReady: false,
  /** scroll progress anchor for the center of each section, measured from the DOM */
  anchors: [0, 0.14, 0.3, 0.52, 0.72, 0.85, 1] as number[],
  /** programmatic smooth scroll, wired up by SmoothScroll (Lenis) */
  scrollTo: undefined as ((target: number | HTMLElement) => void) | undefined,
};
