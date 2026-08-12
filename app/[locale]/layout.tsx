import type { Metadata, Viewport } from 'next';
import { Sofia_Sans_Condensed, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Reveal from '@/components/Reveal';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { LOCALES, isLocale, type Locale } from '@/lib/locales';
import { ROUTES, href } from '@/lib/routes';
import { contentFor } from '@/lib/content';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import '../globals.css';

/**
 * This is the root layout. Everything is locale-scoped (DD-2), so `<html lang>`
 * cannot be resolved above this level — which is why there is no app/layout.tsx
 * and why bare `/` is handled by middleware instead of a page.
 *
 * Phase 9 owns full metadata and the Organization-first JSON-LD graph
 * (SPEC §7). Titles and descriptions here are placeholders.
 */

/**
 * DD-12 — the pairing, and the constraint that chose it.
 *
 * EL and MK mean every face must carry Greek AND Cyrillic. That eliminates
 * most display typefaces outright (Archivo, the first choice, has neither).
 *
 * Sofia Sans Condensed is Bulgarian-designed, so Cyrillic is native rather
 * than an afterthought, and it carries Greek. Condensed is not a stylistic
 * preference: Greek and Macedonian headlines run materially longer than their
 * English equivalents, and a normal-width display face wraps badly on /el and
 * /mk at the same type sizes.
 *
 * Source Serif 4 is chosen for reading at 17px first and character second,
 * per SPEC §11. `display: 'swap'` everywhere — a blocking webfont on a site
 * whose pitch is speed would be self-defeating.
 */
const sofia = Sofia_Sans_Condensed({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['500', '600', '700'],
  variable: '--font-sofia',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  variable: '--font-source-serif',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'greek', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Nav label from content, falling back to the route registry's placeholder. */
function navLabel(locale: Locale, key: string): string {
  const route = ROUTES.find((r) => r.key === key);
  return contentFor(locale).chrome.navLabels[key] ?? route?.placeholderLabel ?? key;
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${sofia.variable} ${sourceSerif.variable} ${jetbrains.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader
          locale={locale}
          utility={contentFor(locale).chrome.footerNote}
          /**
           * Five items, not ten. The four service pages collapse under one
           * word, and Lab moves to the footer — it is capability proof, and it
           * was competing with Pricing for a slot in a sales nav.
           */
          items={[
            { key: 'work', href: href(locale, 'work'), label: navLabel(locale, 'work') },
            {
              key: 'services',
              href: href(locale, 'services/websites'),
              label: 'Services',
              children: [
                { href: href(locale, 'services/websites'), label: navLabel(locale, 'services.websites'), hint: 'A site your business is judged by' },
                { href: href(locale, 'services/ecommerce'), label: navLabel(locale, 'services.ecommerce'), hint: 'Storefront, orders and admin' },
                { href: href(locale, 'services/redesign'), label: navLabel(locale, 'services.redesign'), hint: 'For a site that has aged out' },
                { href: href(locale, 'services/custom'), label: navLabel(locale, 'services.custom'), hint: 'When nothing off the shelf fits' },
              ],
            },
            { key: 'process', href: href(locale, 'process'), label: navLabel(locale, 'process') },
            { key: 'pricing', href: href(locale, 'pricing'), label: navLabel(locale, 'pricing') },
            { key: 'studio', href: href(locale, 'studio'), label: navLabel(locale, 'studio') },
          ]}
          ctaLabel={contentFor(locale).chrome.ctaBook}
          ctaHref={href(locale, 'contact')}
        />
        <MotionProvider>
          <main id="main" className="flex-1">
            {children}
          </main>
        </MotionProvider>
        <SiteFooter locale={locale} />
        <Reveal />
        {/* Filmic grain. Fixed, pointer-transparent, z-9998 — decorative only,
            and above content in stacking order but never intercepting it. */}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
