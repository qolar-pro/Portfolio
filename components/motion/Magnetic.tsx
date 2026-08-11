"use client";

import { useEffect, useRef } from "react";
import { motion, type Surface } from "@/lib/motion/store";
import { assertAllowed } from "@/lib/motion/budget";

interface MagneticProps {
  children: React.ReactNode;
  surface?: Surface;
  /** attraction strength, 0..1 */
  strength?: number;
  className?: string;
}

/**
 * Cursor attraction. Writes transform directly in the pointer handler —
 * no state, no re-render. Disabled under reduced motion and on touch.
 */
export function Magnetic({
  children,
  surface = "spectacle",
  strength = 0.25,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!assertAllowed(surface, "magnetic")) return;

    const s = motion();
    if (s.reducedMotion || !s.hasPointerFine) return;

    const onEnter = () => {
      el.style.willChange = "transform";
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength * 1.3}px, 0)`;
    };
    const onLeave = () => {
      el.style.transform = "";
      el.style.willChange = "auto";
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [surface, strength]);

  return (
    <span
      ref={ref}
      className={`inline-block ${className}`}
      style={{ transition: "transform var(--duration-mid) var(--ease-out)" }}
    >
      {children}
    </span>
  );
}
