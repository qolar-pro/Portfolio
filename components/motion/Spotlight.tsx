"use client";

import { useEffect, useRef } from "react";
import { motion } from "@/lib/motion/store";

/**
 * Per-card local cursor coords as --cx / --cy. The card's own CSS uses them
 * for both the ember spotlight and the dot-texture mask, so texture only
 * appears where the card is "hot".
 *
 * Pure custom-property writes — no React involvement.
 */
export function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const s = motion();
    if (s.reducedMotion || !s.hasPointerFine) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--cx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--cy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}
