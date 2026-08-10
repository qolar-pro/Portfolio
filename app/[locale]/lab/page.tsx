import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import WorkIndex from '@/components/WorkIndex';
import { isLocale } from '@/lib/locales';
import { pageMetadata } from '@/lib/content';

const PATH = "lab";
const KEY = "lab";

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
      surface="lab"
      title={"Where the techniques come from."}
      lede={"Nobody commissions a game engine. This is here because it is the clearest evidence of what \"built from scratch\" actually means — pathfinding, collision, world generation and a render loop, all authored rather than imported."}
    />
  );
}
