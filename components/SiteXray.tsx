'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { readConsent } from '@/lib/consent';
import { ROUTES, XRAY_CHECKS, type Lang, type SiteContent, type XrayCheckId } from '@/lib/content';

/**
 * Site X-ray — a visitor checks their own website against the studio's
 * pre-launch list, on the page, in a few seconds.
 *
 * It exists because the rest of the site asks people to trust that the work
 * is careful; this lets them watch the care applied to something of theirs.
 * Every result is a real measurement from app/api/xray — nothing here is a
 * score invented to make a site look worse than it is.
 */

type Result = {
  ok: true;
  url: string;
  passed: number;
  total: number;
  ttfb: number;
  kb: number;
  results: Record<XrayCheckId, boolean>;
};

type State =
  | { phase: 'idle' }
  | { phase: 'running' }
  | { phase: 'error'; message: string }
  | { phase: 'done'; data: Result };

export function SiteXray({ c, lang }: { c: SiteContent; lang: Lang }) {
  const x = c.xray;
  const [value, setValue] = useState('');
  const [state, setState] = useState<State>({ phase: 'idle' });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (state.phase === 'running' || !value.trim()) return;
    setState({ phase: 'running' });
    try {
      const res = await fetch('/api/xray', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: value, consent: readConsent()?.analytics }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: 'failed' }));
      if (data.ok) {
        setState({ phase: 'done', data });
      } else {
        const key = data.error as 'invalid' | 'busy' | 'failed';
        setState({ phase: 'error', message: x[key] ?? x.failed });
      }
    } catch {
      setState({ phase: 'error', message: x.failed });
    }
  };

  const done = state.phase === 'done' ? state.data : null;

  return (
    <div className="xray">
      <form className="xray-form" onSubmit={submit}>
        <label className="xray-label" htmlFor="xray-url">
          {x.fieldLabel}
        </label>
        <div className="xray-row">
          <input
            id="xray-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            placeholder={x.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={state.phase === 'running'}
          />
          <button className="btn btn-solid" type="submit" disabled={state.phase === 'running' || !value.trim()}>
            {state.phase === 'running' ? x.running : x.run}
            <span className="circ" aria-hidden="true">
              →
            </span>
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {state.phase === 'running' && (
          <div className="xray-scan" role="status">
            <span className="xray-scan-bar" aria-hidden="true" />
            <span>{x.running}…</span>
          </div>
        )}

        {state.phase === 'error' && <p className="xray-error">{state.message}</p>}

        {done && (
          <div className="xray-result">
            <div className="xray-summary">
              <p className="xray-score">
                <span className="xray-score-n">{done.passed}</span>
                <span className="xray-score-t">/{done.total}</span>
              </p>
              <div>
                <p className="xray-host">{new URL(done.url).hostname}</p>
                <p className="xray-passed">
                  {x.passed.replace('{n}', String(done.passed)).replace('{total}', String(done.total))}
                </p>
                <p className="xray-facts">
                  {done.ttfb} ms · {done.kb} KB
                </p>
              </div>
            </div>

            <ul className="xray-list">
              {XRAY_CHECKS.map((id) => {
                const ok = done.results[id];
                return (
                  <li key={id} className={ok ? 'is-pass' : 'is-fail'}>
                    <span className="xray-mark" aria-hidden="true">
                      {ok ? '✓' : '✕'}
                    </span>
                    <div>
                      <p className="xray-check">
                        <span className="sr-only">{ok ? 'Pass: ' : 'Fail: '}</span>
                        {x.checks[id].label}
                      </p>
                      {!ok && <p className="xray-why">{x.checks[id].why}</p>}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="xray-actions">
              {done.passed < done.total && (
                <Link className="btn btn-solid" href={`/${lang}${ROUTES.contact}`}>
                  {x.fixCta}
                  <span className="circ" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setValue('');
                  setState({ phase: 'idle' });
                }}
              >
                {x.again}
              </button>
            </div>
            <p className="xray-note">{x.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
