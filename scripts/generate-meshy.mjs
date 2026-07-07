/**
 * Meshy text-to-3D generation for the six set-piece symbols.
 *
 *   MESHY_API_KEY=msy_...  node scripts/generate-meshy.mjs [name ...]
 *
 * Reads MESHY_API_KEY from the environment or from .env in the project root.
 * With no arguments it generates all six; pass names (e.g. `hero stack`) to
 * regenerate specific ones. Uses only the *preview* stage (geometry, no
 * textures — the site dresses everything in its own materials), ~5 credits
 * per object. Downloads land in public/models-gen/<name>.glb for review;
 * they are integrated into the site separately, so nothing breaks if a
 * generation disappoints.
 */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT_DIR = resolve(ROOT, 'public', 'models-gen');
mkdirSync(OUT_DIR, { recursive: true });

// ---- API key: env var, or .env in project root ----
let apiKey = process.env.MESHY_API_KEY;
if (!apiKey && existsSync(resolve(ROOT, '.env'))) {
  const env = readFileSync(resolve(ROOT, '.env'), 'utf8');
  apiKey = env.match(/^MESHY_API_KEY\s*=\s*(.+)$/m)?.[1]?.trim();
}
if (!apiKey) {
  console.error('No MESHY_API_KEY found (env var or .env). Aborting.');
  process.exit(1);
}

const API = 'https://api.meshy.ai/openapi/v2/text-to-3d';
const headers = { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' };

/**
 * Prompts are geometry-focused (no texture/color language) because the site
 * applies its own chrome/dark/glass materials. Each aims for a clean,
 * machined, high-detail sculptural object on a plain background.
 */
const PROMPTS = {
  hero: 'Symmetrical six-bladed turbine asterisk sculpture, six identical tapered angular blades radiating from a central sphere hub, precision machined, aerodynamic blade profiles with subtle twist, seamless smooth surfaces, high-end product design sculpture, isolated object',
  services: 'Three stacked floating rectangular platform slabs with rounded corners, evenly separated, connected by four slim cylindrical corner rods with spherical caps, architectural model, precision engineered, clean geometry, isolated object',
  work: 'Monumental computer mouse cursor arrow sculpture, thick extruded classic pointer arrow shape with precise beveled chamfered edges, mounted slightly in front of a matching larger backplate arrow, minimal, machined, isolated object',
  experience: 'Faceted mountain peak sculpture, sharp crystalline rock facets, dramatic steep angular ridges converging to a pointed summit, low-poly-inspired but finely detailed geological detailing, sculptural monument, isolated object',
  stack: 'Precision gyroscope instrument, three concentric circular gimbal rings mounted on different rotation axes with detailed pivot hinges and machined joints, small central sphere core, scientific instrument, high mechanical detail, isolated object',
  contact: 'Origami paper airplane in flight, classic dart fold, two crisp swept wings with sharp fold creases, slim central keel fold underneath, elegant minimal geometry, slightly banked flying pose, isolated object',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function createPreview(prompt) {
  const res = await fetch(API, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      mode: 'preview',
      prompt,
      art_style: 'realistic',
      topology: 'triangle',
      target_polycount: 60000,
      should_remesh: true,
    }),
  });
  if (!res.ok) throw new Error(`create failed ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.result; // task id
}

async function waitForTask(id, label) {
  for (let i = 0; i < 240; i++) {
    const res = await fetch(`${API}/${id}`, { headers });
    if (!res.ok) throw new Error(`poll failed ${res.status}: ${await res.text()}`);
    const task = await res.json();
    if (task.status === 'SUCCEEDED') return task;
    if (task.status === 'FAILED' || task.status === 'CANCELED') {
      throw new Error(`${label}: task ${task.status} — ${task.task_error?.message ?? 'no message'}`);
    }
    process.stdout.write(`\r${label}: ${task.status} ${task.progress ?? 0}%   `);
    await sleep(5000);
  }
  throw new Error(`${label}: timed out`);
}

async function generate(name) {
  const prompt = PROMPTS[name];
  if (!prompt) {
    console.error(`unknown object "${name}" — valid: ${Object.keys(PROMPTS).join(', ')}`);
    return;
  }
  console.log(`\n[${name}] creating preview task…`);
  const id = await createPreview(prompt);
  const task = await waitForTask(id, name);
  const url = task.model_urls?.glb;
  if (!url) throw new Error(`${name}: no GLB url on succeeded task`);
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  const file = resolve(OUT_DIR, `${name}.glb`);
  writeFileSync(file, buf);
  console.log(`\n[${name}] saved ${Math.round(buf.length / 1024)} KB → public/models-gen/${name}.glb`);
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PROMPTS);
console.log(`Generating: ${targets.join(', ')}`);
for (const name of targets) {
  await generate(name);
}
console.log('\nAll done. Review the files in public/models-gen/ before integration.');
