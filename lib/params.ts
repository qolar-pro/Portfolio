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
  return { lang: lang as Lang, c: publicContent(content[lang as Lang]) };
}

/**
 * The content every route is allowed to hand to the browser.
 *
 * ── WHY THE FILTER IS HERE AND NOT IN THE COMPONENTS ──────────────────
 * `c` is passed whole into client components, so React serialises all of it
 * into the RSC payload — including projects no component renders. Filtering
 * inside each component hides a project from the screen while leaving its
 * title, description and live URL one Ctrl+F away in view-source. lib/projects
 * already documents that trap for the embargoed client, which is why its
 * `liveUrl` is blank rather than merely unrendered.
 *
 * A project marked `hidden` is off the site, and off the site has to mean out
 * of the payload too. Doing it once, at the boundary every route already goes
 * through, is also the only version that cannot be forgotten by the next
 * component that takes `c` as a prop.
 *
 * The per-component filters stay as they are: they are cheap, and they keep
 * each component correct on its own terms rather than depending on this.
 */
const cache = new WeakMap<SiteContent, SiteContent>();

export function publicContent(c: SiteContent): SiteContent {
  const hit = cache.get(c);
  if (hit) return hit;

  const projects = c.work.projects.filter((p) => !p.hidden);
  const shown = new Set(projects.map((p) => p.slug));

  /* Draft quotes were written in this repo, not said by the client, and the
     Testimonials card marks each one with a loud DRAFT badge for exactly that
     reason. The badge only protects what is rendered: the payload carries the
     text with no badge attached, so an unapproved quote naming a real firm is
     readable in view-source on a page that does not display it.
     Production therefore never ships one. Locally they stay, because previewing
     a draft before chasing the real quote is the workflow the badge exists for. */
  const items = c.testimonials.items
    .filter((t) => shown.has(t.slug))
    .filter((t) => t.approved || process.env.NODE_ENV !== 'production');

  const clean: SiteContent = {
    ...c,
    work: { ...c.work, projects },
    testimonials: { ...c.testimonials, items },
  };
  cache.set(c, clean);
  return clean;
}
