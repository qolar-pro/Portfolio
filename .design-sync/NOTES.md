# design-sync notes — NovaFaber

## How this repo differs from a normal design system
- It is a Next.js **app**, not a published component library: `private: true`,
  no `main`/`exports`, no `dist/`. The converter's default (`node_modules/<pkg>`)
  crashes with ENOENT. Always pass `--entry .design-sync/entry.tsx`; with an
  entry the package dir resolves by walking up to the named `package.json`.
- `--entry` is also the **bundle entry**. Pointing it at one component file
  produced a one-component bundle (`[BUNDLE_EXPORT]` on the rest).
  `entry.tsx` re-exports all five.
- No `.d.ts` tree, so discovery returns `[ZERO_MATCH]`; components are pinned
  in `componentSrcMap`.
- Only 5 of 28 components are synced. The other 23 import `next/link`,
  `next/navigation` or take the whole `SiteContent` object — page sections, not
  reusable parts. Adding one means a provider for SiteContent and next/* shims.

## Styles and fonts
- `cssEntry` is `.design-sync/.cache/ds-styles.css`, **generated** by
  `node .design-sync/build-styles.mjs` from `app/globals.css`. Run it before
  every build or the bundle ships stale CSS.
- The app's fonts come from `next/font` at runtime; the composed stylesheet
  adds a Google Fonts @import and defines `--font-display/body/mono`.
  `tokensGlob` cannot do this — `copyTokens` ignores it without `tokensPkg`.
- Do NOT move the Google Fonts @import into `app/globals.css`: production
  self-hosts through next/font and would double-load.

## Previews
- `HeroTitle`'s styles are all scoped to `.hero h1`; its preview wraps the real
  hero markup. Without it the card rendered as small black italic text.
- `HeroTitle` lines past ~14 characters break mid-word (vw clamp).
- `HeroTitle`, `Marquee`, `Accordion` use `cardMode: column` — clipped in a 3-up grid.

## Build
    node .design-sync/build-styles.mjs
    node .ds-sync/resync.mjs --config .design-sync/config.json \
      --node-modules ./node_modules --entry .design-sync/entry.tsx --out ./ds-bundle

## Re-sync risks
- `ds-styles.css` is derived from `globals.css`; forgetting build-styles ships
  old CSS with no warning.
- Preview content (service names, FAQ answers, prices) is inlined, not read
  from `lib/content.ts` — it goes stale when the site copy changes.
- Font loading assumes fonts.googleapis.com is reachable from Claude Design.
- The `.hero` wrapper in the HeroTitle preview mirrors `app/[lang]/page.tsx`;
  a change to that markup silently breaks the card.
