'use client';

import { Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { journey } from '@/lib/journey';
import { materialFor, useSculptureParts } from './Sculpture';
import type { QualityTier } from '@/lib/quality';

/**
 * The signature piece: the Apex asterisk, monumentalized — six tapered
 * chrome blades turning like a slow turbine around a frosted-glass hub,
 * wrapped in a brushed-metal orbit ring, escorted by three neon shards.
 * It faces the visitor, answers the pointer, and spins with scroll velocity.
 */

// back.out easing — the sculpture lands with a slight overshoot
const backOut = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

export default function HeroObject({ tier }: { tier: QualityTier }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const escorts = useRef<THREE.Group>(null);
  const parts = useSculptureParts('/models/hero.glb');
  const { size } = useThree();
  // portrait viewports get a smaller piece, lifted clear of the hero copy
  const compact = size.width < 768;
  const fit = compact ? 0.58 : 1;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const g = group.current;
    if (!g) return;

    // pointer steers the whole assembly, softly
    const ty = -journey.pointer.x * 0.4;
    const tx = journey.pointer.y * 0.28;
    g.rotation.y += (ty - g.rotation.y) * (1 - Math.exp(-2.5 * dt));
    g.rotation.x += (tx - g.rotation.x) * (1 - Math.exp(-2.5 * dt));

    if (inner.current) {
      // the turbine turn — slow at rest, urged on by scroll
      inner.current.rotation.z -= dt * (0.12 + Math.abs(journey.velocity) * 1.8);
    }
    if (ring.current) {
      ring.current.rotation.z -= dt * 0.22;
      ring.current.rotation.x = Math.PI / 2.4 + Math.sin(state.clock.elapsedTime * 0.25) * 0.12;
    }

    // ---- intro choreography: the mark assembles as the camera arrives ----
    const intro = journey.introProgress;

    // …and dissolves once the descent has left it behind, so its blades
    // never slice across the about section's copy
    const depart = 1 - THREE.MathUtils.smoothstep(journey.progress, 0.09, 0.19);
    g.scale.setScalar(fit * Math.max(depart, 0.0001));
    g.visible = depart > 0.01;

    if (inner.current) {
      const t = THREE.MathUtils.clamp((intro - 0.1) / 0.75, 0, 1);
      inner.current.scale.setScalar(Math.max(backOut(t), 0.0001));
    }
    if (ring.current) {
      const t = THREE.MathUtils.clamp((intro - 0.35) / 0.55, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      ring.current.scale.setScalar(Math.max(e, 0.0001));
    }
    if (escorts.current) {
      escorts.current.children.forEach((child, i) => {
        const t = THREE.MathUtils.clamp((intro - (0.6 + i * 0.12)) / 0.3, 0, 1);
        const e = 1 - Math.pow(1 - t, 3);
        child.scale.setScalar(Math.max(e, 0.0001));
      });
    }
  });

  return (
    // scale is driven per-frame (fit × departure presence)
    <group ref={group} position={[0, compact ? 1.1 : 0.2, 0]} scale={fit}>
      <group ref={inner} scale={0.0001}>
        {parts.map((part) => (
          <mesh key={part.name} name={part.name} geometry={part.geometry} material={materialFor(part.name, tier)} />
        ))}
      </group>

      {/* Brushed-metal orbit ring */}
      <mesh ref={ring} rotation={[Math.PI / 2.4, 0, 0]} scale={0.0001}>
        <torusGeometry args={[2.6, 0.035, 24, 128]} />
        <meshStandardMaterial color="#8f93a8" metalness={1} roughness={0.45} envMapIntensity={1} />
      </mesh>

      {/* Neon escorts — the emissive intensity >1 feeds the bloom pass */}
      <group ref={escorts}>
        <Float speed={2.4} rotationIntensity={1.2} floatIntensity={1.6}>
          <mesh position={[2.1, 1.2, -0.6]} scale={0.13}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#4d7cff" emissive="#4d7cff" emissiveIntensity={3.5} toneMapped={false} />
          </mesh>
        </Float>
        <Float speed={1.8} rotationIntensity={1} floatIntensity={1.2}>
          <mesh position={[-1.9, -1.0, 0.8]} scale={0.1}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#ff4fd8" emissive="#ff4fd8" emissiveIntensity={3.5} toneMapped={false} />
          </mesh>
        </Float>
        <Float speed={2} rotationIntensity={1.4} floatIntensity={1.8}>
          <mesh position={[0.5, -1.9, -1.2]} scale={0.08}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#8a5cff" emissive="#8a5cff" emissiveIntensity={3.2} toneMapped={false} />
          </mesh>
        </Float>
      </group>
    </group>
  );
}
