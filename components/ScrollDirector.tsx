'use client';

import { useEffect } from 'react';
import { ScrollTrigger, registerGsap } from '@/lib/motion';
import { journey, SECTION_ORDER } from '@/lib/journey';

/**
 * The conductor. Maintains journey.progress (0..1 across the whole page)
 * and measures per-section scroll anchors so the 3D camera path can map
 * scroll position to stations in space regardless of actual DOM heights.
 */
export default function ScrollDirector() {
  useEffect(() => {
    registerGsap();

    const master = ScrollTrigger.create({
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        journey.progress = self.progress;
      },
    });

    const measure = () => {
      const max = ScrollTrigger.maxScroll(window);
      if (max <= 0) return;
      const anchors = SECTION_ORDER.map((id) => {
        const el = document.getElementById(`section-${id}`);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        // scroll position where the section's center sits at viewport center
        const center = top + rect.height / 2 - window.innerHeight / 2;
        return Math.min(1, Math.max(0, center / max));
      });
      anchors[0] = 0;
      anchors[anchors.length - 1] = 1;
      journey.anchors = anchors;
    };

    measure();
    // re-measure after fonts/images settle and on resize
    const t = setTimeout(measure, 800);
    window.addEventListener('resize', measure);
    ScrollTrigger.addEventListener('refresh', measure);

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      ScrollTrigger.removeEventListener('refresh', measure);
      master.kill();
    };
  }, []);

  return null;
}
