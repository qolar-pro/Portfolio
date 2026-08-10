/**
 * Post-processing profiles (SPEC §3.4, DD-8 — Phase 1).
 *
 * Phase 7 builds the scene; this module decides what the scene is allowed to
 * look like on a given surface. It ships in Phase 1 because DD-8 is a
 * legibility ruling, not a rendering detail, and the values it corrects are
 * specific and measured.
 *
 * Reference — the old build, which is what these numbers correct:
 *   Effects.tsx:40   Noise, opacity 0.45, SCREEN blend, full frame
 *   Effects.tsx:22-24 ChromaticAberration 0.0012 -> 0.0072 with scroll velocity
 *   Effects.tsx:41   Vignette darkness 0.78
 */

export interface GradeProfile {
  bloomIntensity: number;
  /** Base chromatic aberration offset. 0 disables the pass entirely. */
  chromaticAberration: number;
  /** How much CA grows with scroll velocity. 0 means it never swells. */
  chromaticAberrationVelocity: number;
  /** Film grain opacity. */
  noise: number;
  vignetteDarkness: number;
  vignetteOffset: number;
}

/** Hero, case-study openers, /lab. No body copy sits on these. */
export const FULL: GradeProfile = {
  bloomIntensity: 0.9,
  chromaticAberration: 0.0012,
  chromaticAberrationVelocity: 0.008,
  noise: 0.45,
  vignetteDarkness: 0.78,
  vignetteOffset: 0.22,
};

/**
 * Mandatory on any surface carrying body text.
 *
 * Chromatic aberration is zero rather than reduced. It works by offsetting
 * colour channels at edges, and letterforms are nothing but edges — there is
 * no small amount of it that is safe behind prose.
 */
export const CALM: GradeProfile = {
  bloomIntensity: 0.35,
  chromaticAberration: 0,
  chromaticAberrationVelocity: 0,
  noise: 0.12,
  vignetteDarkness: 0.35,
  vignetteOffset: 0.4,
};

/** No canvas at all. Service, pricing and process pages ship no WebGL. */
export const NONE = null;

export type GradeName = 'full' | 'calm' | 'none';

export function gradeFor(name: GradeName): GradeProfile | null {
  if (name === 'full') return FULL;
  if (name === 'calm') return CALM;
  return NONE;
}
