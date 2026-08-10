import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyPage from '@/components/CaseStudyPage';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/content';

const PATH = "lab/surviving-of-souls";
const KEY = "lab.surviving-of-souls";

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
  return <CaseStudyPage locale={locale} id="surviving-of-souls" />;
}
