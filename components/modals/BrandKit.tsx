'use client';

import ModalShell from './ModalShell';
import { useApp } from '@/components/AppState';

export default function BrandKit() {
  const { t, brandKitOpen, setBrandKitOpen } = useApp();
  if (!brandKitOpen) return null;

  const b = t.brand;

  return (
    <ModalShell onClose={() => setBrandKitOpen(false)} maxWidth="max-w-4xl">
      <div className="flex items-center justify-between border-b border-fog/10 px-6 py-5 md:px-10">
        <h3 className="font-display text-lg font-semibold tracking-tight text-fog uppercase md:text-xl">
          {b.title}
        </h3>
        <button
          onClick={() => setBrandKitOpen(false)}
          data-cursor="link"
          className="font-mono text-[11px] tracking-[0.2em] text-mist uppercase transition-colors duration-300 hover:text-flare"
        >
          {t.preview.close} ✕
        </button>
      </div>

      <div className="flex-1 space-y-14 overflow-y-auto px-6 py-10 md:px-10">
        {/* Logomark */}
        <section>
          <h4 className="mb-6 font-mono text-[10px] tracking-[0.35em] text-ghost uppercase">{b.logomark}</h4>
          <div className="panel-metal flex flex-col items-center justify-center px-6 py-14 text-center md:py-20">
            <div className="font-display text-[clamp(2.2rem,7vw,4.5rem)] leading-none font-bold tracking-tight text-fog uppercase">
              Apex<span className="text-neon">*</span>
            </div>
            <div className="mt-3 font-display text-sm font-medium tracking-[0.5em] text-mist uppercase md:text-lg">
              Solutions
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h4 className="mb-6 font-mono text-[10px] tracking-[0.35em] text-ghost uppercase">{b.typography}</h4>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="panel-metal p-8">
              <div className="mb-4 font-mono text-[10px] tracking-[0.2em] text-mist uppercase">{b.displayName}</div>
              <div className="font-display text-6xl font-bold text-fog">Aa</div>
              <p className="mt-4 text-sm leading-relaxed text-mist">{b.displayDesc}</p>
            </div>
            <div className="panel-metal p-8">
              <div className="mb-4 font-mono text-[10px] tracking-[0.2em] text-mist uppercase">{b.bodyName}</div>
              <div className="font-sans text-6xl font-semibold text-fog">Aa</div>
              <p className="mt-4 text-sm leading-relaxed text-mist">{b.bodyDesc}</p>
            </div>
          </div>
        </section>

        {/* Palette */}
        <section>
          <h4 className="mb-6 font-mono text-[10px] tracking-[0.35em] text-ghost uppercase">{b.palette}</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {b.colors.map((color) => (
              <div key={color.hex} className="flex flex-col gap-3">
                <div
                  className="aspect-square w-full border border-fog/10"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: color.hex === '#030309' ? 'none' : `0 0 32px ${color.hex}33`,
                  }}
                />
                <div>
                  <div className="font-display text-sm font-semibold text-fog uppercase">{color.name}</div>
                  <div className="font-mono text-[10px] tracking-[0.15em] text-ghost uppercase">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ModalShell>
  );
}
