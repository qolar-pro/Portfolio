import { useState } from 'react';
import { motion } from 'motion/react';
import { Layout, Database, Cloud, Wrench } from 'lucide-react';

const CARDS = [
  {
    id: 'frontend',
    title: 'Frontend Architecture',
    desc: 'Crafting responsive, accessible, and highly interactive user interfaces.',
    icon: <Layout className="w-5 h-5" />,
    skills: ['React', 'Next.js', 'Framer Motion', 'Tailwind', 'Three.js']
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    desc: 'Scalable logic, secure databases, and robust APIs for high-performance.',
    icon: <Database className="w-5 h-5" />,
    skills: ['Node.js', 'PostgreSQL', 'Redis', 'Express', 'GraphQL']
  },
  {
    id: 'cloud',
    title: 'DevOps & Cloud',
    desc: 'Deployment, infrastructure, and CI/CD pipelines for continuous delivery.',
    icon: <Cloud className="w-5 h-5" />,
    skills: ['AWS', 'Docker', 'Vercel', 'Linux', 'GitHub Actions']
  },
  {
    id: 'tools',
    title: 'Ecosystem & Tools',
    desc: 'The essential toolchain that powers the daily development process.',
    icon: <Wrench className="w-5 h-5" />,
    skills: ['Git', 'Figma', 'Jest', 'Webpack', 'Vite']
  }
];

export default function TechCoverFlow() {
  const [activeId, setActiveId] = useState(CARDS[0].id);
  const active = CARDS.find(c => c.id === activeId) ?? CARDS[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {CARDS.map((card) => {
          const isActive = card.id === activeId;
          return (
            <button
              key={card.id}
              onClick={() => setActiveId(card.id)}
              className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] text-white shadow-[0_0_30px_rgba(139,92,246,0.45)]'
                  : 'glass text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              {card.icon}
              <span className="hidden sm:inline">{card.title}</span>
              <span className="sm:hidden">{card.title.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active panel */}
      <div className="relative">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 rounded-full bg-[#8B5CF6]/20 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#22D3EE] via-[#8B5CF6] to-[#E879F9] text-white flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                {active.icon}
              </div>

              <h4 className="font-display text-xl md:text-2xl font-bold text-text-primary mb-4">
                {active.title}
              </h4>

              <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                {active.desc}
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                {active.skills.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                    className="aura-border px-4 py-2 text-sm font-semibold rounded-full text-text-primary whitespace-nowrap"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  );
}
