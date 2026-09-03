import { NextResponse } from 'next/server';
import { KIND, sendCard } from '@/lib/discord';
import { describeAgent, placeOf, readRequest } from '@/lib/request';

/**
 * Visit reporting.
 *
 * Fires once per session, from the first page a visitor opens, and ONLY if
 * they accepted analytics cookies — `components/VisitTracker` will not call
 * this otherwise. There is no fallback path that reports an unconsented
 * visit.
 *
 * ── ONE MESSAGE PER SESSION, NOT PER PAGE ────────────────────────────
 * A Discord webhook takes roughly five posts per two seconds before it
 * starts returning 429. Reporting every page view would mean three or four
 * messages for one person reading the site, a channel nobody can scan, and
 * the genuinely important messages — the leads — being the ones dropped
 * when a burst hits the limit. So the client sends once, on first view,
 * carrying the entry page. The session cookie set below is what makes
 * "once" stick across a refresh.
 *
 * ── BOTS ARE COUNTED AND NOT ANNOUNCED ───────────────────────────────
 * Roughly half of all traffic to a small site is automated. Posting every
 * crawler into the channel would bury the humans, so a request whose
 * user-agent identifies itself as a bot is acknowledged and dropped.
 */

export const runtime = 'nodejs';
/* Geo headers are per-request; nothing here may be cached or prerendered. */
export const dynamic = 'force-dynamic';

const SESSION_COOKIE = 'nf_seen';

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const facts = readRequest(req);
  const agent = describeAgent(facts.ua);

  /* Always 200, always fast. This endpoint is fire-and-forget from a
     beacon; a non-2xx would show up as a console error on the visitor's
     page for no benefit to anyone. */
  const ok = NextResponse.json({ ok: true });

  if (agent.bot) return ok;

  /* Already reported this session. The cookie is set below on first sight
     and expires with the browser session. */
  if (req.headers.get('cookie')?.includes(`${SESSION_COOKIE}=1`)) return ok;

  const str = (k: string) => {
    const v = body[k];
    return typeof v === 'string' ? v.slice(0, 300) : '';
  };

  /* Set by the welcome panel when someone gives their address, and sent
     back on every later visit from that browser. This is the only way a
     visit is ever tied to an email — see the note in lib/request.ts. */
  const known = str('email');

  const fields = [
    { name: 'Location', value: placeOf(facts), inline: true },
    { name: 'IP', value: facts.ip, inline: true },
    { name: 'Language', value: str('language') || '—', inline: true },
    { name: 'Browser', value: `${agent.browser} · ${agent.os}`, inline: true },
    { name: 'Screen', value: str('screen') || '—', inline: true },
    { name: 'Timezone', value: str('timezone') || '—', inline: true },
    { name: 'Landed on', value: str('path') || '/', inline: false },
    {
      name: 'Came from',
      value: str('referrer') || facts.referer || 'direct',
      inline: false,
    },
  ];

  if (known) fields.unshift({ name: 'Known visitor', value: known, inline: false });

  await sendCard({
    title: known ? `Return visit — ${known}` : 'New visitor',
    color: KIND.visit,
    fields,
    footer: facts.ua.slice(0, 180),
  });

  ok.cookies.set(SESSION_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // session cookie: gone when the browser closes, so a return visit reports
  });

  return ok;
}
