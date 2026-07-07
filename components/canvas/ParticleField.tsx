'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { journey } from '@/lib/journey';
import { STATIONS } from './CameraRig';
import type { QualityTier } from '@/lib/quality';

/**
 * The air of the deep field: thousands of GPU point sprites clustered along
 * the camera path. They drift on their own, scatter away from the cursor
 * (a repulsor projected into the scene in front of the camera), and flare
 * with scroll velocity. This layer replaces the old instanced debris.
 */

const vertexShader = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform float uEnergy;
  uniform vec3 uRepulsor;
  uniform float uSize;
  uniform float uReveal;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    vec3 p = position;
    float s = aSeed;

    // staggered arrival: each particle has its own slice of the intro,
    // rising into place as it fades in
    float stag = fract(s * 3.31) * 0.55;
    float reveal = smoothstep(stag, stag + 0.45, uReveal);
    p.y -= (1.0 - reveal) * 2.2;

    // perpetual drift, unique per particle
    float amp = 0.35 + 0.45 * fract(s * 7.31);
    p += vec3(
      sin(uTime * 0.22 + s * 17.0),
      cos(uTime * 0.18 + s * 29.0),
      sin(uTime * 0.20 + s * 41.0)
    ) * amp;

    // cursor repulsion
    vec3 away = p - uRepulsor;
    float dist = length(away);
    float push = smoothstep(3.5, 0.0, dist);
    p += (away / max(dist, 0.001)) * push * (1.1 + uEnergy * 1.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float size = uSize * (0.35 + fract(s * 13.7)) * (1.0 + uEnergy * 1.4);
    gl_PointSize = clamp(size * (26.0 / max(-mv.z, 0.1)), 0.6, 9.0);
    gl_Position = projectionMatrix * mv;

    // palette: volt / plasma / flare by seed
    float pick = fract(s * 5.13);
    vec3 volt = vec3(0.30, 0.49, 1.0);
    vec3 plasma = vec3(0.54, 0.36, 1.0);
    vec3 flare = vec3(1.0, 0.31, 0.85);
    vColor = pick < 0.45 ? volt : (pick < 0.8 ? plasma : flare);

    // fade far particles so the field breathes with the fog
    vFade = smoothstep(46.0, 6.0, -mv.z) * (0.5 + 0.5 * fract(s * 3.7)) * reveal;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uEnergy;
  varying vec3 vColor;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.06, d) * vFade * (0.26 + uEnergy * 0.45);
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(vColor * (0.9 + uEnergy * 0.6), alpha);
  }
`;

export default function ParticleField({ tier }: { tier: QualityTier }) {
  const { camera } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const repulsor = useRef(new THREE.Vector3());
  const fwd = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3());
  const energy = useRef(0);

  const count = tier === 'low' ? 2200 : 6000;

  const { positions, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sd = new Float32Array(count);
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const p = new THREE.Vector3();
    // the hero station stays airy — later segments carry more of the field
    const segWeights = [0.4, 0.85, 1, 1, 1, 1].slice(0, STATIONS.length - 1);
    const totalW = segWeights.reduce((a, b) => a + b, 0);
    const pickSegment = () => {
      let r = Math.random() * totalW;
      for (let s = 0; s < segWeights.length; s++) {
        r -= segWeights[s];
        if (r <= 0) return s;
      }
      return segWeights.length - 1;
    };
    for (let i = 0; i < count; i++) {
      // pick a weighted random point along the station polyline, then scatter around it
      const seg = pickSegment();
      a.set(...STATIONS[seg]);
      b.set(...STATIONS[seg + 1]);
      p.lerpVectors(a, b, Math.random());
      // gaussian-ish radial scatter (sum of two uniforms)
      const r = (Math.random() + Math.random()) * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      p.x += r * Math.sin(phi) * Math.cos(theta);
      p.y += r * Math.sin(phi) * Math.sin(theta) * 0.75;
      p.z += r * Math.cos(phi);
      pos.set([p.x, p.y, p.z], i * 3);
      sd[i] = Math.random() * 100;
    }
    return { positions: pos, seeds: sd };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uRepulsor: { value: new THREE.Vector3(0, 0, 999) },
      uSize: { value: tier === 'low' ? 3.4 : 4.2 },
      uReveal: { value: 0 },
    }),
    [tier],
  );

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uReveal.value = journey.introProgress;

    // repulsor: a point ~6 units in front of the camera, offset by the pointer
    camera.getWorldDirection(fwd.current);
    right.current.crossVectors(fwd.current, camera.up).normalize();
    up.current.crossVectors(right.current, fwd.current).normalize();
    repulsor.current
      .copy(camera.position)
      .addScaledVector(fwd.current, 6)
      .addScaledVector(right.current, journey.pointer.x * 4.2)
      .addScaledVector(up.current, journey.pointer.y * 2.6);
    (mat.uniforms.uRepulsor.value as THREE.Vector3).copy(repulsor.current);

    const target = Math.min(Math.abs(journey.velocity) * 1.6, 1);
    energy.current += (target - energy.current) * (1 - Math.exp(-4 * Math.min(delta, 1 / 30)));
    mat.uniforms.uEnergy.value = energy.current;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
