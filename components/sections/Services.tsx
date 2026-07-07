'use client';

import SectionShell from './SectionShell';
import { useApp } from '@/components/AppState';

/**
 * Capabilities as a brutalist ledger: five full-width rows, hollow indices,
 * a neon charge that sweeps in on hover. No cards, no icons — type does the work.
 */
export default function Services() {
  const { t } = useApp();

  return (
    <SectionShell id="services" index="02" label={t.services.label} heading={t.services.heading}>
      <div data-reveal-group className="border-t border-fog/10">
        {t.services.items.map((item, i) => (
          <div
            key={item.title}
            data-cursor="link"
            className="group relative grid grid-cols-12 items-baseline gap-4 overflow-hidden border-b border-fog/10 py-8 transition-colors duration-500 hover:border-plasma/40 md:py-10"
          >
            {/* charge sweep */}
            <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-plasma/8 via-volt/5 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

            <span className="text-hollow relative col-span-2 font-display text-3xl font-bold opacity-50 transition-opacity duration-300 group-hover:opacity-100 md:col-span-1 md:text-5xl">
              {String(i + 1).padStart(2, '0')}
            </span>

            <h3 className="relative col-span-10 font-display text-xl font-semibold tracking-tight text-fog uppercase transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 md:col-span-5 md:text-3xl">
              {item.title}
              <span className="ml-3 inline-block text-plasma opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                ✦
              </span>
            </h3>

            <p className="relative col-span-10 col-start-3 text-sm leading-relaxed text-mist md:col-span-5 md:col-start-8 md:text-base">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
