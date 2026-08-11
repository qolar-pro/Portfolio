# DESIGN_SPEC.md — NovaFaber visual system (locked)

The identity is a **forge**: cold iron grounds, ember light, engraved texture, heat as the
only source of colour. NovaFaber = *nova faber*, "the new maker". Every visual decision
should be defensible against that metaphor.

The failure mode to avoid is generic dark-SaaS-with-an-orange-accent. What separates this
from that is stated in §2: ember behaves like **heated material**, not like a brand colour.

---

## 1. Grounds

| Token | Hex | Use |
|---|---|---|
| `--bg-void` | `#08080A` | deepest wells, canvas clear colour, footer base |
| `--bg-base` | `#0B0B0C` | page ground |
| `--surface-1` | `#121214` | reading surfaces (services, process) |
| `--surface-2` | `#17181B` | cards, raised panels |
| `--rule` | `#24262B` | decorative hairlines |
| `--rule-strong` | `#3A3E44` | component boundaries (≥3:1 vs base) |

**Never `#000000`.** Pure black kills the sense of atmosphere the bloom depends on —
there is nothing for light to fall on. `#0B0B0C` reads as black on every display while
still accepting a gradient.

## 2. Ember — the heat scale

Ember is a **temperature ramp**, not a single accent. Cooler = duller = further from the
user's attention. Hotter = whiter = the thing being touched right now.

| Token | Hex | OKLCH (approx) | Role |
|---|---|---|---|
| `--ember-deep` | `#7A3510` | `oklch(0.42 0.12 45)` | ambient underglow, bottom-of-page bloom |
| `--ember-dull` | `#B4531A` | `oklch(0.55 0.15 45)` | pressed states, muted accent, `notFor` labels |
| `--ember` | `#FF7A1A` | `oklch(0.72 0.19 47)` | **primary accent** — CTA, links, rules, numerals |
| `--ember-hot` | `#FF9A45` | `oklch(0.78 0.16 50)` | hover |
| `--ember-white` | `#FFD2A6` | `oklch(0.89 0.08 60)` | white-hot: the single most important word on a page |

**P3 upgrade.** `--ember` at `oklch(0.72 0.19 47)` sits essentially on the sRGB gamut
boundary — it is the brightest clean orange sRGB can express. On P3 displays push chroma
to ~0.24 for real added luminosity:

```css
:root { --ember: #FF7A1A; }
@media (color-gamut: p3) {
  :root { --ember: color(display-p3 1 0.49 0.13); }
}
```

Verify any hex↔OKLCH conversion in https://oklch.com before committing — the values above
are approximations and gamut clipping is silent.

## 3. Type colours

| Token | Hex | Use |
|---|---|---|
| `--text-primary` | `#E6E1DA` | headings, body |
| `--text-secondary` | `#B4AEA5` | supporting copy |
| `--text-muted` | `#9A948C` | mono labels, footer, captions |
| `--text-disabled` | `#5A5E64` | inactive only, never for content |

Warm off-white, not cool grey — cool text against warm ember reads as two unrelated
systems. Pure `#FFFFFF` on near-black causes halation (the glow-bleed that makes dark
mode feel cheap); `#E6E1DA` is the ceiling.

## 4. Contrast — worked arithmetic

WCAG 2.1 relative luminance: `L = 0.2126R + 0.7152G + 0.0722B` on linearised channels;
ratio = `(L_light + 0.05) / (L_dark + 0.05)`.

**`--ember` `#FF7A1A` on `--bg-base` `#0B0B0C`:**

```
#FF7A1A → sRGB(1.000, 0.478, 0.102)
  linear R = 1.0
  linear G = ((0.478+0.055)/1.055)^2.4 = 0.5052^2.4 = 0.1942
  linear B = ((0.102+0.055)/1.055)^2.4 = 0.1488^2.4 = 0.0103
  L = 0.2126(1.0) + 0.7152(0.1942) + 0.0722(0.0103)
    = 0.2126 + 0.13890 + 0.00075 = 0.35225

#0B0B0C → sRGB(0.0431, 0.0431, 0.0471)
  linear R = G = ((0.0431+0.055)/1.055)^2.4 = 0.0930^2.4 = 0.003350
  linear B     = ((0.0471+0.055)/1.055)^2.4 = 0.1015^2.4 = 0.004128
  L = 0.2126(0.003350) + 0.7152(0.003350) + 0.0722(0.004128)
    = 0.000712 + 0.002396 + 0.000298 = 0.003406

ratio = (0.35225 + 0.05) / (0.003406 + 0.05)
      = 0.40225 / 0.053406
      = 7.54 : 1
```

→ **7.54:1.** Passes AA normal text (4.5), AA large (3.0), AAA large (4.5). Fails AAA
normal (7.0)? No — 7.53 > 7.0, so it passes AAA normal too. Ember is safe for body-size
text on ground, though §Usage still restricts it to accents for hierarchy reasons.

**`#0B0B0C` label on `--ember` button:** identical pair inverted → **7.54:1**. Use this.

**`#FFFFFF` on `--ember`:**
```
L_white = 1.0
ratio = (1.0 + 0.05)/(0.35225 + 0.05) = 1.05 / 0.40225 = 2.61 : 1
```
→ **2.61:1. Fails everything.** White on ember is forbidden.

**`--text-primary` `#E6E1DA` on `--bg-base`:**
```
linear R = ((0.9020+0.055)/1.055)^2.4 = 0.9071^2.4 = 0.7912
linear G = ((0.8824+0.055)/1.055)^2.4 = 0.8882^2.4 = 0.7525
linear B = ((0.8549+0.055)/1.055)^2.4 = 0.8626^2.4 = 0.7013
L = 0.2126(0.7912) + 0.7152(0.7525) + 0.0722(0.7013)
  = 0.16821 + 0.53819 + 0.05063 = 0.75703
ratio = 0.80703 / 0.053406 = 15.13 : 1
```
→ **15.13:1.** AAA everywhere.

**`--text-muted` `#9A948C` on `--bg-base`:**
```
linear R = 0.6247^2.4 = 0.3232 ; G = 0.6023^2.4 = 0.2961 ; B = 0.5725^2.4 = 0.2621
L = 0.06871 + 0.21178 + 0.01892 = 0.29941
ratio = 0.34941 / 0.053406 = 6.55 : 1
```
→ **6.55:1.** AA normal, AAA large. Safe for mono labels.

**`--rule-strong` `#3A3E44` on `--bg-base`** (non-text 3:1 requirement):
```
linear R = ((0.2275+0.055)/1.055)^2.4 = 0.2678^2.4 = 0.03955
linear G = 0.2842^2.4 = 0.04566 ; B = 0.3080^2.4 = 0.05612
L = 0.008409 + 0.032656 + 0.004052 = 0.045117
ratio = 0.095117 / 0.053406 = 1.83 : 1
```
→ **1.83:1. Fails the 3:1 non-text requirement.** So `--rule-strong` may be used for
*decorative* boundaries only. Any border that carries meaning (input outline, focus ring,
selected state) must use `--ember` (7.54:1) or a lighter grey. **Fix in code:** focus
rings and input borders use `--ember`, not `--rule-strong`. Logged as DD-2.

**APCA note.** WCAG 2 systematically overstates contrast on dark grounds — 15.11:1 for
body text is not a licence to go brighter. Cross-check with https://apcacontrast.com;
target Lc |75|+ for body, |60|+ for large text, |45|+ for non-text. Where WCAG and APCA
disagree on a dark pair, trust APCA and note it in the DD.

## 5. Typography

| Role | Face | Why |
|---|---|---|
| Display | **Sofia Sans Condensed** 700/900 | Bulgarian-designed: native Cyrillic + full Greek. Condensed absorbs long EL/MK headlines without ugly wraps. |
| Body | **Source Serif 4** 400/600 | A serif at 17px separates the studio from every geometric-sans template shop; carries Greek and Cyrillic. |
| Mono | **JetBrains Mono** 400/600 | eyebrow labels, numerals, prices, stack names. |

Bound only as `--font-display`, `--font-body`, `--font-mono` so a swap is one file.

**Do not substitute** Space Grotesk, Archivo, Satoshi or similar — they lack Greek and/or
Cyrillic and would break `/el` and `/mk` silently.

**Scale.** Body 17px / 1.65. Display `clamp()`-driven:

```
--text-display-1: clamp(3rem, 9.5vw, 8.2rem)   line-height 0.92
--text-display-2: clamp(2.4rem, 5.5vw, 4.4rem) line-height 0.95
--text-display-3: clamp(2rem, 4.5vw, 3.2rem)   line-height 1.0
--text-lead:      1.15rem
--text-body:      1.0625rem  (17px)
--text-small:     0.92rem
--text-mono:      0.72rem    letter-spacing 0.18em, uppercase
```

`--text-mono` is for labels **only**. It was a diagnosed failure of the old Apex site that
body copy ran at 11px with 0.35em tracking — never again.

Reading measure capped at **62ch**. Headlines get `text-wrap: balance`, body gets
`text-wrap: pretty`.

## 6. Space, radius, grid

- 4px base scale: `4 8 12 16 24 32 48 64 96 128`
- Shell: `min(1240px, 92vw)`
- Section rhythm: `padding-block: 11vh`
- Radii: `6px` inputs · `14px` cards · `999px` buttons
- Grid overlay: 72px cells (matches the engraved texture)

## 7. Elevation on dark

Black drop shadows are invisible on near-black. Depth comes from three layers:

```css
--lift-hairline: inset 0 1px 0 rgba(230,225,218,0.06);   /* top edge catches light */
--lift-ambient:  0 8px 30px rgba(0,0,0,0.5);             /* separation */
--lift-ember:    0 0 42px -6px rgba(255,122,26,0.55);    /* interactive only */
```

Never combine `--lift-ember` with more than **three** simultaneous elements in a viewport.

## 8. Texture

Three layers, always in this order, always behind content:

1. **Ember bloom** — `radial-gradient` at the eased cursor position, alpha scaled by `--heat`.
2. **Engraved grid** — 1px ember lines at 72px, **masked to the bloom** so texture only
   appears where the page is hot. This is the signature move; a flat grid across the whole
   page is the generic version.
3. **Filmic grain** — one static `feTurbulence` tile, `opacity: 0.055`,
   `mix-blend-mode: overlay`, `position: fixed`, `pointer-events: none`.

**Recolouring white/transparent third-party textures** — pick by asset type:

| Asset | Technique | Notes |
|---|---|---|
| SVG you control | `fill="currentColor"` + `color: var(--ember)` | best control, zero cost |
| White PNG tile | `mask-image: url(tex.png)` over an ember gradient | texture becomes a stencil; full colour freedom |
| Greyscale tile on dark | `mix-blend-mode: screen`, `opacity < 0.12` | cheapest, least control |
| Dark tile on ember fill | `mix-blend-mode: multiply` | for the rare ember-filled panel |
| Procedural | inline `feTurbulence` / `repeating-linear-gradient` | no network request, scales free |

Avoid `filter: sepia() saturate() hue-rotate()` chains for tinting — they are imprecise,
expensive, and drift across browsers.

**Sources** (check licence at use): Hero Patterns (free), Pattern Monster (free/CC),
Transparent Textures (free), Toptal Subtle Patterns (free), Haikei (free), fffuel (free),
BGJar (free), MagicPattern (freemium).

## 9. Ember usage rules

**Do:** CTA fills, link hover, 1px rules and underlines, numerals and stats, active nav,
focus rings, `::selection`, icon strokes, the single white-hot word per section, bloom and
glow, shader emission.

**Don't:** body text at length, large filled panels, more than one white-hot word per
viewport, glow on text that must be read, ember on ember, backgrounds behind paragraphs.

**Budget:** ember pixels < 10% of any viewport. If a screenshot looks orange, it's wrong.

## 10. Locked decisions

- DD-1 Grounds bottom out at `#08080A`; `#000000` never used.
- DD-2 `--rule-strong` is decorative only (1.83:1); meaningful borders and focus rings use `--ember`.
- DD-3 Button labels on ember are `#0B0B0C`; white-on-ember forbidden (2.61:1).
- DD-4 Type stack is Sofia Sans Condensed / Source Serif 4 / JetBrains Mono, chosen for Latin+Greek+Cyrillic coverage. Substitution requires re-verifying all three scripts.
- DD-5 Engraved grid is masked to the ember bloom, not applied flat.
- DD-6 `--ember` verified at 7.54:1 on `--bg-base` by hand (§4). Prior figure of 4.9:1 from earlier research was miscalculated and is superseded.
