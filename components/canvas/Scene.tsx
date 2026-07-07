'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, useProgress } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import { journey } from '@/lib/journey';
import { useQuality } from '@/lib/quality';
import CameraRig from './CameraRig';
import HeroObject from './HeroObject';
import Backdrop from './Backdrop';
import SetPieces from './SetPieces';
import ParticleField from './ParticleField';
import Effects from './Effects';

/** Feeds real GLB/compile progress to the preloader counter. */
function AssetProgress() {
  const { progress } = useProgress();
  useEffect(() => {
    journey.assetProgress = Math.max(journey.assetProgress, progress / 100);
  }, [progress]);
  return null;
}

/** Flips journey.sceneReady on the first frame rendered *after* assets resolved
 *  (this component mounts inside the same Suspense as the sculptures). */
function FirstFrame() {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      journey.assetProgress = 1;
      journey.sceneReady = true;
    }
  });
  return null;
}

export default function Scene() {
  const { tier, dpr } = useQuality();

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false, // post chain handles smoothing; keeps 4K displays affordable
        powerPreference: 'high-performance',
        alpha: false,
        stencil: false,
        depth: true,
      }}
      camera={{ position: [0, 0.1, 16], fov: 42, near: 0.1, far: 140 }}
    >
      <color attach="background" args={['#030309']} />
      <fog attach="fog" args={['#030309', 12, 60]} />

      <ambientLight intensity={0.12} />

      {/* Procedural neon studio — no HDRI download, fully self-contained */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" color="#4d7cff" intensity={4} position={[-6, 1.5, 2]} rotation-y={Math.PI / 2} scale={[14, 2.5, 1]} />
        <Lightformer form="rect" color="#ff4fd8" intensity={3.5} position={[6, -1, 1]} rotation-y={-Math.PI / 2} scale={[14, 2.5, 1]} />
        <Lightformer form="rect" color="#ffffff" intensity={1.2} position={[0, 6, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
        <Lightformer form="circle" color="#8a5cff" intensity={2.5} position={[0, 0.5, -8]} scale={[6, 6, 1]} />
        <Lightformer form="rect" color="#101018" intensity={1} position={[0, -6, 0]} rotation-x={Math.PI / 2} scale={[12, 12, 1]} />
      </Environment>

      <AssetProgress />

      <Suspense fallback={null}>
        <Backdrop />
        <HeroObject tier={tier} />
        <SetPieces tier={tier} />
        <ParticleField tier={tier} />
        <FirstFrame />
      </Suspense>

      <CameraRig />
      <Effects tier={tier} />
    </Canvas>
  );
}
