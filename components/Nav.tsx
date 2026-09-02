'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LANGS, ROUTES, langNames, type Lang, type SiteContent } from '@/lib/content';

/**
 * Two floating islands.
 *
 * Past the fold the right island fades out and the left one collapses: the
 * wordmark and language switch fold away, leaving the anvil and the NF
 * monogram. The monogram's letters are set larger than the disc behind them
 * so they break its edge instead of sitting inside it. The right island
 * carries the navigation, so a menu orb takes its place on collapse —
 * otherwise scrolling would strand the visitor with no way back.
 */
export function Nav({ lang, c }: { lang: Lang; c: SiteContent }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const sheetRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  /** Where focus goes back to when the sheet closes. */
  const openerRef = useRef<HTMLElement | null>(null);

  /**
   * Collapse state comes from an IntersectionObserver on a zero-height
   * sentinel, not from a scroll listener.
   *
   * A `scroll` handler runs on every frame of every scroll on every device
   * and reads `window.scrollY`, which forces layout. The observer fires
   * twice in the life of the page — once when the sentinel leaves the
   * viewport, once when it comes back — and costs nothing in between. On a
   * mid-range phone that is the difference between a nav that stutters
   * during momentum scroll and one that does not.
   */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      rootMargin: '0px',
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    openerRef.current?.focus();
    openerRef.current = null;
  }, []);

  const toggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    setOpen((v) => {
      if (v) {
        openerRef.current?.focus();
        openerRef.current = null;
        return false;
      }
      openerRef.current = btn;
      return true;
    });
  }, []);

  /* Background scroll lock. Without it the page behind an open sheet scrolls
     under your thumb on iOS and you close the menu onto somewhere else. */
  useEffect(() => {
    document.body.classList.toggle('is-locked', open);
    return () => document.body.classList.remove('is-locked');
  }, [open]);

  /**
   * Escape closes, and Tab is trapped inside the sheet while it is open.
   *
   * Without the trap, tabbing past the last link walks invisibly through the
   * page behind the overlay — the single most common way a mobile menu is
   * unusable with a keyboard while looking perfectly fine.
   */
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;

      const sheet = sheetRef.current;
      if (!sheet) return;
      const focusables = sheet.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    // move focus into the sheet so the first Tab lands somewhere sensible
    const t = window.setTimeout(
      () => sheetRef.current?.querySelector<HTMLElement>('a[href]')?.focus(),
      60,
    );
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open, close]);

  /* A route change closes the sheet. Next keeps this component mounted
     across client navigations, so without it the overlay survives the tap
     that was meant to leave it. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /**
   * Switching language keeps your place.
   *
   * This used to point at `/${l}` — the locale home — so a visitor reading
   * /en/work who wanted Greek was dropped back on the Greek front page and
   * had to navigate again. The path after the language segment is identical
   * across locales (routes are not translated), so swapping the first
   * segment is all it takes.
   */
  const localeHref = (l: Lang) => {
    const rest = (pathname ?? `/${lang}`).split('/').slice(2).join('/');
    return rest ? `/${l}/${rest}` : `/${l}`;
  };

  const langSwitch = (inSheet: boolean) => (
    <nav className="lang" aria-label={c.nav.language}>
      <span className="lang-ico" aria-hidden="true">
        <GlobeIcon />
      </span>
      {LANGS.map((l) => (
        <Link
          key={l}
          href={localeHref(l)}
          className={l === lang ? 'on' : ''}
          hrefLang={l}
          aria-current={l === lang ? 'true' : undefined}
          tabIndex={inSheet && !open ? -1 : undefined}
          /* These sit in the viewport on every page, so Next prefetches all
             three translations of the current route on every single load —
             33 KB of RSC payload for a switch most visitors never touch. A
             language change is a deliberate, once-per-session action; it can
             afford to fetch when it happens. */
          prefetch={false}
        >
          {langNames[l]}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* the observer's trip-wire: it sits where the old scrollY > 120 test was */}
      <div ref={sentinelRef} className="nav-sentinel" aria-hidden="true" />

      <header className={`nav ${stuck ? 'stuck' : ''}`}>
        <div className="island left">
          <Link className="mark" href={`/${lang}`} aria-label={`${'NovaFaber'} — home`}>
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
          {langSwitch(false)}
          <ThemeToggle c={c} className="tt-nav" />
        </div>

        <div className="island right">
          <nav className="nlinks" aria-label="Primary">
            {c.nav.links.map((l) => (
              <Link
                key={l.href}
                className="nlink"
                href={`/${lang}${l.href}`}
                aria-current={pathname === `/${lang}${l.href}` ? 'page' : undefined}
              >
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
            aria-controls="nav-sheet"
            aria-label={open ? c.nav.close : c.nav.menu}
            onClick={toggle}
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
          aria-controls="nav-sheet"
          aria-label={open ? c.nav.close : c.nav.menu}
          onClick={toggle}
          tabIndex={stuck ? 0 : -1}
          aria-hidden={!stuck || undefined}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div
        id="nav-sheet"
        ref={sheetRef}
        className={`sheet ${open ? 'open' : ''}`}
        /* `inert` is what actually takes the closed sheet out of the tab
           order, the a11y tree and the hit-testing, in one attribute — the
           tabIndex={-1} juggling this replaces only ever handled the first
           of those. React 19 passes it straight through to the DOM. */
        inert={!open}
      >
        <nav aria-label={c.nav.menu}>
          {c.nav.links.map((l, i) => (
            <Link key={l.href} className="big" href={`/${lang}${l.href}`} onClick={close}>
              {l.label}
              <span>0{i + 1}</span>
            </Link>
          ))}
        </nav>
        <div className="sheet-foot">
          <Link
            className="btn btn-solid sheet-cta"
            href={`/${lang}${ROUTES.book}`}
            onClick={close}
          >
            {c.nav.book}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </Link>
          <div className="sheet-controls">
            {/* the island's switcher folds away on scroll, so it lives here too */}
            {langSwitch(true)}
            <ThemeToggle c={c} className="tt-sheet" />
          </div>
        </div>
      </div>
    </>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </svg>
  );
}
