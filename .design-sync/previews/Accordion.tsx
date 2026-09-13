/* One expandable list, two shapes. `services` carries a title, a description
   and a list of points; `faq` carries a question and an answer. The first row
   opens by default so the card is never a stack of closed bars. */
import { Accordion } from 'novafaber';

/** Service cards — title, description, and what is included. */
export const Services = () => (
  <Accordion
    variant="services"
    items={[
      {
        title: 'Development',
        desc: 'The site or platform itself, built to be changed by someone other than me.',
        points: ['Next.js and TypeScript', 'A real admin panel', 'Source code in your name'],
      },
      {
        title: 'Interface design',
        desc: 'Screens designed around what the business actually sells.',
        points: ['Clickable screens before code', 'One design system', 'Light and dark'],
      },
      {
        title: 'Commerce',
        desc: 'Payments, stock by variant, and an admin your staff will use.',
        points: ['Stripe and local providers', 'Stock that tracks', 'EU-wide shipping'],
      },
    ]}
  />
);

/** The FAQ shape — the money question answered in prose, not on a price list. */
export const Faq = () => (
  <Accordion
    variant="faq"
    items={[
      {
        q: 'What does a website actually cost?',
        a: 'Most projects start around €1,500. You get one fixed number against a written scope before anything begins, and it does not move unless the scope does.',
      },
      {
        q: 'Who owns the code and the domain?',
        a: 'You do. The domain, the hosting and every third-party account are registered in your name and handed over at launch.',
      },
      {
        q: 'How long does it take?',
        a: 'Most sites run four to eight weeks. The usual reason a project slips is content, not code.',
      },
    ]}
  />
);
