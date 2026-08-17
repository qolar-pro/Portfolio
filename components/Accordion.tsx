'use client';

import { useId, useState, type ReactNode } from 'react';
import type { SiteContent } from '@/lib/content';

type Props =
  /** Expandable service cards — the pattern taken from cylicom.gr. */
  | { variant: 'services'; items: SiteContent['services']['items'] }
  /** cactusweb.gr answers the money question in the FAQ rather than on a price list. */
  | { variant: 'faq'; items: SiteContent['faq']['items'] };

type Row = { key: string; head: ReactNode; panel: ReactNode };

export function Accordion(props: Props) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  // Narrow on the discriminant once, up here — the row list is uniform after this.
  const rows: Row[] =
    props.variant === 'services'
      ? props.items.map((item, i) => ({
          key: item.title,
          head: (
            <>
              <span className="acc-n">0{i + 1}</span>
              <span>
                <span className="acc-t">{item.title}</span>
                <span className="acc-sub">{item.desc}</span>
              </span>
            </>
          ),
          panel: (
            <ul className="acc-points">
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ),
        }))
      : props.items.map((item) => ({
          key: item.q,
          head: <span className="faq-q">{item.q}</span>,
          panel: <p className="faq-a">{item.a}</p>,
        }));

  return (
    <div className={`acc ${props.variant === 'faq' ? 'faq' : ''}`.trim()}>
      {rows.map((row, i) => {
        const isOpen = open === i;
        const panelId = `${uid}-${i}`;

        return (
          <div className={`acc-item ${isOpen ? 'open' : ''}`} key={row.key}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                className="acc-btn"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {row.head}
                <span className="acc-plus" aria-hidden="true" />
              </button>
            </h3>

            <div className="acc-panel" id={panelId} role="region">
              <div>{row.panel}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
