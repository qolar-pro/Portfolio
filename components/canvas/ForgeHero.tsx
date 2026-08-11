"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { motion } from "@/lib/motion/store";
import { forgeFragment, forgeVertex } from "./forge.glsl";

/**
 * The ember orb.
 *
 * CRITICAL: this file must only ever be imported through
 *   dynamic(() => import("./ForgeHero"), { ssr: false })
 * three.js is ~150KB gzipped and must not sit in the critical path. Hero TEXT
 * is the LCP element (CLAUDE.md invariant 7).
 *
 * Note there is no React subscription to heat anywhere below — useFrame reads
 * getState() directly, which is the whole point.
 */

function Orb() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHeat: { value: 0.25 },
    }),
    []
  );

  useFrame((state, delta) => {
    const m = matRef.current;
    if (!m) return;

    // read the store WITHOUT subscribing — no re-render, ever
    const { heat, pointer } = motion();

    m.uniforms.uTime.value = state.clock.elapsedTime;
    // ease the uniform so a heat jump doesn't pop
    m.uniforms.uHeat.value += (heat - m.uniforms.uHeat.value) * 0.06;

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.06;
      // gentle parallax toward the cursor, capped well under ±5%
      meshRef.current.rotation.x +=
        ((pointer.ny - 0.5) * 0.25 - meshRef.current.rotation.x) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.25, 48]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={forgeVertex}
        fragmentShader={forgeFragment}
      />
    </mesh>
  );
}

export default function ForgeHero() {
  return (
    <Canvas
      aria-hidden
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 3.4], fov: 42 }}
      style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <Orb />
    </Canvas>
  );
}
