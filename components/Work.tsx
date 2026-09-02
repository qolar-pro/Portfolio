'use client';

import Image from 'next/image';
import { useId, useState } from 'react';
import { LockIcon, hostOf } from '@/components/ProjectShot';
import type { Project, SiteContent } from '@/lib/content';

/**
 * The full case studies.
 *
 * Each project's shots sit in browser chrome carrying its own domain, read
 * off the same `liveUrl` the button links to — so the frame is evidence
 * rather than decoration, and the address shown can never drift from the
 * address visited.
 *
 * A project under embargo shows its shape and none of its design: the shots
 * blur, the outbound link goes, and a padlock replaces the "Live" pill. The
 * copy stays — what the site does is ours to talk about, what it looks like
 * is the client's to reveal.
 */
function Shots({
  project,
  label,
  embargoLabel,
  eager,
}: {
  project: Project;
  label: string;
  embargoLabel: string;
  eager: boolean;
}) {
  const [i, setI] = useState(0);
  const hidden = Boolean(project.embargo);
  const uid = useId();
  const host = hostOf(project.liveUrl);

  return (
    <div className="case-media" data-anim="reveal">
      <div className={`shot ${hidden ? 'is-embargoed' : ''}`}>
        <div className="shot-bar" aria-hidden="true">
          <span className="shot-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="shot-host">{hidden ? '—' : host}</span>
          <span className={`shot-state ${hidden ? 'is-soon' : ''}`}>
            {hidden ? (
              <>
                <LockIcon /> {embargoLabel}
              </>
            ) : (
              <>
                <span className="dot" /> Live
              </>
            )}
          </span>
        </div>

        <div className="shot-view">
          <Image
            src={project.images[i]}
            /* An embargoed shot carries no information the visitor is allowed
               to have, so it gets no descriptive alt either — describing a
               design we are blurring would hand it straight back to a screen
               reader. */
            alt={hidden ? '' : `${project.title} — ${project.tagline}`}
            aria-hidden={hidden || undefined}
            width={1280}
            height={800}
            sizes="(max-width: 860px) 100vw, 55vw"
            priority={eager}
            loading={eager ? undefined : 'lazy'}
            key={project.images[i]}
          />
        </div>
      </div>

      {!hidden && project.images.length > 1 && (
        /* A tablist, not a row of unlabelled dots. Each control now says
           which shot it selects, the selected one is teal AND wider, and the
           group announces itself — the previous version was four buttons
           whose only state was a colour change. */
        <div className="shots" role="tablist" aria-label={label}>
          {project.images.map((src, n) => (
            <button
              key={src}
              type="button"
              role="tab"
              id={`${uid}-tab-${n}`}
              className={n === i ? 'on' : ''}
              aria-selected={n === i}
              aria-label={`${project.title} — ${label} ${n + 1} / ${project.images.length}`}
              onClick={() => setI(n)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Work({ c }: { c: SiteContent }) {
  const main = c.work.projects.filter((p) => !p.lab);
  const lab = c.work.projects.filter((p) => p.lab);

  return (
    <>
      <div className="projects">
        {main.map((p, i) => (
          <article className="project" key={p.slug}>
            <Shots
              project={p}
              label={c.work.featuresLabel}
              embargoLabel={c.work.embargoLabel}
              eager={i === 0}
            />
            <div className="project-copy" data-anim="rise" data-anim-delay="1">
              <span className="project-index">
                0{i + 1} / 0{main.length}
              </span>
              <h2>{p.title}</h2>
              <p className="tag">{p.tagline}</p>
              <p className="desc">{p.desc}</p>

              <p className="meta-label">{c.work.featuresLabel}</p>
              <div className="chips">
                {p.features.map((f) => (
                  <span className="chip feat" key={f}>
                    {f}
                  </span>
                ))}
              </div>

              <p className="meta-label">{c.work.stackLabel}</p>
              <div className="chips">
                {p.stack.map((s) => (
                  <span className="chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>

              {p.embargo ? (
                <p className="embargo-note">
                  <LockIcon /> {c.work.embargoNote}
                </p>
              ) : (
                <a
                  className="btn btn-solid"
                  href={p.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.title} — ${c.work.cta}`}
                >
                  {c.work.cta}
                  <span className="circ" aria-hidden="true">
                    ↗
                  </span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {lab.map((p) => (
        <div className="lab" key={p.slug}>
          <Image src={p.images[0]} alt={p.title} width={640} height={400} sizes="220px" loading="lazy" />
          <div>
            <span className="badge">{c.work.labLabel}</span>
            <h3>{p.title}</h3>
            <p>{p.tagline}</p>
            <p className="lab-note">{c.work.labNote}</p>
          </div>
          <a
            className="btn btn-ghost"
            href={p.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.title} — ${c.work.cta}`}
          >
            {c.work.cta}
            <span className="circ" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      ))}
    </>
  );
}
