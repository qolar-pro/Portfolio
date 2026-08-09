import { NextResponse, type NextRequest } from 'next/server';
import { LOCALES, ROOT_REDIRECT_LOCALE } from '@/lib/locales';

/**
 * DD-2 makes every locale URL-prefixed, including English, so bare `/` and any
 * unprefixed path have no tree of their own. This sends them to a locale.
 *
 * Phase 9 may upgrade the bare-root case to negotiate on Accept-Language.
 * Deliberately not doing that yet: a deterministic redirect keeps the sitemap
 * and the 301 map from the old domain simple to reason about.
 */

const PUBLIC_FILE = /\.[^/]+$/;

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

  const url = request.nextUrl.clone();
  url.pathname = `/${ROOT_REDIRECT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
