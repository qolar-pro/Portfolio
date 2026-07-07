'use client';

import SectionShell from './SectionShell';
import { useApp } from '@/components/AppState';
import Magnetic from '@/components/Magnetic';
import TextRoll from '@/components/TextRoll';
import TiltStage from '@/components/TiltStage';
import type { Project } from '@/lib/i18n';

/**
 * Selected work as full showcase moments: oversized ghost numerals,
 * screenshots under a neon veil, alternating composition. The cursor
 * becomes a VIEW disc over media; every panel opens the live site.
 */
export default function Work() {
  const { t } = useApp();

  return (
    <SectionShell id="work" index="03" label={t.work.label} heading={t.work.heading}>
      <div className="flex flex-col gap-[14vh]">
        {t.work.projects.map((project, i) => (
          <ProjectPanel key={project.title} project={project} index={i} flip={i % 2 === 1} cta={t.work.cta} />
        ))}
      </div>
    </SectionShell>
  );
}

function ProjectPanel({ project, index, flip, cta }: { project: Project; index: number; flip: boolean; cta: string }) {
  const { setPreviewUrl } = useApp();
  const open = () => setPreviewUrl(project.url);

  return (
    <article data-reveal className="group/panel relative">
      {/* ghost numeral */}
      <span
        aria-hidden
        className="text-hollow pointer-events-none absolute -top-16 z-0 font-display text-[clamp(8rem,20vw,18rem)] leading-none font-bold opacity-[0.1] select-none"
        style={flip ? { right: '-0.05em' } : { left: '-0.05em' }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className={`relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12`}>
        {/* media — a 3D stage: angled screenshot slab with depth-floating detail shots */}
        <div className={`lg:col-span-7 ${flip ? 'lg:order-2 lg:col-start-6' : ''} ${project.images.length > 1 ? 'pb-12 md:pb-16' : ''}`}>
          <TiltStage baseX={4} baseY={flip ? 9 : -9} idleDelay={index * 0.9}>
            <button
              onClick={open}
              data-cursor="view"
              className="group/media relative block w-full overflow-hidden border border-fog/10 shadow-[0_38px_70px_-18px_rgba(0,0,0,0.85)] transition-[border-color,box-shadow] duration-500 hover:border-plasma/40 hover:shadow-[0_38px_80px_-16px_rgba(138,92,255,0.25)]"
              aria-label={`${project.title} — ${cta}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={project.images[0]}
                  alt={`${project.title} interface`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                {/* neon veil */}
                <div className="absolute inset-0 bg-gradient-to-tr from-plasma/25 via-transparent to-volt/15 opacity-0 transition-opacity duration-700 group-hover/media:opacity-100" />
                <div className="absolute inset-0 bg-void/30 transition-opacity duration-700 group-hover/media:opacity-0" />
                {/* scan line */}
                <div className="absolute inset-x-0 top-0 h-px translate-y-[-2px] bg-gradient-to-r from-transparent via-flare to-transparent opacity-0 transition-all duration-1000 group-hover/media:translate-y-[38vh] group-hover/media:opacity-70" />
              </div>
            </button>

            {/* depth layers — detail shots hovering above the slab */}
            {project.images[1] && (
              <div
                className={`absolute -bottom-10 w-[44%] md:-bottom-14 ${flip ? 'right-[-4%] md:right-[-6%]' : 'left-[-4%] md:left-[-6%]'}`}
                style={{ transform: 'translateZ(70px)' }}
              >
                <div className="thumb-bob" style={{ animationDelay: '0.4s' }}>
                  <button
                    onClick={open}
                    data-cursor="view"
                    className="group/thumb relative block w-full overflow-hidden border border-fog/15 bg-void shadow-[0_24px_45px_-12px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-volt/50"
                    style={{ transform: `rotate(${flip ? 2 : -2}deg)` }}
                  >
                    <div className="relative aspect-[16/9]">
                      <img src={project.images[1]} alt={`${project.title} detail 2`} loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-void/25 transition-opacity duration-500 group-hover/thumb:opacity-0" />
                    </div>
                  </button>
                </div>
              </div>
            )}
            {project.images[2] && (
              <div
                className={`absolute -top-8 w-[32%] md:-top-10 ${flip ? 'left-[-3%]' : 'right-[-3%]'}`}
                style={{ transform: 'translateZ(110px)' }}
              >
                <div className="thumb-bob" style={{ animationDelay: '1.3s' }}>
                  <button
                    onClick={open}
                    data-cursor="view"
                    className="group/thumb relative block w-full overflow-hidden border border-fog/15 bg-void shadow-[0_20px_38px_-10px_rgba(0,0,0,0.9)] transition-colors duration-500 hover:border-flare/50"
                    style={{ transform: `rotate(${flip ? -2.5 : 2.5}deg)` }}
                  >
                    <div className="relative aspect-[16/9]">
                      <img src={project.images[2]} alt={`${project.title} detail 3`} loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-void/25 transition-opacity duration-500 group-hover/thumb:opacity-0" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </TiltStage>
        </div>

        {/* copy */}
        <div className={`lg:col-span-5 ${flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-fog uppercase md:text-4xl">
            {project.title}
          </h3>
          <p className="mt-3 font-display text-sm font-medium text-plasma md:text-base">{project.tagline}</p>
          <p className="mt-5 text-sm leading-relaxed text-mist md:text-[15px]">{project.desc}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.features.map((f) => (
              <span
                key={f}
                className="border border-fog/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] text-mist uppercase"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-4 border-t border-fog/10 pt-6">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {project.stack.map((tech) => (
                <span key={tech} className="font-mono text-[10px] tracking-[0.15em] text-ghost uppercase">
                  {tech}
                </span>
              ))}
            </div>
            <Magnetic strength={0.4} className="shrink-0">
              <button
                onClick={open}
                data-cursor="link"
                className="group/cta roll-trigger relative font-mono text-[11px] tracking-[0.2em] text-fog uppercase"
              >
                <TextRoll text={cta} />{' '}
                <span className="inline-block transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
                <span className="mt-1 block h-px w-full origin-left scale-x-0 bg-gradient-to-r from-volt to-flare transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:scale-x-100" />
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </article>
  );
}
