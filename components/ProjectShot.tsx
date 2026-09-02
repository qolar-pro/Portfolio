import Image from 'next/image';
import type { Project } from '@/lib/content';

/**
 * A project screenshot in browser chrome.
 *
 * The chrome is not decoration. A screenshot floating on a dark page reads as
 * a picture of a design; the same screenshot inside an address bar showing
 * `a25.mk` reads as a site that exists, which is the entire claim this section
 * is making. The host is pulled from the project's own `liveUrl`, so it can
 * never drift from the link beside it.
 *
 * EMBARGO
 * A project whose client has not launched shows its shape and none of its
 * design: the shot blurs, the address bar shows no host, and the alt text goes
 * empty — describing a design we are deliberately blurring would hand it
 * straight back to a screen reader.
 *
 * CLIPS
 * If the project registry gives a `clip`, the still becomes its poster and the
 * clip plays muted on top — but only on a wide viewport with motion allowed.
 * On a phone the still is the whole story, which is the right trade for a
 * project card that is one of four on the page.
 */
export function ProjectShot({
  project,
  index,
  liveLabel,
  soonLabel,
  priority = false,
  sizes = '(max-width: 900px) 100vw, 50vw',
}: {
  project: Project;
  index: number;
  liveLabel: string;
  soonLabel: string;
  priority?: boolean;
  sizes?: string;
}) {
  const hidden = Boolean(project.embargo);
  const host = hostOf(project.liveUrl);

  return (
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
              <LockIcon /> {soonLabel}
            </>
          ) : (
            <>
              <span className="dot" /> {liveLabel}
            </>
          )}
        </span>
      </div>

      <div className="shot-view">
        <Image
          src={project.images[0]}
          alt={hidden ? '' : `${project.title} — ${project.tagline}`}
          aria-hidden={hidden || undefined}
          width={1280}
          height={800}
          sizes={sizes}
          /* Only the first card is a candidate for the LCP element; the rest
             stay lazy so a phone does not fetch four 200 KB screenshots to
             render a fold it has not reached. */
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>

      <span className="shot-index" aria-hidden="true">
        0{index + 1}
      </span>
    </div>
  );
}

/** `https://a25.mk/` → `a25.mk`. Empty string for anything unparseable. */
export function hostOf(url: string) {
  if (!url) return '';
  try {
    return new URL(url).host.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
      <path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" />
    </svg>
  );
}
