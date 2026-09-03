import 'server-only';

/**
 * Discord delivery.
 *
 * ── THE WEBHOOK URL IS A BEARER CREDENTIAL ───────────────────────────
 * Anyone holding it can post to the channel as this integration, forever,
 * with no further authentication. It lives in `DISCORD_WEBHOOK_URL` and is
 * read only here, in a module marked `server-only` so that importing it
 * from a client component is a build error rather than a leak. It must
 * never be prefixed `NEXT_PUBLIC_` — that would inline it into the browser
 * bundle where anyone can read it out of view-source.
 *
 * If it is ever exposed, rotate it in Discord (channel → Integrations →
 * Webhooks) and update the env var. Nothing else needs to change.
 *
 * ── FAILURE IS ALWAYS SILENT TO THE VISITOR ──────────────────────────
 * Discord being down, rate-limited, or misconfigured must never surface as
 * an error on a contact form. Every function here resolves; the caller
 * gets a boolean it is free to ignore.
 */

const ACCENT = 0x2de2c5;

export interface Field {
  name: string;
  value: string;
  inline?: boolean;
}

export interface Card {
  title: string;
  description?: string;
  fields?: Field[];
  /** Overrides the studio accent — used to colour-code message kinds. */
  color?: number;
  footer?: string;
}

/**
 * Discord rejects an embed over 6000 characters and a field value over
 * 1024, and returns 400 for the whole message rather than trimming. Anything
 * a visitor typed has to be clamped before it goes near the API.
 */
function clamp(s: string, max: number) {
  const v = (s ?? '').toString().trim();
  if (!v) return '—';
  return v.length <= max ? v : v.slice(0, max - 1) + '…';
}

export async function sendCard(card: Card): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    // A missing webhook is a configuration state, not an incident: local dev
    // and preview deployments run without one on purpose.
    if (process.env.NODE_ENV !== 'production') {
      console.info('[discord] DISCORD_WEBHOOK_URL not set — skipping:', card.title);
    }
    return false;
  }

  const embed = {
    title: clamp(card.title, 256),
    description: card.description ? clamp(card.description, 4096) : undefined,
    color: card.color ?? ACCENT,
    fields: (card.fields ?? []).slice(0, 25).map((f) => ({
      name: clamp(f.name, 256),
      value: clamp(f.value, 1024),
      inline: f.inline ?? false,
    })),
    footer: card.footer ? { text: clamp(card.footer, 2048) } : undefined,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'NovaFaber', embeds: [embed] }),
      /* Never let a slow webhook hold a request open. The visitor's response
         does not depend on Discord and must not wait for it. */
      signal: AbortSignal.timeout(4000),
    });

    if (res.status === 429) {
      /* Webhooks allow roughly 5 posts per 2 seconds. Dropping the message is
         the right call over queueing it — a backlog of stale visit pings is
         worth less than a responsive site, and the important messages
         (leads) are far too rare to be the ones throttled. */
      console.warn('[discord] rate limited, dropping message:', card.title);
      return false;
    }
    if (!res.ok) {
      console.warn('[discord] rejected', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[discord] delivery failed:', (err as Error).message);
    return false;
  }
}

/** Colour-codes the channel so the eye can sort it without reading. */
export const KIND = {
  lead: 0x2de2c5,
  newsletter: 0x4ade80,
  visit: 0x64748b,
} as const;
