# NovaFaber — Redesign Spec

> **Source of truth.** Every phase and every Director ruling traces back to a
> section here. If this file is silent or ambiguous on something an agent
> needs, that is an escalation to Open Questions in `PROGRESS.md` — not a guess.
>
> Research backing: `research/` artifact (published) + audit of `_current/`
> (clone of `github.com/qolar-pro/Portfolio` @ main, read 9 Aug 2026).

---

## 1. What this project is

Rebrand and rebuild **Apex Solutions** (`blancographics.xyz`, a single-page
cinematic portfolio) into **NovaFaber** (`novafaber.com`), a website
design-and-build studio site.

The shift is not cosmetic. The current site is architected to answer
*"who is this person?"*. The new site must answer *"what do I get, what does
it cost, and how do I start?"*

**Name meaning (binding on brand/voice work):** *faber* = Latin for smith /
craftsman / maker. *nova* = new; a star that suddenly brightens. The forge
metaphor — raw material heated, formed, cooled into structure — is the
brand's core image and supplies the process vocabulary (§6).

---

## 2. The two problems being solved

**S1 — Strategic.** Portfolio framing throughout: no pricing, no packages,
no process, no testimonials, no booking, no client logos. Nothing on the
site lets a visitor buy.

**S2 — Experiential (the owner's stated complaint).** "Too cramped, too many
things, hard to navigate, bad for the eye to read." Diagnosed causes, all
verified in `_current/`:

| Cause | Location |
|---|---|
| Film grain, opacity 0.45, SCREEN blend, full-frame | `components/canvas/Effects.tsx:40` |
| Chromatic aberration swelling with scroll velocity (0.0012 → 0.0072) | `components/canvas/Effects.tsx:22-24` |
| Ghost numeral `clamp(6rem,18vw,15rem)` drifting behind every H2 | `components/sections/SectionShell.tsx:64-70` |
| Vignette 0.78 darkness pulling centre while layout runs to edges | `components/canvas/Effects.tsx:41` |
| Body text styled as label: 11px, 0.35em tracking, low-contrast `text-mist` | `SectionShell.tsx:74-76`, `app/globals.css` |
| No measure cap — paragraphs run the full 1500px container | `SectionShell.tsx:61` |
| Six sections + 2 modals + 4 projects all on one page | `app/page.tsx` → `<Site />` |
| Simultaneous motion: cursor, magnetic, tilt, velocity-skew, marquee, particles, camera | `components/` |

S2 is not fixed by more spacing (`py-[16vh]` is already generous). It is
fixed by **reducing layer count** and **splitting the page**.

---

## 3. Binding design constraints

These are hard rules. Violating one is a defect, not a style preference.

1. **One focal point per viewport.** If the 3D is active, text is quiet. If
   text is active, the 3D holds still.
2. **Measure capped at 65–75 characters** for all body copy.
3. **Body copy ≥ 16px**, near-normal tracking, contrast ratio ≥ 4.5:1.
   `mist`/`fog`/`hollow`-tier colours are for background elements only.
4. **Post-processing is per-surface, not global.** Full grade on hero,
   case-study set pieces, and `/lab`. On any text-bearing section: grain
   ≤ 0.15, no chromatic aberration.
5. **No decorative element behind running text.** The ghost numeral is
   retired or moved clear of the type.
6. **Every page has one job.** If a page needs two, it is two pages.
7. **Performance budget:** see §7. This site sells speed; the budget is a
   guard, not an aspiration.

---

## 4. Positioning

Price at roughly **2–3× the local template market, well under UK agency
rates.** Do not compete on price with €350 WordPress shops — the
differentiator is custom build, performance, and real-time 3D, which they
cannot deliver.

Market reference points (researched Aug 2026):

| Deliverable | Greece | N. Macedonia |
|---|---|---|
| Landing page | €300–600 | from €150 |
| Corporate 5–10 pp. | €500–2,000 | €350–1,500 |
| Corporate 10–20 pp. | €2,000–4,000 | — |
| Corporate 20+ pp. | €4,000–8,000+ | — |
| E-shop ≤100 SKU | €1,500–3,500 | €500–2,500 |
| E-shop 100–1,000 SKU | €3,500–8,000 | — |
| Large / custom | €8,000–25,000+ | — |

Recurring conventions (GR): domain €10–30/yr · hosting €50–500+/yr ·
maintenance €50–300/mo · SSL free–€200/yr.
Common add-ons: 2nd language +€140 · custom design +€600 · booking +€600 ·
SEO +€1,200.

UK/US productized comparison: $149–549/mo entry, $5,995–12,000/mo premium.
DesignJoy charges $5,995/mo as a **one-person operation** — scale is not
what justifies premium pricing; positioning is.

**Differentiator to exploit:** on-page SEO and performance are sold locally
as a +€1,200 add-on. A Next.js build gives them structurally. Bundle them as
*included*.

---

## 5. Page architecture

Single-page → multi-page. This serves both S1 (SEO surface per service and
per language) and S2 (each page carries one job).

```
/                        homepage — showcase + commercial spine
/services/websites       corporate builds
/services/ecommerce      e-shops
/services/redesign       "my site is old and slow" — warmest lead type
/services/custom         platforms, tooling, real-time 3D
/pricing                 how pricing works + configurator (NO price list — DD-1)
/work                    case study index
/work/a25                flagship case study
/work/dresscode          e-commerce case study
/process                 the nine stages (see §6)
/studio                  who NovaFaber is; founder named, with a face
/lab                     experiments, game engine, WebGL demos
/contact                 booking calendar
/el/*  /mk/*             full localized trees + hreflang
```

**Homepage section order** (fixed):
hero (with price anchor + dual CTA) → client logos / "live in production" →
proof strip → services bento → flagship case study → process (4 steps) →
pricing packages → testimonials → configurator → contact.

---

## 6. Process vocabulary

Client-facing = **four** steps (productized convention). `/process` carries
all **nine** Greek-market stages as the detail layer.

| Client-facing | Covers | Deliverable |
|---|---|---|
| **Forge** / Σχέδιο | Needs analysis & strategy · Architecture & sitemap | Goals, audience, feature list, signed-off sitemap |
| **Cast** / Μορφή | UI/UX design — wireframes & mockups | Visual identity and screens, before code |
| **Temper** / Κατασκευή | Front-end · Back-end & CMS · Content integration | Working site with real content |
| **Finish** / Παράδοση | On-page SEO · Testing & QA · Launch & monitoring | Live, measured, tested, analytics running |

---

## 7. Technical constraints

**Stack:** Next.js 15 App Router, TypeScript, Tailwind 4, R3F + drei, GSAP +
ScrollTrigger, Lenis. Carried over from `_current/` — this is a re-architecture,
not a stack change.

**Performance budget (hard):**
- Homepage LCP ≤ 2.0s on 4G / mid-tier mobile.
- **No GLB assets at all** (DD-3). All 3D is procedural geometry and shaders
  authored in code. Baseline to beat: the old build shipped 1,872,788 bytes of
  GLB with 546,960 on the eager path.
- Nothing below the hero loads 3D eagerly.
- `lib/quality.tsx` tiering (`high`/`low`/`static`) is carried over and the
  `static` no-WebGL path must remain genuinely usable, not degraded.
- Service, pricing, and process pages ship **no WebGL at all**.

**Rationale (do not soften without a new ruling):** 2.4s load → 1.9%
conversion; 5.7s → 0.6%. 100ms delay → −7% conversion.

**Identity migration — all of these move together:**
- `SITE_URL` in `app/layout.tsx` (currently pins `https://blancographics.xyz`;
  feeds `metadataBase`, canonicals, OG, sitemap, JSON-LD).
- `package.json` name (currently `apex-solutions`).
- JSON-LD: currently `Person`-first. Must become `Organization` /
  `ProfessionalService`-first, with `areaServed`, `availableLanguage`, and
  per-service `Service` nodes. Keep `alternateName: "Apex Solutions"`.
- 301 from `blancographics.xyz` → `novafaber.com`. **Note:** the old domain
  refused connection on 9 Aug 2026 — confirm it still resolves before
  cancelling anything.
- Contact address: replace the personal Gmail with a `novafaber.com` address.
- `SOCIALS`: personal Instagram/TikTok undercut studio framing — rebrand or
  omit.

**Languages:** EN + EL + MK active. Drop DE/FR/IT (currently stubs aliasing
EN). MK is not optional — A25 is a North Macedonian client and a live
referral network.

---

## 8. Content decisions

| Asset | Call | Note |
|---|---|---|
| A25 — The Agency | **Keep** | Flagship. Own page. Live production, 5 languages, Telegram-backed chat. |
| Dresscode | **Keep** | E-commerce proof. Own page. |
| Apex Shift | **Recast** | Rename (dead brand in title). Reframe as custom internal tooling. |
| Surviving of Souls | **Recast** | Move to `/lab`. Off-message on a business page; valuable as custom-engine proof. |
| Experience / "The road to Apex" | **Scrap** | CV timeline is portfolio thinking. Replaced by §6 process. |
| Hero copy + founder name | **Recast** | NovaFaber leads; Giannis Papadopoulos appears as named founder — proof, not headline. |
| Services (5 items) | **Keep** | Copy is good. Needs from-prices + bento layout. |
| Stack / "Instruments" | **Recast** | Demote below fold; reframe each group as outcome, not logo list. |
| BrandKit modal | **Keep** | Seed for the live brand configurator. |
| Preview modal | **Keep** | Promote to first-class on case study pages. |
| DE / FR / IT locales | **Scrap** | Stubs aliasing EN. |

**Known content gap:** zero testimonials exist anywhere. This is the largest
trust deficit in the build and is blocked on the owner, not on code.

---

## 9. Interactive feature set

**Tier 1 — ship first**
1. Quote configurator → live price range + timeline. Highest-yield lead tool.
2. Booking calendar replacing the `mailto:` CTA.
3. Telegram live chat — already built for A25; port it.
4. Before/after scrubber with load-time numbers on each side.
5. Live site preview — `Preview.tsx` exists; promote it.

**Tier 2 — differentiators**
6. Live brand configurator (palette / type / density → demo rebuilds live).
   `BrandKit.tsx` is the seed.
7. Performance scoreboard — live Core Web Vitals vs a typical local
   WordPress build.
8. Forge hero — material becoming structure; reuses the existing camera rig.

**Tier 3 — polish**
9. Kinetic variable type on scroll velocity. `ClashDisplay-Variable` and
   `GeneralSans-Variable` already ship; `VelocitySkew.tsx` already tracks
   velocity. Near-free.
10. Bento services grid.
11. Scroll-scrubbed 4-step process.
12. Wall of Love testimonials — blocked on content.

---

## 10. Strategic decisions — all resolved

Ruled by the owner 9 Aug 2026. Full reasoning and binding notes in
`PROGRESS.md` → Director Decisions.

| # | Decision | Ruling |
|---|---|---|
| DD-1 | Pricing model | **Per quote.** No published price list, no tier grid, no "from €X" badges. `/pricing` explains *how* pricing works and routes to a quote. Configurator returns an indicative range + scoped brief. |
| DD-2 | Markets | **GR, MK, EN — all first-class.** Copy written per market, not translated. |
| DD-3 | 3D assets | **All six GLBs scrapped.** Replaced by procedural geometry authored in code. One excellent hero + a few supporting moments. |
| DD-4 | Founder | **Founder-forward.** Named and shown; NovaFaber stays the headline. Photo required. |
| DD-5 | Testimonials | **Three available.** Design the block for three, each substantial. Real attribution mandatory. |
| DD-6 | Repo | **Fresh.** Sets the default for the whole build: write new unless a phase says port. |

Still needed from the owner (not blocking): the three testimonial texts with
attribution, client logos, a founder photo, case-study metrics, and a
typography ruling (see §11).

## 11. Typography — new pairing (DD-12)

The old faces **are** available: `ClashDisplay-Variable.woff2` (29 KB),
`GeneralSans-Variable.woff2` (38 KB) and two JetBrains Mono weights ship in
the repository at `app/fonts/`, and remain in git history after the Phase 0
cut. Re-adopting them is a copy, not a re-licensing exercise.

The owner nonetheless ruled for a **new pairing**. The supporting reason is
S2, not availability: Clash Display is a display face, and the old site used
it at sizes where it contributed to the density problem in §2.

Phase 1 must not hard-code a family. Families bind through `--font-display` /
`--font-body` / `--font-mono` only, so the pairing stays a one-file change
while it is being judged. Selection order is deliberate: the body face is
chosen for reading at 16–18px first and for character second.
