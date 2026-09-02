'use client';

import { useState, type FormEvent } from 'react';
import { EMAIL, type SiteContent } from '@/lib/content';

/**
 * No backend yet, so this composes a mail draft in the visitor's own client.
 * The budget question is lifted from netstudio.gr — it qualifies the lead
 * before anyone spends an hour on a call.
 */
export function ContactForm({ c }: { c: SiteContent }) {
  const f = c.contact.form;
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();

    const subject = `${get('kind')} — ${get('name')}${get('company') ? ` (${get('company')})` : ''}`;
    const body = [
      `${f.name}: ${get('name')}`,
      `${f.email}: ${get('email')}`,
      `${f.company}: ${get('company') || '—'}`,
      `${f.kind}: ${get('kind')}`,
      `${f.budget}: ${get('budget')}`,
      '',
      `${f.message}:`,
      get('message'),
    ].join('\n');

    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  }

  return (
    <form className="form" onSubmit={onSubmit} data-anim-group>
      <div className="row">
        <div className="field">
          <label htmlFor="cf-name">{f.name}</label>
          <input id="cf-name" name="name" required placeholder={f.namePh} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="cf-email">{f.email}</label>
          <input id="cf-email" name="email" type="email" required placeholder={f.emailPh} autoComplete="email" />
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-company">{f.company}</label>
        <input id="cf-company" name="company" placeholder={f.companyPh} autoComplete="organization" />
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="cf-kind">{f.kind}</label>
          <select id="cf-kind" name="kind" defaultValue={f.kinds[0]}>
            {f.kinds.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="cf-budget">{f.budget}</label>
          <select id="cf-budget" name="budget" defaultValue={f.budgets[1]}>
            {f.budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-message">{f.message}</label>
        <textarea id="cf-message" name="message" required placeholder={f.messagePh} />
      </div>

      <p className="form-note">{f.note}</p>

      <button className="btn btn-solid" type="submit">
        {sent ? f.sending : f.submit}
        <span className="circ" aria-hidden="true">
          →
        </span>
      </button>

      <p className="form-note">
        {f.fallback}{' '}
        <a href={`mailto:${EMAIL}`} style={{ color: 'var(--orange)' }}>
          {EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
