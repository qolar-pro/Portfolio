'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Project, SiteContent } from '@/lib/content';

/**
 * A project under embargo shows its shape and none of its design: the shots
 * blur, the outbound link goes, and a padlock replaces the "Live" pill. The
 * copy stays — what the site does is ours to talk about, what it looks like
 * is the client's to reveal.
 */
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
    </svg>
  );
}

function Shots({
  project,
  label,
  embargoLabel,
}: {
  project: Project;
  label: string;
  embargoLabel: string;
}) {
  const [i, setI] = useState(0);
  const hidden = Boolean(project.embargo);

  return (
    <div className={`project-media ${hidden ? 'is-embargoed' : ''}`}>
      <Image
        src={project.images[i]}
        /* An embargoed shot carries no information the visitor is allowed to
           have, so it gets no descriptive alt either — describing a design we
           are blurring would hand it straight back to a screen reader. */
        alt={hidden ? '' : `${project.title} — ${project.tagline}`}
        aria-hidden={hidden || undefined}
        width={1280}
        height={800}
        sizes="(max-width: 860px) 100vw, 55vw"
        priority={false}
        key={project.images[i]}
      />
      <span className="frame" />
      {hidden ? (
        <span className="project-live is-soon">
          <LockIcon /> {embargoLabel}
        </span>
      ) : (
        <span className="project-live">
          <span className="dot" /> Live
        </span>
      )}
      {!hidden && project.images.length > 1 && (
        <div className="shots">
          {project.images.map((src, n) => (
            <button
              key={src}
              type="button"
              className={n === i ? 'on' : ''}
              aria-label={`${label} ${n + 1}`}
              aria-current={n === i}
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
            <Shots project={p} label={c.work.featuresLabel} embargoLabel={c.work.embargoLabel} />
            <div>
              <span className="project-index">
                0{i + 1} / 0{main.length}
              </span>
              <h3>{p.title}</h3>
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
                <a className="btn btn-ghost" href={p.url} target="_blank" rel="noopener noreferrer">
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
          <Image src={p.images[0]} alt={p.title} width={640} height={400} sizes="220px" />
          <div>
            <span className="badge">{c.work.labLabel}</span>
            <h4>{p.title}</h4>
            <p>{p.tagline}</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginTop: 10 }}>{c.work.labNote}</p>
          </div>
          <a className="btn btn-ghost" href={p.url} target="_blank" rel="noopener noreferrer">
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
