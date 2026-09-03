'use client';

/**
 * Consent state.
 *
 * ── WHAT CONSENT HAS TO MEAN HERE ────────────────────────────────────
 * Nothing beyond what the site needs to function runs until someone makes
 * a choice. That means:
 *
 *   - no analytics call fires before a decision, not "fires and is deleted
 *     later" — the request itself is the processing
 *   - declining is one click, in the banner, not buried in a settings panel
 *   - the choice is remembered, and can be changed from the footer at any
 *     time
 *
 * "Necessary" is genuinely necessary here: the theme choice and the consent
 * record itself. Neither identifies anyone and neither can be declined,
 * because declining them would mean the site forgetting your theme and
 * asking about cookies on every page.
 */

export type ConsentValue = 'granted' | 'denied';

export interface Consent {
  /** ISO timestamp of the decision — the record that a choice was made. */
  at: string;
  /** Visit reporting and analytics. Everything optional lives behind this. */
  analytics: ConsentValue;
}

export const CONSENT_KEY = 'nf-consent';
/** Bump when the categories change, which invalidates old consent. */
export const CONSENT_VERSION = 1;

interface Stored extends Consent {
  v: number;
}

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    /* An old record is not a decision about the current categories. Asking
       again is the correct behaviour, not an annoyance to be engineered
       around. */
    if (parsed.v !== CONSENT_VERSION) return null;
    if (parsed.analytics !== 'granted' && parsed.analytics !== 'denied') return null;
    return { at: parsed.at, analytics: parsed.analytics };
  } catch {
    /* Storage blocked (private mode, embedded webview). No stored consent
       means no consent, which means nothing optional runs. That is the
       right way for this to fail. */
    return null;
  }
}

export function writeConsent(analytics: ConsentValue): Consent {
  const value: Consent = { at: new Date().toISOString(), analytics };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...value, v: CONSENT_VERSION }));
  } catch {
    /* Not persisting is survivable: the banner reappears next visit. */
  }
  window.dispatchEvent(new CustomEvent('nf-consent', { detail: value }));
  return value;
}

export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {}
  window.dispatchEvent(new CustomEvent('nf-consent', { detail: null }));
}

/** The address someone gave the welcome panel, if they ever did. */
export const EMAIL_KEY = 'nf-email';

export function readKnownEmail(): string {
  try {
    return localStorage.getItem(EMAIL_KEY) ?? '';
  } catch {
    return '';
  }
}

export function rememberEmail(email: string) {
  try {
    localStorage.setItem(EMAIL_KEY, email);
  } catch {}
}
