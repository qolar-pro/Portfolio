import Link from 'next/link';
import { ROUTES, href } from '@/lib/routes';
import { SITE_NAME } from '@/lib/site';
import type { Locale } from '@/lib/locales';
import { contentFor } from '@/lib/content';

/**
 * Phase 0 footer: the full route list, so every page is reachable from every
 * page even before the header's information architecture is designed.
 *
 * Contact details and socials land in Phase 6 — the old site's personal Gmail
 * and personal Instagram/TikTok are deliberately not carried over (SPEC §7).
 */
export default function SiteFooter({ locale }: { locale: Locale }) {
  const chrome = contentFor(locale).chrome;
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {/* Top-level destinations only. Listing every route put individual
              case studies and lab entries in the footer of every page — which
              both cluttered it and leaked a lab entry onto /work (DD-4 keeps
              those apart). Children are reached from their index page. */}
          {ROUTES.filter((r) => r.inNav).map((route) => (
            <Link
              key={route.path}
              href={href(locale, route.path)}
              className="text-sm text-muted hover:text-ink"
            >
              {chrome.navLabels[route.key] ?? route.placeholderLabel}
            </Link>
          ))}
        </nav>
        <p className="mt-8 font-mono text-2xs tracking-[0.06em] text-muted">
          {SITE_NAME} — {chrome.footerNote}
        </p>
      </div>
    </footer>
  );
}
