import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PricingPage from '@/components/PricingPage';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/content';

const PATH = 'pricing';
const KEY = 'pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(KEY, PATH, locale);
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PricingPage locale={locale} />;
}
