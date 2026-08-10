'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { GradeProfile } from '@/lib/grade';

/**
 * The forged object.
 *
 * Geometry is generated at runtime by three.js (DD-3) — an icosahedron
 * subdivided to the device's tier. There is no mesh file, so the entire visual
 * costs whatever this source file gzips to.
 *
 * The concept is literal rather than decorative: material caught mid-forming.
 * Where the smith has just worked it, the surface is molten — displaced,
 * emissive, moving. Where it has been left, it cools toward dark iron and goes
 * still. The pointer is the heat source.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;
  uniform vec3  uHeatPoint;

  varying vec3  vNormalW;
  varying vec3  vViewDir;
  varying float vHeat;

  // Simplex 3D noise (Ashima / Gustavson). Compact form.
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;

    // Proximity to the heat source, in object space. Worked metal stays soft
    // near where it was struck and stiffens with distance.
    float prox = 1.0 - clamp(distance(normalize(pos), normalize(uHeatPoint)) / 1.6, 0.0, 1.0);
    float heat = clamp(uHeat * prox, 0.0, 1.0);
    vHeat = heat;

    // Two octaves: a slow swell that reads as mass, and a faster ripple that
    // only appears where the surface is hot.
    float swell  = snoise(pos * 0.9 + uTime * 0.10);
    float ripple = snoise(pos * 2.6 - uTime * 0.28);

    float amp = 0.10 + heat * 0.26;
    pos += normal * (swell * amp + ripple * heat * 0.09);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormalW = normalize(normalMatrix * normal);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform vec3  uEmber;
  uniform vec3  uIron;
  uniform float uTime;
  uniform float uBloom;
  uniform float uGrain;

  varying vec3  vNormalW;
  varying vec3  vViewDir;
  varying float vHeat;

  float hash(vec2 p){
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    float fres = pow(1.0 - clamp(dot(normalize(vNormalW), normalize(vViewDir)), 0.0, 1.0), 2.4);

    // Iron reads cold and matte; the rim is where a forged surface catches
    // light, so the fresnel carries most of the form.
    vec3 col = mix(uIron, uEmber, clamp(vHeat * 1.15, 0.0, 1.0));
    col += uEmber * fres * (0.45 + uBloom * 0.6);

    // Emissive core where the metal is hottest — this is what a bloom pass
    // would have produced, at no dependency cost (see PHASE_7 scope note).
    col += uEmber * pow(vHeat, 2.0) * uBloom * 1.3;

    // Film grain, value from lib/grade.ts.
    float g = hash(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5;
    col += g * uGrain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function ForgeObject({
  detail,
  grade,
}: {
  detail: number;
  grade: GradeProfile;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const heat = useRef(0);
  const heatPoint = useRef(new THREE.Vector3(0, 0, 1));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeat: { value: 0 },
      uHeatPoint: { value: new THREE.Vector3(0, 0, 1) },
      uEmber: { value: new THREE.Color('#f2814d') },
      uIron: { value: new THREE.Color('#14181c') },
      uBloom: { value: grade.bloomIntensity },
      uGrain: { value: grade.noise },
    }),
    [grade.bloomIntensity, grade.noise],
  );

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.35, detail), [detail]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;

    // Pointer drives heat; it decays when the cursor leaves. The object cools
    // rather than snapping back, which is the whole metaphor.
    const p = state.pointer;
    const active = Math.hypot(p.x, p.y) > 0.001;
    const target = active ? 1 : 0.18;
    heat.current += (target - heat.current) * Math.min(delta * 1.8, 1);
    uniforms.uHeat.value = heat.current;

    heatPoint.current.lerp(new THREE.Vector3(p.x * 1.6, p.y * 1.6, 1), Math.min(delta * 2.5, 1));
    uniforms.uHeatPoint.value.copy(heatPoint.current);

    if (mesh.current) {
      mesh.current.rotation.y = t * 0.12;
      mesh.current.rotation.x = Math.sin(t * 0.18) * 0.15;
    }
  });

  return (
    <mesh ref={mesh} geometry={geometry}>
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} />
    </mesh>
  );
}
