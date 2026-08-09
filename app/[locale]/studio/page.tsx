import type { Metadata } from 'next';
import PageStub from '@/components/PageStub';
import { isLocale } from '@/lib/locales';
import { localeAlternates } from '@/lib/metadata';

const PATH = "studio";
const TITLE = "Studio";
const NOTE = "Who NovaFaber is. The founder is named and shown here (DD-4).";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return { title: TITLE, alternates: localeAlternates(PATH, locale) };
}

export default function Page() {
  return <PageStub title={TITLE} note={NOTE} />;
}
