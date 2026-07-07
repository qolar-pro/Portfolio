'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap } from '@/lib/motion';

/**
 * Shared modal chrome: dimmed void backdrop, panel entrance on the house
 * curve, Escape / backdrop-click to close, exit animation before unmount.
 */
export default function ModalShell({
  onClose,
  children,
  maxWidth = 'max-w-5xl',
}: {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(panelRef.current, { y: 24, opacity: 0, duration: 0.35, ease: 'power3.in' }).to(
      backdropRef.current,
      { opacity: 0, duration: 0.3, ease: 'power2.in' },
      '-=0.15',
    );
  }, [onClose]);

  useEffect(() => {
    gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' });
    gsap.fromTo(
      panelRef.current,
      { y: 48, opacity: 0, scale: 0.985 },
      { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: 'expo.out', delay: 0.08 },
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-void/80 p-4 opacity-0 backdrop-blur-md md:p-8"
      onClick={close}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        className={`panel-glass relative flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden opacity-0 shadow-[0_0_120px_rgba(138,92,255,0.15)]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
