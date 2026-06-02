import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Layout, Database, Cloud, Wrench } from 'lucide-react';

const CARDS = [
  {
    id: 'frontend',
    title: 'Frontend Architecture',
    desc: 'Crafting responsive, accessible, and highly interactive user interfaces.',
    icon: <Layout className="w-8 h-8 text-[#E94560]" />,
    skills: ['React', 'Next.js', 'Framer Motion', 'Tailwind', 'Three.js']
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    desc: 'Scalable logic, secure databases, and robust APIs for high-performance.',
    icon: <Database className="w-8 h-8 text-[#E94560]" />,
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Express', 'GraphQL']
  },
  {
    id: 'cloud',
    title: 'DevOps & Cloud',
    desc: 'Deployment, infrastructure, and CI/CD pipelines for continuous delivery.',
    icon: <Cloud className="w-8 h-8 text-[#E94560]" />,
    skills: ['AWS', 'Docker', 'Vercel', 'Linux', 'GitHub Actions']
  },
  {
    id: 'tools',
    title: 'Ecosystem & Tools',
    desc: 'The essential toolchain that powers the daily development process.',
    icon: <Wrench className="w-8 h-8 text-[#E94560]" />,
    skills: ['Git', 'Figma', 'Jest', 'Webpack', 'Vite']
  }
];

export default function TechCoverFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % CARDS.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + CARDS.length) % CARDS.length);

  return (
    <div className="w-full flex flex-col items-center mt-8 mb-12">
      <div 
        className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center overflow-visible" 
        style={{ perspective: 1200 }}
      >
        <div className="absolute inset-x-0 w-full flex items-center justify-center pointer-events-none z-0 opacity-40">
           <div className="w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-[#E94560]/30 to-transparent absolute top-1/2 -translate-y-1/2" />
        </div>

        {CARDS.map((card, index) => {
          let offset = index - currentIndex;
          const len = CARDS.length;
          
          if (offset > len / 2) offset -= len;
          if (offset < -len / 2) offset += len;
          
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);
          
          let zIndex = 10 - absOffset;
          if (absOffset > 1) zIndex = 1;

          // Mobile adjustments
          const xOffset = isMobile ? 120 : 280;

          return (
            <motion.div
              key={card.id}
              initial={false}
              animate={{
                x: offset * xOffset,
                z: isCenter ? 0 : -250,
                rotateY: offset * -35,
                scale: isCenter ? 1 : 0.85,
                opacity: isCenter ? 1 : absOffset > 1 ? 0 : 0.4,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 1
              }}
              onClick={() => {
                if (offset === 1) next();
                else if (offset === -1) prev();
              }}
              className={`absolute w-[280px] md:w-[400px] h-[380px] md:h-[450px] rounded-3xl border border-space-grey-border bg-[#0A0406] flex flex-col overflow-hidden text-left ${
                isCenter ? 'cursor-default shadow-[0_0_40px_rgba(233,69,96,0.2)] ring-1 ring-[#E94560]/50 z-20' : 'cursor-pointer z-10 hover:opacity-60'
              }`}
              style={{
                zIndex,
                pointerEvents: absOffset > 1 ? 'none' : 'auto'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E94560] to-[#E94560]/10 opacity-70" />
              
              <div className="p-6 md:p-8 flex flex-col h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-bg-surface/50 to-transparent">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-bg-base border border-space-grey-border flex items-center justify-center mb-6 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)] shrink-0">
                  {card.icon}
                </div>
                
                <h4 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
                  {card.title}
                </h4>
                
                <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-8 flex-grow">
                  {card.desc}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {card.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium rounded-full border border-space-grey-border bg-bg-base text-text-secondary whitespace-nowrap"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-6 mt-4 md:mt-8 z-20">
        <button onClick={prev} className="w-12 h-12 rounded-full border border-space-grey-border flex items-center justify-center hover:border-[#E94560] hover:text-[#E94560] transition-colors bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-[#E94560]">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={next} className="w-12 h-12 rounded-full border border-space-grey-border flex items-center justify-center hover:border-[#E94560] hover:text-[#E94560] transition-colors bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-[#E94560]">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
