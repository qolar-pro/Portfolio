import type { Metadata } from 'next';
import PageStub from '@/components/PageStub';
import { isLocale } from '@/lib/locales';
import { localeAlternates } from '@/lib/metadata';

const PATH = "contact";
const TITLE = "Contact";
const NOTE = "A booking calendar, not a mailto link.";

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
