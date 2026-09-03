'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { readConsent, readKnownEmail, rememberEmail } from '@/lib/consent';
import type { SiteContent } from '@/lib/content';

/**
 * The welcome panel: a greeting and an email signup for updates, news and
 * offers.
 *
 * ── WHEN IT APPEARS, AND WHEN IT DOES NOT ────────────────────────────
 * Not on arrival. A panel that covers the page before anyone has read a
 * word is the reason people install popup blockers, and it converts worse
 * than one that waits. It appears once the visitor has either spent real
 * time on the page or scrolled a meaningful way down it — both signals that
 * they are actually reading — and never again once they have dealt with it.
 *
 * It is suppressed entirely when:
 *   - the address is already known (they signed up before)
 *   - it has been dismissed on this browser
 *   - the consent banner is still up, because stacking a second overlay on
 *     someone who has not answered the first is how a site feels hostile
 *
 * ── THE ADDRESS IS ALSO THE IDENTITY ─────────────────────────────────
 * There is no browser API that exposes an email, so this form is the only
 * point at which one can ever be known. Once given, it is stored locally
 * and sent with later visit reports, which is what makes a returning
 * visitor recognisable at all. That is stated plainly in the consent line
 * rather than buried — someone handing over an address is entitled to know
 * it will be attached to their future visits.
 */
export function WelcomePanel({ c }: { c: SiteContent }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [agreed, setAgreed] = useState(false);
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const mountedAt = useRef(Date.now());

  const DISMISSED = 'nf-welcome-dismissed';

  useEffect(() => {
    let done = false;
    try {
      if (localStorage.getItem(DISMISSED)) return;
    } catch {
      /* storage blocked: showing it once per page load is the fallback */
    }
    if (readKnownEmail()) return;

    const show = () => {
      if (done) return;
      // never stack on top of an unanswered consent banner
      if (!readConsent()) return;
      done = true;
      opener.current = document.activeElement;
      setOpen(true);
    };

    const timer = window.setTimeout(show, 18000);
    const onScroll = () => {
      const p = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
      if (p > 0.28) show();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      localStorage.setItem(DISMISSED, '1');
    } catch {}
    (opener.current as HTMLElement | null)?.focus?.();
  }, []);

  /* This one IS a modal — it covers the page and asks for something — so it
     does trap focus and close on Escape, unlike the consent banner. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
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
    document.body.classList.add('is-locked');
    const t = window.setTimeout(
      () => dialogRef.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus(),
      120,
    );
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-locked');
      window.clearTimeout(t);
    };
  }, [open, close]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed || state === 'sending') return;
    setState('sending');

    const form = e.currentTarget;
    const hp = (form.elements.namedItem('company_website') as HTMLInputElement)?.value ?? '';

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: 'newsletter',
          email,
          path: pathname,
          company_website: hp,
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      rememberEmail(email);
      setState('done');
      window.setTimeout(close, 2200);
    } catch {
      setState('error');
    }
  };

  if (!open) return null;

  return (
    <div className="wp-scrim" onClick={close}>
      <div
        className="wp"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wp-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="wp-close" onClick={close} aria-label={c.nav.close}>
          <span aria-hidden="true">×</span>
        </button>

        <p className="eyebrow">{c.welcome.eyebrow}</p>
        <h2 className="wp-title" id="wp-title">
          {c.welcome.title}
        </h2>
        <p className="wp-text">{c.welcome.body}</p>

        {state === 'done' ? (
          <p className="wp-done" role="status">
            {c.welcome.thanks}
          </p>
        ) : (
          <form className="wp-form" onSubmit={submit}>
            <label className="wp-label" htmlFor="wp-email">
              {c.welcome.emailLabel}
            </label>
            <div className="wp-row">
              <input
                id="wp-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder={c.welcome.emailPh}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-solid"
                disabled={!agreed || state === 'sending'}
              >
                {state === 'sending' ? c.welcome.sending : c.welcome.submit}
              </button>
            </div>

            {/* off-screen, hidden from assistive tech: a person never sees it */}
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="wp-hp"
            />

            <label className="wp-consent">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <span>{c.welcome.consent}</span>
            </label>

            {state === 'error' && (
              <p className="wp-error" role="alert">
                {c.welcome.error}
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
