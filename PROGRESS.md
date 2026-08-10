# Build Progress — NovaFaber

> Living state file. Every phase agent updates its section when done.
> Director reviews and independently verifies before gating the next phase.
> Read this file first in any new session.

**Project:** Apex Solutions (`blancographics.xyz`) → NovaFaber (`novafaber.com`)
**Spec:** `SPEC.md` · **Operating manual:** `ORCHESTRATION.md`
**Reference clone (read-only):** `_current/`

---

## Phase Status

| Phase | Status | Commit | Notes |
|-------|--------|--------|-------|
| — Research & audit | DONE | — | Source audit of `_current/`, GR/MK/UK/US market research, positioning, page map, feature ranking. Written up in `SPEC.md`. |
| 0 — Foundation | DONE | `0469e77` | 13 routes × 3 locales prerendered. Pushed to `qolar-pro/Portfolio` main. Fonts deferred to Phase 1 — see report + DD-12. |
| 1 — Design system | DONE | — | Type pairing (DD-13), measured palette, motion budget (DD-14), grade profiles. Contrast guard gates `npm run lint`. |
| 2A — Content model (EN structure) | NOT STARTED | — | — |
| 2B — Content voice rewrite (EN) | NOT STARTED | — | Portfolio voice → builder voice. |
| 3 — Core pages | NOT STARTED | — | Home shell + 4 service pages. |
| 4 — Pricing + configurator | BLOCKED | — | Gated on **OQ-1** (pricing model). |
| 5 — Case studies | NOT STARTED | — | A25 (flagship), Dresscode. |
| 6 — Process / Studio / Contact | NOT STARTED | — | — |
| 7 — WebGL concentration | NOT STARTED | — | Forge hero + perf budget enforcement. |
| 8 — Localization | NOT STARTED | — | EL, MK. |
| 9 — SEO / schema / migration | NOT STARTED | — | — |
| 10 — Sweeps (find-only) | NOT STARTED | — | Legibility, perf, a11y. Findings gate launch. |
| 11 — Launch | NOT STARTED | — | — |

Statuses: NOT STARTED / IN PROGRESS / BLOCKED / DONE

---

## Phase Reports

<!-- Each agent appends a section: what was built, what's stubbed,
     files touched, how the Director can independently verify. -->

### Phase 0 — Foundation (Director, direct)

**What was built**

- Next.js 15 App Router + TypeScript + Tailwind 4. Dependencies pinned to the
  versions `_current` used, so ported logic won't fight the toolchain.
- Full route tree from SPEC §5: 13 routes × 3 locales = **39 pages**, all
  prerendered as static HTML via `generateStaticParams`.
- `lib/routes.ts` — the route registry. Header nav and (later) the sitemap both
  read from it, so a route cannot exist without being reachable.
- `lib/locales.ts`, `lib/metadata.ts` — locale set and generated
  canonical/hreflang. Alternates are derived from `LOCALES`, not hand-written
  per page, because hand-maintained hreflang is how a multilingual tree rots.
- `middleware.ts` — redirects unprefixed paths to a locale. See DD-11.
- `SiteHeader` / `SiteFooter` — persistent, always-visible navigation. Primary
  destinations readable at rest, no overlay to open first (DD-7).
- `lib/site.ts` — identity strings in exactly one place (SPEC §7).
- Skip-to-content link, visible focus ring, `prefers-reduced-motion` block.

**What's stubbed / deliberately incomplete**

- Every page renders `PageStub` — a heading plus a note describing what the
  page will hold. No real content until Phase 2.
- `app/globals.css` is a Phase 0 baseline, not the design system. It commits to
  two things only: families bind through role variables, and every colour is
  declared at `:root` before being redefined per theme.
- `CONTACT_EMAIL` is a placeholder. SPEC §7 requires a novafaber.com address
  before launch; Phase 9 owns it.
- No JSON-LD yet — Phase 9 owns the Organization-first graph.

**Definition of Done**

- [x] Every route in SPEC §5 exists and renders without error
- [x] `/el/*` and `/mk/*` route correctly; hreflang present
- [ ] **Three fonts load locally — NOT DONE.** See below.
- [x] `SITE_URL` defined once; no hardcoded `blancographics.xyz`
- [x] `package.json` name is `novafaber`
- [x] `npm run build` passes
- [x] `npm run lint` (typecheck) passes
- [x] `PROGRESS.md` updated

**The one unmet item, stated plainly:** no webfont ships in Phase 0. The owner
ruled for a new pairing (DD-12) rather than carrying the old faces forward, and
that pairing is Phase 1's to choose. Phase 0 therefore runs on system stacks
bound through `--font-display` / `--font-body` / `--font-mono`, so the swap is
one file.

Note the correction logged under DD-12: this item was initially reported as
blocked because the font files were missing. They were not — all four `.woff2`
files are in the repository. The Phase 0 outcome is unchanged, but the reason
is a ruling, not an obstacle.

**Assets carried forward:** `public/images/` (10 JPEGs, 2.4 MB) was kept rather
than cut. These are the A25, Dresscode, Apex Shift and Surviving of Souls
screenshots — content SPEC §8 marks Keep or Recast, needed by Phase 5 and the
`/lab` page. They ship unoptimised for now; Phase 5 owns compression and
`next/image` treatment against the SPEC §7 budget.

**How to verify**

```bash
npm install
npm run lint          # tsc --noEmit, exits 0
npm run build         # 39 prerendered routes

# canonical + hreflang + lang, per locale
grep -o '<link rel="alternate"[^>]*>' .next/server/app/en/pricing.html
grep -o '<link rel="canonical"[^>]*>' .next/server/app/el/pricing.html
grep -o '<html lang="[^"]*"'          .next/server/app/mk/pricing.html
```

Observed: four alternates (`en`, `el`, `mk`, `x-default`) on the EN page;
`https://novafaber.com/el/pricing` canonical on the EL page; `lang="mk"` on the
MK page.

---

### Phase 1 — Design System (Director, direct)

**What was built**

- **Type pairing** (DD-13): Sofia Sans Condensed / Source Serif 4 / JetBrains
  Mono, all carrying Latin, Greek and Cyrillic. Bound only through
  `--font-display` / `--font-body` / `--font-mono`.
- **Type scale**, 17px base, with `--text-2xs` explicitly reserved for mono
  labels and never prose — the old site's 11px/0.35em body-adjacent text is
  the failure mode it is shaped against.
- **Measured palette**, forge-derived: cold iron grounds, `--ember` accent,
  `--steel` secondary. Split `--rule` (decorative) from `--rule-strong`
  (component boundaries) — see the guard note below.
- **`scripts/check-contrast.mjs`** — parses the shipped stylesheet, computes
  WCAG ratios for 26 pairings across both themes. Wired into `npm run lint`.
- **`lib/motion-budget.ts`** (DD-14) — per-surface effect allowances with the
  reasoning kept in code, plus a `RETIRED` record so cuts read as decisions.
- **`lib/grade.ts`** — `FULL` and `CALM` post-processing profiles as data for
  Phase 7 to consume. `CALM` sets chromatic aberration to **zero**, not
  reduced.
- **`components/Surface.tsx`** — `ReadingSurface` (opaque, measure-capped) and
  `SpectacleSurface` (full-bleed, canvas-ready).

**Measured contrast — all 26 pairings pass**

| Pairing | Light | Dark |
|---|---|---|
| ink on ground | 16.20:1 | 15.63:1 |
| ink-soft on ground | 9.33:1 | 10.95:1 |
| muted on ground | 5.50:1 | 6.28:1 |
| ember on ground | 6.00:1 | 7.28:1 |
| steel on ground | 7.72:1 | 7.91:1 |
| rule-strong on ground | 3.91:1 | 3.62:1 |

**The guard caught a real defect on first run.** `--rule` measured 1.34:1 —
technically compliant, since WCAG 1.4.11 exempts decorative separators, and
genuinely invisible. Rather than lower the threshold, the token was split: a
decorative `--rule` held to a non-WCAG *design* floor of 1.5:1, and a
`--rule-strong` for component boundaries held to the real 3:1. Faint hairlines
were part of why the old site read as undifferentiated.

**Mutation test (ORCHESTRATION.md requires this)**

Two deliberate breaks, guard failed loudly on both, restored clean:

```
MUTATION 1  --muted #5b636b -> #b9bec4
            FAIL muted on ground   1.68:1 (min 4.5)
            FAIL muted on surface  1.87:1 (min 4.5)
MUTATION 2  --rule-strong #6b727a -> #24282d (dark)
            FAIL rule-strong on ground   1.29:1 (min 3)
            FAIL rule-strong on surface  1.19:1 (min 3)
RESTORED    26 pairings checked, 0 failing
```

**Definition of Done**

- [x] Colour tokens defined; computed ratios recorded; all clear their floor
- [x] Type scale with body ≥16px, label and prose roles separated
- [x] Measure cap exists and is structural (`ReadingSurface` owns it)
- [x] Motion budget documented with a readable mechanism (`allows()`)
- [x] `full` / `calm` grade profiles defined as consumable data
- [x] Ghost-numeral decision documented (`RETIRED` in `lib/motion-budget.ts`)
- [x] Contrast guard exists **and is mutation-tested**
- [ ] **No-WebGL-on-reading-pages guard — deferred to Phase 7.** Stated
      plainly: there is no WebGL anywhere in the tree yet, so such a check
      would pass trivially and could not be mutation-tested. A guard that
      cannot be made to fail is decorative, which is exactly what
      ORCHESTRATION.md says not to accept. It is a Phase 7 DoD item.
- [x] Light and dark both resolve; no colour declared only inside a media or
      `[data-theme]` block
- [x] `prefers-reduced-motion` honoured
- [x] `npm run build` passes
- [x] `npm run lint` passes (typecheck + contrast guard)

**How to verify**

```bash
npm run lint            # tsc, then 26 contrast pairings, exits non-zero on any failure
npm run check:contrast  # guard alone, prints the full table

# prove the guard bites:
sed -i 's/--muted: #5b636b;/--muted: #b9bec4;/' app/globals.css
npm run check:contrast  # expect: FAIL muted on ground 1.68:1
git checkout app/globals.css
```

**Note on the build as verification.** The three typefaces are requested with
`subsets: ['latin','latin-ext','greek','cyrillic']`. `next/font/google` fails
the build on an unsupported subset, so a green build is direct proof that all
three carry the scripts `/el` and `/mk` need.

---

## Open Questions

<!-- Agents add here instead of guessing. Director resolves and moves the
     resolution into Director Decisions below. -->

**All six resolved by the owner, 9 Aug 2026 → DD-1 … DD-6 below.** Kept here
for the record; do not reopen without a new Decision.

Live items still needing owner input (not blocking any phase yet):

- **The three testimonial texts** — verbatim quote, name, role, company, and
  permission to publish, for each (DD-5).
- **Client logos** for the "live in production" strip.
- **A founder photo** for `/studio` and the homepage (DD-4).
- **Case-study metrics** for A25 and Dresscode.
- **Typography** — the font files were never committed to `_current`
  (`app/fonts/` absent, not gitignored), so this is a fresh choice, not a
  port. Raised with the owner during Phase 0.

<details>
<summary>Original wording of the six questions</summary>

### OQ-1 — Pricing model
Fixed packages, monthly subscription, or quote-only?
*Recommendation:* published fixed packages with a "from" price. Subscription
is a hard sell in GR/MK; quote-only is what every local competitor already
does, so it forfeits the differentiator.
**Blocks:** Phase 4.

### OQ-2 — Primary market
Local-first (GR/MK, price-competitive, local SEO) or English-first (UK/US,
premium, remote)?
*Recommendation:* local-first for revenue, English as the aspirational tier.
The site can hold both; the homepage can only lead with one.
**Blocks:** Phase 2B (voice), Phase 3 (homepage hero), Phase 8 ordering.

### OQ-3 — How much cinema survives
*Recommendation:* full grade on homepage hero, case studies, and `/lab`;
calm, fast, high-contrast typography on services, pricing, and process.
Already encoded as a constraint in `SPEC.md` §3.4 and §7 — confirm or amend.
**Blocks:** Phase 1 (motion budget), Phase 7.

### OQ-4 — Founder-forward or faceless studio
*Recommendation:* founder-forward. Solo studios that show a real person
convert better, and it's honest. DesignJoy charges $5,995/mo as one person.
**Blocks:** Phase 6 (`/studio`), Phase 2B (hero copy).

### OQ-5 — Testimonials
Can 3–5 named quotes with real numbers be obtained, starting with A25?
*Note:* the site currently has zero. This is the single largest trust gap and
the highest-leverage non-code task in the project.
**Blocks:** Phase 3 (homepage testimonial slot), Phase 5.

### OQ-6 — Repo strategy
Rebrand `qolar-pro/Portfolio` in place, or start fresh and port?
*Recommendation:* fresh repo. The current one is architected as a single-page
portfolio; the new one needs a route tree, and the old site should stay
deployable until the new one lands.
**Blocks:** Phase 0.

</details>

---

## Director Decisions

<!-- Numbered rulings. Later agents cite these instead of re-litigating.
     Numeric rulings show worked values across the relevant range, not prose. -->

### DD-1 — Pricing is per quote. No published price list.

**Owner ruling:** quote-based.

This overrides the research recommendation (publish fixed packages, because
quote-gating is what every local competitor already does and therefore
forfeits differentiation). The owner weighed that and chose quote-based.
Proceeding as ruled.

**How the configurator survives this:** it still ships and still carries its
whole rationale — it just stops short of committing to a number. It collects
site type, page count, locales, commerce, CMS and animation level, returns an
**indicative range** with an explicit *"final figure comes with your quote"*,
and delivers a scoped brief to the studio. The visitor self-qualifies;
NovaFaber receives a specification instead of "how much for a website?" None
of that value depended on a fixed price list.

The market anchors in `SPEC.md` §4 become **internal calibration** for the
range the configurator returns. They are never rendered as a price table.

**Binding:** No route publishes a fixed price or a package tier grid.
`/pricing` is a *how pricing works* page — cost drivers, what's included, what
a range looks like. Do not add "from €X" badges to the services bento.

### DD-2 — Markets: Greece, North Macedonia, English

**Owner ruling:** GR/MK and English.

All three locales are first-class. English is a real market, not a fallback.

**Binding:** No locale is "primary" with the others as translations. Copy is
*written* per market, not translated from English. Phase 8 is a copywriting
phase, not string substitution.

### DD-3 — All existing 3D assets are scrapped. Replacement is procedural.

**Owner ruling:** *"I don't like the current 3D objects — maybe if we can
create a very good one for the hero and some else."*

**Context:** the six GLBs were produced by the AI pipelines in
`_current/scripts/` (`generate-meshy.mjs`, `generate-hf.mjs`, `sculpt.mjs`).
Regenerating through the same pipeline would most likely reproduce the same
character.

**Ruling: replace downloaded meshes with geometry authored in code** —
procedural geometry and shaders, not GLB assets. Three reasons, in order of
weight:

1. **It fixes the actual complaint.** Procedural geometry is art-directable by
   parameter. "Sharper, slower, more molten" becomes a value to tune rather
   than a regeneration lottery.
2. **It dissolves the payload problem.** The old build shipped 1,872,788 bytes
   of GLB, 546,960 of it on the eager path. Procedural geometry ships as code —
   low single-digit KB, shared with the bundle. Against a 546,960-byte eager
   baseline that is a >99% reduction on the hero, which turns `SPEC.md` §7
   from a constraint the build fights into one it satisfies by construction.
3. **It matches the brand.** *Faber* is a smith. Material heated, formed and
   cooled into structure is a *process* — which procedural geometry expresses
   and a static mesh cannot.

**Scope:** one excellent hero plus a small number of supporting moments. Not
one object per section — that structure died with DD-7 anyway.

**Binding:** Do not port any file from `_current/public/models/`. Do not re-run
the Meshy/HF scripts for site assets. If procedural geometry proves
insufficient for a specific moment, that is an escalation with a byte budget
attached, not a quiet reintroduction of a GLB.

### DD-4 — Founder-forward

**Owner ruling:** founder-forward.

Giannis Papadopoulos is named and shown, on `/studio` and in a homepage trust
slot. NovaFaber stays the headline; the founder is the proof beneath it.

**Binding:** The founder is a trust signal, not the brand. Do not restore the
hero to a personal name — `_current` had `hero.name: 'Giannis Papadopoulos'`
as the primary H1. A photo is required; a faceless "about the founder"
paragraph gets none of the conversion benefit this decision exists to capture.

### DD-5 — Three testimonials

**Owner ruling:** three available.

Three named quotes is enough to ship a credible section — well short of the
30+ "Wall of Love" pattern in the research, so **design the block for three
and make each substantial** rather than building a dense grid that looks
under-filled at three.

**Binding:** Every testimonial shows a real name, role and company. No
anonymised "— Client, CEO" entries; an unattributed testimonial reads as
invented and costs more trust than it earns. If attribution can't be obtained
for one, ship two.

### DD-6 — Fresh repo, full rebrand, nothing carried over unexamined

**Owner ruling:** *"start fresh and rebrand — everything about NovaFaber clean
and fresh."*

New `novafaber` project. `_current/` stays read-only reference for content and
component *logic*; nothing is copied wholesale.

**Binding:** This is stronger than a repo-location choice — it sets the default
for the whole build. Where a phase could port an old file or write a new one,
**write the new one** unless the phase file explicitly says port. Specifically,
these do not come across in any form: `Nav.tsx`'s overlay menu, the Experience
section (dead per DD-9), the six GLBs (dead per DD-3), the DE/FR/IT locale
slots (dead per DD-10).

The old site stays deployable until Phase 11, so the 301s in Phase 9 have
something to redirect from.

---

*DD-7 … DD-10 are Director rulings from the research pass. They are recorded
because each is something a later session would plausibly try to undo.*

### DD-7 — Multi-page route tree, not a single scrolling page

**Context:** the current site is genuinely well-executed as one continuous
scroll through a single 3D environment. The pull to preserve that is real, and
a later session will feel it.

Two independent arguments force pages, and they converge:

1. **Navigation** (`SPEC.md` §2, S2). One route means the only wayfinding is
   the `Index` overlay in `_current/components/Nav.tsx`. You cannot land on a
   topic, link someone to one, or leave and return to your place.
2. **Search.** One URL carries one title and one description, so it ranks for
   one query in one language. NovaFaber needs `κατασκευή ιστοσελίδων`,
   `изработка на веб страни`, e-shop, redesign and city-qualified variants —
   across three locales.

**Binding:** Do not consolidate routes back into one page, and do not
"restore the original flow" as a polish task. The homepage may keep
camera-choreographed scroll; no other route may.

### DD-8 — Post-processing is disabled behind body text

**Context:** `_current/components/canvas/Effects.tsx` applies bloom, chromatic
aberration, film grain and vignette across the whole canvas, with body copy
composited on top. Chromatic aberration works by splitting and offsetting
colour channels at edges — and letterforms are edges. Worked values from the
source: grain `0.45` in SCREEN blend (line 40); CA offset swelling from
`0.0012` to `0.0072` with scroll velocity (lines 22–24); vignette darkness
`0.78` (line 41). This is the mechanical cause of "really bad for the eye to
read."

**Binding:** Reading surfaces render on opaque panels with post-processing off
or the canvas absent. An agent that re-enables the grade behind a services
list because "it looks flatter now" has reintroduced the defect the rebuild
exists to fix. Escalate instead.

### DD-9 — The Experience section is deleted, not restyled

**Context:** `_current/components/sections/Experience.tsx` renders a
three-entry job history. That is a CV. Agencies publish *process*, not
employment history — a four-step workflow block was near-universal across the
productized sites in the research.

**Binding:** `/process` replaces it in the same homepage slot, using the forge
vocabulary in `SPEC.md` §6 (**Forge / Cast / Temper / Finish**), not
"discovery / design / develop / deploy." The job history does not return in
condensed form on `/studio`.

### DD-10 — Locales: EN, EL, MK ship. DE, FR, IT are deleted.

**Context:** `_current/lib/i18n.ts` declares six locales but `ACTIVE_LOCALES`
is `['en','el']`; `de`, `fr`, `mk`, `it` all alias English.

MK is promoted not because scaffolding exists but because A25 — the flagship
case study — is a licensed North Macedonian agency, i.e. a live referral
network in a market the site currently addresses in English.

DE/FR/IT are deleted rather than left stubbed: a stub locale is surface area
that costs maintenance, invites `hreflang` errors, and reaches nobody.

**Binding:** Do not re-add a locale as a stub. A locale ships with real copy
or it does not exist in the type.

---

*DD-11 … DD-12 arose during Phase 0.*

### DD-11 — Every locale is URL-prefixed, including English

**Context:** the common pattern is an unprefixed default locale (`/pricing` for
EN, `/el/pricing` for Greek). That was rejected here.

**Ruling:** all three locales carry a prefix — `/en/…`, `/el/…`, `/mk/…`. Bare
`/` and any unprefixed path redirect via `middleware.ts`.

**Reasoning:** DD-2 makes GR, MK and EN all first-class, with copy written per
market rather than translated. An unprefixed English tree would encode exactly
the hierarchy DD-2 rejects — English as "the site" and the others as
translations of it. It also keeps the route shape uniform, so
`lib/metadata.ts` can generate canonicals and hreflang from `LOCALES` with no
special case for a default.

**Cost, stated honestly:** English URLs are one segment longer, and the bare
domain costs a redirect hop. Accepted.

**Binding:** Do not add an unprefixed alias tree for EN. If Phase 9 adds
Accept-Language negotiation, it changes *which* locale bare `/` redirects to —
it does not remove the prefix.

### DD-12 — Typography is a fresh pairing, not a port

**Owner ruling:** new pairing for a clean rebrand.

**Reasoning:** Clash Display is a display face, and the old site used it at
sizes where it contributed to the density problem in SPEC §2. Re-adopting it
would re-import a known cause.

**Correction to the record.** This decision was first presented to the owner
alongside a claim that the font files were missing from the repository. That
claim was wrong — `app/fonts/` contains all four `.woff2` files
(ClashDisplay 29 KB, GeneralSans 38 KB, two JetBrains Mono weights). The
error came from a directory listing that filtered binaries, read as absence.
The ruling stands on the S2 reasoning above, which never depended on
availability, but the owner made it under a false premise and may revisit it.
The files remain in git history after the Phase 0 cut and in the local
`_current/` clone, so re-adopting any of them is a copy.

**Binding on Phase 1:** Do not hard-code a family anywhere. Families bind
through `--font-display` / `--font-body` / `--font-mono` only, as Phase 0
established, so the pairing stays a one-file change while it is being judged.
The body face is chosen for reading at 16–18px first and for character second —
that ordering is the point of the ruling.

---

*DD-13 … DD-14 arose during Phase 1.*

### DD-13 — Type pairing: Sofia Sans Condensed / Source Serif 4 / JetBrains Mono

**Context:** DD-12 called for a new pairing. The binding constraint turned out
not to be taste but script coverage — DD-2 ships EL and MK, so every face must
carry **Greek and Cyrillic**. That eliminates most display typefaces outright.
Archivo, the first choice, offers `latin, latin-ext, vietnamese` and neither
of the scripts needed. Of the full Google Fonts catalogue, 104 families carry
both Greek and Cyrillic; 58 of those are variable-weight.

**Ruling:**

- **Display — Sofia Sans Condensed.** Bulgarian-designed, so Cyrillic is a
  native script rather than an appended subset, and it carries Greek. Its
  signage lineage suits a studio named for a smith. *Condensed is a functional
  choice, not a stylistic one:* Greek and Macedonian headlines run materially
  longer than their English equivalents, and a normal-width display face wraps
  badly on `/el` and `/mk` at the same type sizes.
- **Body — Source Serif 4.** Chosen for reading at 17px first and character
  second, per SPEC §11. A serif body also separates NovaFaber from the
  geometric-sans look every local template shop ships.
- **Mono — JetBrains Mono.** Labels, prices, metrics. Carries both scripts and
  keeps the old build's mono role.

**Binding:** Any future substitution must be verified for Greek and Cyrillic
before it is proposed. The build enforces this — `next/font/google` fails on an
unsupported subset — so do not "fix" a build error by narrowing the `subsets`
array. Narrowing it silently drops script coverage for two of three locales.

### DD-14 — Motion budget: per-surface allowances

**Context:** the owner asked whether the old site's animations could be reused.
They can, nearly all of them. The defect was never an individual effect — it
was eight running simultaneously, over body copy, under a film grade.

**Ruling:** effects are allocated per surface in `lib/motion-budget.ts`.

| Surface | Allowed |
|---|---|
| `spectacle` | cursor, magnetic, velocitySkew, reveal, cameraScroll, grade |
| `reading` | cursor, reveal |
| `chrome` | cursor, textRoll |

Carried over unchanged: `lib/journey.ts`, `lib/motion.ts`, the Lenis↔GSAP
ticker marriage, `lib/reveal.ts`, `lib/quality.tsx`. That architecture is
sound and none of it caused the problem.

**Retired, with reasons:**

- **Preloader** — delays LCP on a site whose pitch is speed (SPEC §7 sets LCP
  ≤ 2.0s). This one costs money, not just legibility.
- **Ghost numeral** — the `clamp(6rem,18vw,15rem)` numeral drifting behind
  every H2. Two elements occupied one spot and neither won.
- **VelocitySkew on reading surfaces** — shearing the page up to 3.2° while
  scrolling was the most reading-hostile DOM effect in the old build.
- **TiltStage on services** — card tilt fights scanning when someone is
  comparing four options.

**Binding:** adding an effect to a surface means removing one. If a component
needs an effect its surface does not allow, that is an escalation — not a
local exception.
