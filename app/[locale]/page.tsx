import type { Metadata } from 'next';
import PageStub from '@/components/PageStub';
import { isLocale } from '@/lib/locales';
import { localeAlternates } from '@/lib/metadata';
import { SITE_NAME } from '@/lib/site';

const PATH = '';
const NOTE =
  'The showcase. Hero with a price anchor, client logos, proof strip, services bento, flagship case study, process, testimonials, configurator, contact — in that order (SPEC §5).';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  // Absolute: the home page is the brand, not "Home · NovaFaber".
  return { title: { absolute: SITE_NAME }, alternates: localeAlternates(PATH, locale) };
}

export default function Page() {
  return <PageStub title={SITE_NAME} note={NOTE} />;
}
