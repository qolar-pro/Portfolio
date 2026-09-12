import { BRAND, EMAIL, FOUNDER, LOCATION, PHONE, type Lang } from '@/lib/content';
import { SITE_URL } from '@/lib/seo';

/**
 * The course delivery — sent once, when someone gives their address to the
 * welcome panel.
 *
 * ── IT SENDS A LINK, NOT AN ATTACHMENT ───────────────────────────────
 * A PDF attached to a first email from an unknown sender is the single
 * fastest way into a spam folder, and a link can be improved after it is
 * sent while an attachment is frozen the moment it leaves. The page it
 * points at is public and ungated, which is deliberate — see the note in
 * app/course/page.tsx.
 *
 * The course itself is English. The wrapper around it is translated, so a
 * Greek or Macedonian reader is told plainly what they are getting rather
 * than being handed an English page with no explanation.
 */

interface Copy {
  subject: string;
  hi: string;
  intro: string;
  /** Set only where the course language differs from the reader's. */
  langNote?: string;
  cta: string;
  lessonsTitle: string;
  lessons: string[];
  after: string;
  signoff: string;
  unsub: string;
}

const COPY: Record<Lang, Copy> = {
  en: {
    subject: 'Before you pay for a website — your course',
    hi: 'Here it is.',
    intro:
      'Ten short lessons on commissioning a website, written for the person signing the invoice. Read it in about thirty-five minutes, or skip to lesson 03 — that is the one that costs people real money.',
    cta: 'Read the course',
    lessonsTitle: 'What is in it',
    lessons: [
      'Why two quotes for the same site differ by ten times',
      'Who owns the domain and the code when you fall out',
      'How to read a scope document',
      'What “SEO included” almost always means',
      'How to know whether it worked',
    ],
    after:
      'Every lesson ends with a question to put to whoever is quoting you. You do not need to understand the answer technically — just whether it comes plainly.',
    signoff: 'Any questions, reply to this. It comes to me.',
    unsub: 'You asked for this on novafaber.com. Reply with “stop” and I will not write again.',
  },
  el: {
    subject: 'Πριν πληρώσετε για ένα site — το μάθημά σας',
    hi: 'Ορίστε.',
    intro:
      'Δέκα σύντομα μαθήματα για το πώς αναθέτετε μια ιστοσελίδα, γραμμένα για αυτόν που υπογράφει το τιμολόγιο. Διαβάζεται σε περίπου τριάντα πέντε λεπτά, ή πηγαίνετε κατευθείαν στο μάθημα 03 — αυτό είναι που κοστίζει πραγματικά λεφτά.',
    langNote: 'Το μάθημα είναι στα αγγλικά. Η ελληνική έκδοση ετοιμάζεται.',
    cta: 'Διαβάστε το μάθημα',
    lessonsTitle: 'Τι περιέχει',
    lessons: [
      'Γιατί δύο προσφορές για το ίδιο site διαφέρουν δέκα φορές',
      'Ποιος έχει το domain και τον κώδικα όταν χαλάσει η σχέση',
      'Πώς διαβάζετε ένα έγγραφο scope',
      'Τι σημαίνει συνήθως το «SEO included»',
      'Πώς θα ξέρετε αν έπιασε τόπο',
    ],
    after:
      'Κάθε μάθημα τελειώνει με μια ερώτηση για αυτόν που σας δίνει προσφορά. Δεν χρειάζεται να καταλαβαίνετε τεχνικά την απάντηση — μόνο αν έρχεται καθαρά.',
    signoff: 'Οποιαδήποτε απορία, απαντήστε σε αυτό. Έρχεται σε μένα.',
    unsub: 'Το ζητήσατε στο novafaber.com. Απαντήστε «stop» και δεν θα ξαναγράψω.',
  },
  mk: {
    subject: 'Пред да платите за страница — вашиот курс',
    hi: 'Еве го.',
    intro:
      'Десет кратки лекции за нарачување веб-страница, напишани за оној што ја потпишува фактурата. Се чита за околу триесет и пет минути, или одете директно на лекција 03 — таа е онаа што чини вистински пари.',
    langNote: 'Курсот е на англиски. Македонската верзија се подготвува.',
    cta: 'Прочитајте го курсот',
    lessonsTitle: 'Што содржи',
    lessons: [
      'Зошто две понуди за иста страница се разликуваат десет пати',
      'Кој го поседува доменот и кодот кога ќе се раздвоите',
      'Како да прочитате документ за опфат',
      'Што обично значи „SEO вклучено“',
      'Како да знаете дали вредеше',
    ],
    after:
      'Секоја лекција завршува со прашање за оној што ви дава понуда. Не морате технички да ја разбирате одговорот — само дали доаѓа јасно.',
    signoff: 'Прашања — одговорете на ова. Доаѓа кај мене.',
    unsub: 'Го побаравте ова на novafaber.com. Одговорете со „stop“ и нема да пишувам повторно.',
  },
};

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function buildCourseEmail(lang: Lang) {
  const c = COPY[lang] ?? COPY.en;
  const url = `${SITE_URL}/en/course`;

  const text = [
    c.hi,
    '',
    c.intro,
    ...(c.langNote ? ['', c.langNote] : []),
    '',
    `${c.cta}: ${url}`,
    '',
    `${c.lessonsTitle}:`,
    ...c.lessons.map((l) => `  - ${l}`),
    '',
    c.after,
    '',
    c.signoff,
    `${FOUNDER} — ${BRAND}, ${LOCATION.city}`,
    `${EMAIL} · ${PHONE.display}`,
    '',
    c.unsub,
  ].join('\n');

  const P = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:#12100e;';
  const html = `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:24px 12px;background:#e8e2ff;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">

      <tr><td style="padding:0 0 18px;">
        <span style="display:inline-block;background:#5600ff;color:#fff;border:2px solid #12100e;padding:9px 15px;font-size:19px;font-weight:800;">${BRAND}</span>
      </td></tr>

      <tr><td style="background:#ffffff;border:2px solid #12100e;padding:28px;">
        <p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5600ff;font-weight:700;">Before you pay</p>
        <p style="${P}font-size:26px;font-weight:800;line-height:1.1;">${esc(c.hi)}</p>
        <p style="${P}">${esc(c.intro)}</p>
        ${c.langNote ? `<p style="${P}font-size:14px;color:#3d3831;">${esc(c.langNote)}</p>` : ''}
        <p style="margin:24px 0 0;">
          <a href="${url}" style="display:inline-block;background:#5600ff;color:#ffffff;text-decoration:none;border:2px solid #12100e;padding:14px 24px;font-size:17px;font-weight:800;">${esc(c.cta)} &rarr;</a>
        </p>
      </td></tr>

      <tr><td style="height:14px;line-height:14px;">&nbsp;</td></tr>

      <tr><td style="background:#ffffff;border:2px solid #12100e;padding:24px 28px;">
        <p style="margin:0 0 14px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5600ff;font-weight:700;">${esc(c.lessonsTitle)}</p>
        ${c.lessons
          .map(
            (l, i) =>
              `<p style="${P}padding-left:28px;"><span style="display:inline-block;width:22px;margin-left:-28px;font-weight:800;color:#5600ff;">${String(i + 1).padStart(2, '0')}</span>${esc(l)}</p>`,
          )
          .join('')}
        <p style="${P}margin-top:6px;font-size:14px;color:#3d3831;">${esc(c.after)}</p>
      </td></tr>

      <tr><td style="padding:22px 4px 0;font-size:15px;line-height:1.6;color:#12100e;">
        <p style="margin:0 0 10px;">${esc(c.signoff)}</p>
        <p style="margin:0;font-weight:800;font-size:17px;">${esc(FOUNDER)}</p>
        <p style="margin:2px 0 0;color:#3d3831;">${esc(BRAND)} — ${esc(LOCATION.city)}, ${esc(LOCATION.country)}</p>
        <p style="margin:8px 0 0;"><a href="mailto:${EMAIL}" style="color:#5600ff;">${EMAIL}</a> &nbsp;·&nbsp; <a href="tel:${PHONE.tel}" style="color:#5600ff;">${esc(PHONE.display)}</a></p>
        <p style="margin:18px 0 0;font-size:12px;color:#5f584e;">${esc(c.unsub)}</p>
      </td></tr>

    </table>
  </td></tr></table>
</body></html>`;

  return { subject: c.subject, html, text };
}
