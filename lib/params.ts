import { notFound } from 'next/navigation';
import { LANGS, content, type Lang, type SiteContent } from '@/lib/content';

/**
 * Every route resolves its locale the same way: validate, or 404. Keeps the
 * cast to Lang in exactly one place.
 */
export async function resolveLang(
  params: Promise<{ lang: string }>,
): Promise<{ lang: Lang; c: SiteContent }> {
  const { lang } = await params;
  if (!(LANGS as string[]).includes(lang)) notFound();
  return { lang: lang as Lang, c: content[lang as Lang] };
}
