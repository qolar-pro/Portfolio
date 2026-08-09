# Phase 1 — Design System

## Goal

Build the token layer and typographic system that fixes **S2** — the
"too cramped, hard to read" problem. This phase is the reason the redesign
exists; every later visual phase consumes what it produces.

Nothing here is decorative. Each rule below traces to a diagnosed cause in
`SPEC.md` §2.

## Read first

- `SPEC.md` §2 (the two problems, with the diagnosed causes table)
- `SPEC.md` §3 (binding design constraints — these are hard rules)
- `SPEC.md` §7 (perf budget; relevant to the motion budget below)
- `_current/app/globals.css` — the palette being replaced, and *why*:
  text colours named `mist` / `fog` / `hollow` are the low-contrast problem
- `PROGRESS.md` — Director Decisions, especially any OQ-3 ruling on how much
  cinema survives

## Scope

**In:**
- Colour tokens with **measured** contrast ratios, not eyeballed ones.
- A type scale, with body and label roles clearly separated.
- Spacing rhythm and a measure cap.
- A motion budget: what may animate, where, and how much at once.
- Post-processing profiles: `full` (hero, case studies, `/lab`) vs `calm`
  (any text-bearing surface).
- Lint-or-test-level guards for the constraints that must not silently erode.

**Deliberately out of scope:**
- Applying the system to real pages — that is Phase 3.
- The 3D scene itself — that is Phase 7. This phase only defines the
  *profiles* the scene will later read.
- Brand identity work (logomark, final palette hues) — the owner has not
  ruled on this; use the existing Void/Volt/Plasma/Flare hues as a starting
  point and escalate if a new palette is needed.

## Tasks

1. **Contrast pass.** Build the colour token set. Every token pairing used
   for text must be measured and recorded — compute the actual ratio, don't
   estimate. Body text pairings must clear **4.5:1**; large display text
   **3:1**. Record the computed ratios in the phase report as a table.
2. **Type scale.** Define the scale with explicit roles. Body copy is
   **≥16px** with near-normal tracking. The current site's pattern of
   styling body-adjacent text as a label — `11px` at `0.35em` tracking in a
   low-contrast colour (`_current/.../SectionShell.tsx:74-76`) — is the
   failure mode to design against. Labels are labels; text is text.
3. **Measure cap.** A container or utility that caps running text at
   **65–75 characters**. The current site has no cap — paragraphs run the
   full `1500px` container. Every prose surface must use it.
4. **Spacing rhythm.** Note that vertical padding is *not* the problem
   (`py-[16vh]` is already generous). The problem is layer count. Define
   spacing normally; do not inflate it as a fix.
5. **Motion budget.** Codify §3.1 — one focal point per viewport. Produce a
   documented rule for which of cursor / magnetic / tilt / velocity-skew /
   marquee / particles may be simultaneously active on a given surface, and
   a mechanism that makes violating it visible.
6. **Post-processing profiles.** Define two, as data the Phase 7 scene reads:
   - `full` — the existing grade. Hero, case-study set pieces, `/lab` only.
   - `calm` — grain **≤ 0.15**, **no chromatic aberration**, reduced vignette.
     Mandatory on every text-bearing section.
   Reference values being corrected: grain `0.45` SCREEN, CA swelling
   `0.0012 → 0.0072` with scroll velocity, vignette `0.78`
   (`_current/components/canvas/Effects.tsx:22-24, 40-41`).
7. **Retire the ghost numeral.** The `clamp(6rem,18vw,15rem)` drifting
   numeral behind every H2 (`_current/.../SectionShell.tsx:64-70`) does not
   carry forward, or carries forward only clear of running text. Document
   which.
8. **Guards.** Add checks for the constraints that must not erode: measure
   cap, contrast floor, and "no WebGL on service/pricing/process pages."
9. **Mutation-test each guard.** Deliberately violate each one — set a body
   colour below 4.5:1, remove a measure cap, import the canvas into a pricing
   page — and confirm the check **fails loudly**. Restore. Report what you
   broke and what the failure output was. A guard that stays green under
   violation is decorative; fix the guard, not just the code.
10. `npm run build` and `npm run lint` pass. Commit. Update `PROGRESS.md`.

## Definition of Done

- [ ] Colour tokens defined; **computed** contrast ratios recorded in the
      report for every text pairing, all clearing 4.5:1 (3:1 for large display)
- [ ] Type scale defined with body ≥16px and label/text roles separated
- [ ] Measure cap utility exists and caps at 65–75 characters
- [ ] Motion budget documented, with a mechanism that surfaces violations
- [ ] `full` and `calm` post-processing profiles defined as consumable data
- [ ] Ghost-numeral decision made and documented
- [ ] Guards exist for: measure cap, contrast floor, no-WebGL-on-text-pages
- [ ] **Each guard mutation-tested** — violation confirmed to fail loudly,
      with the failure output quoted in the report
- [ ] Light and dark both resolve; no colour defined only inside a media or
      `[data-theme]` block
- [ ] `prefers-reduced-motion` honoured across the motion budget
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Committed
- [ ] `PROGRESS.md` updated (report section + any Open Questions)

## Escalate, don't guess

Escalate to `PROGRESS.md` → Open Questions rather than deciding:

- A new brand palette is needed and the existing hues won't carry
- A binding constraint in `SPEC.md` §3 conflicts with something practical
- The contrast floor forces a hue change the owner should approve
- This phase's scope looks wrong once you're in it

**Do not** soften a constraint in `SPEC.md` §3 or §7 to make a check pass.
Those numbers are rulings. Changing one requires a new Director Decision.
