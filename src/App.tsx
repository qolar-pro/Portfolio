import { useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { ArrowRight, Github, Linkedin, Instagram, Mail, X, ExternalLink, Globe, LayoutDashboard, ShoppingCart, ShieldCheck, Palette, Type, Droplets, ArrowUp } from 'lucide-react';
import { LanguageCode, languageNames, translations } from './i18n';
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
    <div className="min-h-screen bg-bg-base text-text-primary font-sans selection:bg-[#8B5CF6] selection:text-white overflow-x-clip">
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
              className="relative w-full max-w-6xl h-[80vh] md:h-[90vh] glass-strong rounded-3xl overflow-hidden flex flex-col shadow-[0_0_120px_rgba(139,92,246,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 z-20">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#22D3EE]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#8B5CF6]/70" />
                    <div className="w-3 h-3 rounded-full bg-[#E879F9]/70" />
                  </div>
                  <span className="font-mono text-xs text-text-secondary ml-4">{previewUrl}</span>
                </div>
                <div className="flex items-center gap-4">
                  <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-white transition-colors" title="Open in new tab">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setPreviewUrl(null)}
                    className="text-text-secondary hover:text-[#E879F9] transition-colors cursor-pointer"
                    title="Close preview"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-bg-base relative">
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-text-secondary p-8 text-center pointer-events-none z-0">
                    <div className="w-8 h-8 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin mb-2" />
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md"
            onClick={() => setShowBrandKit(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl max-h-[85vh] glass-strong rounded-3xl overflow-hidden flex flex-col shadow-[0_0_120px_rgba(139,92,246,0.25)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-white/10 z-20 shrink-0">
                <h3 className="font-display font-bold text-xl md:text-2xl text-text-primary flex items-center gap-3">
                  <Palette className="w-6 h-6 text-[#8B5CF6]" />
                  Brand Identity
                </h3>
                <button
                  onClick={() => setShowBrandKit(false)}
                  className="text-text-secondary hover:text-[#E879F9] transition-colors cursor-pointer p-2 glass rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar space-y-16">

                {/* Logo Section */}
                <section>
                  <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-text-tertiary mb-6 flex items-center gap-2">
                    <Droplets className="w-4 h-4" /> Logomark
                  </h4>
                  <div className="p-8 md:p-12 rounded-2xl glass flex flex-col items-center justify-center text-center">
                    <div className="font-display font-black leading-none aura-text text-4xl md:text-6xl uppercase mb-2">
                      APEX
                    </div>
                    <div className="font-display font-bold leading-none tracking-[0.35em] text-text-primary text-lg md:text-2xl uppercase mt-2">
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
                    <div className="p-8 rounded-2xl glass space-y-4">
                      <div className="text-sm font-mono text-text-secondary uppercase">Display / Unbounded</div>
                      <div className="font-display text-5xl font-black text-white">Aa</div>
                      <div className="text-text-secondary text-sm leading-relaxed">
                        Used for headlines and hero statements. Wide, futuristic, and unmistakably bold.
                      </div>
                    </div>
                    <div className="p-8 rounded-2xl glass space-y-4">
                      <div className="text-sm font-mono text-text-secondary uppercase">Body / Manrope</div>
                      <div className="font-sans text-5xl font-bold text-white">Aa</div>
                      <div className="text-text-secondary text-sm leading-relaxed">
                        Used for body copy and UI readability. Soft, geometric, and clean.
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
                      { name: 'Aura Violet', hex: '#8B5CF6', border: 'border-transparent' },
                      { name: 'Aura Cyan', hex: '#22D3EE', border: 'border-transparent' },
                      { name: 'Aura Fuchsia', hex: '#E879F9', border: 'border-transparent' },
                      { name: 'Deep Space', hex: '#060215', border: 'border-white/10' },
                    ].map((color, idx) => (
                      <div key={`${color.name}-${idx}`} className="flex flex-col gap-3">
                        <div
                          className={`w-full aspect-square rounded-2xl border ${color.border} shadow-inner`}
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
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 p-3 rounded-full glass hover:border-[#8B5CF6]/60 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] text-text-secondary hover:text-white transition-all cursor-pointer group"
          >
            <ArrowUp className="w-5 h-5 group-hover:text-[#22D3EE] group-hover:-translate-y-1 transition-all duration-300" />
            <span className="sr-only">Scroll to top</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ---------- Ambient aura backdrop ---------- */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid" />
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(139,92,246,0.22) 0%, transparent 65%)' }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aura-orb z-0 w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] -top-32 -left-24"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)' }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aura-orb z-0 w-[40vw] h-[40vw] max-w-[520px] max-h-[520px] top-1/3 -right-32"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18) 0%, transparent 70%)' }}
        animate={{ x: [0, -50, 0], y: [0, 60, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="aura-orb z-0 w-[35vw] h-[35vw] max-w-[460px] max-h-[460px] bottom-[-10%] left-1/4"
        style={{ background: 'radial-gradient(circle, rgba(232,121,249,0.15) 0%, transparent 70%)' }}
        animate={{ x: [0, 40, 0], y: [0, -50, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />

      {/* ---------- Floating glass navbar ---------- */}
      <header className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center px-4">
        <div className="glass rounded-full pl-5 pr-2 py-2 flex items-center justify-between gap-4 w-full max-w-3xl shadow-[0_8px_40px_rgba(6,2,21,0.6)]">
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
            <span className="font-display font-bold text-sm tracking-wide text-text-primary">APEX</span>
            <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-widest hidden md:inline">Solutions | GP</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 text-text-secondary hover:text-white transition-all cursor-pointer group"
              >
                <Globe className="w-4 h-4 group-hover:text-[#22D3EE] transition-colors" />
                <span className="font-mono text-xs font-bold uppercase tracking-widest hidden sm:inline-block">{languageNames[lang].substring(0, 3)}</span>
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full mt-3 right-0 min-w-[150px] glass-strong rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col"
                  >
                    {(Object.entries(languageNames) as [LanguageCode, string][]).map(([code, name]) => (
                      <button
                        key={code}
                        onClick={() => {
                          setLang(code);
                          setShowLangMenu(false);
                        }}
                        className={`text-left px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-white/5 ${lang === code ? 'aura-text font-bold' : 'text-text-secondary hover:text-white'}`}
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
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 text-text-secondary hover:text-white transition-all cursor-pointer group"
            >
              <Palette className="w-4 h-4 group-hover:text-[#E879F9] transition-colors" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest hidden sm:inline-block">{t.nav.brandKit}</span>
            </button>

            <a
              href="#work"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.7)] transition-shadow"
            >
              {t.work.title}
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* ---------- Hero ---------- */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-24 overflow-hidden">
          {/* Rotating aura ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <motion.div
              className="w-[80vw] h-[80vw] max-w-[560px] max-h-[560px] rounded-full opacity-35"
              style={{ background: 'conic-gradient(from 0deg, #22D3EE, #8B5CF6, #E879F9, #22D3EE)', filter: 'blur(70px)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute w-[92vw] h-[92vw] max-w-[680px] max-h-[680px] rounded-full border border-white/5" />
            <div className="absolute w-[76vw] h-[76vw] max-w-[540px] max-h-[540px] rounded-full border border-white/10" />
            <motion.div
              className="absolute w-[92vw] h-[92vw] max-w-[680px] max-h-[680px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
            </motion.div>
            <motion.div
              className="absolute w-[76vw] h-[76vw] max-w-[540px] max-h-[540px]"
              animate={{ rotate: -360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#E879F9] shadow-[0_0_16px_rgba(232,121,249,0.9)]" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center max-w-4xl"
          >
            <div className="glass rounded-full px-5 py-2 flex items-center gap-3 mb-10">
              <motion.span
                className="w-2 h-2 rounded-full bg-green-400 shrink-0"
                animate={{ opacity: [1, 0.4, 1], scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="font-mono text-[11px] md:text-xs text-text-secondary uppercase tracking-[0.2em]">{t.nav.available}</span>
            </div>

            <h1 className="font-display font-black uppercase leading-[1.02] tracking-tight aura-text text-[clamp(2.2rem,7vw,5.5rem)] pb-3">
              APEX<br className="sm:hidden" /> SOLUTIONS
            </h1>

            <h2 className="font-sans font-bold text-[clamp(1.1rem,2.4vw,1.8rem)] text-text-primary mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              Giannis Papadopoulos
              <span className="font-medium text-text-tertiary text-[clamp(0.95rem,2vw,1.4rem)]">Γιαννης Παπαδοπουλος</span>
            </h2>

            <p className="text-base md:text-xl text-text-secondary leading-relaxed font-normal max-w-2xl mt-8">
              {t.hero.desc}
            </p>

            <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-text-tertiary mt-8">
              POWERED BY REACT • TYPESCRIPT • TAILWIND CSS • NODE.JS
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
              <motion.a
                href="#work"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] text-white font-bold tracking-widest uppercase text-sm shadow-[0_0_40px_rgba(139,92,246,0.45)] hover:shadow-[0_0_70px_rgba(139,92,246,0.7)] transition-all duration-300 group"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                VIEW WORK
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.a>
              <motion.a
                href="mailto:yioyiomenyioyiomen@gmail.com"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass text-text-primary font-bold tracking-widest uppercase text-sm hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Mail className="w-4 h-4 text-[#22D3EE]" />
                {t.contact.email}
              </motion.a>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-px h-14 bg-gradient-to-b from-transparent via-[#8B5CF6] to-transparent" />
          </motion.div>
        </section>

        <Marquee lang={lang} />

        <main className="pb-24">
          {/* About Section */}
          <Section num="01" title={t.about.title} heading={t.about.heading}>
            <div className="max-w-3xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl md:text-2xl text-text-primary leading-relaxed mb-6 font-medium"
              >
                {t.about.p1}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-base md:text-lg text-text-secondary leading-relaxed mb-12"
              >
                {t.about.p2}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-wrap justify-center gap-3"
              >
                {['Frontend Engineering', 'Backend Systems', 'Database Design', 'UI/UX'].map((skill, idx) => (
                  <div key={`${skill}-${idx}`} className="aura-border px-5 py-2.5 rounded-full text-text-primary text-sm font-semibold">
                    {skill}
                  </div>
                ))}
              </motion.div>
            </div>
          </Section>

          {/* Services Section — bento grid */}
          <Section num="02" title={t.services.title} heading={t.services.heading}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
              <ServiceCard
                icon={<Globe className="w-6 h-6" />}
                title={t.services.items[0].title}
                description={t.services.items[0].desc}
                delay={0}
                className="md:col-span-3"
              />
              <ServiceCard
                icon={<ShoppingCart className="w-6 h-6" />}
                title={t.services.items[1].title}
                description={t.services.items[1].desc}
                delay={0.08}
                className="md:col-span-3"
              />
              <ServiceCard
                icon={<LayoutDashboard className="w-6 h-6" />}
                title={t.services.items[2].title}
                description={t.services.items[2].desc}
                delay={0.16}
                className="md:col-span-2"
              />
              <ServiceCard
                icon={<ShieldCheck className="w-6 h-6" />}
                title={t.services.items[3].title}
                description={t.services.items[3].desc}
                delay={0.24}
                className="md:col-span-2"
              />
              <ServiceCard
                icon={<Palette className="w-6 h-6" />}
                title={t.services.items[4].title}
                description={t.services.items[4].desc}
                delay={0.32}
                className="md:col-span-2"
              />
            </div>
          </Section>

          {/* Selected Work Section */}
          <Section num="03" title={t.work.title} heading={t.work.heading} id="work">
            <div className="space-y-10 md:space-y-16 text-text-secondary">
              <ProjectCard
                num="01"
                title={t.work.projects[3].title}
                tagline={t.work.projects[3].tagline}
                images={['/images/a25-1.jpg', '/images/a25-2.jpg', '/images/a25-3.jpg']}
                description={t.work.projects[3].desc}
                features={['5 Languages', 'Live Chat + Telegram', 'Application Forms', 'Email Notifications', 'Live in Production']}
                stack={['React', 'TypeScript', 'Tailwind', 'Express', 'Redis']}
                align="left"
                previewUrl="https://a25.mk"
                onPreview={() => setPreviewUrl("https://a25.mk")}
              />
              <ProjectCard
                num="02"
                title={t.work.projects[0].title}
                tagline={t.work.projects[0].tagline}
                images={['/images/apex-1.jpg', '/images/apex-2.jpg', '/images/apex-3.jpg']}
                description={t.work.projects[0].desc}
                features={['Full Customization', 'Earnings Calculator', 'Schedule Management', 'Multi-Format Export']}
                stack={['React', 'TypeScript', 'Tailwind', 'Node.js']}
                align="right"
                previewUrl="https://animated-valkyrie-8d4b67.netlify.app/"
                onPreview={() => setPreviewUrl("https://animated-valkyrie-8d4b67.netlify.app/")}
              />
              <ProjectCard
                num="03"
                title={t.work.projects[2].title}
                tagline={t.work.projects[2].tagline}
                images={['/images/dresscode-1.jpg', '/images/dresscode-2.jpg', '/images/dresscode-3.jpg']}
                description={t.work.projects[2].desc}
                features={['Shop & Sale Pages', 'Order Management', 'Admin Panel', 'Product Database', 'Dynamic Hero Banners']}
                stack={['React', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL']}
                align="left"
                previewUrl="https://dresscode-rho.vercel.app/"
                onPreview={() => setPreviewUrl("https://dresscode-rho.vercel.app/")}
              />
              <ProjectCard
                num="04"
                title={t.work.projects[1].title}
                tagline={t.work.projects[1].tagline}
                images={['/images/sos-1.jpg']}
                description={t.work.projects[1].desc}
                features={['Survival Mechanics', 'Expedition System', 'Procedural Worlds', 'Resource Management']}
                stack={['TypeScript', 'Canvas', 'Game Loop', 'Pathfinding']}
                align="right"
                previewUrl="https://celadon-crostata-316852.netlify.app/"
                onPreview={() => setPreviewUrl("https://celadon-crostata-316852.netlify.app/")}
              />
            </div>
          </Section>

          {/* Experience Section */}
          <Section num="04" title={t.experience.title} heading={t.experience.heading} id="experience">
            <Timeline lang={lang} />
          </Section>

          {/* Stack Section */}
          <Section num="05" title={t.stack.title} heading={t.stack.heading}>
            <TechCoverFlow />
          </Section>

          {/* Contact Section */}
          <Section num="06" title={t.contact.title}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <h2
                className="font-display font-black uppercase text-[clamp(2rem,6.5vw,4.5rem)] leading-[1.05] tracking-tight mb-8"
                dangerouslySetInnerHTML={{ __html: t.contact.heading.replace(' ', '<br />') }}
              />
              <p className="text-text-secondary text-lg md:text-2xl mb-12 max-w-2xl">{t.contact.desc}</p>

              <a
                href="mailto:yioyiomenyioyiomen@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 md:gap-6 px-6 md:px-10 py-5 md:py-6 rounded-full glass hover:shadow-[0_0_60px_rgba(139,92,246,0.25)] transition-all duration-500 max-w-full mb-16"
              >
                <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                  <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex flex-col overflow-hidden text-left">
                  <span className="font-mono text-xs md:text-sm text-text-tertiary uppercase tracking-widest mb-1">{t.contact.email}</span>
                  <span className="text-base md:text-2xl font-bold text-text-primary group-hover:aura-text transition-all duration-500 truncate">
                    yioyiomenyioyiomen@gmail.com
                  </span>
                </div>
              </a>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-24">
                <SocialLink href="https://github.com/qolar-pro" icon={<Github className="w-6 h-6" />} label="qolar-pro" />
                <SocialLink href="https://www.linkedin.com/in/blanco-xd-06313b268" icon={<Linkedin className="w-6 h-6" />} label="LinkedIn" />
                <SocialLink href="https://instagram.com/Giannispdl._" icon={<Instagram className="w-6 h-6" />} label="Giannispdl._" />
                <SocialLink href="https://tiktok.com/@thyswedishguy" icon={<TikTokIcon className="w-6 h-6" />} label="thyswedishguy" />
              </div>

              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
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
  heading?: string;
  children: React.ReactNode;
  id?: string;
}

function Section({ num, title, heading, children, id }: SectionProps) {
  return (
    <section id={id} className="relative py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center mb-12 md:mb-16"
        >
          <span className="glass rounded-full px-5 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-text-secondary inline-flex items-center gap-3">
            <span className="aura-text font-bold">{num}</span>
            <span className="w-4 h-px bg-gradient-to-r from-[#8B5CF6] to-transparent" />
            {title}
          </span>
          {heading && (
            <h3 className="font-display font-bold text-[clamp(1.5rem,4vw,3rem)] text-text-primary tracking-tight leading-tight max-w-3xl mt-8">
              {heading}
            </h3>
          )}
        </motion.div>
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

function ProjectCard({ num, title, tagline, description, features, stack, align, className = '', onPreview, images = [] }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative glass rounded-[2rem] p-6 md:p-10 overflow-hidden transition-shadow duration-500 hover:shadow-[0_0_80px_rgba(139,92,246,0.15)] ${className}`}
    >
      {/* Ghost number watermark */}
      <div className="absolute -top-4 right-6 font-display font-black text-[6rem] md:text-[9rem] text-outline opacity-60 pointer-events-none select-none leading-none">
        {num}
      </div>

      <div className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center`}>
        {/* Images */}
        <div className={`${align === 'right' ? 'lg:order-2' : ''} space-y-4`}>
          {images.length > 0 && (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group/img">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/25 to-[#22D3EE]/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
              <img
                src={images[0]}
                alt={`${title} preview 1`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
              />
            </div>
          )}
          {images.length > 1 && (
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1).map((img, idx) => (
                <div key={`${title}-img-${idx + 1}`} className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group/img">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6]/25 to-[#22D3EE]/10 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
                  <img
                    src={img}
                    alt={`${title} preview ${idx + 2}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copy */}
        <div className={`${align === 'right' ? 'lg:order-1' : ''}`}>
          <h4 className="font-display font-bold text-xl md:text-3xl text-text-primary mb-3 leading-tight">
            {title}
          </h4>
          <p className="text-lg text-text-secondary mb-5">{tagline}</p>

          <p className="text-text-secondary leading-relaxed mb-7 text-[15px] md:text-base">
            {description}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {features.map((feature, idx) => (
              <span key={`${title}-feat-${feature}-${idx}`} className="px-3 py-1 glass rounded-full text-xs font-semibold text-text-secondary">
                {feature}
              </span>
            ))}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-3">
              {stack.map((tech, idx) => (
                <span key={`${title}-stack-${tech}-${idx}`} className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                  {tech}
                </span>
              ))}
            </div>

            {onPreview && (
              <button
                onClick={(e) => { e.preventDefault(); onPreview(); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full aura-border text-text-primary font-bold text-sm group/link self-start md:self-auto shrink-0 cursor-pointer hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-shadow"
              >
                Live Preview
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  className?: string;
}

function ServiceCard({ icon, title, description, delay, className = '' }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
      className={`group relative p-7 md:p-8 rounded-3xl glass overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_50px_rgba(139,92,246,0.18)] ${className}`}
    >
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#8B5CF6]/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] text-white flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h4 className="font-display font-bold text-lg md:text-xl text-text-primary mb-3 leading-snug">
        {title}
      </h4>
      <p className="text-text-secondary leading-relaxed text-[15px]">
        {description}
      </p>
    </motion.div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      className="glass rounded-2xl px-4 py-5 flex flex-col items-center gap-3 text-text-secondary hover:text-white hover:shadow-[0_0_35px_rgba(139,92,246,0.2)] transition-all duration-300 group"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4 }}
    >
      <span className="group-hover:text-[#22D3EE] transition-colors duration-300">{icon}</span>
      <span className="font-mono text-[11px] uppercase tracking-widest truncate max-w-full">{label}</span>
    </motion.a>
  );
}
