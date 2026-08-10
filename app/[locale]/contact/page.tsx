import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContactPage from '@/components/ContactPage';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/content';

const PATH = 'contact';
const KEY = 'contact';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(KEY, PATH, locale);
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const sp = await searchParams;
  return <ContactPage locale={locale} searchParams={sp} />;
}
