'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { readConsent, writeConsent } from '@/lib/consent';
import { ROUTES, type Lang, type SiteContent } from '@/lib/content';

/**
 * The consent banner.
 *
 * ── ACCEPT AND DECLINE ARE THE SAME SIZE ─────────────────────────────
 * Both are buttons, both in the banner, both one click. A "reject" hidden
 * behind a settings link while "accept all" sits in the accent colour is
 * the pattern regulators have been fining people for, and it is not worth
 * the few percent of extra consent it buys.
 *
 * ── IT DOES NOT TRAP FOCUS ───────────────────────────────────────────
 * A cookie banner is not a modal. It must not block reading the page, and
 * a focus trap on something that appears on every first visit is hostile —
 * the visitor has to dismiss it before they can reach anything, including
 * the privacy policy explaining what they are being asked about. It sits at
 * the bottom, it is reachable by keyboard, and it can be ignored.
 *
 * ── NOTHING RUNS BEFORE A DECISION ───────────────────────────────────
 * The banner does not enable anything itself. It writes a decision, and
 * `VisitTracker` acts on it. Until then no optional request has been made.
 */
export function CookieConsent({ c, lang }: { c: SiteContent; lang: Lang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* Rendered only when there is no decision on file. Deciding on the
       server is impossible — consent lives in localStorage — so it mounts
       hidden and appears after the check, which is why it animates in
       rather than being present at first paint. */
    if (!readConsent()) setOpen(true);

    /* The footer link clears the record to let someone change their mind. */
    const onChange = () => setOpen(!readConsent());
    window.addEventListener('nf-consent', onChange);
    return () => window.removeEventListener('nf-consent', onChange);
  }, []);

  const decide = useCallback((granted: boolean) => {
    writeConsent(granted ? 'granted' : 'denied');
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      className="cc"
      ref={ref}
      role="region"
      aria-label={c.consent.title}
    >
      <div className="cc-body">
        <div className="cc-copy">
          <p className="cc-title">{c.consent.title}</p>
          <p className="cc-text">
            {c.consent.body}{' '}
            <Link href={`/${lang}${ROUTES.privacy}`} className="cc-link">
              {c.consent.readMore}
            </Link>
          </p>
        </div>

        <div className="cc-actions">
          <button type="button" className="btn btn-ghost cc-btn" onClick={() => decide(false)}>
            {c.consent.decline}
          </button>
          <button type="button" className="btn btn-solid cc-btn" onClick={() => decide(true)}>
            {c.consent.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * The footer control that reopens the choice. Separate from the banner so
 * the decision is always reversible without clearing browser data — which
 * is the part of "you can withdraw consent at any time" that most sites
 * write down and never build.
 */
export function ConsentReset({ label }: { label: string }) {
  const [has, setHas] = useState(false);

  useEffect(() => {
    const sync = () => setHas(Boolean(readConsent()));
    sync();
    window.addEventListener('nf-consent', sync);
    return () => window.removeEventListener('nf-consent', sync);
  }, []);

  if (!has) return null;

  return (
    <button
      type="button"
      className="cc-reset"
      onClick={() => {
        import('@/lib/consent').then((m) => m.clearConsent());
      }}
    >
      {label}
    </button>
  );
}
