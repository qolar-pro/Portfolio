# Phase 0 — Foundation

## Goal

Stand up the NovaFaber project: a Next.js 15 App Router codebase with the
full route tree from `SPEC.md` §5 scaffolded as empty, building pages. No
content, no design, no 3D — just a structure that compiles and routes.

**Status: BLOCKED on OQ-6** (repo strategy). Do not start until the Director
has ruled and logged it as a Decision.

## Read first

- `SPEC.md` §5 (page architecture), §7 (technical constraints)
- `PROGRESS.md` — Director Decisions, especially the OQ-6 ruling
- `_current/package.json`, `_current/next.config.ts`, `_current/tsconfig.json`
  — the stack being carried forward

## Scope

**In:**
- Project init: Next.js 15, TypeScript, Tailwind 4, matching `_current/`'s
  dependency versions for the carried-over stack.
- Every route in `SPEC.md` §5 scaffolded as a page that renders its own name
  and builds cleanly.
- Locale routing structure for `en` / `el` / `mk` with `hreflang` wiring
  (structure only — no translated content).
- Fonts ported from `_current/app/fonts/` via `next/font/local`
  (`ClashDisplay-Variable`, `GeneralSans-Variable`, `JetBrainsMono`).
- `package.json` named `novafaber`.
- Git repo initialized, first commit.

**Deliberately out of scope — do not build these here:**
- Any visual design, colour, or type scale — that is Phase 1.
- Any real content — that is Phase 2.
- Any 3D / WebGL / GSAP / Lenis — that is Phase 7.
- SEO metadata and JSON-LD beyond a placeholder — that is Phase 9.

## Tasks

1. Per the OQ-6 ruling, either init a fresh repo or branch `_current/`.
2. Install the carried-over stack. Do not add dependencies not in
   `_current/package.json` without escalating.
3. Scaffold all routes from `SPEC.md` §5, including the `/el/*` and `/mk/*`
   trees. Each page renders a heading with its own route name.
4. Port the three local font files and register them in the root layout.
5. Set `SITE_URL` to `https://novafaber.com` in one exported constant — every
   later consumer reads from it. Do not repeat the literal anywhere else.
6. Confirm `npm run build` and `npm run lint` both pass.
7. Commit; update `PROGRESS.md`.

## Definition of Done

- [ ] Every route in `SPEC.md` §5 exists and renders without error
- [ ] `/el/*` and `/mk/*` trees route correctly; `hreflang` tags present
- [ ] Three fonts load locally — zero external font requests in the network tab
- [ ] `SITE_URL` defined once; no hardcoded `blancographics.xyz` anywhere
- [ ] `package.json` name is `novafaber`
- [ ] `npm run build` passes
- [ ] `npm run lint` (typecheck) passes
- [ ] Committed
- [ ] `PROGRESS.md` updated (report section + any Open Questions)

## Escalate, don't guess

If you hit an ambiguity — a missing route, a dependency question, a conflict
between `SPEC.md` and what `_current/` actually does, or this phase's scope
looking wrong once you're in the code — add it to `PROGRESS.md` under Open
Questions instead of deciding it yourself.
