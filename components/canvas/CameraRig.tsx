'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { journey } from '@/lib/journey';

/**
 * One camera, one journey. Scroll progress maps — via the DOM-measured
 * section anchors — onto a chain of stations in space. The camera eases
 * between them, dwelling at each section, while the pointer adds parallax
 * and scroll velocity adds a touch of roll.
 */

// Camera positions, one station per section (hero → contact)
export const STATIONS: [number, number, number][] = [
  [0, 0.1, 8.5], // hero — facing the monolith
  [4.2, -1.6, 5.2], // about — swinging wide of the blades, not through them
  [0.4, -2.4, -5.5], // services — descending toward the lattice
  [-1.6, -4.6, -19.5], // work — drifting through the shard field
  [2.2, -7.0, -34], // experience — entering the light corridor
  [0, -9.6, -48], // stack — approaching the orbit rings
  [0, -12.1, -62], // contact — arriving at the beacon
];

// What the camera looks toward at each station
const TARGETS: [number, number, number][] = [
  [0, 0.2, 0],
  [-0.8, -2.4, -9],
  [0, -3.4, -14],
  [-3.6, -6.2, -29],
  [2.4, -7.9, -42],
  [0, -10.6, -56],
  [0, -12.7, -70],
];

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export default function CameraRig() {
  const { camera } = useThree();
  const smoothed = useRef(0);
  const pos = useRef(new THREE.Vector3());
  const tgt = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const va = useRef(new THREE.Vector3());
  const vb = useRef(new THREE.Vector3());
  const parallax = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);

    // critically-damped chase of the real scroll progress
    smoothed.current += (journey.progress - smoothed.current) * (1 - Math.exp(-4.2 * dt));
    const p = smoothed.current;

    // progress → station segment via the DOM-measured anchors
    const anchors = journey.anchors;
    const n = Math.min(anchors.length, STATIONS.length);
    let i = 0;
    while (i < n - 2 && p > anchors[i + 1]) i++;
    const span = Math.max(anchors[i + 1] - anchors[i], 1e-5);
    const t = smootherstep(THREE.MathUtils.clamp((p - anchors[i]) / span, 0, 1));

    va.current.set(...STATIONS[i]);
    vb.current.set(...STATIONS[Math.min(i + 1, n - 1)]);
    pos.current.copy(va.current).lerp(vb.current, t);

    va.current.set(...TARGETS[i]);
    vb.current.set(...TARGETS[Math.min(i + 1, n - 1)]);
    tgt.current.copy(va.current).lerp(vb.current, t);

    // intro dolly: start high and far, settle into station 0
    const intro = 1 - journey.introProgress;
    pos.current.z += intro * 9;
    pos.current.y += intro * 2.2;

    // pointer parallax, softly chased so it never jitters
    const px = journey.pointer.x * 0.5;
    const py = journey.pointer.y * 0.3;
    parallax.current.x += (px - parallax.current.x) * (1 - Math.exp(-3 * dt));
    parallax.current.y += (py - parallax.current.y) * (1 - Math.exp(-3 * dt));
    pos.current.x += parallax.current.x;
    pos.current.y += parallax.current.y;

    // breathing — the camera is never fully still
    const et = state.clock.elapsedTime;
    pos.current.y += Math.sin(et * 0.4) * 0.05;
    pos.current.x += Math.cos(et * 0.3) * 0.04;

    camera.position.copy(pos.current);
    lookTarget.current.copy(tgt.current);
    lookTarget.current.x += parallax.current.x * 0.6;
    lookTarget.current.y += parallax.current.y * 0.4;
    camera.lookAt(lookTarget.current);

    // scroll velocity leans into a subtle roll
    camera.rotation.z += journey.velocity * 0.045;
  });

  return null;
}
