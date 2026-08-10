# Phase 3 — Core pages

## Goal

Build the homepage and the four service pages from Phase 2 content using the
Phase 1 system. This is where the site stops being a scaffold.

## Read first

- `SPEC.md` §5 (homepage section order), §3 (binding design constraints)
- `PROGRESS.md` — DD-1 (no price list), DD-4 (founder-forward), DD-5 (design
  the testimonial block for three), DD-14 (motion budget), DD-16 (services)
- `lib/content/en.ts` — the copy being rendered

## Scope

**In:**
- Homepage in the SPEC §5 order, minus the parts later phases own
- Four service pages sharing one template
- Header and footer labels sourced from content chrome
- A bento services grid with deliberately unequal weight
- Testimonial block that renders its empty state honestly

**Out:**
- WebGL, camera choreography, the forge hero — Phase 7. The hero ships as
  typography until then, and must stand up on its own.
- The configurator — Phase 4
- Case study pages — Phase 5
- `/process`, `/studio`, `/contact` pages — Phase 6
- EL/MK copy — Phase 8

## Constraints that apply directly here

- `ReadingSurface` for anything with prose. No exceptions on service pages.
- Density budget: ~7 blocks per page (SPEC §3.3). The homepage list in SPEC §5
  has ten items; some must combine or the homepage breaches its own budget on
  the day it is built.
- Motion: `reading` surfaces allow `cursor` and `reveal` only (DD-14).
- No price figures anywhere (DD-1).

## Tasks

1. Shared primitives: section heading, eyebrow label, CTA button, stat.
2. Homepage hero — typographic, carrying headline, subhead, dual CTA.
3. Proof strip from `home.proof`.
4. Services bento. Unequal weight: `websites` is the highest-volume service
   and takes more room than the other three.
5. Flagship case study teaser, reading A25 from content by its `flagship` flag.
6. Process strip — four steps, names plus deliverables.
7. Testimonial block with an honest empty state.
8. Closing CTA.
9. Service page template + the four routes.
10. Wire header/footer labels to content.

## Definition of Done

- [ ] Homepage renders all sections from content, no hardcoded copy
- [ ] Four service pages render from the `Service` entity
- [ ] Homepage block count within the density budget, counted in the report
- [ ] Every prose surface uses `ReadingSurface`
- [ ] No price figures rendered anywhere
- [ ] Testimonial empty state is honest — no placeholder quotes
- [ ] Nav and footer labels come from content
- [ ] Keyboard reachable, visible focus, headings in order
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Committed, `PROGRESS.md` updated

## Escalate, don't guess

The hero has no 3D until Phase 7. If it cannot carry the page on typography
alone, that is worth saying rather than compensating with decoration that
breaches the motion budget.
