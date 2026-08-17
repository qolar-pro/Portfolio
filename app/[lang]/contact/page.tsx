import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { SiteFooter } from '@/components/SiteFooter';
import { EMAIL, ROUTES, SOCIALS } from '@/lib/content';
import { resolveLang } from '@/lib/params';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang, c } = await resolveLang(params);
  return pageMetadata({
    lang,
    path: ROUTES.contact,
    title: c.routes.contact.title,
    description: c.routes.contact.lede,
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang, c } = await resolveLang(params);

  return (
    <>
      <Nav lang={lang} c={c} />
      <main>
        <PageHero c={c} route="contact" />

        {/* no CTA band on this route — the form is the call to action */}
        <section className="section contact">
          <div className="shell contact-grid">
            <Reveal>
              <div className="direct">
                <p className="meta-label">{c.contact.emailLabel}</p>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
              <div className="direct">
                <p className="meta-label">{c.footer.socialsLabel}</p>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: '1.05rem', marginTop: 8 }}
                  >
                    {s.label} <span style={{ color: 'var(--muted)' }}>{s.handle}</span>
                  </a>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ContactForm c={c} />
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter c={c} lang={lang} />
    </>
  );
}
