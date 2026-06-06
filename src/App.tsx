import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Github, Linkedin, Twitter, Instagram, Mail, X, ExternalLink, Globe, LayoutDashboard, Database, ShoppingCart, ShieldCheck, Palette, Type, Droplets, ArrowUp } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { LanguageCode, languageNames, translations } from './i18n';
import Hero3D from './components/Hero3D';
import TechCoverFlow from './components/TechCoverFlow';
import CustomCursor from './components/CustomCursor';

import Marquee from './components/Marquee';
import Timeline from './components/Timeline';

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function App() {
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 1000], [0, 50]);
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showBrandKit, setShowBrandKit] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [lang, setLang] = useState<LanguageCode>('en');
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const t = translations[lang];

  useEffect(() => {
    return scrollY.on('change', (latest) => {
      setShowScrollTop(latest > window.innerHeight * 0.8);
    });
  }, [scrollY]);

  useEffect(() => {
    if (previewUrl || showBrandKit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [previewUrl, showBrandKit]);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-[#E94560] selection:text-white">
      <Analytics />
      <CustomCursor />
      <AnimatePresence>
        {previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-md"
            onClick={() => setPreviewUrl(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl h-[80vh] md:h-[90vh] bg-bg-surface border border-space-grey-border rounded-2xl overflow-hidden flex flex-col shadow-[0_0_80px_rgba(233,69,96,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-space-grey-border bg-bg-base/50 backdrop-blur-sm z-20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="font-mono text-xs text-text-secondary ml-4">{previewUrl}</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors" title="Open in new tab">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => setPreviewUrl(null)}
                    className="text-text-secondary hover:text-[#E94560] transition-colors cursor-pointer"
                    title="Close preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-bg-base relative">
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-text-secondary p-8 text-center pointer-events-none z-0">
                    <div className="w-8 h-8 rounded-full border-2 border-[#E94560] border-t-transparent animate-spin mb-2" />
                    <p className="font-medium text-lg text-text-primary">Loading preview...</p>
                    <p className="text-sm text-text-tertiary">If the site refuses to connect due to iframe protection, click the external link icon above.</p>
                 </div>
                 <iframe 
                   src={previewUrl} 
                   className="w-full h-full border-0 relative z-10 bg-transparent"
                   loading="lazy"
                   sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                 />
              </div>
            </motion.div>
          </motion.div>
        )}

        {showBrandKit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
            onClick={() => setShowBrandKit(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-bg-surface border border-space-grey-border rounded-2xl overflow-hidden flex flex-col shadow-[0_0_80px_rgba(233,69,96,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-space-grey-border bg-bg-base/50 backdrop-blur-sm z-20 shrink-0">
                <h3 className="font-extrabold text-2xl text-text-primary flex items-center gap-3">
                  <Palette className="w-6 h-6 text-[#E94560]" />
                  Brand Identity
                </h3>
                <button 
                  onClick={() => setShowBrandKit(false)}
                  className="text-text-secondary hover:text-[#E94560] transition-colors cursor-pointer p-2 bg-space-grey rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar bg-bg-base space-y-16">
                
                {/* Logo Section */}
                <section>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary mb-6 flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> Logomark
                  </h4>
                  <div className="p-8 md:p-12 rounded-xl border border-space-grey-border bg-bg-surface flex flex-col items-center justify-center text-center">
                    <div className="font-black leading-[0.85] tracking-[-0.04em] text-transparent bg-clip-text text-5xl md:text-7xl uppercase mb-2"
                      style={{ 
                        backgroundImage: 'linear-gradient(180deg, #FF6B8A 0%, #E94560 50%, #C2185B 100%)',
                      }}
                    >
                      APEX
                    </div>
                    <div className="font-black leading-[0.85] tracking-[0.2em] text-text-primary text-xl md:text-3xl uppercase mt-2">
                      SOLUTIONS
                    </div>
                  </div>
                </section>

                {/* Typography Section */}
                <section>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary mb-6 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Typography
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-xl border border-space-grey-border bg-bg-surface space-y-4">
                      <div className="text-sm font-mono text-text-secondary uppercase">Primary / Inter</div>
                      <div className="font-sans text-5xl font-black text-white">Aa</div>
                      <div className="text-text-secondary text-sm leading-relaxed">
                        Used for headlines, body copy, and UI element readability. Modern, geometric, and clean.
                      </div>
                    </div>
                    <div className="p-8 rounded-xl border border-space-grey-border bg-bg-surface space-y-4">
                      <div className="text-sm font-mono text-text-secondary uppercase">Mono / JetBrains</div>
                      <div className="font-mono text-5xl font-bold text-white">Aa</div>
                      <div className="text-text-secondary text-sm leading-relaxed">
                        Used for technical labels, metadata, and overlines. Delivers a distinct engineering aesthetic.
                      </div>
                    </div>
                  </div>
                </section>

                {/* Colors Section */}
                <section>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary mb-6 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Color Palette
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Cosmic Crimson', hex: '#E94560', border: 'border-transparent' },
                      { name: 'Base Dark', hex: '#0A0508', border: 'border-space-grey-border' },
                      { name: 'Surface Gray', hex: '#14080C', border: 'border-space-grey-border' },
                      { name: 'Text Primary', hex: '#F5F0F2', border: 'border-transparent' },
                    ].map((color, idx) => (
                      <div key={`${color.name}-${idx}`} className="flex flex-col gap-3">
                        <div 
                          className={`w-full aspect-square rounded-xl border ${color.border} shadow-inner bg-bg-surface`}
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <div className="font-bold text-sm text-text-primary">{color.name}</div>
                          <div className="font-mono text-xs text-text-secondary uppercase">{color.hex}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </motion.div>
          </motion.div>
        )}

        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-3 rounded-full bg-bg-surface/80 backdrop-blur-md border border-space-grey-border hover:border-[#E94560]/50 hover:shadow-[0_0_20px_rgba(233,69,96,0.2)] text-text-secondary hover:text-white transition-all cursor-pointer group"
          >
            <ArrowUp className="w-5 h-5 group-hover:text-[#E94560] group-hover:-translate-y-1 transition-all duration-300" />
            <span className="sr-only">Scroll to top</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Background Glow */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #3D0A1A 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-6 lg:px-8 relative z-20 gap-4">
          <div className="font-mono font-bold tracking-tight text-xl text-text-primary flex items-center gap-2">
            APEX SOLUTIONS <span className="opacity-50 font-normal hidden md:inline">| GP</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-space-grey-border rounded-full hover:border-[#E94560]/50 hover:shadow-[0_0_20px_rgba(233,69,96,0.15)] bg-bg-surface/50 text-text-secondary hover:text-white transition-all cursor-pointer group backdrop-blur-sm shrink-0"
              >
                <Globe className="w-4 h-4 group-hover:text-[#E94560] transition-colors" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest hidden sm:inline-block">{languageNames[lang].substring(0, 3)}</span>
              </button>
              
              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-2 left-0 md:right-0 md:left-auto min-w-[140px] bg-bg-surface border border-space-grey-border rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col"
                  >
                    {(Object.entries(languageNames) as [LanguageCode, string][]).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLang(code);
                          setShowLangMenu(false);
                        }}
                        className={`text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-space-grey ${lang === code ? 'text-[#E94560] bg-space-grey/50 font-bold' : 'text-text-secondary hover:text-white'}`}
                      >
                        {name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setShowBrandKit(true)}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 border border-space-grey-border rounded-full hover:border-[#E94560]/50 hover:shadow-[0_0_20px_rgba(233,69,96,0.15)] bg-bg-surface/50 text-text-secondary hover:text-white transition-all cursor-pointer group backdrop-blur-sm shrink-0"
            >
              <Palette className="w-4 h-4 group-hover:text-[#E94560] transition-colors" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest hidden sm:inline-block">{t.nav.brandKit}</span>
            </button>
            <div className="flex items-center gap-2 md:gap-3 bg-bg-surface border border-space-grey-border rounded-full px-3 py-1.5 md:px-4 md:py-2 opacity-90 backdrop-blur-sm shrink-0">
              <motion.div 
                className="w-2 h-2 rounded-full bg-green-500 shrink-0"
                animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[10px] sm:text-xs md:text-sm font-mono text-text-secondary uppercase tracking-wider">{t.nav.available}</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-6 lg:px-8 relative pt-24 pb-20">
          <Hero3D />
          <motion.div style={{ y: yHero, opacity: opacityHero }} className="space-y-6 md:space-y-8 pointer-events-none relative z-10 md:[&_a]:pointer-events-auto">
            <div className="flex flex-col gap-3">
              <motion.h1 
                className="font-black leading-[0.85] tracking-[-0.04em] text-transparent bg-clip-text pb-2 uppercase"
                style={{ 
                  fontSize: 'clamp(3rem, 11vw, 9rem)',
                  backgroundImage: 'linear-gradient(180deg, #FF6B8A 0%, #E94560 50%, #C2185B 100%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{ backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"] }}
                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
              >
                APEX SOLUTIONS
              </motion.h1>
              <h2 className="font-extrabold text-[clamp(1.5rem,3vw,3rem)] text-text-primary leading-tight tracking-[-0.02em] mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                Giannis Papadopoulos <span className="opacity-50 font-normal text-[clamp(1.2rem,2.5vw,2.5rem)]">Γιαννης Παπαδοπουλος</span>
              </h2>
            </div>
            
            <div className="flex items-stretch gap-6 max-w-2xl mt-8">
              <div className="w-1 rounded-full bg-gradient-to-b from-[#FF6B8A] via-[#E94560] to-[#C2185B] shrink-0" />
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-normal">
                {t.hero.desc}
              </p>
            </div>

            <div className="font-mono text-xs uppercase tracking-[0.15em] text-text-tertiary mt-8">
              POWERED BY REACT • TYPESCRIPT • TAILWIND CSS • NODE.JS
            </div>

            <div className="pt-8">
              <motion.a 
                href="#work"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-b from-[#FF6B8A] via-[#E94560] to-[#C2185B] text-white font-bold tracking-wide uppercase text-sm shadow-[0_0_40px_rgba(233,69,96,0.35)] hover:shadow-[0_0_60px_rgba(233,69,96,0.6)] transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                VIEW WORK
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-12 left-6 lg:left-8"
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#E94560] to-transparent" />
          </motion.div>
        </section>

        <Marquee lang={lang} />

        <main className="pb-32">
          {/* About Section */}
          <Section num="01" title={t.about.title}>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold text-3xl md:text-5xl text-text-primary tracking-tight mb-8"
            >
              {t.about.heading}
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6 max-w-3xl"
            >
              {t.about.p1}
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-text-secondary leading-relaxed mb-12 max-w-3xl"
            >
              {t.about.p2}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              {['Frontend Engineering', 'Backend Systems', 'Database Design', 'UI/UX'].map((skill, idx) => (
                <div key={`${skill}-${idx}`} className="px-5 py-2.5 rounded-full border border-space-grey-border bg-bg-surface text-text-primary text-sm font-medium hover:border-[#E94560] transition-colors duration-300">
                  {skill}
                </div>
              ))}
            </motion.div>
          </Section>

          {/* Services Section */}
          <Section num="02" title={t.services.title}>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold text-3xl md:text-5xl text-text-primary tracking-tight mb-16"
            >
              {t.services.heading}
            </motion.h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ServiceCard 
                icon={<Globe className="w-8 h-8 text-[#E94560]" />}
                title={t.services.items[0].title}
                description={t.services.items[0].desc}
                delay={0}
              />
              <ServiceCard 
                icon={<ShoppingCart className="w-8 h-8 text-[#E94560]" />}
                title={t.services.items[1].title}
                description={t.services.items[1].desc}
                delay={0.1}
              />
              <ServiceCard 
                icon={<LayoutDashboard className="w-8 h-8 text-[#E94560]" />}
                title={t.services.items[2].title}
                description={t.services.items[2].desc}
                delay={0.2}
              />
              <ServiceCard 
                icon={<ShieldCheck className="w-8 h-8 text-[#E94560]" />}
                title={t.services.items[3].title}
                description={t.services.items[3].desc}
                delay={0.3}
              />
              <ServiceCard 
                icon={<Palette className="w-8 h-8 text-[#E94560]" />}
                title={t.services.items[4].title}
                description={t.services.items[4].desc}
                delay={0.4}
              />
            </div>
          </Section>

          {/* Experience Section */}
          <Section num="03" title={t.experience.title} id="experience">
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold text-3xl md:text-5xl text-text-primary tracking-tight mb-16"
            >
              {t.experience.heading}
            </motion.h3>

            <Timeline lang={lang} />
          </Section>

          {/* Selected Work Section */}
          <Section num="04" title={t.work.title} id="work">
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold text-3xl md:text-5xl text-text-primary tracking-tight mb-16"
            >
              {t.work.heading}
            </motion.h3>

            <div className="space-y-8 md:space-y-16 text-text-secondary">
              <ProjectCard 
                num="01"
                title={t.work.projects[0].title}
                tagline={t.work.projects[0].tagline}
                images={['https://placehold.co/800x450/1A1A1F/6B5F65?text=Apex+Shift+Dashboard', 'https://placehold.co/800x450/1A1A1F/6B5F65?text=Schedule+Editor']}
                description={t.work.projects[0].desc}
                features={['Full Customization', 'Earnings Calculator', 'Schedule Management', 'Multi-Format Export']}
                stack={['React', 'TypeScript', 'Tailwind', 'Node.js']}
                align="left"
                previewUrl="https://animated-valkyrie-8d4b67.netlify.app/"
                onPreview={() => setPreviewUrl("https://animated-valkyrie-8d4b67.netlify.app/")}
              />
              <ProjectCard 
                num="02"
                title={t.work.projects[1].title}
                tagline={t.work.projects[1].tagline}
                images={['https://placehold.co/800x450/1A1A1F/6B5F65?text=SoS+Gameplay', 'https://placehold.co/800x450/1A1A1F/6B5F65?text=Inventory+System', 'https://placehold.co/800x450/1A1A1F/6B5F65?text=World+Map']}
                description={t.work.projects[1].desc}
                features={['Survival Mechanics', 'Expedition System', 'Procedural Worlds', 'Resource Management']}
                stack={['TypeScript', 'Canvas', 'Game Loop', 'Pathfinding']}
                align="right"
                previewUrl="https://celadon-crostata-316852.netlify.app/"
                onPreview={() => setPreviewUrl("https://celadon-crostata-316852.netlify.app/")}
              />
              <ProjectCard 
                num="03"
                title={t.work.projects[2].title}
                tagline={t.work.projects[2].tagline}
                images={['https://placehold.co/800x450/1A1A1F/6B5F65?text=DressCode+Storefront', 'https://placehold.co/800x450/1A1A1F/6B5F65?text=Product+Details']}
                description={t.work.projects[2].desc}
                features={['Shop & Sale Pages', 'Order Management', 'Admin Panel', 'Product Database', 'Dynamic Hero Banners']}
                stack={['React', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL']}
                align="left"
                previewUrl="https://dresscode-rho.vercel.app/"
                onPreview={() => setPreviewUrl("https://dresscode-rho.vercel.app/")}
              />
            </div>
          </Section>

          {/* Stack Section */}
          <Section num="05" title={t.stack.title}>
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-extrabold text-3xl md:text-5xl text-text-primary tracking-tight mb-16 relative z-10"
            >
              {t.stack.heading}
            </motion.h3>

            <div className="relative z-10 w-full mt-8 overflow-hidden py-12">
              <TechCoverFlow />
            </div>
          </Section>

          {/* Contact Section */}
          <Section num="06" title={t.contact.title}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="pt-12"
            >
              <h2 className="font-extrabold text-[clamp(2.5rem,8vw,6rem)] text-text-primary leading-none tracking-tight mb-12" dangerouslySetInnerHTML={{ __html: t.contact.heading.replace(' ', '<br />') }}></h2>
              
              <div className="flex flex-col mb-20">
                <p className="text-text-secondary text-xl md:text-2xl mb-8">{t.contact.desc}</p>
                <a 
                  href="mailto:yioyiomenyioyiomen@gmail.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-4 md:gap-6 px-6 md:px-8 py-5 md:py-6 rounded-2xl bg-bg-surface border border-space-grey-border hover:border-[#E94560]/40 hover:shadow-[0_0_40px_rgba(233,69,96,0.1)] transition-all duration-500 self-start max-w-full"
                >
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-space-grey group-hover:bg-gradient-to-br from-[#FF6B8A] via-[#E94560] to-[#C2185B] transition-colors duration-500">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-text-secondary group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="font-mono text-xs md:text-sm text-text-tertiary uppercase tracking-widest mb-1">{t.contact.email}</span>
                    <span className="text-lg md:text-2xl font-bold text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF6B8A] group-hover:to-[#C2185B] transition-all duration-500 truncate">
                      yioyiomenyioyiomen@gmail.com
                    </span>
                  </div>
                </a>
              </div>

              <div className="flex flex-col md:flex-row flex-wrap gap-8 md:gap-12 mb-32">
                <SocialLink href="https://github.com/qolar-pro" icon={<Github className="w-6 h-6" />} label="qolar-pro" />
                <SocialLink href="https://www.linkedin.com/in/blanco-xd-06313b268" icon={<Linkedin className="w-6 h-6" />} label="LinkedIn" />
                <SocialLink href="https://instagram.com/Giannispdl._" icon={<Instagram className="w-6 h-6" />} label="Giannispdl._" />
                <SocialLink href="https://tiktok.com/@thyswedishguy" icon={<TikTokIcon className="w-6 h-6" />} label="thyswedishguy" />
              </div>

              <div className="border-t border-space-grey-border pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                  &copy; {new Date().getFullYear()} Giannis Papadopoulos
                </p>
                <p className="font-mono text-xs text-text-tertiary uppercase tracking-wider">
                  Crafted with intention.
                </p>
              </div>
            </motion.div>
          </Section>

        </main>
      </div>
    </div>
  );
}

// Subcomponents

interface SectionProps {
  num: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}

function Section({ num, title, children, id }: SectionProps) {
  return (
    <section id={id} className="relative flex flex-col lg:flex-row py-20 lg:py-32 px-6 lg:px-8">
      <div className="lg:w-1/4 flex-shrink-0 mb-8 lg:mb-0 relative">
        <div className="sticky top-24 inline-flex flex-col">
          <span className="font-mono font-bold text-sm text-text-tertiary tracking-widest uppercase">
            {num} <span className="opacity-40">/</span> {title}
          </span>
        </div>
      </div>
      <div className="lg:w-3/4 flex flex-col z-10 w-full">
        {children}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  num: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  stack: string[];
  align: 'left' | 'right';
  className?: string;
  previewUrl?: string;
  onPreview?: () => void;
  images?: string[];
}

function ProjectCard({ num, title, tagline, description, features, stack, className = '', previewUrl, onPreview, images = [] }: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className={`group relative bg-bg-surface border border-space-grey-border rounded-xl p-8 md:p-12 transition-all duration-400 hover:border-[#E94560]/40 hover:shadow-[0_0_50px_rgba(233,69,96,0.05)] w-full block ${className}`}
    >
      <div className="font-mono text-xl text-text-tertiary mb-6 opacity-60 font-bold">{num}</div>
      <h4 className="font-extrabold text-3xl md:text-4xl text-text-primary mb-3">
        {title}
      </h4>
      <p className="text-xl text-text-secondary mb-6">{tagline}</p>
      
      {images && images.length > 0 && (
        <div className={`grid gap-4 mb-8 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
          {images.map((img, idx) => (
            <div key={`${title}-img-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border border-space-grey-border bg-space-grey group/img">
              <div className="absolute inset-0 bg-[#E94560]/20 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
              <img 
                src={img} 
                alt={`${title} preview ${idx + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
              />
            </div>
          ))}
        </div>
      )}

      <p className="text-text-secondary leading-relaxed mb-8">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-10">
        {features.map((feature, idx) => (
          <span key={`${title}-feat-${feature}-${idx}`} className="px-3 py-1 bg-space-grey rounded-full text-xs font-medium text-text-secondary border border-space-grey-border">
            {feature}
          </span>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-space-grey-border">
        <div className="flex flex-wrap gap-3">
          {stack.map((tech, idx) => (
            <span key={`${title}-stack-${tech}-${idx}`} className="font-mono text-xs uppercase tracking-[0.1em] text-text-tertiary">
              {tech}
            </span>
          ))}
        </div>
        
        {onPreview ? (
          <button 
            onClick={(e) => { e.preventDefault(); onPreview(); }}
            className="inline-flex items-center gap-2 text-text-primary font-bold group/link relative self-start md:self-auto shrink-0 cursor-pointer"
          >
            <span className="relative z-10">Live Preview</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 relative z-10" />
            <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-gradient-to-r from-[#FF6B8A] to-[#E94560] scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-300 ease-out" />
          </button>
        ) : (
          <a href="#" className="inline-flex items-center gap-2 text-text-primary font-bold group/link relative self-start md:self-auto shrink-0">
            <span className="relative z-10">View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1 relative z-10" />
            <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-gradient-to-r from-[#FF6B8A] to-[#E94560] scale-x-0 group-hover/link:scale-x-100 origin-left transition-transform duration-300 ease-out" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function ServiceCard({ icon, title, description, delay }: ServiceCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group p-8 rounded-2xl bg-bg-surface border border-space-grey-border hover:border-[#E94560]/40 hover:shadow-[0_0_30px_rgba(233,69,96,0.1)] transition-all duration-300"
    >
      <div className="w-14 h-14 rounded-full bg-space-grey border border-space-grey-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h4 className="font-bold text-2xl text-text-primary mb-3">
        {title}
      </h4>
      <p className="text-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href}
      className="flex items-center gap-3 text-text-secondary hover:text-[#FF6B8A] transition-colors duration-300 group"
      target="_blank"
      rel="noopener noreferrer"
    >
      <motion.div whileHover={{ y: -2 }} className="flex items-center gap-3">
        {icon}
        <span className="font-mono text-sm uppercase tracking-widest">{label}</span>
      </motion.div>
    </a>
  );
}
