# NovaFaber — neobrutalism, Electric palette

A one-person studio's site system. Styling is **plain CSS classes plus custom
properties** — there are no utility classes, no Tailwind, no styled-props. You
write semantic class names from the list below and reach for `var(--token)`
when you need a value.

## Setup

Nothing to wrap for most components — `styles.css` defines everything on
`:root`. Two things do matter:

- **Theme.** Light is the default. For dark, set `data-theme="dark"` on the
  root element; `data-theme="light"` forces light. Every token re-declares
  itself under both, so never hardcode a hex you could take from a token.
- **`HeroTitle` needs its ancestor.** All of its styling is scoped to
  `.hero h1` — size, uppercase, the accent on the second line. Placed without
  it, it renders as small black italic body text. Always:
  `<section class="hero"><div class="shell"><div class="hero-copy">`.

## The look, in three numbers

Everything discrete is the same box: **2px solid black rule, 5px radius, one
4px 4px 0 black offset**. No blur, no gradient, no tint — fills are full
strength or they are not there. Use the tokens, never the literals:
`--nb-bw` (2px), `--nb-r` (5px), `--nb-border` (#000), `--nb-shadow`,
`--nb-shadow-lg` (6px, for the largest panels only).

Pressing moves an element *into* its shadow: shadow to `none`, plus
`transform: translate(4px, 4px)`. That is the affordance — use it on anything
clickable you build.

## Tokens

| Role | Token |
|---|---|
| Accent fill | `--main` (#5600ff light, #a300ff dark), text on it `--main-fg` |
| Accent **text** | `--accent` — never `--main`; the fills are too dark to read at small sizes |
| Electric ramp | `--nb-violet` `--nb-indigo` `--nb-blue` `--nb-cyan` |
| Page ground | `--surface`; sunken `--surface-sunken`; cards `--panel`, `--panel-2` |
| Ink | `--text-primary` `--text-secondary` `--text-muted` |
| Rules | `--line` |
| Type | `--font-d` display (Sofia Sans Condensed), `--font-b` body (Sofia Sans), `--font-m` mono (JetBrains Mono) |

**The fill/text split is the one rule that bites.** Every Electric colour sits
between 32% and 55% lightness: excellent as a background, illegible as 12px
text. `--main` fills, `--accent` writes.

## Classes

`.shell` (max-width page gutter) · `.section` (vertical rhythm) ·
`.sec-head` + `.eyebrow` + `.h2` + `.lede` (a section's heading block) ·
`.btn` with `.btn-solid` or `.btn-ghost` · `.chip` (flat label, not a fill) ·
`.field` (form row) · `.when-chip` (toggle) · `.price-card` · `.marquee`

## Where the truth is

Read `styles.css` and its `@import` closure before styling anything — it is the
real stylesheet from the site, not a summary. Per-component API is in each
`<Name>.d.ts`; usage is in `<Name>.prompt.md`.

## Idiomatic

```jsx
<section className="section">
  <div className="shell">
    <div className="sec-head">
      <p className="eyebrow">Services</p>
      <h2 className="h2">Everything a modern studio should carry.</h2>
      <p className="lede">Design, engineering and the code that ships.</p>
    </div>
    <div style={{
      background: 'var(--panel)',
      border: 'var(--nb-bw) solid var(--nb-border)',
      borderRadius: 'var(--nb-r)',
      boxShadow: 'var(--nb-shadow)',
      padding: 24,
    }}>
      <p style={{ color: 'var(--accent)' }}>Accent text uses --accent.</p>
      <button className="btn btn-solid">Book a call</button>
    </div>
  </div>
</section>
```
