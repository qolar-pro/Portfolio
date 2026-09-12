import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

/**
 * Outbound mail, one door.
 *
 * ── TWO PROVIDERS, PICKED BY WHAT IS CONFIGURED ──────────────────────
 * Zoho gives the studio a real mailbox and SMTP credentials; Resend gives
 * an HTTP API built for serverless. Rather than betting on one, this reads
 * whichever is present:
 *
 *   RESEND_API_KEY   -> Resend's HTTP API (one fetch, no TCP handshake)
 *   SMTP_HOST + ...  -> nodemailer over SMTP (Zoho, or anything else)
 *   neither          -> logged and skipped, never thrown
 *
 * Resend wins when both are set, because a serverless function pays the
 * full TLS handshake to an SMTP server on every cold invocation while an
 * HTTP POST reuses the platform's connection pool. Swapping between them is
 * an environment variable, not a code change — which is the point: the
 * studio can start on the Zoho credentials it already has and move later
 * without anyone touching a template.
 *
 * ── CREDENTIALS ARE BEARER SECRETS ───────────────────────────────────
 * SMTP_PASS and RESEND_API_KEY both send mail as the studio, forever, with
 * no further authentication. They live in the environment, are read only in
 * this `server-only` module, and must never carry a NEXT_PUBLIC_ prefix —
 * that would inline them into the browser bundle.
 *
 * ── IT NEVER THROWS ──────────────────────────────────────────────────
 * A confirmation email is worth less than the enquiry that triggered it. If
 * this fails the caller must still return 200, so every path resolves to a
 * boolean and failures are logged rather than raised.
 */

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Where a human reply should go. The studio inbox, not the sender. */
  replyTo?: string;
}

/** Display name on the From header. */
const FROM_NAME = process.env.MAIL_FROM_NAME ?? 'NovaFaber';
/** The address itself. Must be on a domain the provider has verified. */
const FROM_ADDR = process.env.MAIL_FROM ?? process.env.SMTP_USER ?? '';

let warned = false;
function warnUnconfigured() {
  if (warned) return;
  warned = true;
  /* Once per process, not per send: this is a deploy-level fact, and
     repeating it per enquiry would bury the per-message failures. */
  console.warn(
    '[mail] no provider configured — set RESEND_API_KEY, or SMTP_HOST/SMTP_USER/SMTP_PASS. ' +
      'No confirmation emails will be sent until one is present.',
  );
}

async function sendViaResend(m: Mail): Promise<boolean> {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_ADDR}>`,
        to: [m.to],
        subject: m.subject,
        html: m.html,
        text: m.text,
        reply_to: m.replyTo ?? FROM_ADDR,
      }),
      /* Never let a slow provider hold the visitor's response open. */
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) {
      console.warn('[mail] resend rejected', res.status, await res.text().catch(() => ''));
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[mail] resend failed:', (err as Error).message);
    return false;
  }
}

/* One transport per process. Rebuilding it per send would re-handshake TLS
   on every enquiry, which is most of the cost of sending over SMTP. */
let transport: Transporter | null = null;
function smtp() {
  if (transport) return transport;
  const port = Number(process.env.SMTP_PORT ?? 465);
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    /* 465 is implicit TLS; 587 upgrades with STARTTLS. Getting this wrong is
       the usual cause of a silent hang rather than an error. */
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
  return transport;
}

async function sendViaSmtp(m: Mail): Promise<boolean> {
  try {
    await smtp().sendMail({
      from: `"${FROM_NAME}" <${FROM_ADDR}>`,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      replyTo: m.replyTo ?? FROM_ADDR,
    });
    return true;
  } catch (err) {
    console.warn('[mail] smtp failed:', (err as Error).message);
    return false;
  }
}

export async function sendMail(m: Mail): Promise<boolean> {
  if (!FROM_ADDR) {
    warnUnconfigured();
    return false;
  }
  if (process.env.RESEND_API_KEY) return sendViaResend(m);
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return sendViaSmtp(m);
  }
  warnUnconfigured();
  return false;
}

/**
 * True when a provider is wired up.
 *
 * It also warns when it is not. Callers guard on this before building a
 * template, which means sendMail — and therefore its own unconfigured
 * warning — is never reached on a site with no mail provider. The result was
 * a deployment that took enquiries, answered 200, sent no confirmation, and
 * said nothing anywhere. That is the identical trap the Discord sender had,
 * and it is worth stating once here rather than discovering it twice.
 */
export const mailConfigured = () => {
  const ok = Boolean(
    FROM_ADDR &&
      (process.env.RESEND_API_KEY ||
        (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)),
  );
  if (!ok) warnUnconfigured();
  return ok;
};
