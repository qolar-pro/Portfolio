'use client';

import { usePathname } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { EMAIL, type SiteContent } from '@/lib/content';

/**
 * The enquiry form.
 *
 * ── IT POSTS, AND IT ALSO FALLS BACK TO MAIL ─────────────────────────
 * Submissions go to /api/lead, which delivers them to the studio's Discord.
 * If that fails for any reason — offline, the endpoint down, the webhook
 * rotated and not yet updated — the visitor's mail client opens with the
 * message pre-filled, which is what this form used to do on its own. An
 * enquiry is the most valuable thing on the site; it does not get to be
 * lost because a webhook 500'd.
 *
 * Delivery is NOT gated on cookie consent, deliberately. Someone filling in
 * a contact form is asking to be contacted; refusing to send their message
 * because they declined analytics would be losing the enquiry in order to
 * protect them from something they explicitly asked for.
 *
 * The budget question is lifted from netstudio.gr — it qualifies the lead
 * before anyone spends an hour on a call.
 */
export function ContactForm({ c }: { c: SiteContent }) {
  const f = c.contact.form;
  const [sent, setSent] = useState(false);
  const pathname = usePathname();
  const mountedAt = useRef(Date.now());

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    setSent(true);

    const payload = {
      kind: get('kind') || 'Enquiry',
      name: get('name'),
      email: get('email'),
      company: get('company'),
      budget: get('budget'),
      message: get('message'),
      path: pathname,
      company_website: get('company_website'),
      elapsed: Date.now() - mountedAt.current,
    };

    let delivered = false;
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      delivered = res.ok;
    } catch {
      delivered = false;
    }

    if (!delivered) {
      const subject = `${payload.kind} — ${payload.name}${payload.company ? ` (${payload.company})` : ''}`;
      const body = [
        `${f.name}: ${payload.name}`,
        `${f.email}: ${payload.email}`,
        `${f.company}: ${payload.company || '—'}`,
        `${f.kind}: ${payload.kind}`,
        `${f.budget}: ${payload.budget}`,
        '',
        `${f.message}:`,
        payload.message,
      ].join('\n');
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

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

      {/* off-screen, hidden from assistive tech: a person never sees it, a
          naive bot fills every input it finds */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="wp-hp"
      />

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
