import type { Metadata } from 'next';
import PageStub from '@/components/PageStub';
import { isLocale } from '@/lib/locales';
import { localeAlternates } from '@/lib/metadata';

const PATH = "lab";
const TITLE = "Lab";
const NOTE = "Experiments, WebGL sketches, and the custom game engine — capability proof, kept clear of the sales path.";

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
