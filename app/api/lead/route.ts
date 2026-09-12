import { NextResponse } from 'next/server';
import { KIND, sendCard } from '@/lib/discord';
import { buildLeadReply } from '@/lib/emails/reply';
import { buildCourseEmail } from '@/lib/emails/course';
import { BRAND, LANGS, type Lang } from '@/lib/content';
import { mailConfigured, sendMail } from '@/lib/mail';
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
    const page = str('path', 200) || '/';
    await sendCard({
      author: `novafaber.com · ${page}`,
      title: '📘 Course signup',
      description: `**${email}**\n\n[✉️ Write to them](mailto:${email})`,
      color: KIND.newsletter,
      fields: [
        { name: '📍 Where', value: placeOf(facts), inline: true },
        { name: '🖥️ Device', value: `${agent.browser} · ${agent.os}`, inline: true },
        { name: '🌐 IP', value: facts.ip, inline: true },
      ],
      footer: 'Consented · course sent automatically',
    });

    /* Deliver the course. Same rule as the enquiry confirmation: the signup
       is already recorded by the card above, so a mail provider being down
       costs the delivery and never the address. */
    if (mailConfigured()) {
      const langRaw = str('lang', 5);
      const lang = ((LANGS as readonly string[]).includes(langRaw) ? langRaw : 'en') as Lang;
      const mail = buildCourseEmail(lang);
      await sendMail({ to: email, subject: mail.subject, html: mail.html, text: mail.text });
    }

    return NextResponse.json({ ok: true });
  }

  const name = str('name', 200);
  if (!name && !email) {
    return NextResponse.json({ ok: false, error: 'empty' }, { status: 400 });
  }

  /* ---- the lead card ----
     Built to be read in one glance on a phone lock screen, because that is
     where it is actually seen. The order is what decides the next action:
     who, what they want, when to call them — then the forensic detail that
     only matters once a reply is already being written.

     The message goes in the description as a blockquote rather than a field,
     because a field caps at 1024 characters and silently truncates the one
     part of the card worth reading in full. */
  const company = str('company', 200);
  const budget = str('budget', 120);
  const preferred = str('preferred', 160);
  const message = str('message', 3500);
  const page = str('path', 200) || '/';

  /* A bigger budget gets a different stripe down the left edge, so the value
     of an enquiry registers before any of it is read. */
  const big = /10[,.]?000|10k|over|πάνω|повеќе/i.test(budget);

  const lines: string[] = [];
  if (company) lines.push(`**${company}**`);
  if (message) lines.push(message.split('\n').map((l) => `> ${l}`).join('\n'));
  /* One tap to answer. mailto in a description is clickable in every Discord
     client, which turns the card from a notification into the reply itself. */
  if (email) {
    const subject = encodeURIComponent(`Re: your enquiry — ${BRAND}`);
    lines.push(`[✉️ Reply to ${name.split(' ')[0] || email}](mailto:${email}?subject=${subject})`);
  }

  await sendCard({
    author: `novafaber.com · ${page}`,
    title: `💼 ${kind} — ${name || email || 'no name'}`,
    description: lines.join('\n\n') || undefined,
    color: big ? KIND.leadBig : KIND.lead,
    fields: [
      { name: '✉️ Email', value: email, inline: true },
      { name: '💰 Budget', value: budget, inline: true },
      { name: '🗓️ Call back', value: preferred, inline: true },
      { name: '📍 Where', value: placeOf(facts), inline: true },
      { name: '🖥️ Device', value: `${agent.browser} · ${agent.os}`, inline: true },
      { name: '🌐 IP', value: facts.ip, inline: true },
    ],
    footer: big ? 'Larger enquiry — worth more than thirty minutes' : 'Reply within 24h · Mon–Fri',
  });

  /* The confirmation to the enquirer, after the studio's own card.
     Deliberately last and deliberately awaited-but-ignored: the enquiry is
     already delivered by this point, so a mail provider being down costs a
     courtesy email and never the lead itself. sendMail resolves false rather
     than throwing, so there is nothing here to catch. */
  if (mailConfigured() && email.includes('@')) {
    const langRaw = str('lang', 5);
    const lang = ((LANGS as readonly string[]).includes(langRaw) ? langRaw : 'en') as Lang;
    const num = (k: string) => {
      const v = Number(body[k]);
      return Number.isInteger(v) && v >= 0 ? v : -1;
    };
    const mail = buildLeadReply({
      lang,
      name,
      email,
      company: str('company', 200),
      kind,
      kindIndex: num('kindIndex'),
      budget: str('budget', 120),
      budgetIndex: num('budgetIndex'),
      message: str('message', 3500),
      preferred: str('preferred', 160),
      preferredIsAny: body.preferredIsAny === true,
    });
    await sendMail({
      to: email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      /* A reply goes to the studio inbox, which is also the From address. */
    });
  }

  return NextResponse.json({ ok: true });
}
