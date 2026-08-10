import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkIndex from '@/components/WorkIndex';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/content';

const PATH = "work";
const KEY = "work";

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
  return (
    <WorkIndex
      locale={locale}
      surface="work"
      title={"Built, shipped, running."}
      lede={"Three projects. One in production for a client, two built to find out how far a thing could be pushed. No invented metrics — what follows is what was made and why."}
    />
  );
}
