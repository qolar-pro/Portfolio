import Link from 'next/link';
import { Logo } from '@/components/Logo';
import {
  BRAND,
  EMAIL,
  FOUNDER,
  INSTAGRAM,
  LOCATION,
  PHONE,
  ROUTES,
  STUDIO_SOCIALS,
  type Lang,
  type SiteContent,
} from '@/lib/content';

/**
 * The footer opens with a "get in touch" block — three contact cards beside a
 * map — and closes with the index columns and the legal line.
 *
 * Every value here is real, so nothing carries a placeholder badge any more.
 * There is deliberately no street address: the map pins the city the studio
 * works out of, which is true, rather than an office that does not exist.
 */

const ICON = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function MailIcon() {
  return (
    <svg {...ICON} aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6.5 8.15 6a1.5 1.5 0 0 0 1.7 0l8.15-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg {...ICON} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...ICON} aria-hidden="true">
      <path d="M8.4 3.5H5.2A1.7 1.7 0 0 0 3.5 5.3c0 8.4 6.8 15.2 15.2 15.2a1.7 1.7 0 0 0 1.8-1.7v-3.2l-4-1.4-1.9 2.3a13.3 13.3 0 0 1-6.3-6.3l2.3-1.9Z" />
    </svg>
  );
}

/**
 * Google's `maps?q=…&output=embed` shortcut no longer frames: that URL answers
 * 301 and the redirect itself carries `X-Frame-Options: SAMEORIGIN`, so the
 * browser blocks it before it ever reaches the map and you get a black box.
 *
 * This is the address that redirect was pointing at — same map, served 200
 * with no framing restriction, and no API key. If it ever stops working, the
 * keyed replacement is the Maps Embed API:
 * https://www.google.com/maps/embed/v1/place?key=…&q=…
 */
function mapEmbedUrl(query: string) {
  const q = encodeURIComponent(query).replace(/%20/g, '+');
  return `https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1s${q}`;
}

/** One contact card: icon, what it is, why you would use it, then the value. */
function ContactCard({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="fc-item">
      <span className="fc-icon" aria-hidden="true" data-anim="pop">
        {icon}
      </span>
      <div className="fc-body">
        <h3 className="fc-title">{title}</h3>
        <p className="fc-desc">{desc}</p>
        {children}
      </div>
    </div>
  );
}

export function SiteFooter({ c, lang }: { c: SiteContent; lang: Lang }) {
  const year = new Date().getFullYear();
  const fc = c.footer.contact;

  return (
    <footer className="footer">
      <div className="shell">
        {/* ---------------- get in touch ---------------- */}
        <div className="footer-contact">
          <div className="fc-pattern" aria-hidden="true" />
          <div className="fc-head">
            <p className="eyebrow">{fc.eyebrow}</p>
            <h2 className="fc-h" data-anim="clip">{fc.heading}</h2>
            <p className="lede">{fc.lede}</p>
          </div>

          <div className="fc-grid">
            <div className="fc-list" data-anim-group>
              <ContactCard icon={<MailIcon />} title={fc.email.title} desc={fc.email.desc}>
                <a className="fc-value" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
              </ContactCard>

              <ContactCard icon={<InstagramIcon />} title={fc.social.title} desc={fc.social.desc}>
                <a
                  className="fc-value"
                  href={INSTAGRAM.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{INSTAGRAM.handle}
                </a>
              </ContactCard>

              <ContactCard icon={<PhoneIcon />} title={fc.phone.title} desc={fc.phone.desc}>
                <a className="fc-value" href={`tel:${PHONE.tel}`}>
                  {PHONE.display}
                </a>
              </ContactCard>
            </div>

            {/* The pin is the city the studio works out of, not a front door.
                `mapLabel` says exactly that, so the map cannot be read as an
                invitation to turn up somewhere. */}
            <div className="fc-map" data-anim="reveal">
              <iframe
                title={fc.mapLabel}
                src={mapEmbedUrl(LOCATION.mapQuery)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* ---------------- index ---------------- */}
        <div className="foot-grid" data-anim-group>
          <div>
            <span className="mark">
              <Logo size={28} />
              <b className="wordmark">
                Nova<i>Faber</i>
              </b>
            </span>
            <p className="foot-tag">{c.footer.tagline}</p>
            <Link className="foot-mail" href={`/${lang}${ROUTES.book}`}>
              {c.ctaBand.primary}
            </Link>
          </div>

          <div className="foot-col">
            <h3>{c.footer.servicesLabel}</h3>
            {c.services.pillars.map((p) => (
              <Link key={p.title} href={`/${lang}/services`}>
                {p.title}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h3>{c.footer.studioLabel}</h3>
            {c.footer.studioLinks.map((l) => (
              <Link key={l.href} href={`/${lang}${l.href}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="foot-col">
            <h3>{c.footer.socialsLabel}</h3>
            {STUDIO_SOCIALS.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
                <span>{s.handle}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="foot-bottom" data-anim="fade">
          <span>
            © {year} {BRAND} — {FOUNDER}
          </span>
          <span>{c.footer.note}</span>
          <span>{c.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
