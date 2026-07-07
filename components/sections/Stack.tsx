'use client';

import SectionShell from './SectionShell';
import { useApp } from '@/components/AppState';

/**
 * The instrument set: four smoked-glass panels, each a discipline,
 * skills as bordered mono tags that catch neon on hover.
 */
export default function Stack() {
  const { t } = useApp();

  const accents = ['volt', 'plasma', 'flare', 'volt'] as const;
  const accentHex: Record<string, string> = { volt: '#4d7cff', plasma: '#8a5cff', flare: '#ff4fd8' };

  return (
    <SectionShell id="stack" index="05" label={t.stack.label} heading={t.stack.heading}>
      <div data-reveal-group className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {t.stack.groups.map((group, i) => (
          <div
            key={group.title}
            className="panel-glass group relative overflow-hidden p-8 transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(138,92,255,0.12)] md:p-10"
          >
            {/* corner glow */}
            <span
              className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-25"
              style={{ background: accentHex[accents[i]] }}
            />

            <div className="mb-6 flex items-baseline justify-between">
              <h3 className="font-display text-lg font-semibold tracking-tight text-fog uppercase md:text-xl">
                {group.title}
              </h3>
              <span className="font-mono text-[10px] text-ghost">0{i + 1}</span>
            </div>

            <p className="mb-8 max-w-md text-sm leading-relaxed text-mist">{group.desc}</p>

            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span
                  key={skill}
                  data-cursor="link"
                  className="border border-fog/15 px-3.5 py-2 font-mono text-[11px] tracking-[0.1em] text-mist uppercase transition-all duration-300 hover:border-plasma/60 hover:text-fog hover:shadow-[0_0_16px_rgba(138,92,255,0.2)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
