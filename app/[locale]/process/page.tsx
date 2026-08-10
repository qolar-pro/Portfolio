import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProcessPage from '@/components/ProcessPage';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/content';

const PATH = 'process';
const KEY = 'process';

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
  return <ProcessPage locale={locale} />;
}
