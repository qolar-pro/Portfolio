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
| 1 — Design system | DONE | `e6936dc` | Type pairing (DD-13), measured palette, motion budget (DD-14), grade profiles. Contrast guard gates `npm run lint`. |
| 2A — Content model (EN structure) | DONE | — | Entity model + EN copy. Route metadata now sourced from content. See DD-15, DD-16. |
| 2B — Content voice rewrite (EN) | DONE | — | Merged into 2A — the model and the copy were too coupled to write separately. |
| 3 — Core pages | DONE | — | Homepage (7 blocks) + 4 service pages, composed from content. See DD-17. |
| 4 — Pricing + configurator | DONE | — | `/pricing` explains how, never how much. Configurator returns a range. Base rates need owner sign-off (DD-23). |
| 5 — Case studies | DONE | — | `/work`, 3 case studies, `/lab`. Images renamed + `next/image`. See DD-24. |
| 6 — Process / Studio / Contact | DONE | — | Configurator brief round-trips through the URL, server-rendered. Booking tool still unchosen — OQ-7. |
| 7 — Forge hero & perf budget | DONE | — | Procedural shader hero, zero mesh files. WebGL containment guard added + mutation-tested. See DD-25. |
| 7B — Forge visual identity | DONE | — | Dark spectacle surfaces, heat range, grain, scroll reveals. See DD-26. |
| 7C — Full revamp | DONE | — | Chrome, component system, all 15 templates on the forge identity. See DD-27. |
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
  **written** permission to publish, for each (DD-5). Verbal is not enough to
  put a client's name and firm on a public page. Start with A25.
  **Minimum to render the section: two** — below that the block stays absent
  (DD-18), because a single quote reads as the only one that could be
  obtained. *(Absorbs the kit's OQ-11.)*
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

---

*DD-15 … DD-16 arose during Phase 2.*

### DD-15 — Unwritten locales fall back to English, but never silently

**Context:** DD-10 forbids a locale quietly pretending to be finished — the old
build aliased four locales to English and called them shipped. But Phase 0
built the `/el` and `/mk` route trees, and those routes must render something
before Phase 8 writes their copy.

**Ruling:** `contentFor()` falls back to English for an unwritten locale, and
three mechanisms stop that being silent:

1. `content.el` and `content.mk` are literally `null` in the registry, so the
   gap is visible at the definition, not buried in a status field.
2. `pageMetadata()` sets `robots: noindex, follow` on any locale whose copy is
   not written. Verified in the build output: `/en/pricing` carries no robots
   tag, `/el/pricing` and `/mk/pricing` both carry `noindex, follow`.
3. `scripts/check-content-coverage.mjs` reports the gap on every `npm run lint`.

The noindex is the commercially important one. An English page served at a
Greek URL competes with the real Greek page for the same queries once it
exists, and search engines are slow to forgive that overlap.

**Binding:** When Phase 8 lands, delete the fallback and make `contentFor()`
return non-null. Do not extend the fallback to a fourth locale as a shortcut.

### DD-16 — The services list is repositioned, not ported

**Context:** the old site's five services were Full-Stack Platforms, Commerce
Systems, Internal Tooling, Data & Security, and Experience Systems.

**None of them is "we build you a website."**

That was not an oversight in the old copy. It accurately described a portfolio
for a software engineer, and it is precisely why the site could not sell into
the market NovaFaber is entering — where the highest-volume search in both
Greek and Macedonian is exactly that phrase.

**Ruling:** the mapping is deliberately not one-to-one.

| New route | Source |
|---|---|
| `/services/websites` | **New.** The offering that did not exist. |
| `/services/ecommerce` | Commerce Systems |
| `/services/redesign` | **New.** Warmest lead type. |
| `/services/custom` | Full-Stack Platforms + Internal Tooling + Data & Security + Experience Systems, consolidated into one |

**Binding:** Do not re-split `/services/custom` back into four pages to "cover
more keywords." Four thin pages describing the same buyer compete with each
other; one substantial page does not.

Each service carries a `notFor` field, and it is not decorative. Naming who the
service is wrong for is the cheapest trust signal available to a studio with no
testimonials yet (DD-5), and it filters enquiries that would waste both sides'
time.

---

### Phase 3 — Core pages (Director, direct)

**What was built**

- `components/Home.tsx` — homepage in **7 blocks**
- `components/ServicePage.tsx` — one template, four services (DD-16)
- `components/ui.tsx` — `Eyebrow`, `SectionHeading`, `Button`, `Stat`, `Band`
- Header and footer labels now read from `chrome.navLabels` (DD-2)

**Definition of Done**

- [x] Homepage renders from content, no hardcoded copy
- [x] Four service pages render from the `Service` entity
- [x] Density budget respected — 7 blocks, counted
- [x] Prose surfaces use `ReadingSurface`
- [x] No price figures rendered
- [x] Testimonial empty state honest — section omitted entirely
- [x] Nav and footer labels from content
- [x] One `<h1>` per page, verified in build output
- [x] `npm run build` passes
- [x] `npm run lint` passes

**A verification mistake worth recording.** The DoD check for leaked prices was
run as a grep for `[€$][0-9]` over the *rendered HTML*, and it hit — three
matches on `/en/services/websites`. They were React Server Components flight
data (`\"$\",\"$1\",\"c\"`), not prices. That check would false-positive on
every Next.js page ever built. The real guard scans `lib/content/en.ts` at
source, which is where a price would actually be authored, and it passes. The
code was fine; the verification was wrong.

**How to verify**

```bash
npm run lint            # tsc, 26 contrast pairings, content coverage
npm run build
grep -c "<Band" components/Home.tsx                    # 7 — the density budget
grep -o "<h1" .next/server/app/en/index.html | wc -l   # 1
node scripts/check-content-coverage.mjs                # price guard, at source
```

---

### DD-17 — SPEC §5 lists ten homepage sections; the density budget allows seven

**Context:** SPEC §5 specifies a homepage order of ten sections. SPEC §3.3 caps
a page at roughly seven blocks. Both were written during research, and they
contradict each other.

**Ruling:** the budget wins, and the sections compose rather than being cut.

- Proof strip folds into the hero band — it is credibility *for* the hero, not
  a separate argument.
- The closing CTA carries the contact section.
- Client logos are dropped for now: the owner has not supplied any, and an
  empty "trusted by" strip is worse than none.

Final: hero+proof, services, flagship, process, testimonials, capabilities,
closing CTA. Seven.

**Binding:** adding a homepage section means merging or removing another.
Resolving this at build time is the entire reason the budget exists — shipping
ten sections and calling the result dense is the failure being prevented.

### DD-18 — The testimonial section renders nothing, not an empty state

**Context:** DD-5 says design the block for three substantial testimonials. The
quotes have not been supplied.

**Ruling:** when `testimonials` contains no entries, the section does not
render at all — no heading, no placeholder cards, no "coming soon".

A styled empty state announces that testimonials were expected and are absent,
which is a worse signal than never raising the subject. Placeholder quotes are
not an option at any point (DD-5).

**Binding:** do not add skeleton cards or sample quotes to "show the layout".
The layout can be judged when there is something real in it.

---

*DD-19 … DD-20 resolve the Phase 2 copy review.*

### DD-19 — NovaFaber is based in Greece. It serves North Macedonia.

**Owner ruling:** "gr/en ok, mk not — but we were made in Greece."

**Context:** the footer read "Designed and built in-house, in Greece and North
Macedonia." I inferred a Macedonian presence from A25 being a Macedonian
client. That inference was wrong, and it appeared on every page of the site.

**Ruling:** the footer says Greece. The markets served remain Greek, Macedonian
and English (DD-2 unchanged) — the homepage subhead still names all three,
because *serving* a market and being *established* in it are different claims
and only one of them is true here.

**Binding:** never state or imply a Macedonian office, entity, or address.
Language coverage and client location do not establish presence. This is a
factual claim about the business, not positioning — if it needs to change, it
changes because the business changed.

### DD-20 — The `notFor` statements stay

**Owner ruling:** delegated — "you decide what's best."

**Ruling:** keep them, on all four service pages, with real weight on the page
rather than tucked into fine print.

**Reasoning:** the site currently has zero published testimonials (DD-5), no
client logos, and no case-study metrics. Every conventional trust signal is
unavailable. Naming who a service is *wrong* for is the one credibility device
that costs nothing but honesty and cannot be faked by a competitor — a template
shop cannot tell you to go to a template shop.

It also does commercial work: each statement disqualifies a category of
enquiry that would have wasted a call.

**The cost, stated plainly:** this turns away real work. "If you need a single
page online this week and cost is the deciding factor, a template shop will
serve you better" will lose enquiries that might have converted. That trade is
the decision, and it is worth revisiting once testimonials exist and the trust
they buy is available from a cheaper source.

### DD-21 — "Apex Shift" becomes "Nova Shift"

**Owner ruling:** rename to Nova Shift.

Ties the product to the studio brand rather than leaving it orphaned. Entity id
is `nova-shift`, which is also its future URL at `/work/nova-shift`.

**Binding:** no remaining copy or asset reference may say "Apex". Image files
still carry `apex-*.jpg` filenames; Phase 5 renames them when it optimises the
case-study imagery.

---

### Phase 4 — Pricing & configurator (Director, direct)

**What was built**

- `lib/pricing.ts` — every coefficient in one module, each commented with the
  local-market anchor it was derived against
- `components/Configurator.tsx` — client component, live range, keyboard
  operable (radio groups in labelled fieldsets)
- `components/PricingPage.tsx` — cost drivers, what is included as standard,
  what is billed separately, and why there is no price list

**Definition of Done**

- [x] No static price list or tier grid on any route
- [x] Range always accompanied by the "not a quote" qualifier, adjacent in the
      DOM — verified present in the prerendered HTML
- [x] Every coefficient in one module, tunable in one place
- [x] Selections carry into `/contact` as query params
- [x] Radio groups in labelled fieldsets; keyboard operable
- [x] `npm run build` and `npm run lint` pass
- [ ] **Base rates not owner-approved** — DD-23, surfaced on every lint

**How to verify**

```bash
npm run build
grep -oE "€[0-9,]+" .next/server/app/en/pricing.html | sort -u   # €1,400 €2,200
grep -c "This is a range, not a quote" .next/server/app/en/pricing.html  # 1
npm run check:content   # prints the base rates awaiting approval
```

---

### DD-22 — The configurator's default is the cheapest configuration

**Context:** the configurator is a client component, so its default state
server-renders. Whatever that default is becomes the figure an unconfigured
visitor sees and a crawler indexes.

The first default was mid-range — website, 6–15 pages, self-editable,
designed from scratch, considered motion — which put **€4,200–6,300** into the
static HTML.

**Ruling:** default to the cheapest valid configuration. The page now renders
**€1,400–2,200**.

**Reasoning:** a mid-range anchor shows €4,200–6,300 to someone whose actual
project is €1,440–2,160, and loses that enquiry before they touch a control.
It also misrepresents the studio as more expensive than it is. Building up
from a floor is how a configurator is supposed to behave anyway — every choice
adds something the visitor asked for.

**On DD-1:** a single configured range with its qualifier adjacent is not the
"fixed price or package tier grid" DD-1 forbids. It cannot be scanned or
compared without describing a project first, which is the qualification the
tool exists to perform. Recorded because it sits close to the line.

**Binding:** do not "improve" the default to a more representative
configuration. The number that renders unconfigured is an anchor, and anchors
belong at the entry point.

### DD-23 — Base rates are derived, not confirmed

**Context:** `BASE_RATES` in `lib/pricing.ts` — website €1,800, store €4,000,
redesign €1,500, custom €6,000 — are the studio's **actual prices**. Everything
else in that file is arithmetic.

They were derived from the SPEC §7 market anchors and the positioning ruling
(2–3× the local template market, well under UK agency rates), and each carries
the comparison it was derived against. Worked example: a small store configures
to roughly €7,800–11,600 against a local €1,500–3,500, which sits in the band.

**But derived is not confirmed.** This is a business fact, and the phase file
says plainly that agents never invent those.

**Binding:** `scripts/check-content-coverage.mjs` prints the rates on every
`npm run lint` until the marker `OWNER APPROVED` appears in `lib/pricing.ts`.
Do not add that marker on the owner's behalf. Launch is blocked on it in the
same way it is blocked on the missing testimonials.

---

### Phase 5 — Case studies & Lab (Director, direct)

**What was built**

- `components/CaseStudyPage.tsx`, `components/WorkIndex.tsx`
- `/work` + `/work/a25`, `/work/dresscode`, `/work/nova-shift`
- `/lab` + `/lab/surviving-of-souls`
- `apex-*.jpg` → `nova-shift-*.jpg` (DD-21), content references updated
- All imagery through `next/image` with `fill` inside fixed-aspect containers,
  so no image can cause layout shift regardless of its source dimensions

**A bug the DoD check caught.** `/work` was rendering "Surviving of Souls"
despite the surface filter being correct. The leak was `SiteFooter`, which
listed *every* route in `ROUTES` — including individual case studies and lab
entries — on every page. Two problems in one: a cluttered 15-link footer, and
a lab entry appearing on the sales path, which is precisely what DD-4 exists
to prevent. Footer now lists top-level destinations only; children are reached
from their index. Verified: `/work` 0 occurrences, `/lab` 1, footer 10 links.

**Definition of Done**

- [x] `/work` lists client work, excludes lab entries
- [x] Each case study renders from the `CaseStudy` entity
- [x] `/lab` renders Surviving of Souls
- [x] Images through `next/image`
- [x] No invented metric anywhere
- [x] `npm run build` and `npm run lint` pass
- [~] **"Zero occurrences of apex"** — two remain and both are deliberate:
      `LEGACY_NAME` in `lib/site.ts`, which SPEC §7 requires for the JSON-LD
      `alternateName`, and the README's account of what this repository used to
      hold. No user-facing copy or asset filename contains it. The DoD line was
      written too broadly; the intent was copy and filenames.

---

### DD-24 — Case studies carry no metrics, and the pages are built around that

**Context:** every teardown in the research found the same pattern — case
studies that lead with outcome numbers ("$300K in sponsorship revenue",
"+28% demo requests") convert, and generic ones do not.

NovaFaber has none. Not "not gathered yet": there is no analytics access to
A25 or Dresscode, and A25 was delivered unpaid, so there is no engagement to
request it under.

**Ruling:** case studies are built on **what was made and why**, in prose.
No outcome figures, no traffic claims, no invented percentages.

**Reasoning:** an invented metric is the single cheapest way to destroy the
credibility of every other claim on the site, and this site's entire
positioning rests on claims a visitor cannot independently verify. The
downside is real — this is a weaker form of proof, and the writing has to work
harder to compensate. The A25 page therefore leads with the *problem* (two
audiences sharing no language) and shows the build following from it, so the
reader learns how the studio thinks rather than what it achieved.

**Binding:** do not add a metric to any case study until the client supplies
it in writing. If one arrives, cite the client as its source.

---

### Phase 6 — Process, Studio, Contact (Director, direct)

**What was built**

- `/process` — four steps, all nine covered stages verified present in the
  built HTML, plus a "what I need from you" block
- `/studio` — founder-forward, degrades honestly without a photo
- `/contact` — reads the configurator brief from the URL, server-side

**Verified end to end**

```
GET /en/contact?type=store&scale=medium&catalogue=c1000&locales=l2&cms=yes&design=scratch&motion=considered
  → renders: An online store · 100 to 1,000 products · Two languages ·
    Self-editable content · Design it from scratch · Considered movement
    Indicative range €12,400 – €18,600

GET /en/contact?type=EVIL&...
  → brief not rendered (0 occurrences). Invalid values are rejected rather
    than reaching estimate() and producing an authoritative-looking figure.
```

Both with JavaScript disabled — the brief is read from the URL on the server.
That matters more than it sounds: the most common thing a visitor does with a
configured quote is send the link to whoever actually decides.

**Cost of that choice, recorded:** using `searchParams` makes `/contact`
dynamically rendered rather than static, in all three locales. Accepted —
contact is low-traffic and the parameter round-trip is the feature.

**On the missing founder photo:** `/studio` renders without substituting an
avatar, monogram or stock portrait. A placeholder face on an "about the
founder" page reads as an agency performing intimacy, which forfeits exactly
the trust DD-4 exists to buy. An absent photo reads as a page still being
finished; a fake one reads as dishonest.

**Definition of Done**

- [x] `/process` renders four steps and all nine covered stages
- [x] `/studio` renders and degrades honestly without a photo
- [x] `/contact` reads configurator params and displays the brief
- [x] Brief display works with JavaScript disabled
- [x] Invalid params rejected
- [x] No price figures outside the configurator round-trip
- [x] `npm run build` and `npm run lint` pass
- [ ] **Booking calendar — not built.** See OQ-7.

---

## Open Questions (live)

### OQ-7 — Booking tool and transactional email · *blocks launch*

SPEC §4 specifies `/contact` as "a booking calendar, not a mailto." That needs
two things the studio has not chosen: a scheduling tool and a transactional
email service (Resend, Postmark) for a real form.

`/contact` currently composes the brief into a `mailto:`, marked `INTERIM` in
`components/ContactPage.tsx`. Shipping that silently would have quietly done
the thing the spec rules out, so it is flagged rather than absorbed.

**Scheduling tool — the choice, with the kit's reasoning folded in:**

- **Cal.com, self-hosted** — themeable to the ember palette, so the booking
  step does not hand the visitor off to a page that looks like someone else's
  product at the exact moment they are deciding to trust this one. Costs
  hosting and maintenance.
- **Calendly** — zero maintenance, but its chrome is unbrandable at the free
  tier and the visual break is real.

**Needed from the owner:** which scheduling tool, and whether a form that
posts server-side is wanted over a mail client handoff.

*Absorbed the kit's OQ-15, which asked the same question. Its Cal.com
themeability argument is the paragraph above.*

### OQ-8 — The configurator has no market modifier · *affects credibility*

The same configuration returns one figure regardless of where the client is.
A store at 100–1,000 products currently quotes **€12,400–18,600** — a
defensible Athens or London number, and far outside the Macedonian market,
where local studios list stores at €500–2,500.

DD-2 makes Greece, North Macedonia and English-speaking markets all
first-class. A single price scale cannot serve three markets whose local rates
differ by roughly 3×, and quoting a Skopje client an Athens figure loses them
before they reply.

**Needed from the owner:** whether to add a market selector, and what the
Macedonian multiplier should be. This compounds with DD-23 — the base rates are
themselves unapproved.

*Absorbed the kit's OQ-17, which asked the same question and added no detail
this entry did not already carry.*

---

### Phase 7 — Forge hero & performance budget (Director, direct)

**What was built**

- `components/canvas/ForgeObject.tsx` — icosahedron generated at runtime,
  surfaced by a custom GLSL shader. Vertex displacement by simplex noise with
  amplitude driven by heat; fresnel rim and an ember-to-iron gradient in the
  fragment shader. **No mesh file of any kind.**
- `lib/quality.ts` — `high` / `low` / `static` tiers. Starts at `static` on
  every render including the server, and only upgrades after mount, so the
  canvas cannot delay LCP or cause a hydration mismatch.
- `components/Hero.tsx` — type renders server-side and is the LCP element;
  canvas is dynamically imported and never requested on the `static` tier.
- `scripts/check-no-webgl.mjs` — the guard deferred from Phase 1.

**Verified**

```
Homepage First Load JS ....... 108 kB
Reading pages ................ 106 kB
  → the WebGL hero costs 2 kB at first load.

three.js chunks .............. separate, loaded after mount
shared bundle ................ contains no three.js
SSR homepage HTML ............ headline present, <canvas> count 0
```

**Guard mutation-tested — both directions**

```
MUTATION 1  direct import on /pricing
            FAIL /pricing
            reaches WebGL via: pricing/page.tsx -> @/components/canvas/ForgeCanvas

MUTATION 2  indirect, via shared components/ui.tsx
            14 reading routes caught
            reaches WebGL via: contact/page.tsx -> ContactPage.tsx -> ui.tsx -> ForgeCanvas

RESTORED    exit 0
```

Mutation 2 is the one that mattered. A grep of the page file would have passed
it, and an indirect pull through a shared component is the realistic way this
constraint actually breaks.

**Scope decision:** `@react-three/postprocessing` was not added. The grade
values in `lib/grade.ts` are applied inside the fragment shader (grain,
emissive falloff standing in for bloom) and in CSS (vignette). Chromatic
aberration is not implemented at all, which costs nothing — DD-8 sets it to
zero on every surface carrying text, and the hero is the only surface that
could have used it.

**Definition of Done**

- [x] Zero mesh files; geometry generated at runtime
- [x] Grade values read from `lib/grade.ts`
- [x] `static` tier renders a complete hero with no WebGL
- [x] `prefers-reduced-motion` forces the static tier
- [x] Canvas dynamically imported; text is the LCP element
- [x] No-WebGL guard exists **and is mutation-tested**
- [x] `npm run build` and `npm run lint` pass

---

### DD-25 — Correcting the payload arithmetic in DD-3

DD-3 justified scrapping the GLBs partly on this claim:

> "Procedural geometry ships as code — low single-digit KB, shared with the
> bundle. Against a 546,960-byte eager baseline that is a >99% reduction."

**That was misleading and should be corrected.** The geometry and shader are
indeed a few KB. But they require three.js, which lands in code-split chunks
totalling roughly **700 KB**. Describing the hero as a >99% reduction ignored
the runtime the technique depends on.

**The honest comparison**, since the old build also shipped three.js:

| | Old build | Now |
|---|---|---|
| Mesh files | 1,872,788 B, 546,960 eager | **0** |
| three.js | shipped | shipped, code-split, after mount |
| Eager 3D payload | 546,960 B | **0 B** |
| Homepage First Load JS | — | 108 kB (2 kB over a reading page) |

So the decision still holds, and comfortably — 1.87 MB of models is gone and
nothing 3D is eager. But the win is "no models and nothing blocking", not
"the hero is free."

**Binding:** three.js is now the largest single dependency in the project. If
a future phase adds `drei`, `postprocessing`, or a physics library, the cost
goes in the phase report with a measured number. Do not let this grow quietly
on a site whose pitch is speed.

---

### Phase 7B — Forge visual identity (Director, direct)

**Why this phase exists.** The owner's assessment of the site after Phase 7:
*"we are lacking colors personality design visuals animations advanced
interactive components and designs layouts — we just got a base."*

Correct, and the cause was mine. The brief in SPEC §2 was "too cramped, hard
to read", so Phase 1 wrote hard constraints against noise — density budget,
motion budget, one interaction per section — and Phase 3 applied them to
*every* surface. But SPEC §3.2 had already split the site into spectacle and
reading surfaces. **I never spent the spectacle allowance I had written for
myself.** The rule was right; the application was uniform where it should have
been selective.

**What was built**

- **The forge palette** (DD-26) — three darks, a four-step heat range
  (`--heat-dull` → `--heat-white`), forge-specific text tokens. All
  theme-independent.
- `.forge` surface treatment — feTurbulence grain (no request, scales
  cleanly) and a banked-heat radial, both `z-index: -1` so neither ever sits
  over text. The old site's full-frame grain over body copy is a diagnosed
  cause in SPEC §2; this is the same idea confined to surfaces with no prose.
- `<Reveal />` — one IntersectionObserver for the document. No animation
  library: DD-25 made three.js the largest dependency here, and adding GSAP to
  fade things in would be a poor trade. Reveals fire once and never re-run.
- Hero rebuilt on forge ground with a staggered entrance.
- Homepage rhythm: **forge → light → forge → light → light → forge**.

**Contrast held.** 37 pairings, 0 failing — 11 of them new forge pairings.
`forge-muted on forge-void` at 6.64:1 is the one most likely to have drifted,
which is why it is checked rather than assumed. Dark grounds are where
contrast discipline usually lapses quietly.

**Verified**

```
forge bands on homepage ....... 3 (hero, flagship, closing CTA)
data-reveal targets ........... 27
<canvas> in SSR HTML .......... 0   (hero still LCP-safe)
Homepage First Load JS ........ 109 kB  (+1 kB, the observer)
```

---

### DD-26 — The forge is dark. The daylight follows the theme.

**Owner question:** which visual direction fits the name better?

**Ruling:** spectacle surfaces are **always dark, in both themes**. Reading
surfaces follow the viewer's theme.

**Reasoning, and it is derived from the name rather than chosen for taste:**

1. *Faber* is a smith, and a forge is dark for a **working reason** — a smith
   judges steel's temperature by its colour (cherry, orange, straw), which is
   only possible in low light. The darkness is a working condition, not
   atmosphere.
2. *Nova* is a sudden brightening, and brightening only reads as sudden
   against dark.
3. A technical argument I had walked into: the Phase 7 shader is **emissive** —
   fresnel rim, glowing core, ember bloom — and it was sitting on a `#f2f3f5`
   ground. Glow requires darkness to exist. The hero was fighting its page.

**But not a fully dark site.** The original complaint was that the old dark
site was hard to read, and the buyers are lawyers and businesses in Greece and
North Macedonia, where dark-everything reads as gaming rather than a reliable
supplier. The resolution is the metaphor made literal: **the smith works in
the dark; the finished piece is shown in daylight.** Drama lives where there
is no body copy; prose lives on light.

**Binding:**
- Forge tokens are theme-independent. Do not add light-mode variants — a forge
  that turns white in light mode abandons the entire rationale.
- Grain and glow are `z-index: -1` and may never composite over text (DD-8).
- Any text on a forge surface uses the `forge-*` / `heat-*` tokens. The normal
  ink tokens are near-invisible there, and the contrast guard checks the forge
  pairings specifically so this cannot regress silently.
- Alternating forge against light is the homepage's structural rhythm. It is
  what makes seven sections read as distinct without seven bespoke layouts.

---

### Phase 7C — Full site revamp (Director, direct)

**Brief:** *"complete revamp but in our style and theme… visuals layouts design
palettes uis panels cards texts monograms footers headers navbar language menu
book a meeting — everything."* Plus: keep the strengths from the UK/US/GR/MK
agency research that the studio can actually support.

**Chrome — new**

- `Logomark.tsx` — an anvil whose negative space reads as an N, with the spark
  where the hammer lands. The shape is the trade, which is the same argument
  the brand makes. Single path, inherits `currentColor`, legible at 20px.
- `SiteHeader` — forge tone, sticky, hides on scroll-down and returns on
  scroll-up (the one motion DD-14 allows chrome, and it earns it by giving
  back phone screen space). Active-route state, full mobile sheet.
- `LocaleMenu` — switches to **the same page** in the target locale rather
  than dumping the visitor on the homepage, which is the single most common
  multilingual failure. Full names in the menu ("Македонски" tells a Macedonian
  speaker this site is for them; "MK" does not).
- `SiteFooter` — grouped by what a visitor is trying to do (buy, verify,
  contact) rather than by the shape of the route tree. Closes on the ownership
  promise.

**Component system** — `PageHeader`, `Panel`, `Card`, `Tag`, `MarkedList`,
`GridRule`, plus `tone` props throughout. Every inner page now opens on a forge
`PageHeader`, which is what stops fifteen pages drifting apart.

**Research patterns adopted** (from the GR/MK/UK/US teardowns):

| Pattern | Status |
|---|---|
| Instant quote calculator | shipped (configurator) |
| Four-step process block | shipped |
| Bento grid, unequal weight | shipped |
| Volume metrics above the fold | shipped |
| **Risk reversal early** | **now on the homepage and `/pricing`** — was footer-only |
| **Split CTA by audience** | **new** — "I need a website" / "Mine needs fixing" |
| **Live preview of client work** | **new** — `LivePreview`, opt-in load |
| Named testimonials | blocked on owner content (DD-5) |
| Client logos under hero | blocked — none supplied |

`LivePreview` is opt-in rather than auto-loading because many sites refuse to
be framed and there is no way to detect that from the parent — the load event
fires either way. A click-to-load with a permanent "Open ↗" escape hatch beats
a silent blank rectangle, which is what the old site's version could produce.

**Density budget held at seven.** The risk-reversal section replaced the
standalone capabilities block rather than adding to it — a tech-stack list is
the weakest section commercially (the site's own copy says clients do not buy
Redis), so the stack survives as a single strip inside the new section.

**Verified**

```
forge surfaces per page ....... 4–5 on all 15 templates
logomark / locale menu / footer promise ... present sitewide
contrast ...................... 37 pairings, 0 failing
WebGL containment ............. home only, 14 reading routes clean
build + typecheck ............. pass
```

---

### DD-27 — Every inner page opens on a forge `PageHeader`

**Context:** Phase 3–6 gave each page its own `<Band>` opener. They drifted
immediately — different eyebrow treatments, different heading sizes, some with
a lede and some without. The owner's read was that the site had "no personality,
just a base", and inconsistency was a large part of why.

**Ruling:** one `PageHeader` component, forge tone, used by every route except
the homepage (which has the hero instead).

**Reasoning:** the forge/daylight split (DD-26) only reads as intentional if it
happens in the same place every time. A visitor who lands on `/pricing` from
search and then clicks to `/work` should feel the same rhythm — dark opener,
light body — rather than two pages that happen to share a palette.

**Binding:** do not write a bespoke opener for a new page. If `PageHeader` will
not carry a case, extend it — a second opener component is how this drifts
again.

---

## Kit install — ported decisions

*DD-28 … DD-37 are the novafaber-kit's ten Director Decisions, renumbered to
continue this log (kit DD-1…DD-10). Internal cross-references have been
updated to the new numbers. DD-38 … DD-40 arose during the install itself.*

### DD-28 — Grounds bottom out at `#08080A`; `#000000` is never used
Pure black gives the ember bloom nothing to fall on. `#0B0B0C` reads as black
on every display while still accepting a gradient.

### DD-29 — `--rule-strong` is decorative only
Measures **1.83:1** on `--bg-base`, below the 3:1 non-text requirement. Focus
rings, input borders and selected states use `--ember` (**7.54:1**). Enforced
by `scripts/check-contrast.mjs`, which records the 1.83 figure as a `none`
pairing rather than pretending the token is usable for meaning.

### DD-30 — Button labels on ember fills are `#0B0B0C`
**7.54:1.** White-on-ember is **2.61:1** and forbidden — kept in the gate as a
regression guard that must continue to *fail*. Verified: the gate reports
`white/ember (must fail) 2.61:1` and would error if that pair ever passed.

### DD-31 — Type stack: Sofia Sans Condensed / Source Serif 4 / JetBrains Mono
Chosen for simultaneous Latin + Greek + Cyrillic coverage. Space Grotesk,
Archivo and Satoshi are disqualified. Any substitution requires re-verifying
all three scripts.

**Note:** this repo reached the identical stack independently in DD-13, for the
same reason. The kit and the existing build agree; nothing changed.

### DD-32 — The engraved grid is masked to the ember bloom
Not applied flat across the page. A flat grid is the generic dark-site look;
local emergence under the cursor is the signature.

### DD-33 — `--ember` verified at 7.54:1 on `--bg-base`
By hand in DESIGN_SPEC §4 and independently by
`scripts/check-contrast.mjs`, which now reproduces the same figure from the
shipped stylesheet. An earlier research figure of 4.9:1 was miscalculated and
is superseded.

### DD-34 — Motion architecture: one scalar `heat ∈ [0,1]`
Derived from idle level + scroll velocity, smoothed at 0.05/frame, written to
`--heat` on `:root`. All ember effects read it, so they rise and fall in
agreement instead of being six unrelated animations.

### DD-35 — Continuous motion values never enter the React render path
Pointer and scroll fire at 60–120Hz; routing them through `useState` or a
subscribing selector re-renders the tree every frame and destroys INP. React
may subscribe only to discrete state (`qualityTier`, `reducedMotion`,
`idleLevel`, `cursorVariant`, `webglEnabled`).

### DD-36 — Per-surface motion budgets enforced at runtime
`spectacle` / `reading` / `chrome`, via `assertAllowed()`. Throws in dev,
no-ops in prod. Adding an effect to a surface requires removing one.

### DD-37 — `three` loads only through `dynamic(ssr:false)`
Hero text is the LCP element. `dpr` capped at 1.75.

---

*DD-38 … DD-40 arose during the install.*

### DD-38 — The site is dark throughout. DD-26 is reversed.

**Owner ruling during kit install:** the kit wins; the whole site goes dark.

**What this reverses.** DD-26 established a two-surface split — spectacle
surfaces always dark, reading surfaces following the viewer's theme (light by
default) — on the reasoning that *the smith works in the dark and the finished
piece is shown in daylight*. That rationale is now retired. The kit's
`tokens.css` sets `body { background: var(--color-base) }` with no light path,
and adapting it to preserve DD-26 would have meant rewriting the kit's core
premise rather than installing it.

**What survives from DD-26.** The forge/daylight metaphor is gone, but the
constraint it protected is not: prose still has to be readable. That is now
carried by the contrast gate (25 pairings, all text pairings ≥ 4.5:1 measured
on the actual dark grounds) rather than by putting body copy on a light
surface.

**Binding:** there is no light theme. Do not reintroduce `prefers-color-scheme`
branches for the page ground. The only remaining theme-like variation is
`--heat`, which is a motion value, not a palette switch.

### DD-39 — Old token names survive as aliases, not as a second palette

**Context:** roughly twenty shipped components are written against the earlier
vocabulary (`bg-ground`, `text-ink`, `text-forge-ink`, `text-heat-ember`, …).
The kit uses `--color-base`, `--color-text-primary`, `--color-ember`.

**Ruling:** the kit names are canonical; the old names are declared in the same
`@theme` block as aliases pointing at identical values.

**Reasoning:** a hand sweep of ~20 files converting every `className` would be
a large diff with real regression risk and no visual payoff, and it would have
to happen before anything could be verified. Aliasing makes the migration a
single file, and the components keep working unchanged.

Because the site is now dark throughout, the two former sets — light surface
tokens and forge tokens — collapse onto one ramp. They are no longer two
palettes; they are two names for one.

**Binding:** new code uses the kit names. `scripts/check-contrast.mjs` asserts
every alias equals its canonical token, so an alias cannot silently drift and
leave twenty components pointing at a colour nobody measured. 17 aliases
checked, 0 drifted.

### DD-40 — `IgniteText` builds its element with `createElement`

The kit shipped `const Tag = as as React.ElementType`, which widens to a union
TypeScript cannot narrow across a JSX call. Every prop on the tag then resolves
to `never`, and `ref`, `className` and `children` all fail to compile — 3 of
the 10 TS errors on first install came from this file.

`h1`/`h2`/`h3`/`p` accept identical attributes, so constructing the element
directly is both correct and simpler than reconciling the union.

---

## Kit install — ported open questions

*OQ-9 … OQ-17 are the kit's nine, renumbered to continue from this log's
existing OQ-8.*

**Three were duplicates and have been struck.** The kit restated three
questions this log already carried. The originals survive with their own
numbers and have absorbed whatever extra detail the kit's wording added; the
kit's numbers are retired rather than reused, so a future reference to OQ-11
resolves to a tombstone instead of silently pointing at an unrelated question.

- **OQ-9** Hero: CSS ember bloom alone, or bloom + R3F forge orb? Build
  bloom-only first, measure LCP and bundle delta, then decide with numbers.
- **OQ-10** Custom cursor: desktop only, or drop entirely? Beautiful at 1440px
  and a liability everywhere else.
- ~~**OQ-11** Testimonials~~ — **struck. See OQ-5.** Its two additions
  (*written* permission, and a two-quote minimum before the section renders)
  are folded into the outstanding-content list above.
- **OQ-12** Founder photo for `/studio` and the homepage trust slot.
- **OQ-13** Client logos for the "live in production" strip.
- **OQ-14** Case-study metrics: no analytics access to A25 or Dresscode.
  Until a client supplies numbers in writing, case studies stay problem-led.
- ~~**OQ-15** Booking tool~~ — **struck. See OQ-7.** Its Cal.com
  self-hosting/themeability argument is folded into that entry.
- **OQ-16** Greek legal entity details (ΑΦΜ / ΓΕΜΗ) for the footer, needed once
  trading formally. Do not imply a North Macedonian office (see DD-19).
- ~~**OQ-17** Configurator market modifier~~ — **struck. See OQ-8.** Added no
  detail OQ-8 did not already carry.

**Live open questions after the merge:** OQ-7, OQ-8, OQ-9, OQ-10, OQ-12,
OQ-13, OQ-14, OQ-16. Eight, not eleven. OQ-1…OQ-6 were resolved into
DD-1…DD-6 during the earlier phases.
