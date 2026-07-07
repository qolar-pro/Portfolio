'use client';

import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { journey } from '@/lib/journey';
import type { QualityTier } from '@/lib/quality';

/**
 * The asset pipeline's entry point. Loads a GLB from /public/models and
 * dresses each mesh by its name prefix — the three-material house system:
 *
 *   chrome_*  polished liquid chrome
 *   dark_*    near-black brushed metal
 *   glass_*   refractive frosted glass (translucent fallback on low tier)
 *
 * `spins` lets named parts rotate independently (e.g. gyroscope rings).
 * Swapping any sculpture for a purchased model is: replace the file,
 * keep the filename and the name prefixes.
 */

const chrome = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  metalness: 1,
  roughness: 0.16,
  clearcoat: 1,
  clearcoatRoughness: 0.3,
  envMapIntensity: 1.45,
});

const dark = new THREE.MeshPhysicalMaterial({
  color: '#101018',
  metalness: 0.92,
  roughness: 0.42,
  clearcoat: 0.3,
  clearcoatRoughness: 0.4,
  envMapIntensity: 0.85,
});

// real refraction — renders the scene behind it through the glass
const glassReal = new THREE.MeshPhysicalMaterial({
  color: '#ffffff',
  metalness: 0,
  roughness: 0.18,
  transmission: 1,
  thickness: 1.1,
  ior: 1.45,
  clearcoat: 1,
  clearcoatRoughness: 0.15,
  envMapIntensity: 1.3,
});

// cheap translucency for the low tier — no transmission pass
const glassLite = new THREE.MeshPhysicalMaterial({
  color: '#aebbff',
  metalness: 0.1,
  roughness: 0.15,
  transparent: true,
  opacity: 0.32,
  envMapIntensity: 1.4,
});

// brushed silver — for large flat panels that would mirror the void as black
const silver = new THREE.MeshPhysicalMaterial({
  color: '#e8eaf2',
  metalness: 1,
  roughness: 0.34,
  clearcoat: 0.5,
  clearcoatRoughness: 0.4,
  envMapIntensity: 1.35,
});

export type MaterialKey = 'chrome' | 'dark' | 'glass' | 'silver';

export function materialFor(name: string, tier: QualityTier, fallback: MaterialKey = 'chrome'): THREE.Material {
  if (name.startsWith('glass')) return tier === 'high' ? glassReal : glassLite;
  if (name.startsWith('dark')) return dark;
  if (name.startsWith('silver')) return silver;
  if (name.startsWith('chrome')) return chrome;
  // no house prefix (e.g. AI-generated mesh) — use the object's assigned material
  if (fallback === 'glass') return tier === 'high' ? glassReal : glassLite;
  if (fallback === 'dark') return dark;
  if (fallback === 'silver') return silver;
  return chrome;
}

export interface SculpturePart {
  name: string;
  geometry: THREE.BufferGeometry;
}

export function useSculptureParts(url: string): SculpturePart[] {
  const { scene } = useGLTF(url);
  return useMemo(() => {
    const parts: SculpturePart[] = [];
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) parts.push({ name: mesh.name, geometry: mesh.geometry });
    });
    return parts;
  }, [scene]);
}

/** per-part rotation: mesh name → [axis, radians/sec] */
export type SpinMap = Record<string, ['x' | 'y' | 'z', number]>;

interface SculptureProps {
  url: string;
  tier: QualityTier;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  /** whole-object idle rotation around Y */
  spin?: number;
  /** gentle rocking around X */
  sway?: number;
  spins?: SpinMap;
  /** material for meshes without a house name prefix (AI-generated models) */
  material?: MaterialKey;
  /** normalize the model so its largest dimension equals this (world units) —
   *  lets swapped-in assets of any authoring scale land correctly */
  fit?: number;
}

export default function Sculpture({ url, tier, position, rotation, scale = 1, spin = 0.1, sway = 0.12, spins, material = 'chrome', fit }: SculptureProps) {
  const parts = useSculptureParts(url);
  const ref = useRef<THREE.Group>(null);
  const partRefs = useRef<Record<string, THREE.Mesh | null>>({});
  const baseX = rotation?.[0] ?? 0;

  const norm = useMemo(() => {
    if (!fit || parts.length === 0) return null;
    const box = new THREE.Box3();
    for (const p of parts) {
      p.geometry.computeBoundingBox();
      if (p.geometry.boundingBox) box.union(p.geometry.boundingBox);
    }
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = fit / Math.max(size.x, size.y, size.z, 1e-5);
    return { scale: s, offset: center.multiplyScalar(-1) };
  }, [parts, fit]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const grp = ref.current;
    if (!grp) return;
    grp.rotation.y += dt * (spin + journey.velocity * 0.9);
    grp.rotation.x = baseX + Math.sin(state.clock.elapsedTime * 0.3 + (position?.[2] ?? 0)) * sway;

    if (spins) {
      const kick = 1 + Math.abs(journey.velocity) * 3;
      for (const [name, [axis, speed]] of Object.entries(spins)) {
        const mesh = partRefs.current[name];
        if (mesh) mesh.rotation[axis] += dt * speed * kick;
      }
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <group scale={norm?.scale ?? 1}>
        <group position={norm ? norm.offset : undefined}>
          {parts.map((part) => (
            <mesh
              key={part.name}
              name={part.name}
              geometry={part.geometry}
              material={materialFor(part.name, tier, material)}
              ref={(el) => {
                partRefs.current[part.name] = el;
              }}
            />
          ))}
        </group>
      </group>
    </group>
  );
}

export function preloadSculptures() {
  ['hero', 'services', 'work', 'experience', 'stack', 'contact'].forEach((name) =>
    useGLTF.preload(`/models/${name}.glb`),
  );
}
