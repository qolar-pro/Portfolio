import { NextResponse } from 'next/server';
import { buildLeadReply } from '@/lib/emails/reply';
import { LANGS, content, type Lang } from '@/lib/content';

/**
 * Renders a confirmation email in the browser, for review.
 *
 * ── LOCAL ONLY ───────────────────────────────────────────────────────
 * 404s on a production build. It renders arbitrary template output from
 * query parameters, and while everything is escaped, an endpoint whose whole
 * job is to echo input back as HTML has no business being reachable on a
 * live site.
 *
 *   /api/email-preview?lang=en&kind=1&budget=3
 *   /api/email-preview?format=text        plain-text part instead
 *   /api/email-preview?matrix=1           every branch, side by side
 *
 * The matrix view exists because the templates branch five ways on what the
 * client needs and five ways on budget, in three languages — 75 combinations
 * that are otherwise only ever seen one at a time, by the one person who
 * happened to fill the form in that way.
 */
export const dynamic = 'force-dynamic';

const sample = (lang: Lang, kindIndex: number, budgetIndex: number, withCompany = true) => {
  const f = content[lang].contact.form;
  return {
    lang,
    name: 'Maria Konstantinou',
    email: 'maria@example.com',
    company: withCompany ? 'Konstantinou & Co' : '',
    kind: f.kinds[kindIndex] ?? f.kinds[0],
    kindIndex,
    budget: f.budgets[budgetIndex] ?? f.budgets[0],
    budgetIndex,
    message:
      'We run a plant-hire firm and the current site is four years old. Nobody can update it, and we cannot add machines to the fleet page without calling the person who built it.',
    /* Built from the locale's own strings, exactly as ContactForm builds it.
       This was hardcoded English, which meant the preview showed a Greek mail
       with "Tue, Thu — Afternoon" in its subject and the fixture — not the
       product — was the thing that was wrong. A fixture that cannot fail the
       way production fails is not testing production. */
    preferred: `${f.days[1]}, ${f.days[3]} — ${f.bands[2].label} (${f.bands[2].hours})`,
    preferredIsAny: false,
  };
};

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  const url = new URL(req.url);
  const langRaw = url.searchParams.get('lang') ?? 'en';
  const lang = ((LANGS as readonly string[]).includes(langRaw) ? langRaw : 'en') as Lang;

  /* Every branch on one page, so a change to the copy can be read across all
     of them at once rather than one query string at a time. */
  if (url.searchParams.get('matrix')) {
    const f = content[lang].contact.form;
    const cells: string[] = [];
    for (let k = 0; k < f.kinds.length; k++) {
      for (let b = 0; b < f.budgets.length; b++) {
        const m = buildLeadReply(sample(lang, k, b));
        cells.push(
          `<article style="border:2px solid #000;background:#fff;padding:14px;">
             <p style="margin:0 0 8px;font:700 12px/1.4 monospace;background:#5600ff;color:#fff;display:inline-block;padding:3px 7px;">kind ${k} · budget ${b}</p>
             <p style="margin:0 0 6px;font:700 14px/1.4 system-ui;">${m.subject}</p>
             <pre style="margin:0;white-space:pre-wrap;font:12px/1.5 monospace;color:#333;">${m.text
               .split('\n')
               .slice(2, 9)
               .join('\n')
               .replace(/</g, '&lt;')}</pre>
           </article>`,
        );
      }
    }
    return new NextResponse(
      `<!doctype html><meta charset="utf-8"><title>Email matrix — ${lang}</title>
       <body style="margin:0;padding:20px;background:#e8e2ff;font-family:system-ui;">
       <h1 style="font:800 22px/1 system-ui;margin:0 0 6px;">Confirmation email — every branch (${lang})</h1>
       <p style="margin:0 0 18px;font:14px/1.5 system-ui;">${f.kinds.length} × ${f.budgets.length} = ${cells.length} variants. Switch locale with ?lang=el or ?lang=mk.</p>
       <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:14px;">${cells.join('')}</div>`,
      { headers: { 'content-type': 'text/html; charset=utf-8' } },
    );
  }

  const kindIndex = Number(url.searchParams.get('kind') ?? 0) || 0;
  const budgetIndex = Number(url.searchParams.get('budget') ?? 1) || 0;
  const built = buildLeadReply(
    sample(lang, kindIndex, budgetIndex, url.searchParams.get('company') !== '0'),
  );

  if (url.searchParams.get('format') === 'text') {
    return new NextResponse(built.text, {
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }
  return new NextResponse(built.html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
