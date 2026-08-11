# MOTION_SPEC.md — NovaFaber

## 1. The heat law

```
heat(t) = ease( clamp( idleBase(idleLevel) + scrollEnergy(velocity), 0, 1 ) )

idleBase:   level 0 → 0.25    active
            level 1 → 0.35    drowsy   (after 6s)
            level 2 → 0.55    attract  (after 16s)

scrollEnergy: min(|Δy| / Δt * 0.5, 0.5)

ease: exponential smoothing, heat += (target - heat) * 0.05  (per frame)
```

`heat` is written to `--heat` on `:root` once per frame. The eased pointer position is
written as `--mx` / `--my` (percentages). Nothing else may write these variables.

**Why one scalar:** every ember effect then agrees with every other automatically. The
bloom, the grid mask, the headline glow and the shader emission all rise and fall together,
so the page reads as one material heating up rather than six unrelated animations.

## 2. Effect catalogue

| id | What it does | Implementation | Surfaces | Cost |
|---|---|---|---|---|
| `emberBloom` | radial ember light at eased cursor, alpha × heat | CSS `radial-gradient` on `.forge::before` | spectacle | free (paint) |
| `gridMask` | 72px engraved grid masked to the bloom | `mask-image` on `.forge::after` | spectacle | free |
| `grain` | fixed filmic noise tile, overlay 5.5% | inline SVG `feTurbulence` | global | free |
| `floatWord` | headline words drift on staggered phase | CSS keyframes, per-word delay | spectacle | free |
| `forgedGlow` | white-hot word, text-shadow spread × heat | CSS, reads `--heat` | spectacle (1 per section) | free |
| `velocitySkew` | up to 3.2° skewY from scroll velocity | GSAP `quickSetter` + ScrollTrigger | spectacle | low |
| `magnetic` | element translates toward cursor within radius | pointer listener → `transform` | spectacle, chrome | low |
| `spotlight` | per-card local `--cx/--cy`, dot texture masked to it | pointer listener → CSS vars | reading (cards) | free |
| `reveal` | fire-once fade-up on entry | one shared IntersectionObserver | all | free |
| `ignite` | words fade 0.22 → 1 on entry, key word goes ember | word split + `.lit` class | reading | free |
| `underlineDraw` | nav underline grows from 0 with ember glow | CSS width transition | chrome | free |
| `marquee` | continuous instrument strip, pauses on hover | CSS keyframes `translateX(-50%)` | chrome | free |
| `cursorHot` | blend-mode cursor dilates over interactives | `mix-blend-mode: screen` | global desktop | low |
| `shader` | R3F ember orb, emission driven by heat uniform | GLSL, `useFrame` + `getState()` | spectacle (hero only) | high |

## 3. Per-surface budget

Declared as a class on the section wrapper. `useMotionBudget()` enforces it.

```
spectacle → emberBloom gridMask velocitySkew magnetic cursorHot floatWord forgedGlow reveal shader
reading   → reveal ignite spotlight cursorHot
chrome    → underlineDraw marquee cursorHot magnetic
```

Adding to a list requires removing from it. Log the trade in a DD.

## 4. Section assignments

### Hero — `spectacle`
- Ground `--bg-base`, ember bloom trailing cursor, grid masked to bloom.
- H1 word-split with `floatWord` (7s cycle, 0.5s stagger); "from scratch," gets
  `forgedGlow`; "a theme." gets flat `--ember`.
- Two magnetic CTAs, split by intent.
- Proof strip: three numerals in `--ember`, hairline rule above.
- **Optional R3F:** `ForgeHero` — icosahedron, simplex-noise vertex displacement scaled by
  `uHeat`, fresnel rim, ember→iron gradient, additive bloom. Mounts via
  `next/dynamic({ ssr:false })` **after** first paint. Text is LCP.
- Reduced motion: no drift, no bloom animation; static bloom at heat 0.3, glow fixed.
- Static tier: no canvas at all, gradient ground only.

### Services bento — `reading`
- Ground `--surface-1`, cards `--surface-2`.
- Four cards, unequal weight (2×2, 2×1, 1×1, 1×1).
- Hover: border → `rgba(ember,0.45)`, `translateY(-5px)`, spotlight + dot texture masked
  to cursor at 16% opacity.
- Each card carries a `notFor` line in `--ember-dull` — the cheapest trust signal
  available while testimonials are absent.
- Heading uses `ignite`.

### Flagship case study — `spectacle`
- Split: framed preview left, narrative right.
- Frame: diagonal hatch texture, `--rule-strong` border, "Live in production" badge.
- Narrative heading uses `ignite` with the key phrase in ember.
- Problem-led, not metric-led, until the client supplies numbers in writing.
- Never fabricate percentages.

### Process — `reading`
- Four steps: Forge · Cast · Temper · Finish.
- Top hairline per step turns ember on hover.
- `reveal` staggered 80ms.

### Testimonials — `reading`
- **Renders nothing until ≥2 real named quotes exist.** No placeholders, no "— Client, CEO".
- When populated: three cards, `reveal`, marquee optional.

### Instrument strip — `chrome`
- Marquee, duplicated track, `translateX(-50%)`, 34s linear, pause on hover.
- Names go ember on individual hover.

### Closing CTA — `spectacle`
- Centred, oversized display type, "forge" as the white-hot word.
- Two magnetic CTAs: quote configurator + booking.

### Footer — `chrome`
- Four columns, links go ember on hover.
- Ownership promise as the last line.
- Greek legal entity + ΑΦΜ/ΓΕΜΗ once trading formally. Never imply an MK office.

## 5. Easing and duration tokens

```css
--duration-fast: 180ms;   /* state changes: colour, border */
--duration-mid:  420ms;   /* transforms, spotlights, underlines */
--duration-slow: 900ms;   /* reveals, bloom settles */

--ease-out:  cubic-bezier(0.16, 1, 0.3, 1);      /* default for entrances */
--ease-soft: cubic-bezier(0.4, 0, 0.2, 1);       /* ambient loops */
--ease-in:   cubic-bezier(0.7, 0, 0.84, 0);      /* exits only */
```

Never `ease-in-out` by default — it makes everything feel like the same generic transition.
Entrances decelerate (`--ease-out`); ambient loops are symmetric (`--ease-soft`).

Entrance animations ≤ 700ms. Anything longer delays content and reads as a loading bug.

## 6. Reduced motion

Not a blanket kill. Preserve the information, remove the vestibular load:

| Effect | Reduced-motion behaviour |
|---|---|
| `emberBloom` | static at heat 0.30, does not follow cursor |
| `gridMask` | static centred mask |
| `floatWord` | no drift, words in final position |
| `forgedGlow` | fixed spread, no breathing |
| `velocitySkew` | disabled |
| `magnetic` | disabled; hover colour change retained |
| `spotlight` | disabled; border colour change retained |
| `reveal` | content visible immediately, no translate |
| `ignite` | all words at full opacity, key word still ember |
| `marquee` | paused, first items visible |
| `cursorHot` | native cursor restored |
| `shader` | canvas not mounted |

## 7. Accessibility gates

- Every hover affordance has a `:focus-visible` equivalent. Focus ring: `2px solid var(--ember)`, `outline-offset: 3px`.
- Custom cursor only where `(hover: hover) and (pointer: fine)`; native cursor on touch.
- Parallax offsets capped at ±5%.
- No loop faster than 2s or with >0.4 alpha swing (vestibular safety).
- Animated regions that convey state get `aria-live="polite"`; decorative motion gets `aria-hidden`.
- WCAG 2.2 SC 2.3.3: any motion from interaction must be disableable — covered by the table above.

## 8. Performance gates

- `next/dynamic({ ssr:false })` for anything touching `three` — it's ~150KB gzipped and must never be in the critical path.
- Only `transform` / `opacity` animate. `will-change` applied on hover-in and removed on hover-out, never left permanently.
- One rAF loop for the whole page. One IntersectionObserver, shared.
- `content-visibility: auto` on below-fold sections.
- Pointer/scroll → CSS custom properties, never React state (see CLAUDE.md §5).
- Targets: LCP ≤ 2.0s, CLS ≤ 0.05, INP ≤ 200ms on mid-tier mobile / 4G.

## 9. Anti-patterns

| Don't | Why | Instead |
|---|---|---|
| Glow on everything | destroys hierarchy, eye fatigue | ≤3 glowing elements per viewport |
| Flat grid across whole page | the generic dark-site look | mask the grid to the bloom |
| Entrance animations > 1s | delays content, reads as a bug | ≤700ms, ≤120ms stagger |
| Scroll-jacking | removes user control | smooth scroll only, never displace |
| White text on ember | 2.61:1, unreadable | `#0B0B0C` labels |
| Texture over paragraphs | illegible, cheap | texture at z-index -1 only |
| Pure `#000` ground | nothing for light to fall on | `#0B0B0C` |
| `ease-in-out` everywhere | generic, mushy | `--ease-out` for entrances |
| Subscribing React to pointer | 60 re-renders/sec, INP death | CSS custom properties |
| Six libraries for six effects | bundle bloat, style mismatch | CSS first, GSAP where needed, R3F once |
