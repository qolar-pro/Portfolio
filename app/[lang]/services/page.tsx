import type { Metadata } from 'next';
import { Accordion } from '@/components/Accordion';
import { CtaBand } from '@/components/CtaBand';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { CapabilityBrowser } from '@/components/CapabilityBrowser';
import { SiteFooter } from '@/components/SiteFooter';
import { ROUTES } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.services,
    title: c.routes.services.title,
    description: c.routes.services.lede,
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="services" />

        <section className="section">
          <div className="shell">
            <CapabilityBrowser c={c} lang={lang} headingLevel={2} />
          </div>
        </section>

        {/* the five ported studio capabilities live here rather than on the
            homepage — same copy as the old site, expanded */}
        <section className="section">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow" data-anim="fade">{c.services.label}</p>
              <h2 className="h2" data-anim="clip">{c.services.heading}</h2>
            </Reveal>
            <Reveal>
              <Accordion variant="services" items={c.services.items} />
            </Reveal>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <Reveal className="sec-head">
              <p className="eyebrow" data-anim="fade">{c.faq.label}</p>
              <h2 className="h2" data-anim="clip">{c.faq.heading}</h2>
              <p className="lede">{c.faq.lede}</p>
            </Reveal>
            <Reveal>
              <Accordion variant="faq" items={c.faq.items} />
            </Reveal>
          </div>
        </section>
      </main>
      <CtaBand c={c} lang={lang} />
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
