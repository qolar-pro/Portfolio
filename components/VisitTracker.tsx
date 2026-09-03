'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { readConsent, readKnownEmail, type Consent } from '@/lib/consent';

/**
 * Reports a visit, once, after consent.
 *
 * ── THE ORDER MATTERS ────────────────────────────────────────────────
 * Nothing here runs until `readConsent()` returns a granted decision. It is
 * not "collect now, honour the choice later" — the request itself is the
 * processing, so the request does not happen. If someone declines, this
 * component mounts and does nothing for the life of the page.
 *
 * It also listens for the consent event, so accepting in the banner reports
 * the visit immediately rather than only from the next page load. Declining
 * never triggers it.
 *
 * ── WHY IT SENDS ONCE ────────────────────────────────────────────────
 * The server sets a session cookie and ignores repeat calls, but a guard
 * here too saves the round trip on every client navigation. Between the
 * two, one person reading five pages produces one message instead of five
 * — which is what keeps the channel readable and keeps a burst of traffic
 * from rate-limiting the messages that actually matter.
 */
export function VisitTracker() {
  const pathname = usePathname();
  const sent = useRef(false);
  /* usePathname changes on navigation; the effect must always see the
     current one without re-running and re-sending. */
  const path = useRef(pathname);
  path.current = pathname;

  useEffect(() => {
    const report = () => {
      if (sent.current) return;
      sent.current = true;

      /* Everything below is claimed by the browser, and every field is
         optional — a locked-down or unusual browser answering "unknown" to
         any of it must not stop the report. */
      let screen = '';
      let timezone = '';
      try {
        screen = `${window.screen.width}×${window.screen.height} @${window.devicePixelRatio}x`;
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
      } catch {}

      const payload = JSON.stringify({
        path: path.current,
        referrer: document.referrer || '',
        language: navigator.language || '',
        screen,
        timezone,
        email: readKnownEmail(),
      });

      /* `keepalive` so the report survives the visitor navigating away in
         the same tick — the alternative, sendBeacon, cannot set the JSON
         content type this endpoint expects. Failure is ignored on purpose:
         a visit report is not worth a console error on someone's screen. */
      fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    };

    const consent = readConsent();
    if (consent?.analytics === 'granted') {
      /* Wait for idle: a visit report is the lowest-priority request on the
         page and must never compete with content for bandwidth. */
      const w = window as Window & {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      };
      if (w.requestIdleCallback) w.requestIdleCallback(report, { timeout: 3000 });
      else window.setTimeout(report, 1200);
      return;
    }

    const onDecision = (e: Event) => {
      const detail = (e as CustomEvent<Consent | null>).detail;
      if (detail?.analytics === 'granted') report();
    };
    window.addEventListener('nf-consent', onDecision);
    return () => window.removeEventListener('nf-consent', onDecision);
  }, []);

  return null;
}
