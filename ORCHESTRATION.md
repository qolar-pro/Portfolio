# Orchestration Guide — NovaFaber Director

## Agent routing

- **Director (main thread):** never writes bulk code. Reads `PROGRESS.md`,
  confirms the previous phase is green, decides the next phase, launches the
  matching subagent, reviews its report, resolves flagged questions against
  `SPEC.md`, approves or sends back. Owns every escalated architectural,
  design, or pricing decision.
- **Implementer agents:** phase implementation work. One per phase file.
- **Find-only agents:** legibility sweeps, performance audits, a11y audits,
  content-voice audits. These **never edit** — they report into `PROGRESS.md`
  for the Director to triage.
- **Fix-with-proof agents:** resolve triaged findings. Every fix must name
  what was broken, the fix, and the specific check that would fail if the fix
  were reverted.

## Run pattern (per phase)

1. Director reads `PROGRESS.md` → confirms the previous phase is green
   (`npm run build` passes, `npm run lint` passes, committed).
2. Director launches the matching agent with a prompt naming the exact phase
   file, `SPEC.md` as the rules file, and `PROGRESS.md` as the report target.
3. Agent works, commits, updates `PROGRESS.md`.
4. Director **independently verifies** — re-runs build and typecheck itself,
   opens the diff, walks the Definition of Done line by line. A subagent's
   "done, build passes" is a claim, not a fact.
5. Any Open Questions the agent flagged → Director resolves from `SPEC.md` or
   by asking the owner, logs the ruling as a numbered Decision (DD-N), then
   amends the phase file and re-runs, or proceeds.
6. Repeat.

## Project-specific verification

Because two of this project's core constraints are **visual** and **numeric**,
step 4 has extra teeth here — a passing build proves nothing about either.

- **Legibility constraints (`SPEC.md` §3)** are not verifiable from a build.
  The Director checks them directly: measured contrast ratios, computed
  measure in characters, rendered font sizes. "Looks fine" is not a check.
- **Performance budget (`SPEC.md` §7)** is verified by running the numbers —
  actual GLB byte counts after compression, actual LCP — not by reading the
  agent's summary. Show the arithmetic in the phase report.
- **Mutation-test the guards.** For any constraint that must not silently
  erode (measure cap, contrast floor, GLB budget, no-WebGL-on-pricing-pages),
  deliberately break it once and confirm the check fails loudly. A check that
  passes when the guarded behaviour is violated is decorative, not a guard.

## Phase order & gating

Strictly sequential unless noted. A phase may not start until the previous
phase's Definition of Done is fully checked **and** the Director has
independently confirmed it.

```
0  Foundation            → gated on DD for repo strategy (Open Q6)
1  Design system         → the S2 fix; everything visual depends on it
2  Content model (A: EN structure, B: EN voice rewrite)
3  Core pages            → home shell + 4 service pages
4  Pricing + configurator → gated on DD for pricing model (Open Q1)
5  Case studies          → A25, Dresscode
6  Process / Studio / Contact
7  WebGL concentration   → forge hero + perf budget enforcement
8  Localization          → EL, MK
9  SEO / schema / migration
10 Sweeps (find-only)    → legibility, perf, a11y
11 Launch
```

Phases 2, 3, and 8 are large — split into Part A/B/C files rather than
handing one agent a multi-hour run. Phase 10 is find-only and may run
concurrently with 11 prep, but its findings gate launch.

## Escalation rules (agent → Director)

Agents escalate into `PROGRESS.md` → Open Questions instead of deciding when:

- `SPEC.md` is silent or ambiguous on something they need
- A concrete number, price, or threshold is needed that isn't in `SPEC.md` §4
- A binding design constraint (§3) conflicts with something practical they hit
- Their phase's scope looks wrong once they're in the code
- Copy is needed that states a business fact — a price, a guarantee, a client
  claim, a metric. **Agents never invent these.** No fabricated testimonials,
  client names, or statistics, ever.

## Session hygiene

- One phase per session where possible. Extend the session for an oversized
  phase rather than cramming the next one in.
- Keep subagent slices to ~30–40 minutes of work. An agent that dies at
  minute 50 loses more than one that dies at minute 30.
- Director keeps the numbered Decision log at the bottom of `PROGRESS.md`
  current after every ruling, so the next session inherits full context from
  one file.
- `_current/` is a read-only reference clone of the old site. Agents read it
  for content and prior art; nothing writes to it.
