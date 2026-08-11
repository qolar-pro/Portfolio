# CLAUDE.md — NovaFaber

Agency site for NovaFaber (novafaber.com). Repo: `qolar-pro/Portfolio`.
Read this file, `docs/DESIGN_SPEC.md` and `docs/MOTION_SPEC.md` before writing code.
Log every non-obvious choice in `BUILD_PROGRESS.md` as a numbered Director Decision.

---

## 1. Stack (fixed — do not substitute)

| Concern | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript strict |
| React | 19 |
| Styling | Tailwind 4 (`@theme` in CSS, no `tailwind.config.js` colors) |
| Motion state | Zustand 5 |
| Scroll | Lenis + GSAP ScrollTrigger (ticker-married) |
| Timeline animation | GSAP 3 (free for commercial since Webflow acquisition) |
| 3D | React Three Fiber 9 + drei + raw GLSL |
| Fonts | Sofia Sans Condensed (display) · Source Serif 4 (body) · JetBrains Mono (labels) |

No Framer Motion. No styled-components. No CSS-in-JS. No component library dumped in wholesale — lift a pattern, own the code.

---

## 2. The one idea

**Heat is a physical law of this site.**

A single scalar `heat ∈ [0,1]` is derived every frame from pointer activity, scroll velocity and idle time. It is written to `--heat` on `:root`. Every ember effect — bloom radius, grid opacity, text-shadow spread, shader emission — reads `var(--heat)`.

Consequences that are **not optional**:

- New visual effects hang off `--heat`. They do not invent their own timing.
- 60fps values never pass through React state. Ever. See §5.
- If an effect can't be expressed as a function of heat, question whether it belongs.

---

## 3. Hard invariants

1. **Texture never composites over text.** Grain, grids, patterns live at `z-index: -1` or in `::before/::after` with content at `z-index: 2`.
2. **Orange is light, not paint.** `--ember` is used for accents, CTAs, hover states, 1px rules, glow. Never as a large fill behind body copy. Accent should occupy < 10% of any viewport.
3. **Dark labels on ember buttons.** `#0B0B0C` on `--ember` = 7.5:1. White on ember = 2.6:1 and is forbidden.
4. **Never pure black or pure white.** Grounds bottom out at `#08080A`; text tops out at `#E6E1DA`.
5. **One focal point per viewport.** If 3D is animating, type is still. If type is kinetic, the background is quiet.
6. **Compositor-only animation.** `transform` and `opacity` only. Animating `width`, `height`, `top`, `left`, `margin` is a bug.
7. **Text is the LCP element.** The hero canvas mounts after paint via `next/dynamic({ ssr: false })`. LCP budget ≤ 2.0s on mid-tier mobile / 4G.
8. **Every effect has a reduced-motion path** that preserves the information, not just an `animation: none` blanket.
9. **Unwritten locales are `noindex, follow`.** Never ship English copy at an `/el` or `/mk` URL.
10. **Contrast guard is a gate.** `npm run check:contrast` must pass before any commit touching tokens or type colour.

---

## 4. Motion budget (per surface)

Surfaces declare a class. Effects are only permitted where listed. **Adding an effect to a surface means removing one.**

| Surface | Permitted |
|---|---|
| `spectacle` (hero, case-study hero, closing CTA) | emberBloom, gridMask, velocitySkew, magnetic, cursorHot, floatWord, reveal, shader |
| `reading` (services copy, process, case-study body, legal) | reveal, ignite, cursorHot |
| `chrome` (nav, footer, marquee) | underlineDraw, marquee, cursorHot |

Enforced at runtime by `useMotionBudget(surface, effect)` — see `src/lib/motion/budget.ts`. In dev it throws; in prod it no-ops the effect.

---

## 5. The performance rule that matters most

Pointer and scroll fire at 60–120Hz. Routing those through `useState` or a subscribing `useStore` selector re-renders the tree every frame and destroys INP.

**Wrong:**
```tsx
const pointer = useMotionStore(s => s.pointer);   // re-renders on every mousemove
return <div style={{ left: pointer.x }} />;
```

**Right — write to CSS custom properties from one rAF loop:**
```tsx
useEffect(() => useMotionStore.subscribe(
  s => s.heat,
  h => root.style.setProperty('--heat', String(h))
), []);
```

**Right — read inside `useFrame`, never subscribe:**
```tsx
useFrame(() => {
  mat.uniforms.uHeat.value = useMotionStore.getState().heat;
});
```

React may only subscribe to **discrete** state: `qualityTier`, `reducedMotion`, `idleLevel`, `cursorVariant`, `webglEnabled`. Anything continuous stays out of the render path.

---

## 6. Working agreement

- **Show real arithmetic.** When a decision depends on numbers (contrast ratios, bundle sizes, frame budgets, pricing), print the worked calculation. Never a summary. (Standing rule, carried from prior projects.)
- **One phase per session.** Finish it, update `BUILD_PROGRESS.md`, commit, stop.
- **Verify visually.** Use Playwright MCP to screenshot at 390px, 768px and 1440px before declaring a phase done.
- **Log open questions** as `OQ-n` in `BUILD_PROGRESS.md` rather than guessing at content, pricing or legal facts.
- **Never invent client metrics, testimonials or logos.** Absent proof, the section does not render. An empty testimonial section is honest; a fabricated one is fraud.

---

## 7. File map

```
src/
  app/
    layout.tsx              MotionProvider + fonts + grain
    page.tsx                homepage section composition
  styles/
    tokens.css              @theme, all design tokens, @property --heat
  lib/motion/
    store.ts                Zustand — the motion store
    heat.ts                 the rAF loop: derives heat, writes CSS vars
    idle.ts                 idle escalation timers
    quality.ts              device tiering + WebGL probe
    budget.ts               per-surface effect enforcement
    scroll.ts               Lenis ↔ GSAP ticker marriage
  components/motion/
    MotionProvider.tsx      mounts loop, idle, scroll, quality
    Cursor.tsx              blend-mode cursor, desktop only
    Reveal.tsx              single IntersectionObserver, fire-once
    Magnetic.tsx            cursor attraction wrapper
    Spotlight.tsx           per-card local --cx/--cy
    IgniteText.tsx          word-split scroll ignition
    FloatWords.tsx          phase-staggered headline drift
    Marquee.tsx             instrument strip
  components/canvas/
    ForgeHero.tsx           R3F ember orb (dynamic, ssr:false)
    forge.glsl.ts           vertex + fragment source
scripts/
  check-contrast.mjs        gate: every token pair vs WCAG + APCA
docs/
  DESIGN_SPEC.md            locked visual system
  MOTION_SPEC.md            effect catalogue + per-section spec
  BUILD_PLAN.md             phases
BUILD_PROGRESS.md           DD log + OQ log — append only
```

---

## 8. Definition of done (per phase)

- [ ] `npm run build` clean, no TS errors
- [ ] `npm run check:contrast` passes
- [ ] Screenshots at 390 / 768 / 1440 reviewed
- [ ] Keyboard-only pass: every hover affordance reachable, focus ring visible
- [ ] `prefers-reduced-motion: reduce` pass: content readable, no drift
- [ ] Lighthouse mobile: LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms
- [ ] `BUILD_PROGRESS.md` updated with DDs and OQs
