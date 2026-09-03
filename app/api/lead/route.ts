import { NextResponse } from 'next/server';
import { KIND, sendCard } from '@/lib/discord';
import { describeAgent, placeOf, readRequest } from '@/lib/request';

/**
 * Everything a visitor deliberately submits: the contact form, the
 * book-a-call form, and the welcome panel's email signup.
 *
 * Unlike /api/track this is NOT gated on cookie consent, and should not be:
 * someone filling in a contact form is asking to be contacted, which is the
 * lawful basis on its own. Refusing to deliver a message because the person
 * declined analytics cookies would be losing the enquiry to protect them
 * from something they asked for.
 *
 * ── ABUSE ────────────────────────────────────────────────────────────
 * A public endpoint that forwards text into a chat channel is a spam relay
 * unless it is bounded. Three cheap guards, in order of how much they
 * catch: a honeypot field no human ever fills, a minimum time-on-form no
 * script waits out, and a per-IP rate limit.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* In-memory and therefore per-instance: a serverless deployment may run
   several, so this is a brake rather than a lock. It stops one person
   hammering the form, which is the realistic case. Anything more determined
   needs a shared store, and would be worth adding only if it happens. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function overLimit(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude ceiling; this is not a database
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const facts = readRequest(req);
  const agent = describeAgent(facts.ua);
  const str = (k: string, max = 1500) => {
    const v = body[k];
    return typeof v === 'string' ? v.trim().slice(0, max) : '';
  };

  /* A field positioned off-screen and hidden from assistive tech. A person
     never sees it; a naive bot fills every input it finds. Answering 200
     rather than 400 means the bot has no signal that it was caught. */
  if (str('company_website')) return NextResponse.json({ ok: true });

  /* Nobody reads a form and types an answer in under two seconds. */
  const elapsed = Number(body.elapsed ?? 0);
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < 2000) {
    return NextResponse.json({ ok: true });
  }

  if (overLimit(facts.ip)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 });
  }

  const kind = str('kind', 40) || 'message';
  const email = str('email', 200);

  if (kind === 'newsletter') {
    if (!email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'email' }, { status: 400 });
    }
    await sendCard({
      title: 'Newsletter signup',
      description: email,
      color: KIND.newsletter,
      fields: [
        { name: 'Location', value: placeOf(facts), inline: true },
        { name: 'IP', value: facts.ip, inline: true },
        { name: 'Browser', value: `${agent.browser} · ${agent.os}`, inline: true },
        { name: 'Page', value: str('path', 200) || '/', inline: false },
      ],
      footer: 'Consented to updates, news and offers',
    });
    return NextResponse.json({ ok: true });
  }

  const name = str('name', 200);
  if (!name && !email) {
    return NextResponse.json({ ok: false, error: 'empty' }, { status: 400 });
  }

  await sendCard({
    title: `${kind} — ${name || email || 'no name'}`,
    description: str('message', 3500) || undefined,
    color: KIND.lead,
    fields: [
      { name: 'Name', value: name, inline: true },
      { name: 'Email', value: email, inline: true },
      { name: 'Company', value: str('company', 200), inline: true },
      { name: 'Budget', value: str('budget', 120), inline: true },
      { name: 'Location', value: placeOf(facts), inline: true },
      { name: 'IP', value: facts.ip, inline: true },
      { name: 'Browser', value: `${agent.browser} · ${agent.os}`, inline: true },
      { name: 'Page', value: str('path', 200) || '/', inline: false },
    ],
  });

  return NextResponse.json({ ok: true });
}
