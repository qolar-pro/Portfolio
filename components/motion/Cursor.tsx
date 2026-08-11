"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionStore } from "@/lib/motion/store";

/**
 * Blend-mode ember cursor. Desktop only — on touch the native cursor is
 * restored and this renders nothing, because a custom cursor on a phone is
 * pure liability.
 *
 * Position is written in a local rAF from getState(). The only React
 * subscription is cursorVariant, which changes a few times per session.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const variant = useMotionStore((s) => s.cursorVariant);
  const enabled = useMotionStore((s) => s.hasPointerFine && !s.reducedMotion);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    let raf = 0;

    const tick = () => {
      const p = motion().pointer;
      x += (p.x - x) * 0.18;
      y += (p.y - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // dilate over anything interactive
    const setHot = () => motion().setCursorVariant("hot");
    const setDefault = () => motion().setCursorVariant("default");

    const targets = document.querySelectorAll("a, button, [data-cursor-hot]");
    targets.forEach((t) => {
      t.addEventListener("pointerenter", setHot);
      t.addEventListener("pointerleave", setDefault);
    });

    return () => {
      cancelAnimationFrame(raf);
      targets.forEach((t) => {
        t.removeEventListener("pointerenter", setHot);
        t.removeEventListener("pointerleave", setDefault);
      });
    };
  }, [enabled]);

  if (!enabled) return null;

  const hot = variant === "hot";

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: hot ? 46 : 10,
        height: hot ? 46 : 10,
        borderRadius: "50%",
        background: hot ? "rgb(255 122 26 / 0.18)" : "var(--color-ember)",
        boxShadow: hot
          ? "0 0 34px 8px rgb(255 122 26 / 0.28)"
          : "0 0 18px 4px rgb(255 122 26 / 0.55)",
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 9999,
        transition: "width 300ms var(--ease-out), height 300ms var(--ease-out), background 300ms",
      }}
    />
  );
}
