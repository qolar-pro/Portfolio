# Phase 4 — Pricing page & quote configurator

## Goal

Build `/pricing` — a page that explains *how* pricing works without publishing
figures — and the configurator, which returns an indicative range for a
specific configuration and hands the studio a scoped brief.

## Read first

- `PROGRESS.md` — **DD-1**, which governs this entire phase
- `SPEC.md` §7 (market anchors — internal calibration only), §3 (design constraints)

## The DD-1 line, precisely

DD-1 forbids "a fixed price or a package tier grid" on any route. It explicitly
permits the configurator to return "an indicative range with an explicit *final
figure comes with your quote*".

The distinction is not cosmetic. A price list is a **static** claim that
invites line-by-line comparison against a template shop's list, which is a
comparison NovaFaber loses on the only axis such a list exposes. A configured
range is a **response to a specific brief** — it cannot be scanned, screenshotted
or compared without the visitor first describing their project, which is the
qualification step that makes the tool worth building.

## Scope

**In:**
- `lib/pricing.ts` — options, coefficients, range and timeline computation
- `components/Configurator.tsx` — client component, live range
- `components/PricingPage.tsx` — what drives cost, what is included, what is not
- Configurator output carries into `/contact` as a scoped brief

**Out:**
- Sending the brief anywhere — Phase 6 owns contact
- Payment, deposits, contracts

## Tasks

1. Pricing model with every coefficient in one place and derived openly from
   SPEC §7 anchors plus the 2–3× positioning ruling.
2. Configurator: project type, scale, locales, CMS, design origin, motion.
3. Output: a range, a timeline, and a plain-language summary of what was
   selected — the summary is the actual deliverable for the studio.
4. `/pricing`: cost drivers, what is included as standard, what is charged
   separately, and why there is no price list.
5. Range presented so it cannot be mistaken for a quote.

## Definition of Done

- [ ] No static price list or tier grid on any route
- [ ] Configurator output always accompanied by the "not a quote" qualifier
- [ ] Every coefficient in one module, commented, tunable in one place
- [ ] Selections carry into `/contact`
- [ ] Keyboard operable; every control labelled
- [ ] `npm run build` and `npm run lint` pass
- [ ] Committed, `PROGRESS.md` updated

## Escalate, don't guess

The base rates are **the studio's actual prices** and are the one thing here
that is a business fact rather than a design decision. They are derived from
SPEC §7 and the positioning ruling, but derived is not confirmed. They must be
surfaced for the owner to approve before launch, in the same way the missing
testimonials are.
