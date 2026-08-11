# BUILD_PLAN.md — NovaFaber visual rebuild

Nine phases. **One phase per session.** Finish it, run the gatekeeper, update
`BUILD_PROGRESS.md`, commit, stop. Do not start the next phase in the same session.

The existing repo is roughly 70% architected; this plan is a *visual* rebuild on
top of it, not a from-scratch build. Where a file already exists, replace its
contents rather than creating a parallel version.

---

## Phase 0 — Foundation
**Agent:** motion-engineer

- Install: `zustand gsap lenis three @react-three/fiber @react-three/drei`
- Drop in `src/styles/tokens.css`, import it in `app/layout.tsx`
- Wire fonts with `next/font/google`: Sofia Sans Condensed, Source Serif 4,
  JetBrains Mono → expose as `--font-sofia`, `--font-source-serif`, `--font-jetbrains`
- Add `scripts/check-contrast.mjs`, wire `"check:contrast"` and add it to `lint`
- Add the `.grain` div to the root layout

**Done when:** `npm run check:contrast` passes, fonts render in all three scripts
(test with `Καλημέρα`, `Здраво`, `Hello`), build is clean.

---

## Phase 1 — The motion system
**Agent:** motion-engineer

- `src/lib/motion/`: `store.ts`, `heat.ts`, `idle.ts`, `quality.ts`, `budget.ts`,
  `scroll.ts`, `reveal.ts`
- `MotionProvider` in `app/layout.tsx` wrapping children
- Verify `--heat`, `--mx`, `--my` update on `:root` in DevTools

**Done when:** heat rises on scroll, escalates at 6s and 16s idle, drops on
activity. `console.count()` in the page body does not climb on mousemove.

---

## Phase 2 — Forge surface + texture
**Agent:** surface-builder

- `.forge` class applied to spectacle sections
- Confirm the grid is masked to the bloom (DD-5), not flat
- Grain at 0.055 overlay, fixed, pointer-events none
- Verify texture never composites over text at any breakpoint

**Done when:** moving the cursor reveals grid texture locally; screenshots at
three widths show no texture over any paragraph.

---

## Phase 3 — Motion components
**Agent:** motion-engineer

- `Reveal`, `Magnetic`, `Spotlight`, `IgniteText`, `FloatWords`, `Cursor`, `Marquee`
- Each one checks its surface budget
- Each one has its reduced-motion path implemented per MOTION_SPEC §6

**Done when:** every component works with `prefers-reduced-motion: reduce` and
on a touch device (cursor absent, magnetic inert, hover states reachable by tap).

---

## Phase 4 — Hero
**Agent:** surface-builder, then shader-artist

- Layout: eyebrow, `FloatWords` H1, lead paragraph, dual magnetic CTA, proof strip
- **Confirm hero text is the LCP element** before adding any canvas
- Then: `ForgeHero` via `dynamic(ssr:false)`, gated on `qualityTier === "high"`

**Done when:** LCP ≤ 2.0s mobile with the canvas present, and the static-tier
fallback looks deliberate rather than empty. Log the three.js bundle cost as a DD.

**Open decision (OQ):** CSS ember bloom alone vs. bloom + R3F orb. Build the
bloom-only version first, measure, then decide with numbers.

---

## Phase 5 — Reading surfaces
**Agent:** surface-builder

- Services bento (4 cards, unequal, `Spotlight`, `notFor` lines)
- Process (4 steps, ember hairline on hover)
- Case study (framed preview + `IgniteText` narrative, problem-led)
- Testimonials shell — **renders nothing until ≥2 real named quotes exist**

**Done when:** all copy is real or the section is absent. Zero placeholder
testimonials, zero invented metrics.

---

## Phase 6 — Chrome
**Agent:** surface-builder

- Nav with `underlineDraw`, scrolled state, mobile menu
- Instrument `Marquee`
- Footer: four columns, ownership promise, Greek legal entity placeholder + OQ

**Done when:** mobile nav is keyboard-operable and closes on Escape.

---

## Phase 7 — Polish
**Agent:** motion-engineer + shader-artist

- `velocitySkew` on spectacle headlines (cap 3.2°)
- `forgedGlow` — exactly one white-hot word per section, audit for violations
- View Transitions between routes
- `content-visibility: auto` on below-fold sections

**Done when:** a full-page scroll holds 60fps on a 4× throttled CPU.

---

## Phase 8 — Localisation
**Agent:** surface-builder

- EL and MK copy written **per market**, not translated
- `hreflang` + `x-default` correct; remove `noindex` per locale as copy ships
- Verify Sofia Sans Condensed renders Greek and Cyrillic without fallback

**Done when:** no locale serves the wrong language, and unwritten locales are
still `noindex, follow`.

---

## Phase 9 — Launch gates
**Agent:** gatekeeper

- Full gate sequence (see `.claude/agents/gatekeeper.md`)
- JSON-LD: `Organization` / `ProfessionalService`, `areaServed`, `availableLanguage`,
  per-service `Service` nodes, `alternateName: "Apex Solutions"`
- GDPR + Greek Law 3471/2006 consent: prior opt-in, per-cookie disclosure, no
  pre-ticked boxes, no cookie wall, revisit widget
- 301s from the old domain
- `/privacy`, `/cookies`, `/terms` live

**Done when:** every gate reports a passing measured number, not an adjective.
