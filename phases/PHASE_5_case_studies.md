# Phase 5 — Case studies & Lab

## Goal

Build `/work`, the case study pages, and `/lab`. This is the proof layer —
the pages a prospect reads after the services page convinces them but before
they email.

## Read first

- `SPEC.md` §7 (perf budget), §8 (content decisions)
- `PROGRESS.md` — DD-4 (`/lab` keeps capability proof off the sales path),
  DD-21 (no "Apex" references survive), DD-5 (no invented metrics)

## Scope

**In:**
- `/work` — index of client work
- `/work/a25` — flagship, full body
- `/work/dresscode`, `/work/nova-shift`
- `/lab` — Surviving of Souls, framed as capability rather than a sale
- Image handling: `next/image`, and the `apex-*.jpg` rename DD-21 requires

**Out:**
- The live-preview iframe and before/after scrubber — Tier 1 interactive, but
  they belong with the interactive pass, not the content pass
- Client logos — none supplied

## The honest constraint on this phase

There are **no metrics**. Not "we haven't gathered them yet" — the owner has
no analytics access to A25 or Dresscode, and inventing a conversion figure is
the one thing that would make every other claim on the site suspect.

So case studies here are built on **what was made and why**, not on outcome
numbers. That is a weaker form of proof and the pages have to work harder
because of it: the reasoning has to carry what a statistic normally would.

## Tasks

1. Case study template — tagline, body, facts, stack, images, live link.
2. `/work` index. Client work only; `/lab` is separate by DD-4.
3. `/lab` page for Surviving of Souls.
4. Rename `apex-*.jpg` to `nova-shift-*.jpg`; update content references.
5. `next/image` with explicit dimensions so images cannot cause layout shift.
6. Route registry gains `work/nova-shift`.

## Definition of Done

- [ ] `/work` lists client work, excludes lab entries
- [ ] Each case study renders from the `CaseStudy` entity
- [ ] `/lab` renders Surviving of Souls
- [ ] Zero occurrences of "apex" in filenames or content
- [ ] Images served through `next/image`
- [ ] No invented metric anywhere
- [ ] `npm run build` and `npm run lint` pass
- [ ] Committed, `PROGRESS.md` updated

## Escalate, don't guess

No outcome claims about A25 or Dresscode beyond what `_current/lib/i18n.ts`
already stated. No traffic figures, no conversion rates, no "increased X by Y".
