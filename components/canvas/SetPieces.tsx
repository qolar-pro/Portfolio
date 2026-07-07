'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import Sculpture, { preloadSculptures } from './Sculpture';
import { journey } from '@/lib/journey';
import type { QualityTier } from '@/lib/quality';

/**
 * One deliberate sculpture per station along the descent — real GLB assets
 * from public/models, dressed in the house chrome — plus the light moments
 * that stay: the corridor bars, the orbit satellites, the beacon glow.
 * Atmospheric debris is gone; the particle field carries the air now.
 */

preloadSculptures();

/**
 * Scroll-proximity materialization: a station's contents grow into being as
 * the camera approaches its section anchor and dissolve once it has passed —
 * nothing in the journey pre-exists, everything appears in time.
 */
function Station({ index, position, children }: { index: number; position: [number, number, number]; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  const presence = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const anchor = journey.anchors[index] ?? 1;
    const d = Math.abs(journey.progress - anchor);
    // fully formed within ±0.07 of the section, absent beyond ±0.20
    const target = 1 - THREE.MathUtils.smoothstep(d, 0.07, 0.2);
    presence.current += (target - presence.current) * (1 - Math.exp(-3.5 * dt));

    const g = ref.current;
    if (!g) return;
    const e = 1 - Math.pow(1 - presence.current, 3);
    g.scale.setScalar(Math.max(e, 0.0001));
    g.visible = presence.current > 0.01; // skip the draw entirely while absent
  });

  return (
    <group ref={ref} position={position} scale={0.0001} visible={false}>
      {children}
    </group>
  );
}

function Corridor({ position }: { position: [number, number, number] }) {
  const group = useRef<THREE.Group>(null);
  const bars = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        z: -i * 1.7 + 6,
        color: i % 3 === 0 ? '#ff4fd8' : i % 3 === 1 ? '#4d7cff' : '#8a5cff',
      })),
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 2 + Math.sin(state.clock.elapsedTime * 1.4 + i * 0.9) * 0.8;
    });
  });

  // bars flank the flight path wide so they frame copy instead of crossing it
  return (
    <group ref={group} position={position}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[i % 2 === 0 ? -4.6 : 4.6, 0, bar.z]}>
          <boxGeometry args={[0.05, 2.4, 0.05]} />
          <meshStandardMaterial color={bar.color} emissive={bar.color} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Satellites({ position }: { position: [number, number, number] }) {
  const sats = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (sats.current) sats.current.rotation.y += delta * 0.5;
  });
  const colors = ['#4d7cff', '#8a5cff', '#ff4fd8', '#4d7cff'];
  return (
    <group ref={sats} position={position}>
      {colors.map((c, i) => {
        const a = (i / colors.length) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.6, Math.sin(a) * 0.3, Math.sin(a) * 2.6]} scale={0.07}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
}

function BeaconGlow({ position }: { position: [number, number, number] }) {
  const core = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!core.current) return;
    const mat = core.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 1.4 + Math.sin(state.clock.elapsedTime * 1.6) * 0.5;
  });
  return (
    <group position={position}>
      <mesh ref={core} scale={0.16}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#1a0a18" emissive="#ff4fd8" emissiveIntensity={1.4} flatShading toneMapped={false} />
      </mesh>
      <pointLight color="#ff4fd8" intensity={3} distance={12} decay={2} />
    </group>
  );
}

// Station indices follow SECTION_ORDER: hero 0 · about 1 · services 2 ·
// work 3 · experience 4 · stack 5 · contact 6
export default function SetPieces({ tier }: { tier: QualityTier }) {
  return (
    <>
      {/* services — the Stack: three pinned platform slabs (full-stack, literally) */}
      <Station index={2} position={[3.1, -3.1, -15.5]}>
        <Sculpture url="/models/services.glb" tier={tier} scale={1.2} spin={0.12} sway={0.06} rotation={[0.32, 0.5, 0.05]} />
        <pointLight color="#8a5cff" intensity={4} distance={10} decay={2} position={[2, 1.5, 2]} />
      </Station>

      {/* work — the Cursor: a monumental pointer, face held toward the camera */}
      <Station index={3} position={[-10.2, -7.6, -34.5]}>
        <Sculpture url="/models/work.glb" tier={tier} scale={1.55} spin={0.05} sway={0.05} rotation={[0.05, -0.15, -0.08]} />
        <pointLight color="#4d7cff" intensity={4} distance={11} decay={2} position={[-2, 2, 2.5]} />
      </Station>

      {/* experience — the Peak ("The road to Apex."), AI-generated massif in house dark metal */}
      <Station index={4} position={[5.6, -8.9, -45.5]}>
        <Sculpture url="/models/experience.glb" tier={tier} material="dark" fit={4.2} spin={0.07} sway={0.03} />
        <pointLight color="#8a5cff" intensity={4} distance={12} decay={2} position={[-2.5, 2, 2.5]} />
      </Station>
      <Station index={4} position={[2.4, -7.9, -42]}>
        <Corridor position={[0, 0, 0]} />
      </Station>

      {/* stack — the Gyroscope: rings turning on three axes, satellites centered */}
      <Station index={5} position={[3.0, -10.5, -57]}>
        <Sculpture
          url="/models/stack.glb"
          tier={tier}
          scale={1.25}
          spin={0.03}
          sway={0.05}
          rotation={[0.3, 0, 0.1]}
          spins={{ dark_outer: ['y', 0.25], chrome_middle: ['x', 0.4], chrome_inner: ['z', 0.55] }}
        />
      </Station>
      <Station index={5} position={[0, -10.6, -56]}>
        <Satellites position={[0, 0, 0]} />
      </Station>

      {/* contact — the Paper Plane banking past the beacon glow */}
      <Station index={6} position={[3.4, -12.1, -71]}>
        {/* pitched so the chrome wing tops present to the camera */}
        <Sculpture url="/models/contact.glb" tier={tier} scale={1.15} spin={0} sway={0.08} rotation={[0.5, -0.35, 0.12]} />
        {/* raking key light so the wing tops carry a specular streak */}
        <pointLight color="#dfe6ff" intensity={6} distance={9} decay={2} position={[1.2, 2.2, 1.8]} />
        <BeaconGlow position={[1.6, -2.6, -3.6]} />
      </Station>
    </>
  );
}
