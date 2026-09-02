# Build progress — Capabilities (Ledger) + Process (Sticky Stack)

Living state file. Read this first in any new session.

## What is being built

Two homepage sections, chosen off a temporary picking board that rendered
five candidate layouts per section against the real copy. The board has since
been deleted — its job was to make the choice, and a picking board left in a
repo becomes a second, stale copy of the section it was picking.

| Section | Chosen variant | New component | New stylesheet |
|---|---|---|---|
| Capabilities | **A — Ledger** | `components/CapabilityLedger.tsx` | `app/css/ledger.css` |
| How it runs | **B — Sticky stack** | `components/ProcessStack.tsx` | `app/css/stack.css` |

Both must be **scroll-linked**, not one-shot: motion runs forward on the way
down and backward on the way up, so the page keeps responding while someone
navigates it. Foundation is `lib/scrollMotion.ts`.

## Phase status

| Phase | Owner | Scope | Status |
|---|---|---|---|
| 0 | Director | Research, `lib/scrollMotion.ts`, CSS wiring, briefs | **DONE** |
| 1A | subagent | Build `CapabilityLedger` + `ledger.css` | **DONE** |
| 1B | subagent → Director | Build `ProcessStack` + `stack.css` | **DONE** (see note) |
| 2A | Director | Review of 1A | **DONE** |
| 2B | Director | Review of 1B | **DONE** |
| 3 | Director | Integrate, full QA, push | **DONE** |

**Note on delegation.** Both phase-1 subagents were killed mid-run by an
account-level rate limit (session cap). 1A had finished its component and
stylesheet and was starting visual verification; 1B had written nothing.
The Director completed 1B directly and took over both review phases. The
find/fix separation was therefore weaker than the pattern wants — the
reviewer of `ProcessStack` was also its author. That is called out here
rather than papered over, and it is why the stack got the heaviest
empirical verification (see DD-6 and DD-7).

1A and 1B are genuinely independent — different components, different
stylesheets, no shared file — so they run in parallel. 2A/2B gate on their
respective build.

## Open questions

_None outstanding._

## Follow-ups worth doing, not blocking

- `refreshOnFontsReady` fixes stale trigger positions after the webfont
  swap. Worth watching whether the App Router route-change refresh in
  `MotionProvider` is enough on slow connections, where the font can land
  after that too.

---

## Decision log

Cite these by ID. Do not re-litigate.

### DD-1 — Scroll-linked motion uses GSAP ScrollTrigger, not CSS `animation-timeline`

CSS scroll-driven animations express this natively and cost no JS, but MDN
confirms `animation-timeline` is **not Baseline** in 2026: Firefox ships it
behind `layout.css.scroll-driven-animations.enabled` in stable. Global
support ~84%.

Building the signature motion of two sections on a feature that silently does
nothing in a major browser is not an acceptable trade, and shipping both
paths doubles the surface for no gain. ScrollTrigger is already a dependency,
runs one shared scroll listener for all triggers, and works everywhere.

**Constrains future work:** do not "modernise" these to `animation-timeline`
until Firefox ships it unflagged. Revisit then — the CSS version would move
these off the main thread.

### DD-2 — Resting CSS is the finished state; motion animates *away* from it

No section may author a from-state in CSS that JavaScript is then responsible
for undoing. Reduced motion, a JS error, or a failed hydration must all leave
the section fully readable.

This is not theoretical: the previous reveal system wrote `opacity: 0` on
mount and relied on a trigger to put it back, and when the trigger did not
fire the homepage published "0 shipped platforms" and "0% written, not
templated" — false claims about the studio, rendered confidently. Under
`prefers-reduced-motion`, `useScrubbed` registers nothing at all, which is
only safe because of this rule.

### DD-3 — Both sections keep the existing surface-texture system

Backgrounds use the established tokens (`--tex-topo`, `--tex-grain`,
`--tex-contours`) with `mix-blend-mode: var(--tex-blend)` and an opacity
derived from `--tex-strength`, masked so the texture is strongest where there
is no copy. A texture layer with no opacity set renders at full strength
directly over the text — that shipped once already on the pillar cards.

### DD-4 — Section stylesheets are separate files, imported after `globals.css`

`app/css/ledger.css` and `app/css/stack.css`, imported in
`app/[lang]/layout.tsx` after `globals.css`. Two reasons: parallel agents
cannot conflict in one 3,900-line file, and import order gives these rules
the cascade position they need to override base component styles without
`!important`.

CSS `@import` inside `globals.css` was rejected — `@import` must precede all
other rules, which would place section styles *before* the token block.

### DD-5 — Copy is frozen

The three disciplines, their descriptions and all sub-items; the four stages,
their descriptions and their deliverables. Exactly as written in
`lib/content.ts`, in all three locales. Layout and motion are in scope.
Wording is not.

### DD-6 — Recession bottoms out at `brightness(0.82)`, and that is a measured number

A card being covered in the pile scales to `0.94` and dims to
`brightness(0.82)`. The dim is the part that needed checking: every covered
card's header stays visible down the left edge of the pile, so that text is
on screen and has to clear AA — and `filter: brightness()` is invisible to
`getComputedStyle().color`, so the contrast audit cannot see it. It was
computed by hand instead.

`brightness()` scales foreground and background together, but the `+0.05`
in the WCAG ratio means the ratio still moves. Worked through, dark theme:

| what | b=1.00 | b=0.88 | **b=0.82** | b=0.75 |
|---|---|---|---|---|
| heading, `--text-primary` on `--panel-2` | 13.47 | 10.81 | **9.54** | 8.11 |
| body, `--text-secondary` on `--panel-2` | 7.42 | 6.07 | **5.41** | 4.70 |
| deliverable, `--text-secondary` on `--surface` | 8.52 | 6.77 | **5.99** | 5.13 |
| tag, `--accent` on `--surface` | 11.21 | 8.79 | **7.73** | 6.61 |

Light theme at 0.82: body 6.67, heading 11.70.

Worst case is **5.41:1**, against a 4.5 floor. The floor is not reached until
about `0.72`, so 0.82 has real headroom.

**Constrains future work:** do not push the dim past 0.82 to make the pile
read deeper. Deepen the scale instead, or darken `--panel-2` — both of which
the audit can actually see. If this number changes, redo the table.

### DD-7 — Each sticky card carries its own scroll distance

`position: sticky` only holds while the element's own containing box is still
crossing the sticky position. With every `<li>` sized to its card, each one
un-stuck the moment the next arrived: the first build of the pile showed
card 01 and card 04 with nothing in between, because 02 and 03 had already
scrolled away.

Each item is now padded downward by the number of cards still to come —
`calc((var(--stk-n) - 1 - var(--i)) * var(--stk-step))` — so the first item's
box reaches the foot of the pile and stays stuck the whole way.

`--stk-step` is computed in the component (`clamp(170, 32vh, 320)`) and
handed to CSS, because the same number is *also* each card's scrub end
offset. Two copies would drift.

The scrub end is a fixed `+=step`, deliberately, not something proportional
like `bottom 20%`: the items now have unequal heights by design, so a
proportional end would make card 01 recede across the whole remaining
section while card 03 receded across a fraction of it — and a card deeper in
the pile would be *less* receded than one above it. The depth would read
backwards.

### DD-8 — The global reveal system is reversible, and re-arms only off-screen

Site-wide motion was one-shot: reveal on entry, unobserve, done. Scroll back
up and nothing moved, so a visitor navigating the page saw motion exactly
once.

Elements are now kept under observation and re-armed when they leave — but
**only once completely outside the viewport**, tested with
`getBoundingClientRect`, not with the observer's own `isIntersecting`. With a
negative `rootMargin`, an element sitting in the bottom 10% of the screen
also reports "not intersecting"; re-arming that one animates content out from
under someone looking straight at it.

An element rescued by the 2.6s safety timeout is marked `settled` and never
re-armed: if the observer is not firing for that element, re-arming it would
hide content that nothing is going to bring back.

---

## Phase reports

### 1A — CapabilityLedger (subagent)

Delivered the component and stylesheet before being cut off by the rate
limit. Reviewed by the Director rather than accepted on report.

Two scrubbed behaviours, both reversible: differential drift (the index
number travels the full length of the row's pass, the title block about a
fifth of it, and both cross their authored position at the *middle* of the
pass — so the row is typographically correct exactly when it is in the
reading position), and a hairline that draws itself across the first half of
the range and holds.

Its two rejections were the right calls and are worth keeping: progressive
reveal of the sub-item run, and weight/contrast lifting toward the reading
position. Both make *copy* a function of scroll position — park mid-range and
text sits at partial opacity indefinitely, which fails the AA contract and,
under DD-5, quietly edits frozen copy by hiding part of it.

Verified by the Director: `tsc --noEmit` clean, build clean, texture opacity
explicit (DD-3), `min-width: 0` on the grid track and its contents, hover
*and* `:focus-within`, reduced-motion and forced-colors blocks present, no
horizontal overflow at 320/390/768/1440.

### 1B — ProcessStack (Director)

Built directly after the subagent was cut off. Sticky stacking is pure CSS —
no `pin`, no scroll capture, no wheel handler — because two earlier pinned
versions of this section were rejected for exactly that.

Scrubbed: recession only (scale + brightness, per DD-6). The stage rail is
driven by `useScrollProgress`, which deliberately does *not* opt out under
reduced motion, because which stage you are in is information rather than
decoration.

Rejected: fading a covered card's text, and revealing the deliverable within
the card's range. Same defect the Ledger avoided — frozen copy becoming a
function of scroll position.

Verified: pile forms correctly across four scroll positions (all four cards
stick and recede in order), reduced motion degrades to a plain column with no
overlap, short-viewport opt-out at `max-height: 720px`, contrast computed by
hand for the dimmed state.

### 3 — Integration (Director)

`CapabilityLedger` replaces `CapabilityBrowser` on the homepage and
`/services`; `ProcessStack` replaces `ProcessFlow` on the homepage. Both
superseded components deleted. The picking board that produced the choice —
its route, its five-per-section variant components and its ~600 lines of
`mk`-prefixed CSS — was deleted once the decision was made.

Full QA: WCAG AA in both themes on every route; 69/69
behaviour checks; 108 route × language × width shots with zero overflow and
zero console errors.
