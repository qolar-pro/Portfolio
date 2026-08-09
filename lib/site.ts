/**
 * Single source for identity strings. SPEC §7 requires these live in exactly
 * one place — the old site scattered `blancographics.xyz` across layout,
 * sitemap, robots and three JSON-LD nodes, which is why the rebrand touches
 * so much. Every consumer imports from here.
 */

export const SITE_URL = 'https://novafaber.com';
export const SITE_NAME = 'NovaFaber';

/** Kept for JSON-LD `alternateName` so the rebrand stays machine-linkable (SPEC §7). */
export const LEGACY_NAME = 'Apex Solutions';

export const FOUNDER_NAME = 'Giannis Papadopoulos';

/**
 * PLACEHOLDER — SPEC §7 requires a novafaber.com address before launch.
 * Phase 9 replaces this. Do not ship the personal Gmail the old site used.
 */
export const CONTACT_EMAIL = 'hello@novafaber.com';
