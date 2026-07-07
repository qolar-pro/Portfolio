import { ImageResponse } from 'next/og';

// Social share card, generated at build. No external fonts/assets so it
// renders identically offline and never trips a CSP.
export const alt = 'Apex Solutions — Independent Digital Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(120% 120% at 20% 0%, #10163a 0%, #050510 55%, #030309 100%)',
          color: '#f4f6ff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              display: 'flex',
              background: 'linear-gradient(135deg, #4d7cff, #8a5cff 50%, #ff4fd8)',
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 2, color: '#aeb6d8' }}>
            APEX SOLUTIONS
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, maxWidth: 960 }}>
            Software with the precision of engineering and the presence of cinema.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 30, color: '#f4f6ff' }}>Giannis Papadopoulos</div>
            <div style={{ fontSize: 24, color: '#8b93b8' }}>Independent Digital Studio</div>
          </div>
          <div style={{ fontSize: 26, color: '#8b93b8' }}>blancographics.xyz</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
