'use client';

import { useEffect, useRef } from 'react';

/**
 * The hero background: a flow field drawn on a WebGL canvas.
 *
 * ── WHERE IT CAME FROM ───────────────────────────────────────────────
 * Generated in Claude Design, then rebuilt here. The generated version was a
 * good shader aimed at a different page: grey "Industry" colours, film grain
 * and soft volumetric beams (none of which neobrutalism has), a quiet zone on
 * the LEFT third for a left-aligned headline this site does not have, a type
 * mode painted in Archivo (no Greek, no Cyrillic), and a render loop that never
 * stopped. What survives is the field itself — domain-warped noise, slow beams,
 * and contour lines where the field crosses each band.
 *
 * ── HOW IT BECAME NEOBRUTALIST ───────────────────────────────────────
 * Continuous luminance is quantised into four flat palette colours, and every
 * edge where one band meets another gets a solid rule — flat shapes with black
 * outlines, the same vocabulary as every card on the site. The first version's
 * dither survives only as a halftone inside the palest band.
 *
 * The canvas renders at a third of CSS resolution and is upscaled with
 * `image-rendering: pixelated`, so outlines and halftone dots land as hard
 * 3px blocks rather than blur — and the shader does a ninth of the work,
 * which is what makes it affordable on a phone.
 *
 * Colours are read from the site's tokens, not written here, so the field
 * follows the theme toggle and any future palette change with no edit.
 *
 * ── WHAT IT REFUSES TO DO ────────────────────────────────────────────
 * - Draw while nobody can see it: paused off-screen and in a hidden tab.
 * - Move under `prefers-reduced-motion`: one still frame, redrawn on theme
 *   change and resize only.
 * - Compete with the headline: a centred ellipse is held almost flat, because
 *   "BUILT FROM SCRATCH" sits exactly there.
 * - Fail loudly: no WebGL, or a lost context, leaves the plain page ground.
 */

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

/* Built per context: band outlines need fwidth(), which WebGL1 only has behind
   OES_standard_derivatives. Without it the bands still render, just unoutlined. */
const frag = (deriv: boolean) => `${deriv ? '#extension GL_OES_standard_derivatives : enable' : ''}
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3; uniform vec3 uLine;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for(int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= 0.5; } return s; }
float bayer2(vec2 a){ a = floor(a); return fract(a.x / 2.0 + a.y * a.y * 0.75); }
float bayer8(vec2 a){ return (bayer2(0.25 * a) * 0.25 + bayer2(0.5 * a)) * 0.25 + bayer2(a); }

void main(){
  vec2 px = gl_FragCoord.xy;
  vec2 uv = (px - 0.5 * uRes) / uRes.y;
  float t = uTime;

  vec2 dm = uv - uMouse;
  float md = length(dm);
  vec2 q = uv - normalize(dm + 1e-5) * (0.22 / (1.0 + md * md * 22.0));
  q.y += uScroll * 0.22;

  float ft = t * 0.045;
  vec2 w = vec2(fbm(q * 1.5 + vec2(ft, 0.0)), fbm(q * 1.5 + vec2(0.0, -ft) + 7.31));
  vec2 fq = q + (w - 0.5) * 0.95;
  float field = fbm(fq * 2.3 + vec2(-t * 0.09, t * 0.05));

  float ca = cos(-0.62), sa = sin(-0.62);
  vec2 r = vec2(uv.x * ca - uv.y * sa, uv.x * sa + uv.y * ca);
  float b = 1.00 * exp(-pow((r.x - 0.14 + sin(t * 0.055) * 0.42) * 2.2, 2.0));
  b += 0.60 * exp(-pow((r.x + 0.72 + sin(t * 0.041 + 2.1) * 0.30) * 3.8, 2.0));
  b += 0.40 * exp(-pow((r.x - 0.95 + cos(t * 0.033) * 0.24) * 5.0, 2.0));
  b *= 0.55 + 0.45 * fbm(fq * 1.1 + t * 0.03);

  float c = field * 6.2 + uv.x * 0.9 - t * 0.085;
  float fil = 1.0 - smoothstep(0.0, 0.18, abs(fract(c) - 0.5));

  float vig = smoothstep(1.45, 0.3, length(uv * vec2(0.62, 1.0)));
  /* the headline is centred: hold an ellipse around it flat */
  float quiet = smoothstep(0.50, 1.00, length(uv * vec2(0.95, 1.45)));
  /* the buttons and scroll cue sit in the bottom strip: keep it low */
  quiet *= mix(0.25, 1.0, smoothstep(-0.50, -0.10, uv.y));

  float lum = (b * 0.80 + fil * b * 0.55) * vig * quiet;
  float lv = floor(clamp(lum * 3.9, 0.0, 3.0));

  vec3 col = uC0;
  /* palest band: the first version's ordered dither, kept as a halftone */
  float halftone = step(bayer8(px) / 1.33, 0.22);
  col = mix(col, mix(uC1, uC2, halftone), step(0.5, lv));
  col = mix(col, uC2, step(1.5, lv));
  col = mix(col, uC3, step(2.5, lv));

  ${deriv ? '/* a solid rule wherever one band meets another */\n  col = mix(col, uLine, step(0.5, fwidth(lv)));' : ''}

  gl_FragColor = vec4(col, 1.0);
}`;

/** Tokens this draws with, lightest band first. Resolved through the cascade,
    so var() chains and the active theme are both honoured. */
const TOKENS = ['--surface', '--surface-sunken', '--nb-blue', '--main', '--text-primary'] as const;
const UNIFORMS = ['uC0', 'uC1', 'uC2', 'uC3', 'uLine'] as const;

/** Renders at this fraction of CSS pixels, then scales up with hard edges. */
const RES = 1 / 3;

/** A still frame needs a moment that shows the field well, not t = 0. */
const STILL_T = 38;

function readColors(host: HTMLElement): number[][] {
  const probe = document.createElement('span');
  probe.style.display = 'none';
  host.appendChild(probe);
  const out = TOKENS.map((tk) => {
    probe.style.color = `var(${tk})`;
    const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['0', '0', '0'];
    return m.slice(0, 3).map((v) => Number(v) / 255);
  });
  probe.remove();
  return out;
}

export function HeroField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
    if (!gl) {
      cv.style.display = 'none';
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const deriv = !!gl.getExtension('OES_standard_derivatives');
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, frag(deriv));
    const pr = gl.createProgram();
    if (!vs || !fs || !pr) {
      cv.style.display = 'none';
      return;
    }
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      cv.style.display = 'none';
      return;
    }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(pr, n);
    const uRes = u('uRes');
    const uTime = u('uTime');
    const uMouse = u('uMouse');
    const uScroll = u('uScroll');

    const applyColors = () => {
      readColors(cv.parentElement ?? document.body).forEach((c, i) =>
        gl.uniform3f(u(UNIFORMS[i]), c[0], c[1], c[2]),
      );
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkPref = window.matchMedia('(prefers-color-scheme: dark)');
    const mouse = { x: 0, y: 0.1 };
    const aim = { x: 0, y: 0.1 };
    let scroll = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const w = Math.max(1, Math.round(cv.clientWidth * RES));
      const h = Math.max(1, Math.round(cv.clientHeight * RES));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      gl.viewport(0, 0, w, h);
    };

    const draw = (t: number) => {
      gl.uniform2f(uRes, cv.width, cv.height);
      gl.uniform1f(uTime, t);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const running = () => visible && !document.hidden && !reduced.matches;

    const frame = () => {
      raf = 0;
      if (!running()) return;
      raf = requestAnimationFrame(frame);
      mouse.x += (aim.x - mouse.x) * 0.045;
      mouse.y += (aim.y - mouse.y) * 0.045;
      draw(performance.now() / 1000);
    };

    /* One place decides whether the loop runs, so every signal — scrolled off,
       tab hidden, reduced motion switched on mid-visit — goes through it. */
    const sync = () => {
      if (running()) {
        if (!raf) raf = requestAnimationFrame(frame);
        return;
      }
      cancelAnimationFrame(raf);
      raf = 0;
      if (reduced.matches) draw(STILL_T);
    };

    resize();
    applyColors();
    draw(reduced.matches ? STILL_T : performance.now() / 1000);
    sync();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(cv);

    const onMove = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      aim.x = (e.clientX - b.left - b.width / 2) / b.height;
      aim.y = -(e.clientY - b.top - b.height / 2) / b.height;
    };
    const onScroll = () => {
      const b = cv.getBoundingClientRect();
      scroll = Math.min(1, Math.max(0, -b.top / Math.max(1, window.innerHeight)));
    };
    const onResize = () => {
      resize();
      if (!running()) draw(STILL_T);
    };
    /* Theme is <html data-theme>, or the OS preference when that is unset. */
    const onTheme = () => {
      applyColors();
      if (!running()) draw(STILL_T);
    };
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      cv.style.display = 'none';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    darkPref.addEventListener('change', onTheme);
    cv.addEventListener('webglcontextlost', onLost);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      darkPref.removeEventListener('change', onTheme);
      cv.removeEventListener('webglcontextlost', onLost);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" />;
}
