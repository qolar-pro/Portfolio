'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LOCALES, localeNames, localeShortNames, type Locale } from '@/lib/locales';

/**
 * Language menu.
 *
 * Switches to the *same page* in the target locale rather than dumping the
 * visitor on the homepage — the single most common failure in multilingual
 * sites, and the reason people stop using switchers at all.
 *
 * Full names in the panel, short code on the trigger: "Македонски" tells a
 * Macedonian speaker this site is for them in a way "MK" does not.
 */
export default function LocaleMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const rest = pathname.replace(new RegExp(`^/(${LOCALES.join('|')})`), '') || '';

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Change language"
        className="flex items-center gap-2 rounded-full border border-rule-strong px-3.5 py-2 font-mono text-2xs tracking-[0.12em] text-text-secondary uppercase transition-colors hover:border-ember hover:text-ember"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
          <ellipse cx="7" cy="7" rx="2.6" ry="6" stroke="currentColor" strokeWidth="1.1" />
          <path d="M1.4 5h11.2M1.4 9h11.2" stroke="currentColor" strokeWidth="1.1" />
        </svg>
        {localeShortNames[locale]}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-3 min-w-[12rem] overflow-hidden rounded-xl border border-forge-rule bg-surface-1 py-1.5 shadow-2xl"
        >
          {LOCALES.map((l) => (
            <Link
              key={l}
              role="menuitem"
              href={`/${l}${rest}`}
              hrefLang={l}
              onClick={() => setOpen(false)}
              aria-current={l === locale ? 'true' : undefined}
              className={`flex items-center justify-between gap-4 px-4 py-2.5 text-sm transition-colors ${
                l === locale
                  ? 'text-ember'
                  : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
              }`}
            >
              <span>{localeNames[l]}</span>
              {l === locale ? (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" aria-hidden>
                  <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              ) : (
                <span className="font-mono text-2xs tracking-[0.1em] opacity-60">
                  {localeShortNames[l]}
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
