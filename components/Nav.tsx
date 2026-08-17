'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { LANGS, ROUTES, langNames, type Lang, type SiteContent } from '@/lib/content';

/**
 * Two floating islands (showcase option B).
 *
 * Past the fold the right island fades out and the left one collapses: the
 * wordmark and language switch fold away, leaving the anvil and the NF
 * monogram. The monogram's letters are set larger than the disc behind them
 * so they break its edge instead of sitting inside it.
 *
 * The right island carries the navigation, so a menu orb takes its place on
 * collapse — otherwise scrolling would strand the visitor with no way back.
 */
export function Nav({ lang, c }: { lang: Lang; c: SiteContent }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    return () => document.body.classList.remove('is-locked');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className={`nav ${stuck ? 'stuck' : ''}`}>
        <div className="island left">
          <Link className="mark" href={`/${lang}`} aria-label="NovaFaber — home">
            <span className="anvil">
              <Logo size={30} />
            </span>
            <b className="wordmark">
              Nova<i>Faber</i>
            </b>
            <span className="monogram" aria-hidden="true">
              <span className="disc" />
              <span className="nf">NF</span>
            </span>
          </Link>
          <span className="lang">
            <span aria-hidden="true">🌐</span>
            {LANGS.map((l) => (
              <Link key={l} href={`/${l}`} className={l === lang ? 'on' : ''} hrefLang={l}>
                {langNames[l]}
              </Link>
            ))}
          </span>
        </div>

        <div className="island right">
          <nav className="nlinks" aria-label="Primary">
            {c.nav.links.map((l) => (
              <Link key={l.href} className="nlink" href={`/${lang}${l.href}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link className="btn btn-solid" href={`/${lang}${ROUTES.book}`}>
            {c.nav.book}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
          <button
            type="button"
            className={`burger ${open ? 'open' : ''}`}
            aria-expanded={open}
            aria-label={open ? c.nav.close : c.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <button
          type="button"
          className={`menu-orb ${open ? 'open' : ''}`}
          aria-expanded={open}
          aria-label={open ? c.nav.close : c.nav.menu}
          onClick={() => setOpen((v) => !v)}
          tabIndex={stuck ? 0 : -1}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className={`sheet ${open ? 'open' : ''}`} aria-hidden={!open}>
        {c.nav.links.map((l, i) => (
          <Link
            key={l.href}
            className="big"
            href={`/${lang}${l.href}`}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {l.label}
            <span>0{i + 1}</span>
          </Link>
        ))}
        <div className="sheet-foot">
          <Link
            className="btn btn-solid sheet-cta"
            href={`/${lang}${ROUTES.book}`}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
          >
            {c.nav.book}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
          {/* the island's switcher folds away on scroll, so it lives here too */}
          <span className="lang">
            <span aria-hidden="true">🌐</span>
            {LANGS.map((l) => (
              <Link key={l} href={`/${l}`} className={l === lang ? 'on' : ''} hrefLang={l} tabIndex={open ? 0 : -1}>
                {langNames[l]}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
