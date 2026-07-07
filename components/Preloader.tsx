'use client';

import { useEffect, useRef } from 'react';
import { gsap, registerGsap } from '@/lib/motion';
import { journey } from '@/lib/journey';
import { useApp } from '@/components/AppState';
import { useQuality } from '@/lib/quality';

const MIN_DURATION = 1.6; // seconds — the sequence never flashes past
const FAILSAFE = 7; // seconds — never trap the visitor behind a stuck loader

/**
 * The opening sequence. A counter climbs against real scene readiness,
 * then the void panel wipes upward with a neon edge and hands off to the
 * intro camera dolly (journey.introProgress).
 */
export default function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const { setLoaded } = useApp();
  const { tier } = useQuality();

  useEffect(() => {
    registerGsap();
    const overlay = overlayRef.current;
    const counter = counterRef.current;
    const bar = barRef.current;
    const center = centerRef.current;
    if (!overlay || !counter || !bar || !center) return;

    if (tier === 'static') {
      journey.assetProgress = 1;
      journey.sceneReady = true;
    }

    let raf = 0;
    let done = false;
    const start = performance.now();
    let shown = 0;

    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      counter.textContent = '100';
      gsap.set(bar, { scaleX: 1 });

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        overlay.style.display = 'none';
        journey.introProgress = 1;
        setLoaded(true);
        return;
      }

      const tl = gsap.timeline();
      tl.to(center, { yPercent: -60, opacity: 0, duration: 0.6, ease: 'power3.in' }, 0.15)
        .to(
          overlay,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.05,
            ease: 'power4.inOut',
            onComplete: () => {
              overlay.style.display = 'none';
              setLoaded(true);
            },
          },
          0.45,
        )
        // camera begins its descent while the panel is still clearing
        .to(journey, { introProgress: 1, duration: 2.6, ease: 'power3.inOut' }, 0.7);
    };

    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;
      // time carries the counter to ~92; the scene's first frame buys the last 8
      const timeTarget = Math.min(elapsed / MIN_DURATION, 1) * 0.92;
      const target = journey.sceneReady ? 1 : Math.max(timeTarget, journey.assetProgress * 0.92);
      shown += (target - shown) * 0.12;
      const pct = Math.round(shown * 100);
      counter.textContent = String(pct);
      bar.style.transform = `scaleX(${shown})`;

      const ready = journey.sceneReady && elapsed >= MIN_DURATION && shown > 0.99;
      if (ready || elapsed > FAILSAFE) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [setLoaded, tier]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-void"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      aria-hidden
    >
      {/* neon edge that leads the wipe */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-volt via-plasma to-flare opacity-80" />

      <div ref={centerRef} className="flex flex-col items-center gap-8 px-6">
        <div className="font-display text-sm font-semibold uppercase tracking-[0.5em] text-fog">
          Apex<span className="text-plasma">*</span>Solutions
        </div>

        <div className="flex items-end font-display font-bold leading-none">
          <span ref={counterRef} className="text-[clamp(5rem,18vw,11rem)] tabular-nums text-fog">
            0
          </span>
          <span className="mb-3 text-2xl text-ghost">%</span>
        </div>

        <div className="h-px w-56 overflow-hidden bg-steel md:w-80">
          <div
            ref={barRef}
            className="h-full w-full origin-left bg-gradient-to-r from-volt via-plasma to-flare"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-ghost">
          Initializing environment
        </div>
      </div>
    </div>
  );
}
