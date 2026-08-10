# Phase 2 — Content model & EN copy

## Goal

Move the site's content out of the old single-page shape and into a model that
fits the route tree, then write the English copy in a builder's voice rather
than a portfolio's.

Split into two parts so neither is an oversized slice.

- **2A** — the model, plus every entity whose *facts* port over (services,
  process, case studies, stack). Voice rewritten for those entities.
- **2B** — narrative copy: homepage, service page bodies, nav/footer/CTA
  microcopy.

## Read first

- `SPEC.md` §5 (routes), §6 (process vocabulary), §7 (positioning), §8 (content
  decisions)
- `PROGRESS.md` — DD-1 (no price list), DD-2 (copy written per market),
  DD-4 (founder-forward), DD-5 (three testimonials), DD-9 (no CV timeline)
- `_current/lib/i18n.ts` — the source content, read-only

## Scope

**In (2A):**
- `lib/content/types.ts` — the content model
- `lib/content/en.ts` — English entities: services, process, case studies,
  capabilities, founder
- `lib/content/index.ts` — locale registry and coverage reporting
- Route metadata (title + description) sourced from content rather than the
  placeholder strings Phase 0 shipped

**In (2B):**
- Homepage narrative, service page bodies, microcopy

**Out:**
- Page layout and components — Phase 3
- EL and MK copy — Phase 8
- Pricing figures — DD-1 forbids a published price list; `/pricing` explains
  *how* pricing works
- Testimonial text — owner has three, text not yet supplied. Model carries
  them; content is `null` until delivered.

## The repositioning this phase encodes

The old services list is: Full-Stack Platforms, Commerce Systems, Internal
Tooling, Data & Security, Experience Systems.

**None of them is "we build you a website."** That is not an oversight in the
old copy — it is an accurate description of a portfolio for a software
engineer. It is also why the site could not sell to the market NovaFaber is
entering, where the highest-volume search is exactly that.

So the mapping is not one-to-one:

| New route | Sourced from |
|---|---|
| `/services/websites` | **New.** The offering that did not exist. |
| `/services/ecommerce` | Commerce Systems |
| `/services/redesign` | **New.** Warmest lead type. |
| `/services/custom` | Full-Stack Platforms + Internal Tooling + Data & Security + Experience Systems, consolidated |

## Tasks

1. Write `types.ts`. Locale-keyed, with translation status explicit — a
   locale must not silently inherit English (DD-10).
2. Port and rewrite service entities per the mapping above.
3. Encode the four process steps with their Greek names and the nine stages
   each covers (SPEC §6).
4. Port case studies: A25 (flagship), Dresscode. Apex Shift is recast — the
   dead brand comes out of the name. Surviving of Souls moves to `/lab` (DD-4).
5. Founder entity for `/studio` (DD-4).
6. Testimonial type with three `null` slots.
7. Wire route metadata from content.
8. Coverage script: report which locales are incomplete, so EL/MK cannot
   quietly ship as English.

## Definition of Done

- [ ] Content model typechecks and is locale-keyed
- [ ] Services, process, case studies, founder all present in EN
- [ ] No price figures published anywhere in content (DD-1)
- [ ] No CV/job-history content anywhere (DD-9)
- [ ] Route titles and descriptions come from content, all distinct
- [ ] Coverage script reports EL and MK as incomplete rather than passing
- [ ] `npm run build` passes
- [ ] `npm run lint` passes (typecheck + contrast guard)
- [ ] Committed
- [ ] `PROGRESS.md` updated

## Escalate, don't guess

Never invent a business fact — a price, a metric, a client claim, a
testimonial. If copy needs one and `SPEC.md` does not have it, it goes to Open
Questions.

Specifically escalate: the replacement name for "Apex Shift", and any claim
about A25 or Dresscode not already in `_current/lib/i18n.ts`.
