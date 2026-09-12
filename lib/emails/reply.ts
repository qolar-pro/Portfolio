import { BRAND, EMAIL, FOUNDER, LOCATION, PHONE, type Lang } from '@/lib/content';

/**
 * The confirmation that goes back to whoever filled in the contact form.
 *
 * ── IT BRANCHES ON INDICES, NOT ON PROSE ─────────────────────────────
 * The form's "what do you need" and "budget" are translated strings, so
 * matching on their text would silently stop branching the moment a word
 * changed in one locale — and it would fail differently per language, which
 * is the worst kind of copy bug. The form sends the option's index instead;
 * these arrays line up with `kinds` and `budgets` in lib/content.
 *
 * ── WHY IT IS WORTH SENDING AT ALL ───────────────────────────────────
 * Today someone submits the form and gets nothing back — no receipt, no
 * timeframe, no confirmation the callback window they picked was even read.
 * The competitive study put a reply-time promise among the cheapest trust
 * signals a one-person studio has; this is that promise, kept automatically,
 * in the enquirer's own language.
 */

interface Copy {
  subjectGot: string;
  subjectWhen: (when: string) => string;
  hi: (first: string) => string;
  landed: (kind: string) => string;
  kindLines: string[];
  budgetLines: string[];
  callbackPicked: (when: string) => string;
  callbackAny: string;
  nextTitle: string;
  next: string[];
  signoff: string;
  ps: string;
  summaryTitle: string;
  labels: { company: string; need: string; budget: string; when: string; project: string };
}

const COPY: Record<Lang, Copy> = {
  en: {
    subjectGot: 'Got your message',
    subjectWhen: (w) => `Got it — I'll call you ${w}`,
    hi: (f) => `Hi ${f},`,
    landed: (k) =>
      `Your message about ${k} landed, and it came straight to me rather than into a queue. I read every one myself.`,
    kindLines: [
      'Most website projects here start the same way: what the site has to do for the business, before anyone opens a design tool.',
      'With a store, the parts that decide whether it works sit behind the storefront — payments, stock by variant, and an admin panel your staff will actually use. That is where I start.',
      'With a redesign the useful question is not how the current site looks. It is what happens when you try to change something. I will ask about that first.',
      'A platform is mostly decisions about data and about who does what. Expect the first call to be more questions than answers.',
      'Not sure yet is a fine place to start. Most of a first call is working out what you actually need, and sometimes that turns out to be less than you expected.',
    ],
    budgetLines: [
      'On budget: that band covers a focused site, built properly, with a small number of pages. If what you described needs more than that, I will say so on the call rather than after it.',
      'On budget: that is the usual range for what you have described. You get one fixed number before anything starts, and it does not move unless you change the scope.',
      'On budget: at that level there is normally custom work involved, so the scope document matters more than the quote. You get both in writing.',
      'On budget: that is worth more than thirty minutes. Say the word and I will set aside longer for the first call.',
      'On budget: you asked me to tell you. I will — after the call, in writing, as one fixed number against a listed scope.',
    ],
    callbackPicked: (w) => `You asked for ${w}. I will call inside that.`,
    callbackAny: `You did not pick a window, so I will try during working hours — Monday to Friday, 9:00 to 18:00.`,
    nextTitle: 'What happens next',
    next: [
      'Thirty minutes on the phone. No pitch deck, no jargon, no obligation.',
      'You leave with a one-page written brief in plain language — yours to keep whether or not we work together.',
      'If we go ahead, you get a fixed price and a delivery date in writing before any code exists.',
    ],
    signoff: 'Talk soon,',
    ps: 'If anything changes before then, just reply to this — it comes to me.',
    summaryTitle: 'What you sent',
    labels: {
      company: 'Company',
      need: 'What you need',
      budget: 'Budget',
      when: 'Call back',
      project: 'The project',
    },
  },

  el: {
    subjectGot: 'Έλαβα το μήνυμά σας',
    subjectWhen: (w) => `Το έλαβα — θα σας καλέσω ${w}`,
    hi: (f) => `Γεια σας ${f},`,
    landed: (k) =>
      `Το μήνυμά σας για ${k} έφτασε, και ήρθε απευθείας σε μένα και όχι σε κάποια ουρά. Τα διαβάζω όλα ο ίδιος.`,
    kindLines: [
      'Τα περισσότερα έργα ιστοσελίδων εδώ ξεκινούν το ίδιο: τι πρέπει να κάνει το site για την επιχείρηση, πριν ανοίξει κανείς εργαλείο σχεδίασης.',
      'Σε ένα κατάστημα, αυτά που κρίνουν αν δουλεύει είναι πίσω από τη βιτρίνα — πληρωμές, απόθεμα ανά παραλλαγή, και ένα admin panel που θα χρησιμοποιεί όντως το προσωπικό σας. Από εκεί ξεκινάω.',
      'Στον ανασχεδιασμό το χρήσιμο ερώτημα δεν είναι πώς δείχνει το τωρινό site. Είναι τι γίνεται όταν προσπαθήσετε να αλλάξετε κάτι. Αυτό θα ρωτήσω πρώτο.',
      'Μια πλατφόρμα είναι κυρίως αποφάσεις για τα δεδομένα και για το ποιος κάνει τι. Περιμένετε η πρώτη κλήση να έχει περισσότερες ερωτήσεις παρά απαντήσεις.',
      'Το «δεν είμαι σίγουρος ακόμα» είναι μια χαρά αφετηρία. Η πρώτη κλήση κυρίως ξεκαθαρίζει τι χρειάζεστε πραγματικά, και καμιά φορά είναι λιγότερα από όσα περιμένατε.',
    ],
    budgetLines: [
      'Για τον προϋπολογισμό: αυτό το εύρος καλύπτει ένα εστιασμένο site, φτιαγμένο σωστά, με λίγες σελίδες. Αν αυτό που περιγράψατε χρειάζεται περισσότερα, θα σας το πω στην κλήση και όχι μετά.',
      'Για τον προϋπολογισμό: αυτό είναι το συνηθισμένο εύρος για όσα περιγράψατε. Παίρνετε έναν σταθερό αριθμό πριν ξεκινήσει οτιδήποτε, και δεν αλλάζει αν δεν αλλάξετε το scope.',
      'Για τον προϋπολογισμό: σε αυτό το επίπεδο συνήθως υπάρχει custom δουλειά, οπότε το έγγραφο του scope μετράει περισσότερο από την προσφορά. Παίρνετε και τα δύο γραπτώς.',
      'Για τον προϋπολογισμό: αξίζει περισσότερο από μισή ώρα. Πείτε μου και κρατάω περισσότερο χρόνο για την πρώτη κλήση.',
      'Για τον προϋπολογισμό: μου ζητήσατε να σας πω εγώ. Θα το κάνω — μετά την κλήση, γραπτώς, ως έναν σταθερό αριθμό πάνω σε καταγεγραμμένο scope.',
    ],
    callbackPicked: (w) => `Ζητήσατε ${w}. Θα καλέσω μέσα σε αυτό.`,
    callbackAny:
      'Δεν διαλέξατε ώρα, οπότε θα προσπαθήσω σε εργάσιμες ώρες — Δευτέρα με Παρασκευή, 9:00 με 18:00.',
    nextTitle: 'Τι ακολουθεί',
    next: [
      'Μισή ώρα στο τηλέφωνο. Χωρίς παρουσιάσεις, χωρίς ορολογία, χωρίς δέσμευση.',
      'Φεύγετε με ένα γραπτό brief μίας σελίδας σε απλά ελληνικά — δικό σας είτε συνεργαστούμε είτε όχι.',
      'Αν προχωρήσουμε, παίρνετε σταθερή τιμή και ημερομηνία παράδοσης γραπτώς πριν γραφτεί κώδικας.',
    ],
    signoff: 'Τα λέμε σύντομα,',
    ps: 'Αν αλλάξει κάτι στο μεταξύ, απαντήστε απλώς σε αυτό — έρχεται σε μένα.',
    summaryTitle: 'Τι στείλατε',
    labels: {
      company: 'Εταιρεία',
      need: 'Τι χρειάζεστε',
      budget: 'Προϋπολογισμός',
      when: 'Επιστροφή κλήσης',
      project: 'Το έργο',
    },
  },

  mk: {
    subjectGot: 'Ја примив вашата порака',
    subjectWhen: (w) => `Примено — ќе ве побарам ${w}`,
    hi: (f) => `Здраво ${f},`,
    landed: (k) =>
      `Вашата порака за ${k} пристигна, и дојде директно кај мене, а не во редица. Сите ги читам самиот.`,
    kindLines: [
      'Повеќето проекти за веб-страница овде почнуваат исто: што треба страницата да прави за фирмата, пред некој да отвори алатка за дизајн.',
      'Кај продавница, работите што одлучуваат дали функционира се зад излогот — плаќања, залиха по варијанта, и admin панел што персоналот навистина ќе го користи. Оттаму почнувам.',
      'Кај редизајн корисното прашање не е како изгледа сегашната страница. Туку што се случува кога ќе се обидете да смените нешто. Тоа ќе го прашам прво.',
      'Платформата е главно одлуки за податоците и за тоа кој што работи. Очекувајте првиот разговор да има повеќе прашања отколку одговори.',
      '„Сè уште не сум сигурен“ е сосема добра почетна точка. Првиот разговор главно разјаснува што навистина ви треба, а понекогаш тоа е помалку отколку што очекувавте.',
    ],
    budgetLines: [
      'За буџетот: тој распон покрива фокусирана страница, изработена како треба, со мал број страници. Ако тоа што го опишавте бара повеќе, ќе ви кажам на разговорот, а не потоа.',
      'За буџетот: тоа е вообичаениот распон за она што го опишавте. Добивате една фиксна бројка пред да почне што било, и таа не се менува ако вие не го смените опфатот.',
      'За буџетот: на тоа ниво обично има изработка по мерка, па документот за опфат е поважен од понудата. Ги добивате и двете писмено.',
      'За буџетот: тоа вреди повеќе од половина час. Кажете и ќе одвојам подолго за првиот разговор.',
      'За буџетот: побаравте јас да ви кажам. Ќе го направам тоа — по разговорот, писмено, како една фиксна бројка за наведен опфат.',
    ],
    callbackPicked: (w) => `Побаравте ${w}. Ќе се јавам во тој термин.`,
    callbackAny:
      'Не избравте термин, па ќе се обидам во работно време — понеделник до петок, 9:00 до 18:00.',
    nextTitle: 'Што следи',
    next: [
      'Половина час на телефон. Без презентации, без жаргон, без обврска.',
      'Заминувате со пишан brief од една страница на јасен јазик — ваш, без разлика дали ќе соработуваме.',
      'Ако продолжиме, добивате фиксна цена и датум на испорака писмено пред да постои код.',
    ],
    signoff: 'Се слушаме наскоро,',
    ps: 'Ако нешто се смени дотогаш, само одговорете на ова — доаѓа кај мене.',
    summaryTitle: 'Што испративте',
    labels: {
      company: 'Фирма',
      need: 'Што ви треба',
      budget: 'Буџет',
      when: 'Повратен повик',
      project: 'Проектот',
    },
  },
};

export interface LeadReplyInput {
  lang: Lang;
  name: string;
  email: string;
  company: string;
  kind: string;
  kindIndex: number;
  budget: string;
  budgetIndex: number;
  message: string;
  /** Already-formatted, e.g. "Tue, Thu — Afternoon (15:00-18:00)". */
  preferred: string;
  /** True when the visitor did not choose a window. */
  preferredIsAny: boolean;
}

/** "Giannis Papadopoulos" -> "Giannis". Falls back to the whole string. */
const firstName = (n: string) => n.trim().split(/\s+/)[0] || n.trim();

/** Anything a person typed is escaped before it goes anywhere near HTML. */
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Index into a branching array, tolerating anything out of range. */
const pick = (arr: string[], i: number) => arr[i] ?? arr[arr.length - 1];

export function buildLeadReply(input: LeadReplyInput) {
  const c = COPY[input.lang] ?? COPY.en;
  const first = firstName(input.name);

  const subject = input.preferredIsAny
    ? `${c.subjectGot} — ${BRAND}`
    : `${c.subjectWhen(input.preferred)}`;

  const callback = input.preferredIsAny ? c.callbackAny : c.callbackPicked(input.preferred);

  const rows: [string, string][] = [
    [c.labels.need, input.kind],
    [c.labels.budget, input.budget],
    [c.labels.when, input.preferred],
  ];
  if (input.company) rows.unshift([c.labels.company, input.company]);

  /* ---- plain text ----
     Sent alongside the HTML, not as an afterthought: a text part is what
     stops a message being scored as image-only spam, and it is what some
     clients and every screen reader on a phone lock screen actually show. */
  const text = [
    c.hi(first),
    '',
    c.landed(input.kind.toLowerCase()),
    '',
    pick(c.kindLines, input.kindIndex),
    '',
    pick(c.budgetLines, input.budgetIndex),
    '',
    callback,
    '',
    `${c.nextTitle}:`,
    ...c.next.map((n) => `  - ${n}`),
    '',
    c.signoff,
    `${FOUNDER} — ${BRAND}`,
    `${LOCATION.city}, ${LOCATION.country}`,
    `${EMAIL} · ${PHONE.display}`,
    '',
    c.ps,
    '',
    `--- ${c.summaryTitle} ---`,
    ...rows.map(([k, v]) => `${k}: ${v}`),
    `${c.labels.project}: ${input.message}`,
  ].join('\n');

  /* ---- html ----
     Table layout and inline styles throughout. Outlook renders with Word,
     which supports no flexbox, no grid, and drops <style> blocks — so the
     neobrutalist look is carried by borders and solid fills, which every
     client does support, and NOT by box-shadow, which most of them ignore.
     The offset is drawn as a second table cell instead. */
  const P = 'margin:0 0 16px;font-size:16px;line-height:1.6;color:#12100e;';
  const row = ([k, v]: [string, string]) => `
      <tr>
        <td style="padding:9px 14px;border-bottom:1px solid #12100e;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#3d3831;white-space:nowrap;">${esc(k)}</td>
        <td style="padding:9px 14px;border-bottom:1px solid #12100e;font-size:15px;color:#12100e;">${esc(v)}</td>
      </tr>`;

  const html = `<!doctype html>
<html lang="${input.lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title></head>
<body style="margin:0;padding:24px 12px;background:#e8e2ff;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:100%;">

        <tr><td style="padding:0 0 18px;">
          <span style="display:inline-block;background:#5600ff;color:#ffffff;border:2px solid #12100e;padding:9px 15px;font-size:19px;font-weight:800;letter-spacing:-.01em;">${BRAND}</span>
        </td></tr>

        <tr><td style="background:#ffffff;border:2px solid #12100e;padding:28px;">
          <p style="${P}font-size:19px;font-weight:700;">${esc(c.hi(first))}</p>
          <p style="${P}">${esc(c.landed(input.kind.toLowerCase()))}</p>
          <p style="${P}">${esc(pick(c.kindLines, input.kindIndex))}</p>
          <p style="${P}">${esc(pick(c.budgetLines, input.budgetIndex))}</p>

          <p style="margin:22px 0 0;padding:14px 16px;background:#e8e2ff;border:2px solid #12100e;font-size:16px;line-height:1.55;color:#12100e;">
            <strong>${esc(callback)}</strong>
          </p>
        </td></tr>

        <tr><td style="height:14px;line-height:14px;">&nbsp;</td></tr>

        <tr><td style="background:#ffffff;border:2px solid #12100e;padding:24px 28px;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5600ff;font-weight:700;">${esc(c.nextTitle)}</p>
          ${c.next
            .map(
              (n, i) => `<p style="${P}padding-left:26px;position:relative;">
            <span style="display:inline-block;width:20px;margin-left:-26px;font-weight:800;color:#5600ff;">${i + 1}</span>${esc(n)}</p>`,
            )
            .join('')}
        </td></tr>

        <tr><td style="height:14px;line-height:14px;">&nbsp;</td></tr>

        <tr><td style="background:#ffffff;border:2px solid #12100e;padding:24px 28px;">
          <p style="margin:0 0 14px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#5600ff;font-weight:700;">${esc(c.summaryTitle)}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:2px solid #12100e;border-collapse:collapse;">
            ${rows.map(row).join('')}
            <tr><td colspan="2" style="padding:12px 14px;font-size:15px;color:#12100e;white-space:pre-wrap;">${esc(input.message)}</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:22px 4px 0;font-size:15px;line-height:1.6;color:#12100e;">
          <p style="margin:0 0 4px;">${esc(c.signoff)}</p>
          <p style="margin:0;font-weight:800;font-size:17px;">${esc(FOUNDER)}</p>
          <p style="margin:2px 0 0;color:#3d3831;">${esc(BRAND)} — ${esc(LOCATION.city)}, ${esc(LOCATION.country)}</p>
          <p style="margin:8px 0 0;">
            <a href="mailto:${EMAIL}" style="color:#5600ff;">${EMAIL}</a>
            &nbsp;·&nbsp;
            <a href="tel:${PHONE.tel}" style="color:#5600ff;">${esc(PHONE.display)}</a>
          </p>
          <p style="margin:16px 0 0;font-size:13px;color:#3d3831;">${esc(c.ps)}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, html, text };
}
