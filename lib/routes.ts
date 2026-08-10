import type { Locale } from './locales';

/**
 * The route tree from SPEC §5, declared once.
 *
 * DD-7 forced multiple pages over the old single-scroll site, for navigation
 * and for search. Both of those consumers — the header nav and the sitemap —
 * read from this list, so a route cannot exist without being reachable and
 * cannot be reachable without being indexed. Adding a page means adding it
 * here.
 */

export type RouteGroup = 'services' | 'work';

export interface RouteDef {
  /** Path segment(s) after the locale prefix. Empty string is the home page. */
  path: string;
  /** Stable key for i18n lookup and nav labelling. */
  key: string;
  /** Provisional label until Phase 2 supplies real copy per locale. */
  placeholderLabel: string;
  group?: RouteGroup;
  /** Whether this appears as a top-level item in the header. */
  inNav: boolean;
}

export const ROUTES: RouteDef[] = [
  { path: '', key: 'home', placeholderLabel: 'Home', inNav: false },

  { path: 'services/websites', key: 'services.websites', placeholderLabel: 'Websites', group: 'services', inNav: true },
  { path: 'services/ecommerce', key: 'services.ecommerce', placeholderLabel: 'E-commerce', group: 'services', inNav: true },
  { path: 'services/redesign', key: 'services.redesign', placeholderLabel: 'Redesign', group: 'services', inNav: true },
  { path: 'services/custom', key: 'services.custom', placeholderLabel: 'Custom builds', group: 'services', inNav: true },

  { path: 'pricing', key: 'pricing', placeholderLabel: 'Pricing', inNav: true },

  { path: 'work', key: 'work', placeholderLabel: 'Work', inNav: true },
  { path: 'work/a25', key: 'work.a25', placeholderLabel: 'A25 — The Agency', group: 'work', inNav: false },
  { path: 'work/dresscode', key: 'work.dresscode', placeholderLabel: 'Dresscode', group: 'work', inNav: false },
  { path: 'work/nova-shift', key: 'work.nova-shift', placeholderLabel: 'Nova Shift', group: 'work', inNav: false },
  { path: 'lab/surviving-of-souls', key: 'lab.surviving-of-souls', placeholderLabel: 'Surviving of Souls', inNav: false },

  { path: 'process', key: 'process', placeholderLabel: 'Process', inNav: true },
  { path: 'studio', key: 'studio', placeholderLabel: 'Studio', inNav: true },
  { path: 'lab', key: 'lab', placeholderLabel: 'Lab', inNav: true },
  { path: 'contact', key: 'contact', placeholderLabel: 'Contact', inNav: true },
];

/** Absolute in-app href for a route in a given locale. */
export function href(locale: Locale, path: string): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}

export function routeByPath(path: string): RouteDef | undefined {
  return ROUTES.find((r) => r.path === path);
}
