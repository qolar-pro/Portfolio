'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion';
import { useQuality } from '@/lib/quality';

/**
 * A 3D presentation stage for flat media: rests at a perspective angle,
 * drifts idly so it's never still, tilts toward the pointer with a moving
 * glare, and lifts on hover. Children with their own translateZ become
 * depth layers that parallax naturally as the stage rotates.
 *
 * Touch devices keep the angle + idle drift (no pointer tilt);
 * prefers-reduced-motion gets a flat, static stage.
 */
export default function TiltStage({
  children,
  baseX = 4,
  baseY = -9,
  maxTilt = 7,
  idleDelay = 0,
  className = '',
}: {
  children: React.ReactNode;
  baseX?: number;
  baseY?: number;
  maxTilt?: number;
  idleDelay?: number;
  className?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const idleRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const { isTouch, reducedMotion } = useQuality();

  useEffect(() => {
    const frame = frameRef.current;
    const idle = idleRef.current;
    const stage = stageRef.current;
    const glare = glareRef.current;
    if (!frame || !idle || !stage) return;

    if (reducedMotion) {
      gsap.set(stage, { rotationX: 0, rotationY: 0 });
      return;
    }

    gsap.set(stage, { rotationX: baseX, rotationY: baseY });

    // idle drift — the stage breathes even when nobody's touching it
    const idleTl = gsap.timeline({ repeat: -1, yoyo: true, delay: idleDelay });
    idleTl
      .to(idle, { rotationX: 1.6, rotationY: -2.2, y: -6, duration: 3.4, ease: 'sine.inOut' })
      .to(idle, { rotationX: -1.2, rotationY: 1.8, y: 4, duration: 3.8, ease: 'sine.inOut' });

    if (isTouch) {
      return () => {
        idleTl.kill();
      };
    }

    const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.55, ease: 'power3.out' });
    const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.55, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      rx(baseX - ny * maxTilt);
      ry(baseY + nx * maxTilt * 1.25);
      if (glare) {
        glare.style.setProperty('--gx', `${((nx + 1) / 2) * 100}%`);
        glare.style.setProperty('--gy', `${((ny + 1) / 2) * 100}%`);
      }
    };
    const onEnter = () => {
      gsap.to(stage, { z: 34, duration: 0.5, ease: 'power3.out' });
      if (glare) gsap.to(glare, { opacity: 1, duration: 0.4 });
    };
    const onLeave = () => {
      rx(baseX);
      ry(baseY);
      gsap.to(stage, { z: 0, duration: 0.8, ease: 'power3.out' });
      if (glare) gsap.to(glare, { opacity: 0, duration: 0.5 });
    };

    frame.addEventListener('pointermove', onMove);
    frame.addEventListener('pointerenter', onEnter);
    frame.addEventListener('pointerleave', onLeave);
    return () => {
      idleTl.kill();
      frame.removeEventListener('pointermove', onMove);
      frame.removeEventListener('pointerenter', onEnter);
      frame.removeEventListener('pointerleave', onLeave);
    };
  }, [baseX, baseY, maxTilt, idleDelay, isTouch, reducedMotion]);

  return (
    <div ref={frameRef} className={`[perspective:1300px] ${className}`}>
      <div ref={idleRef} style={{ transformStyle: 'preserve-3d' }}>
        <div ref={stageRef} className="relative" style={{ transformStyle: 'preserve-3d' }}>
          {children}
          {/* pointer-following glare */}
          <div
            ref={glareRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-0"
            style={{
              background:
                'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.13), transparent 55%)',
              transform: 'translateZ(4px)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
