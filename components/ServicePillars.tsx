'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { DUR, gsap, prefersReducedMotion, registerMotion } from '@/lib/motion';
import type { Lang, SiteContent } from '@/lib/content';

/**
 * Three pillars, threaded by one continuous line.
 *
 * The line used to be a hard zig-zag — four identical peaks, which read as a
 * chart gone wrong rather than as a connection between the cards. It is now a
 * single smooth weave: it rises through the outer two cards, dips through the
 * middle one, and the cards are offset to sit on it. That offset is the reason
 * the row stops looking like three equal boxes in a row.
 *
 * The stroke is a gradient that fades out at both ends, so the line arrives
 * from off-canvas and leaves again instead of starting and stopping in mid-air.
 * A node sits at each crossing, and one travelling pulse runs the path.
 */

/** Where the weave crosses each card — nodes are placed on these. */
const NODES = [
  { x: 320, y: 132 },
  { x: 600, y: 300 },
  { x: 880, y: 132 },
];

const WEAVE =
  'M -30 292 C 140 292 168 132 320 132 C 472 132 448 300 600 300 C 752 300 728 132 880 132 C 1032 132 1064 268 1230 268';

export function ServicePillars({ c, lang }: { c: SiteContent; lang: Lang }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return;

    if (prefersReducedMotion()) {
      path.style.strokeDasharray = 'none';
      path.style.strokeDashoffset = '0';
      return;
    }

    registerMotion();

    const ctx = gsap.context(() => {
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: DUR.xl,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: wrap, start: 'top 72%', once: true },
      });

      // the nodes light in the order the line reaches them
      gsap.from('.thread-node', {
        scale: 0,
        opacity: 0,
        transformOrigin: '50% 50%',
        duration: DUR.md,
        stagger: 0.28,
        delay: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: wrap, start: 'top 72%', once: true },
      });

      // one charge travelling the weave, on a long idle loop
      const pulse = pulseRef.current;
      if (pulse) {
        gsap.set(pulse, { opacity: 0 });
        const travel = { t: 0 };
        gsap.to(travel, {
          t: 1,
          duration: 5.5,
          repeat: -1,
          repeatDelay: 2.6,
          ease: 'none',
          delay: 1.6,
          onUpdate: () => {
            const pt = path.getPointAtLength(travel.t * len);
            gsap.set(pulse, {
              attr: { cx: pt.x, cy: pt.y },
              // fades in and out at the ends so it never pops
              opacity: Math.sin(travel.t * Math.PI) * 1.4,
            });
          },
        });
      }
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <div className="pillars-wrap" ref={wrapRef}>
      <div className="pillars-stage">
        <svg
          className="thread"
          viewBox="0 0 1200 420"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* fades at both ends: the line passes through rather than begins */}
            <linearGradient id="thread-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--orange)" stopOpacity="0" />
              <stop offset="14%" stopColor="var(--orange)" stopOpacity="0.9" />
              <stop offset="86%" stopColor="var(--orange)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--orange)" stopOpacity="0" />
            </linearGradient>
            <filter id="thread-glow" x="-20%" y="-60%" width="140%" height="220%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            ref={pathRef}
            d={WEAVE}
            fill="none"
            stroke="url(#thread-fade)"
            strokeWidth="2"
            strokeLinecap="round"
            /* the viewBox is stretched non-uniformly; without this the stroke
               would thicken along one axis and stop looking sharp */
            vectorEffect="non-scaling-stroke"
            filter="url(#thread-glow)"
          />

          {NODES.map((n) => (
            <g className="thread-node" key={`${n.x}-${n.y}`}>
              <circle cx={n.x} cy={n.y} r="9" className="thread-node-halo" />
              <circle cx={n.x} cy={n.y} r="4" className="thread-node-dot" />
            </g>
          ))}

          <circle ref={pulseRef} r="5" className="thread-pulse" cx="-30" cy="292" />
        </svg>

        <div className="pillars">
          {c.services.pillars.map((p, i) => (
            <article className="pillar" key={p.title} style={{ ['--i' as string]: i }}>
              <div className="pillar-pattern" aria-hidden="true" />
              <span className="pillar-ghost" aria-hidden="true">
                {i + 1}
              </span>
              <div className="pillar-body">
                <span className="pillar-n">0{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pillars-cta">
        <Link className="btn btn-solid" href={`/${lang}/services`}>
          {c.services.cta}
          <span className="circ" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
