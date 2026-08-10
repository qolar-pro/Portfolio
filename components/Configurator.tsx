'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  CATALOGUE,
  CMS,
  DEFAULT_CONFIG,
  DESIGN,
  LOCALES_OPT,
  MOTION,
  SCALE,
  estimate,
  formatEur,
  toQuery,
  type Config,
  type Option,
  type ProjectType,
} from '@/lib/pricing';
import { href } from '@/lib/routes';
import type { Locale } from '@/lib/locales';

/**
 * The quote configurator (DD-1).
 *
 * Returns an indicative range, never a quote, and says so in the same visual
 * breath as the number — a figure that has to be scrolled away from before the
 * qualifier appears is a figure people will quote back at you.
 *
 * The genuinely valuable output is not the range. It is the summary: the
 * studio receives a described project instead of "how much for a website?"
 */

const TYPES: { value: ProjectType; label: string; hint: string }[] = [
  { value: 'website', label: 'A website', hint: 'Pages, contact, the things a business is judged by' },
  { value: 'store', label: 'An online store', hint: 'Products, checkout, orders, admin' },
  { value: 'redesign', label: 'A redesign', hint: 'The site exists but has aged out' },
  { value: 'custom', label: 'Something custom', hint: 'A platform, tool or system' },
];

function Field<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3 border-0 p-0">
      <legend className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer border px-4 py-2 text-sm transition-colors ${
              value === o.value
                ? 'border-ember bg-ember text-surface'
                : 'border-rule-strong text-ink-soft hover:border-ink hover:text-ink'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Configurator({ locale }: { locale: Locale }) {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const result = useMemo(() => estimate(config), [config]);
  const set = <K extends keyof Config>(key: K, value: Config[K]) =>
    setConfig((c) => ({ ...c, [key]: value }));

  const isStore = config.type === 'store';

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="flex flex-col gap-3 border-0 p-0">
          <legend className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
            What are you building?
          </legend>
          <div className="grid gap-px bg-rule sm:grid-cols-2">
            {TYPES.map((t) => (
              <label
                key={t.value}
                className={`cursor-pointer p-4 transition-colors ${
                  config.type === t.value ? 'bg-ember text-surface' : 'bg-ground hover:bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={config.type === t.value}
                  onChange={() => set('type', t.value)}
                  className="sr-only"
                />
                <span className="block font-display text-xl">{t.label}</span>
                <span
                  className={`mt-1 block text-sm ${
                    config.type === t.value ? 'text-surface/85' : 'text-muted'
                  }`}
                >
                  {t.hint}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {isStore ? (
          <Field
            legend="How big is the catalogue?"
            name="catalogue"
            options={CATALOGUE}
            value={config.catalogue}
            onChange={(v) => set('catalogue', v)}
          />
        ) : (
          <Field
            legend="How many pages?"
            name="scale"
            options={SCALE}
            value={config.scale}
            onChange={(v) => set('scale', v)}
          />
        )}

        <Field
          legend="How many languages?"
          name="locales"
          options={LOCALES_OPT}
          value={config.locales}
          onChange={(v) => set('locales', v)}
        />
        <Field
          legend="Do you want to edit the content yourself?"
          name="cms"
          options={CMS}
          value={config.cms}
          onChange={(v) => set('cms', v)}
        />
        <Field
          legend="Where does the design start?"
          name="design"
          options={DESIGN}
          value={config.design}
          onChange={(v) => set('design', v)}
        />
        <Field
          legend="How much movement?"
          name="motion"
          options={MOTION}
          value={config.motion}
          onChange={(v) => set('motion', v)}
        />
      </form>

      <aside className="flex h-fit flex-col gap-5 border border-rule-strong bg-surface p-6 lg:sticky lg:top-8">
        <p className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
          Indicative range
        </p>

        <p
          className="font-display text-4xl leading-none text-ink tabular-nums"
          aria-live="polite"
        >
          {formatEur(result.low)} – {formatEur(result.high)}
        </p>

        {/* The qualifier sits with the number, not below the fold. */}
        <p className="text-sm text-ink-soft">
          This is a range, not a quote. The final figure comes after we have talked about what
          you actually need — it may land outside this entirely.
        </p>

        <p className="font-mono text-2xs tracking-[0.08em] text-muted uppercase">
          Roughly {result.weeksLow}–{result.weeksHigh} weeks
        </p>

        <div className="border-t border-rule pt-4">
          <p className="font-mono text-2xs tracking-[0.12em] text-muted uppercase">
            What you described
          </p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {result.summary.map((s) => (
              <li key={s} className="text-sm text-ink-soft">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={`${href(locale, 'contact')}?${toQuery(config)}`}
          className="inline-flex items-center justify-center bg-ember px-6 py-3 font-display text-lg tracking-wide text-surface transition-colors hover:bg-ink"
        >
          Send this as a brief
        </Link>
      </aside>
    </div>
  );
}
