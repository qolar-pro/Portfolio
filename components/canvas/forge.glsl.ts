/**
 * FORGE SHADER
 *
 * An icosahedron whose surface is displaced by 3D simplex noise, scaled by
 * uHeat. Emission ramps dull-red → ember → white-hot along the same scalar,
 * so the orb glows in agreement with everything else on the page.
 *
 * Fresnel rim keeps the silhouette readable against a near-black ground —
 * without it the object dissolves into the background at low heat.
 */

export const forgeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uHeat;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;

  // Ashima / Gustavson simplex noise (public domain)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
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

    i = mod289(i);
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
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    // two octaves: slow large swell + faster fine crawl
    float n1 = snoise(position * 1.4 + vec3(0.0, uTime * 0.10, 0.0));
    float n2 = snoise(position * 4.2 - vec3(uTime * 0.18, 0.0, 0.0)) * 0.35;
    float n  = n1 + n2;

    vNoise = n;

    // displacement scales with heat: cold = nearly smooth, hot = molten
    float amp = 0.06 + 0.16 * uHeat;
    vec3 displaced = position + normal * n * amp;

    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    vViewPosition = -mv.xyz;

    gl_Position = projectionMatrix * mv;
  }
`;

export const forgeFragment = /* glsl */ `
  uniform float uHeat;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vNoise;

  // the ember ramp, matching DESIGN_SPEC §2
  const vec3 IRON        = vec3(0.043, 0.043, 0.047); // #0B0B0C
  const vec3 EMBER_DEEP  = vec3(0.478, 0.208, 0.063); // #7A3510
  const vec3 EMBER       = vec3(1.000, 0.478, 0.102); // #FF7A1A
  const vec3 EMBER_WHITE = vec3(1.000, 0.824, 0.651); // #FFD2A6

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPosition);

    // fresnel rim — keeps the silhouette legible on near-black
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);

    // noise crests read as hotter metal
    float t = clamp(vNoise * 0.5 + 0.5, 0.0, 1.0);
    float temp = clamp(t * (0.35 + 0.9 * uHeat), 0.0, 1.0);

    vec3 col = IRON;
    col = mix(col, EMBER_DEEP, smoothstep(0.15, 0.55, temp));
    col = mix(col, EMBER,      smoothstep(0.45, 0.85, temp));
    col = mix(col, EMBER_WHITE, smoothstep(0.82, 1.00, temp) * uHeat);

    // rim adds ember light, never white — white rim reads as plastic
    col += EMBER * fres * (0.25 + 0.55 * uHeat);

    gl_FragColor = vec4(col, 1.0);
  }
`;
