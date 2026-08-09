import Link from 'next/link';
import { ROUTES, href } from '@/lib/routes';
import { LOCALES, localeShortNames, type Locale } from '@/lib/locales';
import { SITE_NAME } from '@/lib/site';

/**
 * A persistent, always-visible header.
 *
 * DD-7: the old site's only wayfinding was an overlay "Index" that scrolled
 * within one page. Primary destinations are readable at rest here — no
 * hover-to-reveal, no overlay to open first.
 *
 * Phase 1 owns the visual treatment and the motion budget. Phase 2 replaces
 * placeholder labels with real per-locale copy.
 */
export default function SiteHeader({ locale }: { locale: Locale }) {
  const primary = ROUTES.filter((r) => r.inNav);

  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        <Link href={href(locale, '')} className="font-display text-lg font-semibold tracking-tight">
          {SITE_NAME}
        </Link>

        <nav aria-label="Primary" className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {primary.map((route) => (
            <Link
              key={route.path}
              href={href(locale, route.path)}
              className="text-sm text-ink-soft hover:text-ink"
            >
              {route.placeholderLabel}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2" aria-label="Language">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={href(l, '')}
              hrefLang={l}
              aria-current={l === locale ? 'true' : undefined}
              className={
                l === locale
                  ? 'font-mono text-xs text-ink'
                  : 'font-mono text-xs text-muted hover:text-ink'
              }
            >
              {localeShortNames[l]}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
