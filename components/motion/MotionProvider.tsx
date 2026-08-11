"use client";

import { useEffect } from "react";
import { startHeatLoop, startInputTracking } from "@/lib/motion/heat";
import { startIdleTracking } from "@/lib/motion/idle";
import { startSmoothScroll } from "@/lib/motion/scroll";
import { detectQualityTier } from "@/lib/motion/quality";
import { motion } from "@/lib/motion/store";

/**
 * Mounts every global motion system exactly once. Put it in app/layout.tsx
 * wrapping {children}. Renders nothing itself.
 *
 * Order matters: tier detection first (the loop and scroll both read
 * reducedMotion), then idle, then input, then the loop, then scroll.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { tier, webgl, reduced, pointerFine } = detectQualityTier();
    const s = motion();
    s.setQualityTier(tier);
    s.setWebglEnabled(webgl && tier === "high");
    s.setReducedMotion(reduced);
    s.setHasPointerFine(pointerFine);

    const idle = startIdleTracking();
    const stopInput = startInputTracking(idle.wake);
    const stopLoop = reduced ? () => {} : startHeatLoop();
    const stopScroll = startSmoothScroll();

    return () => {
      stopScroll();
      stopLoop();
      stopInput();
      idle.stop();
    };
  }, []);

  return <>{children}</>;
}
