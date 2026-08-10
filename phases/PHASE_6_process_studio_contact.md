# Phase 6 — Process, Studio, Contact

## Goal

The three remaining content pages. `/contact` closes the loop the configurator
opens, so this is the phase that makes the site able to produce a lead.

## Read first

- `SPEC.md` §4 (routes — note `/contact` is specified as "a booking calendar,
  not a mailto"), §6 (process vocabulary)
- `PROGRESS.md` — DD-4 (founder-forward, photo required), DD-9 (no CV
  timeline), DD-1 (no prices)

## Scope

**In:**
- `/process` — the four steps, each with the industry stages it covers
- `/studio` — the founder, named and shown
- `/contact` — receives the configurator brief and turns it into a message

**Out:**
- The Telegram live chat — interactive pass
- Real booking integration — see the escalation below

## The escalation this phase must not paper over

SPEC §4 says `/contact` is **a booking calendar, not a mailto link**. That
requires two things the studio has not chosen yet: a scheduling tool and a
transactional email service.

Shipping a `mailto:` would quietly do the thing the spec forbids. Shipping
nothing leaves the site unable to produce a lead. Neither is acceptable, so
the page ships with a composed-message fallback that is **explicitly labelled
as interim in the code**, and the tool choice goes to Open Questions.

## Tasks

1. `/process` — four steps, each showing its covered stages and deliverable.
   The nine stages are the credibility layer for the Greek market; the four
   are what a client holds in their head.
2. `/studio` — founder bio, honest about being one person. Photo slot that
   degrades without pretending.
3. `/contact` — read the configurator query params server-side, show the brief
   back, and compose it into a message.
4. No client JS required to read the brief — it arrives in the URL.

## Definition of Done

- [ ] `/process` renders four steps and all nine covered stages
- [ ] `/studio` renders and degrades honestly without a photo
- [ ] `/contact` reads configurator params and displays the brief
- [ ] Brief display works with JavaScript disabled
- [ ] No price figures anywhere
- [ ] Booking-tool choice logged as an Open Question, not silently skipped
- [ ] `npm run build` and `npm run lint` pass
- [ ] Committed, `PROGRESS.md` updated
