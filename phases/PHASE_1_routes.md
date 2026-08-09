# Phase 1 — Route tree & navigation shell

## Goal

Build every route in SPEC §4 as a stub, plus the persistent navigation that
makes them reachable. This is the phase that directly answers the client's
"it's not easy to navigate it." When done, a visitor can reach any page from
any page, and every page has its own URL and title.

## Read first

- `SPEC.md` §4 (route tree), §3.5 (locales), §3.6 (identity migration)
- `PROGRESS.md` → DD-1 (multi-page, not single page), DD-3 (EN/EL/MK only), DD-4 (`/lab`), DD-5 (`/process` replaces Experience)
- `_current/components/Nav.tsx` — the existing menu, for reference only

## Scope

**In:**
- Every route from SPEC §4 as a stub page with a real `<h1>` and one sentence
  of placeholder prose naming what the page will hold.
- Localized route trees for `el` and `mk` alongside `en`, with `hreflang`
  wired. `mk` gets its own tree now even though its copy lands in Phase 8 —
  DD-3 forbids stub locales in the *type*, not in the routing scaffold.
- A persistent header: wordmark, primary nav, locale switcher, and a single
  prominent CTA.
- A footer: routes, contact, socials placeholder.
- Per-route `metadata` (title + description) so no two pages share a title.
- Active-route state in the nav.

**Out (do not build):**
- Real content — Phase 2
- Real pricing numbers — Phase 4, blocked on OQ-1
- Case study bodies — Phase 5
- Any WebGL, camera choreography, or scroll animation — Phase 7
- The mega-menu / index overlay from `_current/components/Nav.tsx`. A
  persistent header replaces it. Do not port the overlay.

## Tasks

1. Create the route tree from SPEC §4, including `/services/*`, `/work/*`,
   `/pricing`, `/process`, `/studio`, `/lab`, `/contact`.
2. Set up locale routing for `en` / `el` / `mk` with correct `hreflang`
   alternates and a canonical per locale.
3. Build the header. Navigation must be readable at rest — no hover-to-reveal
   for primary destinations, and per SPEC §3.3 **one interaction idea**, not a
   stack of magnetic + cursor + tilt effects.
4. Build the footer.
5. Give every route distinct `metadata`. Titles follow a template with
   NovaFaber as the suffix, not the prefix.
6. Confirm keyboard navigation reaches every link with a visible focus state.

## Definition of Done

- [ ] `npm run build` passes
- [ ] `npm run lint` (typecheck) passes
- [ ] Every route in SPEC §4 resolves and returns a distinct `<title>`
- [ ] `/el/*` and `/mk/*` resolve with correct `hreflang` and canonical tags
- [ ] Header and footer render on every route; active route is indicated
- [ ] Every interactive element is keyboard-reachable with a visible focus state
- [ ] No route relies on scroll position for wayfinding
- [ ] Committed
- [ ] `PROGRESS.md` updated (report section + any Open Questions)

## Escalate, don't guess

If you hit an ambiguity — a missing number, a spec gap, a rule conflict, or
this phase's scope looking wrong once you're in the code — add it to
`PROGRESS.md` under Open Questions instead of deciding it yourself.

Specifically escalate rather than deciding: any route not listed in SPEC §4
that you believe is needed, and the locale URL strategy if prefixing `en`
conflicts with the root route.
