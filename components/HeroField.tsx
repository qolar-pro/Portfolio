'use client';

import { useEffect, useRef } from 'react';

/**
 * The hero background: a living contour map.
 *
 * ── WHY CONTOURS ─────────────────────────────────────────────────────
 * Every large panel below the hero already sits on a topographic contour
 * texture (--tex-topo, cartographer-lines.webp). The hero was the one place
 * that ignored the site's own motif — first with a pixel-dithered flow field
 * that read as retro and fought the crisp vector type. This draws the same
 * kind of line, alive: thin anti-aliased contours of a slowly shifting
 * terrain, so the hero flows straight into the texture every other section
 * wears. Precision drawing for a studio that sells precision.
 *
 * ── WHAT IT DRAWS ────────────────────────────────────────────────────
 * - Iso-lines of a domain-warped noise height field, ~1 CSS px wide at any
 *   pixel density, anti-aliased with screen-space derivatives.
 * - Every fifth line is an index contour, slightly heavier and in the accent,
 *   the way a real survey map marks them.
 * - The pointer raises a soft hill in the terrain, so rings form around it
 *   and follow it. That is the whole interaction; nothing else moves fast.
 * - Lines fade, not disappear, behind the centred headline and buttons.
 *
 * ── WHAT IT REFUSES TO DO ────────────────────────────────────────────
 * - Run when unseen: paused off-screen and in a hidden tab.
 * - Move under prefers-reduced-motion: one still frame.
 * - Burn a phone battery: capped at 30 fps and a 1.5 pixel ratio; the
 *   motion is slow enough that the cap is invisible.
 * - Fail loudly: no WebGL, no derivatives, or a lost context leaves the
 *   plain page ground.
 *
 * Colours come from the site tokens, so light and dark both follow the theme.
 */

const VERT = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';

const FRAG = `#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll; uniform float uDpr;
uniform vec3 uBg; uniform vec3 uLine; uniform vec3 uAccent; uniform float uStrength;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for(int i = 0; i < 4; i++){ s += a * noise(p); p *= 2.02; a *= 0.5; } return s; }

/* anti-aliased line at every integer crossing of v, ~px device pixels wide */
float iso(float v, float px){
  float w = fwidth(v);
  float d = abs(fract(v - 0.5) - 0.5);
  return 1.0 - smoothstep(w * (px * 0.5 - 0.5), w * (px * 0.5 + 0.5), d);
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5 * uRes) / uRes.y;
  /* terrain scale in CSS pixels, independent of screen density */
  vec2 p = frag / (uDpr * 330.0);
  p.y += uScroll * 0.6;
  float t = uTime * 0.035;

  vec2 warp = vec2(fbm(p * 0.9 + vec2(t, -t * 0.7)), fbm(p * 0.9 + vec2(5.2 - t * 0.6, 1.3 + t)));
  float h = fbm(p + (warp - 0.5) * 1.1 + vec2(-t * 0.4, t * 0.25));

  /* the pointer raises a soft hill */
  float md = length(uv - uMouse);
  h += 0.16 * exp(-md * md * 7.0);

  float v = h * 11.0;
  float line = iso(v, 1.0 * uDpr);
  float index = iso(v / 5.0, 1.8 * uDpr);

  /* fade behind the centred headline and the button row, never to zero */
  float calm = mix(0.30, 1.0, smoothstep(0.30, 0.85, length(uv * vec2(0.95, 1.5))));
  calm *= mix(0.55, 1.0, smoothstep(-0.46, -0.16, uv.y));
  float edge = smoothstep(1.25, 0.55, length(uv * vec2(0.62, 1.0)));
  float k = uStrength * calm * mix(0.55, 1.0, edge);

  vec3 col = mix(uBg, uLine, line * k);
  col = mix(col, uAccent, index * k * 1.35);
  gl_FragColor = vec4(col, 1.0);
}`;

const TOKENS = ['--surface', '--text-muted', '--accent'] as const;
const UNIFORMS = ['uBg', 'uLine', 'uAccent'] as const;

const MAX_DPR = 1.5;
const FRAME_MS = 1000 / 30;
/** A still frame needs a moment that shows the terrain well, not t = 0. */
const STILL_T = 24;

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
    if (!gl || !gl.getExtension('OES_standard_derivatives')) {
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
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
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
    const uDpr = u('uDpr');
    const uStrength = u('uStrength');

    const applyColors = () => {
      readColors(cv.parentElement ?? document.body).forEach((c, i) =>
        gl.uniform3f(u(UNIFORMS[i]), c[0], c[1], c[2]),
      );
      /* light ground needs a touch more ink for the same visual weight */
      const bg = readColors(cv.parentElement ?? document.body)[0];
      const light = bg[0] * 0.2126 + bg[1] * 0.7152 + bg[2] * 0.0722 > 0.5;
      gl.uniform1f(uStrength, light ? 0.42 : 0.5);
    };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkPref = window.matchMedia('(prefers-color-scheme: dark)');
    const mouse = { x: 0.6, y: -0.2 };
    const aim = { x: 0.6, y: -0.2 };
    let scroll = 0;
    let raf = 0;
    let visible = true;
    let last = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = Math.max(1, Math.round(cv.clientWidth * dpr));
      const h = Math.max(1, Math.round(cv.clientHeight * dpr));
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
      gl.uniform1f(uDpr, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const running = () => visible && !document.hidden && !reduced.matches;

    const frame = (now: number) => {
      raf = 0;
      if (!running()) return;
      raf = requestAnimationFrame(frame);
      if (now - last < FRAME_MS) return;
      last = now;
      mouse.x += (aim.x - mouse.x) * 0.08;
      mouse.y += (aim.y - mouse.y) * 0.08;
      draw(now / 1000);
    };

    /* One place decides whether the loop runs, so every signal goes through it. */
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
