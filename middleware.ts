import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, ROOT_REDIRECT_LOCALE } from '@/lib/locales';
import { ROUTES } from '@/lib/routes';

/**
 * DD-2 makes every locale URL-prefixed, including English, so bare `/` and any
 * unprefixed path have no tree of their own. This sends them to a locale.
 *
 * Phase 9 may upgrade the bare-root case to negotiate on Accept-Language.
 * Deliberately not doing that yet: a deterministic redirect keeps the sitemap
 * and the 301 map from the old domain simple to reason about.
 */

const PUBLIC_FILE = /\.[^/]+$/;

/** Unprefixed forms of the real routes, e.g. `services/websites`, `` for home. */
const KNOWN_PATHS = new Set(ROUTES.map((route) => route.path));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  /**
   * Only redirect paths that exist. Redirecting everything meant a stray URL
   * became a redirect *into* a 404 — `/nonsense` -> `/en/nonsense` -> 404 —
   * which is strictly worse than a 404 at the original URL: it costs a round
   * trip, it reports in Search Console as "Page with redirect" instead of the
   * "Not found" it actually is, and it makes a dead link look load-bearing.
   * An unknown path falls through and 404s where it was asked for.
   */
  const bare = pathname.replace(/^\/|\/$/g, '');
  if (!KNOWN_PATHS.has(bare)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${ROOT_REDIRECT_LOCALE}${bare ? `/${bare}` : ''}`;

  /**
   * 308, not the 307 default. The target is a fixed constant, not a
   * negotiated one, so the redirect is permanent by construction — and a
   * temporary redirect asks search engines to keep the source URL indexed and
   * to re-check it forever, splitting the signals of `/` from `/en`.
   * Revisit only if Phase 9 makes the root Accept-Language dependent, which
   * would make it genuinely temporary.
   */
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
