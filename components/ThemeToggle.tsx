'use client';

import { useCallback, useEffect, useState } from 'react';
import { THEME_COLOR, THEME_KEY, type Theme } from '@/lib/theme';
import type { SiteContent } from '@/lib/content';

/**
 * The theme switch.
 *
 * ACCESSIBILITY
 * `role="switch"` with `aria-checked` is the honest mapping: this is a
 * two-state control, not a button that navigates. It is a real <button>, so
 * it is in the tab order and Space/Enter operate it for free — no key
 * handling of our own to get wrong. The visible state change is a teal fill
 * plus a moved thumb plus a swapped icon, never shadow depth alone: on a
 * neumorphic surface "the shadow got deeper" is invisible to anyone who is
 * not looking for it, and completely invisible in high-contrast mode.
 *
 * PERSISTENCE
 * An explicit choice is written to localStorage and wins forever after,
 * across routes and across language switches — it lives on <html>, which
 * survives client navigation, and the blocking script re-applies it on every
 * hard load. With NO stored choice the control follows the OS live: the
 * matchMedia listener below is why changing your phone to dark mode at sunset
 * changes this page under you, which is the behaviour people expect and stop
 * getting the moment a site "helpfully" remembers a default.
 *
 * MOTION
 * The swap rides the View Transitions API where it exists — a teal-edged
 * circular wipe out of the switch itself, ~380ms. That is one of the site's
 * signature moments, so it is the only place a page-wide transition is spent.
 * Everywhere else, and under prefers-reduced-motion, the swap is instant.
 */
export function ThemeToggle({ c, className = '' }: { c: SiteContent; className?: string }) {
  /* Server-render the default rather than reading localStorage during render:
     the markup has to match what the server sent or React tears the tree
     down. The effect below corrects it on mount, and the blocking script has
     already painted the right colours, so nothing visible changes. */
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'light' ? 'light' : 'dark');
    setMounted(true);
  }, []);

  /* No stored choice means "follow the system" — and keep following it. */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(THEME_KEY);
      } catch {
        /* storage blocked — treat as no stored choice */
      }
      if (stored === 'dark' || stored === 'light') return;
      apply(e.matches ? 'light' : 'dark', false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const apply = useCallback((next: Theme, persist: boolean) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', next);
    root.style.colorScheme = next;
    setTheme(next);

    /* keep the browser chrome (iOS status bar, Android address bar) in step —
       a black notch above a white page is the tell that a theme is bolted on */
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[next]);

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {
        /* private mode: the choice holds for this page load and no further */
      }
    }
  }, []);

  const onToggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (reduced || typeof doc.startViewTransition !== 'function') {
      apply(next, true);
      return;
    }

    document.documentElement.classList.add('theme-swapping');
    const transition = doc.startViewTransition(() => apply(next, true));
    transition.ready.finally(() => {
      window.setTimeout(
        () => document.documentElement.classList.remove('theme-swapping'),
        420,
      );
    });
  }, [theme, apply]);

  const label = theme === 'dark' ? c.theme.toLight : c.theme.toDark;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === 'light'}
      aria-label={label}
      title={label}
      className={`theme-toggle ${className}`.trim()}
      data-theme-state={theme}
      onClick={onToggle}
      /* before mount the control cannot know the real theme; hiding it from
         assistive tech for that one frame is better than announcing a lie */
      aria-hidden={!mounted || undefined}
    >
      {/* The thumb carries the icon rather than the track carrying two.
          Two icons with a filled thumb sliding over them means the thumb
          obscures whichever one it is standing on, which is exactly the one
          describing the current state. One icon, on the moving part, says
          what the theme IS and moves when it changes. */}
      <span className="tt-track" aria-hidden="true">
        <span className="tt-thumb">
          {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
        </span>
      </span>
      <span className="tt-label">{theme === 'dark' ? c.theme.dark : c.theme.light}</span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      className="tt-ico"
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="tt-ico"
      viewBox="0 0 24 24"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6z" />
    </svg>
  );
}
