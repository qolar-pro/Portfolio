'use client';

import { QualityProvider } from '@/lib/quality';
import { AppStateProvider } from '@/components/AppState';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollDirector from '@/components/ScrollDirector';
import VelocitySkew from '@/components/VelocitySkew';
import Preloader from '@/components/Preloader';
import Cursor from '@/components/Cursor';
import CanvasRoot from '@/components/canvas/CanvasRoot';
import Nav from '@/components/Nav';
import Marquee from '@/components/Marquee';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Work from '@/components/sections/Work';
import Experience from '@/components/sections/Experience';
import Stack from '@/components/sections/Stack';
import Contact from '@/components/sections/Contact';
import BrandKit from '@/components/modals/BrandKit';
import Preview from '@/components/modals/Preview';

export default function Site() {
  return (
    <QualityProvider>
      <AppStateProvider>
        <SmoothScroll>
          <Preloader />
          <Cursor />
          <CanvasRoot />
          <ScrollDirector />
          <VelocitySkew />
          <Nav />

          <main id="site-main" className="relative z-10">
            <Hero />
            <Marquee />
            <About />
            <Services />
            <Work />
            <Experience />
            <Stack />
            <Contact />
          </main>

          <BrandKit />
          <Preview />
        </SmoothScroll>
      </AppStateProvider>
    </QualityProvider>
  );
}
