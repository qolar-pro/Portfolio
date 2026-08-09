import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { LOCALES, isLocale } from '@/lib/locales';
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
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
