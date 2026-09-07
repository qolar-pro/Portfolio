/**
 * Single source for identity strings. SPEC §7 requires these live in exactly
 * one place — the old site scattered `blancographics.xyz` across layout,
 * sitemap, robots and three JSON-LD nodes, which is why the rebrand touches
 * so much. Every consumer imports from here.
 */

/**
 * The canonical origin. This MUST be the host that actually answers 200.
 *
 * Production serves www and 308s the apex to it:
 *   https://novafaber.com/en -> 308 -> https://www.novafaber.com/en -> 200
 *
 * The apex was hard-coded here while www was the live host, so every canonical,
 * hreflang, x-default, og:url and sitemap entry pointed at a permanent
 * redirect. A canonical that redirects is a canonical search engines discard,
 * and a sitemap of redirects is a sitemap of URLs that cannot be indexed.
 *
 * If the site ever moves to the apex, flip this one line AND flip the
 * redirect at the host so the two never disagree again.
 */
export const SITE_URL = 'https://www.novafaber.com';
export const SITE_NAME = 'NovaFaber';

/** Kept for JSON-LD `alternateName` so the rebrand stays machine-linkable (SPEC §7). */
export const LEGACY_NAME = 'Apex Solutions';

export const FOUNDER_NAME = 'Giannis Papadopoulos';

/**
 * PLACEHOLDER — SPEC §7 requires a novafaber.com address before launch.
 * Phase 9 replaces this. Do not ship the personal Gmail the old site used.
 */
export const CONTACT_EMAIL = 'hello@novafaber.com';
