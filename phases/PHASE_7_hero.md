# Phase 7 — The forge hero & performance budget

## Goal

Give the homepage its one spectacle moment, built entirely in code, and
enforce the performance budget the rest of the site's pitch depends on.

## Read first

- `PROGRESS.md` — **DD-3** (all GLBs scrapped, replacement is procedural),
  DD-8 (no post-processing behind text), DD-14 (motion budget)
- `SPEC.md` §3.4 (grade profiles), §7 (performance budget)
- `lib/grade.ts`, `lib/motion-budget.ts` — written in Phase 1 for this phase

## Scope

**In:**
- A procedural forged object: geometry generated at runtime, surfaced by a
  custom shader. No mesh files of any kind.
- Device quality tiers, including a genuine no-WebGL path
- Canvas loaded so it cannot delay LCP
- The no-WebGL-on-reading-pages guard deferred from Phase 1

**Out:**
- `@react-three/postprocessing`. The grade in `lib/grade.ts` is applied
  **inside the fragment shader** instead — grain and vignette are a few lines
  there, and the library is a large dependency to add to a site selling speed.
  Chromatic aberration is not implemented at all, which costs nothing: DD-8
  already sets it to zero on every surface carrying text, and the hero is the
  only surface that could use it.

## The concept

*Faber* is a smith. The object is material caught mid-forming: molten where
it has been worked, cooling to dark iron where it has not. Cursor proximity
is the heat source. Nothing about this is decorative — the brand's whole claim
is that things here are made rather than assembled, and a static mesh
downloaded from a generator would have contradicted it.

## Tasks

1. `lib/quality.ts` — `high` / `low` / `static` tiers, reduced-motion aware.
2. Procedural geometry, subdivision by tier.
3. Vertex shader: noise displacement, amplitude driven by heat.
4. Fragment shader: fresnel rim, ember-to-iron heat gradient, grain and
   vignette read from `lib/grade.ts`.
5. Pointer-driven heat with decay.
6. Dynamic import; the typographic hero renders first and stays the LCP element.
7. `scripts/check-no-webgl.mjs` — fail if a reading route imports the canvas.
8. **Mutation-test that guard.**

## Definition of Done

- [ ] Zero mesh files; geometry generated at runtime
- [ ] Grade values come from `lib/grade.ts`, not hard-coded in the shader
- [ ] `static` tier renders a complete hero with no WebGL
- [ ] `prefers-reduced-motion` honoured
- [ ] Canvas dynamically imported; text is the LCP element
- [ ] No-WebGL guard exists **and is mutation-tested**
- [ ] `npm run build` and `npm run lint` pass
- [ ] Committed, `PROGRESS.md` updated

## Escalate, don't guess

If the shader cannot carry the hero without adding a mesh file, that is an
escalation with a byte count attached — not a quiet reintroduction of a GLB
(DD-3).
