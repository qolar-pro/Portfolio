# NovaFaber — design system & maintenance notes

Everything a future change needs to know before it touches the stylesheet.

---

## The two palettes

There is one component system and two palettes. **No component is declared
twice.** Every colour, shadow, radius, duration and type size in
`app/globals.css` resolves through a token declared in the two blocks at the
top of that file.

| | dark (default) | light |
|---|---|---|
| accent | `--accent-teal` `#2de2c5` | `--accent-teal-on-light` `#0b6e64` |
| lit accent (button gradient top) | `--accent-hi` `#6cf0da` | `--accent-hi` `#0d7268` |
| text on an accent fill | `--accent-contrast` `#04120f` | `#ffffff` |
| base surface | `--surface` `#141416` | `#eceef2` |
| elevated / raised | `#1b1b1f` / `#212126` | `#f3f5f8` / `#f9fafc` |
| primary / secondary / muted text | `#edebe8` / `#b3b0ac` / `#94918d` | `#15171a` / `#474d55` / `#5c626a` |

Two calibrations of one hue, not two accents. The dark value is the electric
one (11.2:1 on the base surface); the light value is deepened because the dark
teal drops to 1.6:1 on an off-white ground and stops being a link.

Older rule names (`--page`, `--panel`, `--ink`, `--orange`, …) are still used
throughout the file and are **aliased** to the semantic tokens. New rules
should use the semantic names.

### Adding a colour

Don't. Add a token, in both blocks, and run `npm run qa:contrast`.

---

## Elevation

One light source for the whole site: **upper left**. `--shadow-light` is the
lit edge, `--shadow-dark` the cast shadow, always in that order.

```
--el-1   resting card, chip, small control
--el-2   nav island, hovered button
--el-3   hovered card
--el-in  pressed, selected, or sunken (inputs, the toggle track)
```

Between themes the shadow **values** swap, not the offsets. Inverting the
geometry instead makes the light appear to come from below, which the eye
reads as a hole rather than a button.

Elevation applies to **interactive surfaces only** — cards, buttons, toggles,
inputs, nav pills. Never body copy, never a page background.

### The state rule, which is not negotiable

Shadow depth is never the only thing that changes on hover, focus, active or
selected. Every interactive element also gains a teal outline, fill, underline
or bar. "The shadow got 4px deeper" is not a state change to anyone who is not
staring at the element, and is nothing at all in forced-colors mode.

---

## How the theme resolves

1. `:root` carries the dark palette, so a browser with JS off — and the first
   paint before hydration — gets the studio's default look.
2. `components/ThemeScript` runs **blocking, inline, in `<head>`**. It reads
   `localStorage['nf-theme']`, falls back to `prefers-color-scheme`, and stamps
   `data-theme` on `<html>` before the first pixel. This is why there is no
   flash of the wrong theme, on any route, in any language.
3. `:root[data-theme='light']` is the only place the light palette is written.
4. With no stored choice the page keeps following the OS live — see the
   `matchMedia` listener in `ThemeToggle`.

`<html suppressHydrationWarning>` in the layout is **required**, not
defensive: the server cannot know the visitor's theme, so the attribute the
script writes will not match what was rendered. The mismatch is the mechanism.

---

## Motion

Everything is driven by **one observer** (`components/motion/MotionScope`) and
**one attribute**. To animate anything, add it:

```html
<h2 data-anim="clip">      masked wipe upward — display type
<p  data-anim="fade">      opacity only — copy
<div data-anim="rise">     lift and fade — the default
<div data-anim="left|right">  slide in from the side
<div data-anim="scale">    settle in from 96%
<div data-anim="blur">     focus pulls in
<div data-anim="reveal">   media uncovers, picture settles back
<span data-anim="pop">     icons and small round things
<ul data-anim-group>       children arrive in sequence
<div data-anim-delay="1..5">  offset, for composing a section's entrance
```

Seven verbs and only seven. A site where every section invents its own
entrance is not alive, it is noisy.

**Two specificity rules you must not break.** The armed from-states are
`.anim-armed[data-anim='clip']` — one attribute selector more specific than a
plain class. The landed rules therefore have to match that weight
(`.anim-armed.anim-in[data-anim]`) and the group landed rule has to come
*after* the group from-state in source order. Get either wrong and every
heading on the site stays clipped, or every staggered list stays at opacity 0,
permanently and silently. This has already happened twice.

- **The visibility guarantee.** Markup renders visible. The hiding class is
  added by JS, only to elements genuinely below the fold. The observer removes
  it, and a 2.6s timeout removes it regardless. No sequence of failures ends
  with content the visitor cannot read.
- **On-load motion** (nav, scroll hint) is a CSS animation on `.nav` itself —
  never on `.island`, because `animation-fill-mode: both` pins an animated
  value that then beats `.nav.stuck .island.right { opacity: 0 }` and the nav
  silently stops collapsing.
- **Scroll progress** is `animation-timeline: scroll()` — no JS, no handler.
  Browsers without it get no bar, which is the correct amount of missing.
- **GSAP + ScrollTrigger** is kept only for the process panel's pin, which
  genuinely needs a scroll-linked timeline.
- **Lenis** smooth-scrolls mouse and trackpad only (`pointer: coarse` opts
  out). A phone already has momentum scrolling people know the feel of.
- `prefers-reduced-motion` is honoured everywhere, and everything — every
  number, every word, every stage marker — is fully present with motion off.

## Two kinds of motion

There are two systems and they are not interchangeable. Pick by asking
whether the thing should keep responding after it has arrived.

**One-shot** — `lib/inview.ts` + `data-anim` + `MotionScope`. An element
arrives, the transition runs, done. Use for anything whose animation is
punctuation: a card appearing, a heading wiping in.

Since DD-8 these are *reversible*: an element that leaves the viewport
entirely is re-armed, so scrolling back replays it. The re-arm only ever
happens fully off-screen — nothing the reader can see animates away from
them.

**Scroll-linked** — `lib/scrollMotion.ts` (`useScrubbed`,
`useScrollProgress`). The tween's playhead is tied to scroll position, so it
runs forward going down and backward coming up and is never "already
played". Use for anything whose state should track where the reader is: the
Ledger's drift, the stack's recession.

`useScrubbed` registers **nothing** under `prefers-reduced-motion`, which is
only safe because of DD-2 — the resting CSS is always the finished state.
Never author a from-state in CSS and rely on JS to undo it.

Why not CSS `animation-timeline` (DD-1): not Baseline in 2026, Firefox has it
behind a flag. ScrollTrigger works everywhere and is already a dependency.

## The three rebuilt sections

**Hero.** No footage. The backdrop is the site's own contour tile used as a
`mask-image` over an accent gradient, so the linework is drawn in teal and
recolours with the theme for free. The tile it masks with is
`contours-alpha.webp` — the same artwork with its luminance baked into the
**alpha channel**, because `mask-image` reads alpha, not brightness: a
white-on-black tile used directly as a mask is opaque everywhere and masks
nothing. Headline is 900 weight.

**Capabilities** (`CapabilityLedger`, `app/css/ledger.css`). Rebuilt three
times; this is the shape that was picked from a set of candidates. Full-width
numbered rows, sub-items running on as one line — a contents page, not
cards. Scroll-linked differential drift, a hairline that draws itself as the
row passes, teal edge on hover and focus.

**Process** (`ProcessStack`, `app/css/stack.css`). Also picked from a set.
Four cards that stick and pile up. Stacking is pure `position: sticky` — the
page keeps the scroll, because two earlier pinned versions were rejected for
taking it away. Scrubbed recession gives the pile depth (DD-6, DD-7).

**Work gallery.** A stage and an index. One project large in browser chrome
carrying its real domain; the rest as a strip that responds to hover, focus,
click and arrow keys. `showcase: false` in the registry keeps a project out of
the gallery while leaving it in the case studies.

---

## Project data

`lib/projects.ts` is the registry: **one object per project**, with `liveUrl`,
images, features and stack. `lib/content.ts` supplies only the translated
title, tagline and description and spreads the registry into them.

Swapping a deploy subdomain for a real domain is one line in one file. It is
what the work tiles link to, what the case studies link to, what the logo wall
links to, and what the browser chrome on each screenshot displays.

`PENDING_VANITY_DOMAINS` lists everything still on a platform subdomain.

## Contact details

`EMAIL` in `lib/content.ts` reads `NEXT_PUBLIC_CONTACT_EMAIL` first. Set that
env var on Vercel to move to the branded inbox without a code change — it
feeds the contact page, book-a-call, the footer, the form's mailto and the
Organization JSON-LD from that one place.

`SOCIALS` carries a `studio` flag. Only `STUDIO_SOCIALS` is rendered and only
those go into `sameAs`. See the comment there for why one entry is flagged
`false`.

---

## QA

```
npm run qa            # contrast + behaviour, the two that gate a release
npm run qa:contrast   # every text element vs its real painted background,
                      # both themes, every route — must print PASS
npm run qa:audit      # reduced motion, focus trap, Escape, theme persistence,
                      # heading outline, alt text, form labels
npm run qa:perf       # transfer + CLS on an emulated mid-range phone
npm run qa:shots      # screenshots; takes a spec.json, see tools/shot.mjs
```

All four drive headless Edge over CDP against a **running server** — start
`npm run build && npm start` first. They live in `tools/`, are excluded from
`tsconfig` and from the deployment, and write to `.qa/`.

`qa:contrast` resolves each element's actual painted background, composites
translucent layers, understands gradient fills and skips gradients that are
not painted. It is the thing that keeps a soft-shadow design honest — that
style quietly invites text one shade too low.

---

## Breakpoints

`560 / 640 / 700 / 900 / 1000 / 1100 px`, plus `430px` for the nav.

The 430px one is set by **Macedonian**, not English: «Закажете разговор» is 17
characters where "Book a call" is 11. Any nav breakpoint has to be chosen
against the longest translation, not the one you happen to be reading.

---

## Open decisions

- **Vanity domains.** Sneaker Air (`dresscode-rho.vercel.app`), Nova Shift and
  Surviving of Souls (`*.netlify.app`) still point at platform subdomains, and
  the browser chrome on each card now displays that. `lib/projects.ts`.
- **Project clips.** The Sneaker Air 3D viewer and the A25 live chat are the
  two most persuasive things in the portfolio and a still cannot show either.
  The `clip` field in the registry is wired and unused; no capture exists in
  the repo and none was invented.
- **Dress Code's stack.** The project at `dresscode-rho.vercel.app` now trades
  as Dress Code, not Sneaker Air, and the 3D viewer is not on the live site —
  so `Three.js` and the viewer claim came out of the copy and the stack. Put
  them back if the viewer is still shipping on a product page.
- **Tsopouroglou's stack** lists only what the deployment's own response
  headers prove (`Next.js`, `Vercel`). Fill in the rest from the build.
- **The hero footage is gone.** `public/video/` held 8.6 MB of spark footage
  that nothing references any more; recover it with
  `git checkout 4a50403 -- public/video` if it is ever wanted back.
- **Testimonials** stay unmounted until the named clients sign off their
  quotes. Component, styles and copy are all still in the repo.
- **KD Law** stays under `embargo` until the firm launches.
