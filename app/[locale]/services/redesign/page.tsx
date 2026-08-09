import type { Metadata } from 'next';
import PageStub from '@/components/PageStub';
import { isLocale } from '@/lib/locales';
import { localeAlternates } from '@/lib/metadata';

const PATH = "services/redesign";
const TITLE = "Redesign";
const NOTE = "For sites that are old and slow. The warmest lead type, and where a before/after comparison sells on sight.";

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
