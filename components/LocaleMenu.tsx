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
 * sites, and the one that makes people stop using the switcher at all.
 *
 * Full names in the menu, short codes on the trigger. "Македонски" tells a
 * Macedonian speaker this site is for them in a way "MK" does not.
 */
export default function LocaleMenu({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Strip the current locale prefix so the same page can be re-prefixed.
  const rest = pathname.replace(new RegExp(`^/(${LOCALES.join('|')})`), '') || '';

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
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
        className="flex items-center gap-1.5 border border-forge-rule px-3 py-1.5 font-mono text-2xs tracking-[0.1em] text-forge-ink-soft uppercase transition-colors hover:border-heat-ember hover:text-heat-ember"
      >
        {localeShortNames[locale]}
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden>
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute end-0 top-full z-50 mt-2 min-w-[10rem] border border-forge-rule bg-forge-carbon py-1 shadow-lg"
        >
          {LOCALES.map((l) => (
            <Link
              key={l}
              role="menuitem"
              href={`/${l}${rest}`}
              hrefLang={l}
              onClick={() => setOpen(false)}
              aria-current={l === locale ? 'true' : undefined}
              className={`flex items-center justify-between gap-4 px-4 py-2 text-sm transition-colors ${
                l === locale
                  ? 'text-heat-ember'
                  : 'text-forge-ink-soft hover:bg-forge-steel hover:text-forge-ink'
              }`}
            >
              <span>{localeNames[l]}</span>
              <span className="font-mono text-2xs tracking-[0.1em] opacity-70">
                {localeShortNames[l]}
              </span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
