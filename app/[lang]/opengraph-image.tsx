import { ImageResponse } from 'next/og';
import { BRAND, LANGS, content, type Lang } from '@/lib/content';

/**
 * The card that appears when someone pastes a link into WhatsApp, Slack,
 * Messenger or X. Without one, all three of those render a bare grey box.
 *
 * Generated per locale at build time, so the Greek and Macedonian links
 * preview in their own language. Deliberately no external fonts or images:
 * anything fetched here has to succeed during the build, and a webfont that
 * 404s takes the whole build down with it.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${BRAND} — websites, online stores and custom software`;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const c = content[(LANGS as string[]).includes(lang) ? (lang as Lang) : 'en'];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#141416',
          padding: '72px 80px',
          // the orange bleed that runs through the site, bottom-left
          backgroundImage:
            'radial-gradient(900px 520px at 8% 112%, rgba(255,106,19,0.28), transparent 60%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 22,
              height: 22,
              background: '#ff6a13',
              borderRadius: 5,
              display: 'flex',
            }}
          />
          <div style={{ color: '#e8e6e3', fontSize: 38, fontWeight: 700, letterSpacing: -0.5 }}>
            {BRAND}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          <div
            style={{
              color: '#e8e6e3',
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.03,
              letterSpacing: -2,
              maxWidth: 1000,
              display: 'flex',
            }}
          >
            {c.hero.headA} {c.hero.headB}
          </div>
          <div style={{ color: '#a8a5a1', fontSize: 34, lineHeight: 1.35, maxWidth: 900, display: 'flex' }}>
            {c.hero.tagline}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ width: 64, height: 3, background: '#ff6a13', display: 'flex' }} />
          <div style={{ color: '#7d7a76', fontSize: 26, letterSpacing: 3, textTransform: 'uppercase' }}>
            novafaber.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
