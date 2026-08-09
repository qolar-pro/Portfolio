# NovaFaber — novafaber.com

Website design and build studio. Greece, North Macedonia, and English-speaking
markets.

This repository previously held **Apex Solutions / blancographics.xyz**, a
single-page cinematic portfolio. That site is not deleted — it remains in this
repository's git history, before the NovaFaber rebuild's first commit.

## Why the rebuild

Two problems, documented in full in `SPEC.md` §2:

1. **Strategic.** The old site answered "who is this person?" It had no
   pricing, process, testimonials, or booking — nothing that let a visitor buy.
2. **Experiential.** Too dense to navigate and hard to read. Diagnosed causes
   are listed with file and line references in `SPEC.md`; the short version is
   layer count, not spacing.

## How this project is run

| File | Purpose |
|---|---|
| `SPEC.md` | Source of truth. Every decision traces to a section here. |
| `ORCHESTRATION.md` | How phases are run, gated, and verified. |
| `PROGRESS.md` | Live status, phase reports, and the numbered decision log. |
| `phases/` | One scoped file per phase, each with a Definition of Done. |

Read `PROGRESS.md` first in any new session — it carries the decision log
(DD-1 …), so settled questions are not re-litigated.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4.

3D is procedural — geometry and shaders authored in code, not GLB assets
(DD-3). Locales are EN / EL / MK, all URL-prefixed and all first-class (DD-2).

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint    # typecheck
```

## Reference

The old site is cloned locally to `_current/` for content and prior art. That
directory is gitignored and is never part of this repository.
