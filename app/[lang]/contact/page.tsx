import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { Nav } from '@/components/Nav';
import { PageHero } from '@/components/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { SiteFooter } from '@/components/SiteFooter';
import { EMAIL, LOCATION, PHONE, ROUTES, STUDIO_SOCIALS } from '@/lib/content';
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
  const fc = c.footer.contact;

  return (
    <>
      <Nav lang={lang} c={c} />
      <main id="main">
        <PageHero c={c} route="contact" />

        {/* no CTA band on this route — the form is the call to action */}
        <section className="section contact">
          <div className="shell contact-grid">
            <Reveal>
              {/*
                Every channel the studio actually answers on, in one column.
                This used to be the email address and a social list, and the
                column ran out of content halfway down the form beside it —
                which reads as a page with nothing else to offer. The phone,
                the hours and the city are all real, all already translated,
                and all previously only visible in the footer.
              */}
              <div className="direct">
                <p className="meta-label">{c.contact.emailLabel}</p>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>

              <div className="direct">
                <p className="meta-label">{fc.phone.title}</p>
                <a href={`tel:${PHONE.tel}`}>{PHONE.display}</a>
                <p className="direct-note">{fc.phone.desc}</p>
              </div>

              <div className="direct">
                <p className="meta-label">{c.footer.socialsLabel}</p>
                <ul className="direct-list">
                  {STUDIO_SOCIALS.map((s) => (
                    <li key={s.label}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer">
                        {s.label} <span>{s.handle}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="direct-place">{fc.mapLabel}</p>
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
