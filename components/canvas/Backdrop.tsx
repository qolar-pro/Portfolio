'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { journey } from '@/lib/journey';

/**
 * The nebula shell: an inverted sphere that travels with the camera so the
 * void is never flat. Drifting fbm noise carries three neon light-lobes that
 * rotate through the space as the journey progresses. Dithered to kill
 * banding on high-res displays.
 */

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec3 vDir;
  uniform float uTime;
  uniform float uProgress;
  uniform float uVelocity;

  // --- compact value noise + fbm ---
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.07 + vec3(1.7, 9.2, 4.1);
      a *= 0.5;
    }
    return v;
  }

  vec3 rotY(vec3 v, float a) {
    float c = cos(a), s = sin(a);
    return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
  }

  float lobe(vec3 dir, vec3 center, float tightness) {
    return pow(max(dot(dir, normalize(center)), 0.0), tightness);
  }

  void main() {
    vec3 dir = normalize(vDir);

    // slow cloud drift, pushed along by the journey
    float n = fbm(dir * 2.4 + vec3(0.0, -uProgress * 3.0, uTime * 0.035));
    float n2 = fbm(dir * 5.0 + vec3(uTime * 0.02, uProgress * 2.0, 0.0));

    // neon lobes orbit the void as progress advances
    float spin = uProgress * 4.2;
    vec3 voltDir   = rotY(vec3(-0.8,  0.25, -0.6), spin);
    vec3 plasmaDir = rotY(vec3( 0.0, -0.45, -1.0), spin * 0.7 + 2.1);
    vec3 flareDir  = rotY(vec3( 0.9,  0.1,   0.4), spin * 0.5 + 4.2);

    vec3 volt   = vec3(0.30, 0.49, 1.00);
    vec3 plasma = vec3(0.54, 0.36, 1.00);
    vec3 flare  = vec3(1.00, 0.31, 0.85);

    // NB: these values pass through a linear->sRGB conversion in the post
    // chain, which lifts darks aggressively — keep them very low so the
    // void actually reads near-black.
    vec3 col = vec3(0.0035, 0.0035, 0.010);

    float energy = 0.5 + abs(uVelocity) * 0.8;
    col += volt   * lobe(dir, voltDir,   6.0) * (0.040 + n * 0.055) * energy;
    col += plasma * lobe(dir, plasmaDir, 5.0) * (0.036 + n2 * 0.050) * energy;
    col += flare  * lobe(dir, flareDir,  7.0) * (0.028 + n * 0.045) * energy;

    // faint violet horizon so the vertical axis always reads
    float horizon = pow(1.0 - abs(dir.y), 3.0);
    col += plasma * horizon * 0.014 * (0.6 + n2 * 0.8);

    // filmic dither — kills gradient banding at 4K
    float dither = (hash(vec3(gl_FragCoord.xy, uTime)) - 0.5) / 128.0;
    col += dither;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Backdrop() {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uVelocity: { value: 0 },
        },
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.copy(camera.position);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProgress.value += (journey.progress - material.uniforms.uProgress.value) * 0.05;
    material.uniforms.uVelocity.value += (journey.velocity - material.uniforms.uVelocity.value) * 0.08;
  });

  return (
    <mesh ref={mesh} material={material} frustumCulled={false} renderOrder={-1}>
      <sphereGeometry args={[70, 48, 32]} />
    </mesh>
  );
}
