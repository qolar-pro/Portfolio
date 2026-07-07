/**
 * Offline sculpture authoring v3 — "Precision Instruments", detailed.
 * Bakes the site's 3D set pieces into GLB assets in public/models/:
 *
 *   hero        the Apex asterisk — turbine blades, bolt ring, glass hub w/ chrome core
 *   services    the Stack — pinned platform slabs, standoff collars, corner brackets, vents
 *   work        the Cursor — beveled pointer, bolted backplate, double click-ripple
 *   experience  the Peak — faceted massif on a hex plinth, strata ledges, chrome summit
 *   stack       the Gyroscope — ticked gimbal rings, pivot hinges, yoke mount, glass core
 *   contact     the Paper Plane — creased chrome dart with spine ridge and glass wake
 *
 * Run:  node scripts/sculpt.mjs
 *
 * Mesh naming contract (consumed by components/canvas/Sculpture.tsx):
 * `<material>_<part>` with material ∈ chrome | dark | glass. Parts that the
 * runtime spins independently keep stable names (dark_outer, chrome_middle,
 * chrome_inner). Swap any file for a bought/generated model with the same
 * naming and it inherits the whole look.
 */
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(import.meta.dirname, '..', 'public', 'models');
mkdirSync(OUT_DIR, { recursive: true });

// GLTFExporter assumes a browser FileReader; give Node an equivalent.
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((ab) => {
        this.result = ab;
        this.onloadend?.({ target: this });
        this.onload?.({ target: this });
      });
    }
  };
}

/* ---------------- helpers ---------------- */

function hash3(x, y, z, seed) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 53.13) * 43758.5453;
  return h - Math.floor(h);
}
const smooth = (t) => t * t * (3 - 2 * t);
function valueNoise3(x, y, z, seed) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = smooth(x - xi), yf = smooth(y - yi), zf = smooth(z - zi);
  const lerp = (a, b, t) => a + (b - a) * t;
  const c = (dx, dy, dz) => hash3(xi + dx, yi + dy, zi + dz, seed);
  return (
    lerp(
      lerp(lerp(c(0, 0, 0), c(1, 0, 0), xf), lerp(c(0, 1, 0), c(1, 1, 0), xf), yf),
      lerp(lerp(c(0, 0, 1), c(1, 0, 1), xf), lerp(c(0, 1, 1), c(1, 1, 1), xf), yf),
      zf,
    ) * 2 - 1
  );
}

/** merge that tolerates mixed indexed/non-indexed inputs, re-indexed at the end */
function merge(geos) {
  const normalized = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  const merged = mergeGeometries(normalized);
  if (!merged) throw new Error('merge failed — incompatible attributes');
  return mergeVertices(merged, 1e-5);
}

/** reverse triangle winding — needed after mirror-scaling, which flips handedness */
function flipWinding(geo) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (let i = 0; i < g.getAttribute('position').count; i += 3) {
    for (const attrName of Object.keys(g.attributes)) {
      const attr = g.getAttribute(attrName);
      for (let c = 0; c < attr.itemSize; c++) {
        const a = attr.getComponent(i + 1, c);
        attr.setComponent(i + 1, c, attr.getComponent(i + 2, c));
        attr.setComponent(i + 2, c, a);
      }
    }
  }
  g.computeVertexNormals();
  return g;
}

/** cylinder connecting two points in space (for pivots, ridges, rods) */
function rod(a, b, radius, segments = 20) {
  const from = new THREE.Vector3(...a);
  const to = new THREE.Vector3(...b);
  const dir = to.clone().sub(from);
  const len = dir.length();
  const geo = new THREE.CylinderGeometry(radius, radius, len, segments);
  geo.translate(0, len / 2, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  geo.applyQuaternion(quat);
  geo.translate(from.x, from.y, from.z);
  return geo;
}

/** ring of small spheres — bolt heads / rivets */
function boltRing(radius, count, size, y = 0, plane = 'xz') {
  const bolts = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const s = new THREE.SphereGeometry(size, 12, 10);
    if (plane === 'xz') s.translate(Math.cos(a) * radius, y, Math.sin(a) * radius);
    else s.translate(Math.cos(a) * radius, Math.sin(a) * radius, y);
    bolts.push(s);
  }
  return merge(bolts);
}

/* ---------------- builders ---------------- */

/** HERO — the Apex asterisk. */
function asterisk() {
  const blades = [];
  const sleeves = [];
  const tips = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;

    const blade = new RoundedBoxGeometry(2.0, 0.36, 0.26, 4, 0.08);
    const pos = blade.getAttribute('position');
    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v);
      const t = THREE.MathUtils.clamp((x + 1) / 2, 0, 1);
      const k = 1 - 0.32 * t;
      pos.setY(v, pos.getY(v) * k);
      pos.setZ(v, pos.getZ(v) * k);
    }
    blade.rotateX(0.55); // turbine pitch — faces catch the neon strips
    blade.translate(1.18, 0, 0);
    blade.rotateZ(angle);
    blades.push(blade);

    // machined root sleeve where the blade meets the hub
    const sleeve = new THREE.CylinderGeometry(0.21, 0.24, 0.3, 24);
    sleeve.rotateZ(Math.PI / 2);
    sleeve.translate(0.62, 0, 0);
    sleeve.rotateZ(angle);
    sleeves.push(sleeve);

    // polished tip cap
    const tip = new THREE.SphereGeometry(0.1, 20, 16);
    tip.scale(1.5, 0.7, 0.7);
    tip.translate(2.2, 0, 0);
    tip.rotateZ(angle);
    tips.push(tip);
  }

  return [
    { name: 'chrome_blades', geometry: merge([...blades, ...tips]) },
    { name: 'dark_collar', geometry: merge([new THREE.TorusGeometry(0.62, 0.07, 24, 96), ...sleeves]) },
    { name: 'chrome_bolts', geometry: boltRing(0.62, 12, 0.035, 0, 'xy') },
    { name: 'glass_hub', geometry: new THREE.SphereGeometry(0.52, 48, 32) },
    { name: 'chrome_core', geometry: new THREE.SphereGeometry(0.26, 32, 24) },
  ];
}

/** SERVICES — the Stack. */
function platformStack() {
  const slab = (y, rotY) => {
    const g = new RoundedBoxGeometry(2.3, 0.16, 1.6, 3, 0.06);
    g.rotateY(rotY);
    g.translate(0, y, 0);
    return g;
  };
  const pinXZ = [
    [-0.85, -0.55], [0.85, -0.55], [-0.85, 0.55], [0.85, 0.55],
  ];

  const pins = [];
  const collars = [];
  for (const [x, z] of pinXZ) {
    pins.push(rod([x, -1.05, z], [x, 1.05, z], 0.035));
    for (const capY of [1.05, -1.05]) {
      const cap = new THREE.SphereGeometry(0.07, 16, 12);
      cap.translate(x, capY, z);
      pins.push(cap);
    }
    // standoff collars where the pin pierces each slab
    for (const cy of [-0.78, 0, 0.78]) {
      const collar = new THREE.TorusGeometry(0.062, 0.02, 12, 32);
      collar.rotateX(Math.PI / 2);
      collar.translate(x, cy + 0.09, z);
      collars.push(collar);
    }
  }

  // corner brackets hugging the top slab
  const brackets = [];
  for (const [x, z] of pinXZ) {
    const b = new RoundedBoxGeometry(0.2, 0.07, 0.2, 2, 0.02);
    b.translate(x * 1.06, 0.9, z * 1.06);
    brackets.push(b);
  }

  // cooling vents inset along one edge of the top slab
  const vents = [];
  for (let i = 0; i < 6; i++) {
    const v = new THREE.BoxGeometry(0.045, 0.03, 0.5);
    v.translate(-0.6 + i * 0.24, 0.87, -0.45);
    vents.push(v);
  }

  return [
    { name: 'dark_base', geometry: merge([slab(-0.78, 0.1), ...brackets, ...vents]) },
    { name: 'glass_mid', geometry: slab(0, -0.06) },
    { name: 'chrome_top', geometry: slab(0.78, 0.14) },
    { name: 'chrome_pins', geometry: merge(pins) },
    { name: 'dark_collars', geometry: merge(collars) },
  ];
}

/** WORK — the Cursor. */
function cursor() {
  const PTS = [
    [0, 0], [0, -1.45], [0.34, -1.12], [0.57, -1.66],
    [0.8, -1.56], [0.6, -1.04], [1.02, -1.04],
  ];
  const arrowShape = (s) => {
    const shape = new THREE.Shape();
    shape.moveTo(PTS[0][0] * s, PTS[0][1] * s);
    for (let i = 1; i < PTS.length; i++) shape.lineTo(PTS[i][0] * s, PTS[i][1] * s);
    shape.closePath();
    return shape;
  };

  const body = new THREE.ExtrudeGeometry(arrowShape(1), {
    depth: 0.28, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 4, curveSegments: 8,
  });
  body.center();
  const plate = new THREE.ExtrudeGeometry(arrowShape(1.14), {
    depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 8,
  });
  plate.center();
  plate.translate(0.045, -0.05, -0.26);

  // bolt heads at each vertex of the backplate
  const bolts = [];
  const centroid = PTS.reduce((acc, p) => [acc[0] + p[0] / PTS.length, acc[1] + p[1] / PTS.length], [0, 0]);
  for (const [px, py] of PTS) {
    // pull each vertex 12% toward the centroid so bolts sit inside the edge
    const bx = (px + (centroid[0] - px) * 0.16) * 1.14;
    const by = (py + (centroid[1] - py) * 0.16) * 1.14;
    const bolt = new THREE.CylinderGeometry(0.035, 0.035, 0.05, 16);
    bolt.rotateX(Math.PI / 2);
    // plate.center() shifted the plate by its bounding-box center — mirror that
    bolt.translate(bx - 0.51 * 1.14 + 0.045, by + 0.83 * 1.14 - 0.05, -0.14);
    bolts.push(bolt);
  }

  const ripples = [];
  for (const r of [0.3, 0.46]) {
    const ring = new THREE.TorusGeometry(r, 0.02, 14, 60);
    ring.translate(-0.51, 1.06, 0);
    ripples.push(ring);
  }

  return [
    { name: 'chrome_arrow', geometry: body },
    { name: 'dark_plate', geometry: plate },
    { name: 'chrome_bolts', geometry: merge(bolts) },
    { name: 'glass_ripple', geometry: merge(ripples) },
  ];
}

/** EXPERIENCE — the Peak. */
function peak() {
  const mountain = new THREE.ConeGeometry(1.5, 2.7, 9, 14);
  const pos = mountain.getAttribute('position');
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const h = (v.y + 1.35) / 2.7;
    const r = Math.sqrt(v.x * v.x + v.z * v.z);
    if (r > 0.001 && h < 0.92) {
      const ang = Math.atan2(v.z, v.x);
      const n1 = valueNoise3(Math.cos(ang) * 2, h * 3.5, Math.sin(ang) * 2, 42);
      const n2 = valueNoise3(Math.cos(ang) * 5, h * 8, Math.sin(ang) * 5, 87);
      const k = 1 + (n1 * 0.22 + n2 * 0.07) * (1 - h);
      pos.setX(i, v.x * k);
      pos.setZ(i, v.z * k);
    }
  }
  let m = mergeVertices(mountain, 1e-4);
  m.computeVertexNormals();

  const summit = new THREE.ConeGeometry(1.5 * 0.24, 0.68, 9, 2);
  summit.translate(0, 1.35 - 0.32, 0);
  summit.scale(1.03, 1.03, 1.03);

  // thin chrome strata ledges biting into the massif (radii inside the rock)
  const strata = [];
  for (const [sy, sr] of [[-0.55, 0.98], [-0.05, 0.74]]) {
    const ledge = new THREE.CylinderGeometry(sr, sr, 0.02, 9);
    ledge.translate(0, sy, 0);
    strata.push(ledge);
  }

  const band = new THREE.TorusGeometry(0.66, 0.045, 20, 80);
  band.rotateX(Math.PI / 2);
  band.translate(0, 0.05, 0);

  // hexagonal machined plinth — the monument base
  const plinth = new THREE.CylinderGeometry(1.85, 1.95, 0.22, 6);
  plinth.translate(0, -1.45, 0);
  const trim = new THREE.CylinderGeometry(1.9, 1.9, 0.045, 6);
  trim.translate(0, -1.35, 0);

  return [
    { name: 'dark_mountain', geometry: merge([m, plinth]) },
    { name: 'chrome_summit', geometry: merge([summit, ...strata, trim]) },
    { name: 'glass_band', geometry: band },
  ];
}

/** STACK — the Gyroscope. */
function gyroscope() {
  const outerTicks = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const tick = new THREE.BoxGeometry(0.03, 0.02, i % 6 === 0 ? 0.18 : 0.1);
    tick.translate(0, 0, 1.72);
    tick.rotateY(a);
    outerTicks.push(tick);
  }
  const outer = new THREE.TorusGeometry(1.6, 0.085, 24, 120);
  outer.rotateX(Math.PI / 2); // normal → Y
  for (const t of outerTicks) t.rotateX(0); // ticks already in XZ plane

  const middle = new THREE.TorusGeometry(1.18, 0.06, 24, 110);
  middle.rotateY(Math.PI / 2); // normal → X
  const inner = new THREE.TorusGeometry(0.82, 0.045, 20, 96); // normal Z

  // gimbal pivot hinges along each ring's axis
  const pivots = [];
  const hinge = (a, b, r) => {
    pivots.push(rod(a, b, r));
    for (const p of [a, b]) {
      const knob = new THREE.SphereGeometry(r * 1.9, 14, 12);
      knob.translate(...p);
      pivots.push(knob);
    }
  };
  hinge([1.18, 0, 0], [1.6, 0, 0], 0.045); // middle↔outer +X
  hinge([-1.6, 0, 0], [-1.18, 0, 0], 0.045); // middle↔outer -X
  hinge([0, 0, 0.82], [0, 0, 1.18], 0.04); // inner↔middle +Z
  hinge([0, 0, -1.18], [0, 0, -0.82], 0.04); // inner↔middle -Z
  hinge([0, 0.42, 0], [0, 0.82, 0], 0.035); // core↔inner +Y
  hinge([0, -0.82, 0], [0, -0.42, 0], 0.035); // core↔inner -Y

  // yoke mount cradling the instrument from below
  const yokeArc = new THREE.TorusGeometry(1.85, 0.055, 16, 48, Math.PI * 0.62);
  yokeArc.rotateZ(Math.PI + (Math.PI * (1 - 0.62)) / 2); // arc cups the underside
  const stem = rod([0, -1.85, 0], [0, -2.25, 0], 0.07);
  const base = new THREE.CylinderGeometry(0.5, 0.58, 0.09, 32);
  base.translate(0, -2.3, 0);

  return [
    { name: 'dark_outer', geometry: merge([outer, ...outerTicks]) },
    { name: 'chrome_middle', geometry: middle },
    { name: 'chrome_inner', geometry: inner },
    { name: 'glass_core', geometry: new THREE.SphereGeometry(0.42, 48, 32) },
    { name: 'chrome_pivots', geometry: merge(pivots) },
    { name: 'dark_mount', geometry: merge([yokeArc, stem, base]) },
  ];
}

/** CONTACT — the Paper Plane. */
function paperPlane() {
  const wing = (mirror) => {
    const shape = new THREE.Shape();
    shape.moveTo(1.35, 0);
    shape.lineTo(-1.15, 0.06);
    shape.lineTo(-1.05, 1.0);
    shape.closePath();
    let g = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: false });
    // subtle paper camber — curved surfaces sweep highlights instead of
    // mirroring the flat dark void
    {
      const p = g.getAttribute('position');
      for (let i = 0; i < p.count; i++) {
        const px = p.getX(i);
        const py = p.getY(i);
        const arc = Math.sin(((px + 1.15) / 2.5) * Math.PI) * 0.055 * (0.35 + 0.65 * Math.min(Math.abs(py), 1));
        p.setZ(i, p.getZ(i) + arc);
      }
      g.computeVertexNormals();
    }
    g.rotateX(-Math.PI / 2);
    g.rotateX(mirror ? THREE.MathUtils.degToRad(-14) : THREE.MathUtils.degToRad(14));
    if (mirror) {
      g.scale(1, 1, -1);
      g = flipWinding(g); // mirror-scaling flips handedness → normals invert
    }
    return g;
  };
  const keel = (mirror) => {
    const shape = new THREE.Shape();
    shape.moveTo(1.35, 0);
    shape.lineTo(-1.15, 0.04);
    shape.lineTo(-1.0, 0.5);
    shape.closePath();
    let g = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: false });
    g.rotateX(Math.PI);
    g.rotateX(mirror ? THREE.MathUtils.degToRad(10) : THREE.MathUtils.degToRad(-10));
    if (mirror) {
      g.scale(1, 1, -1);
      g = flipWinding(g);
    }
    return g;
  };

  // crisp spine ridge along the central fold + a polished nose cap
  const spine = rod([-1.15, 0.01, 0], [1.35, 0.01, 0], 0.02);
  const nose = new THREE.SphereGeometry(0.045, 16, 12);
  nose.scale(2.2, 1, 1);
  nose.translate(1.36, 0, 0);

  const beads = [];
  for (let i = 0; i < 4; i++) {
    const bead = new THREE.SphereGeometry(0.05 - i * 0.008, 16, 12);
    bead.translate(-1.6 - i * 0.42, 0.08 + i * 0.1, 0);
    beads.push(bead);
  }

  const wl = wing(false);
  const wr = wing(true);
  wr.computeVertexNormals();

  return [
    // silver (brushed) — flat wing panels would mirror the void as black in chrome
    { name: 'silver_wings', geometry: merge([wl, wr]) },
    { name: 'dark_keel', geometry: merge([keel(false), keel(true)]) },
    { name: 'chrome_spine', geometry: merge([spine, nose]) },
    { name: 'glass_wake', geometry: merge(beads) },
  ];
}

/* ---------------- export ---------------- */

const placeholder = {
  chrome: new THREE.MeshStandardMaterial({ name: 'chrome', metalness: 1, roughness: 0.15 }),
  dark: new THREE.MeshStandardMaterial({ name: 'dark', color: 0x101018, metalness: 0.9, roughness: 0.42 }),
  glass: new THREE.MeshStandardMaterial({ name: 'glass', color: 0xdfe8ff, metalness: 0, roughness: 0.2 }),
};

async function exportGLB(name, parts) {
  const scene = new THREE.Scene();
  let tris = 0;
  for (const part of parts) {
    const matKey = part.name.split('_')[0];
    const mesh = new THREE.Mesh(part.geometry, placeholder[matKey] ?? placeholder.chrome);
    mesh.name = part.name;
    scene.add(mesh);
    const g = part.geometry;
    tris += (g.index ? g.index.count : g.getAttribute('position').count) / 3;
  }
  const exporter = new GLTFExporter();
  const buffer = await new Promise((res, rej) => {
    exporter.parse(scene, (r) => res(r), (e) => rej(e), { binary: true });
  });
  writeFileSync(resolve(OUT_DIR, `${name}.glb`), Buffer.from(buffer));
  console.log(`${name}.glb  ${Math.round(buffer.byteLength / 1024)} KB  ${Math.round(tris / 1000)}k tris  [${parts.map((p) => p.name).join(', ')}]`);
}

await exportGLB('hero', asterisk());
await exportGLB('services', platformStack());
await exportGLB('work', cursor());
await exportGLB('experience', peak());
await exportGLB('stack', gyroscope());
await exportGLB('contact', paperPlane());
console.log('done →', OUT_DIR);
