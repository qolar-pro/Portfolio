/**
 * Free text-to-3D via Hugging Face ZeroGPU (Tencent Hunyuan3D-2 Space).
 *
 *   node scripts/generate-hf.mjs [name ...]
 *
 * Needs HF_TOKEN in the environment or in .env at the project root
 * (free huggingface.co account → Settings → Access Tokens → Read token).
 * With no arguments it generates all six symbols; pass names to do fewer —
 * useful because free ZeroGPU quota is a daily allowance and each object
 * takes ~1 minute of GPU time.
 *
 * Outputs land in public/models-gen/<name>.glb for review; integration into
 * the live set (public/models/) is a separate, deliberate step.
 */
import { Client } from '@gradio/client';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT_DIR = resolve(ROOT, 'public', 'models-gen');
mkdirSync(OUT_DIR, { recursive: true });

let token = process.env.HF_TOKEN;
if (!token && existsSync(resolve(ROOT, '.env'))) {
  const env = readFileSync(resolve(ROOT, '.env'), 'utf8');
  token = env.match(/^HF_TOKEN\s*=\s*(.+)$/m)?.[1]?.trim();
}
if (!token) {
  console.error('No HF_TOKEN found (env var or .env line "HF_TOKEN=hf_..."). Aborting.');
  process.exit(1);
}

const SPACE = 'tencent/Hunyuan3D-2';

const PROMPTS = {
  hero: 'Symmetrical six-bladed turbine asterisk sculpture, six identical tapered angular blades radiating from a central sphere hub, precision machined metal, aerodynamic blade profiles with subtle twist, high-end product design sculpture',
  services: 'Three stacked floating rectangular platform slabs with rounded corners, evenly separated, connected by four slim cylindrical corner rods, architectural model, precision engineered, clean geometry',
  work: 'Monumental computer mouse cursor arrow sculpture, thick extruded classic pointer arrow with precise beveled chamfered edges, mounted in front of a matching larger backplate arrow, minimal machined design',
  experience: 'Dramatic three-quarter view of a single steep mountain peak sculpture, sharp crystalline rock facets and angular ridges converging to one pointed summit, detailed geological strata, matte dark stone, monument on a small hexagonal base',
  stack: 'Precision gyroscope instrument, three concentric circular gimbal rings on different rotation axes with detailed pivot hinges and machined joints, small central sphere core, scientific instrument, high mechanical detail',
  contact: 'Origami paper airplane in flight, classic dart fold, two crisp swept wings with sharp fold creases, slim central keel fold underneath, elegant minimal geometry',
};

/**
 * The Space's text-to-3D tab is disabled, so we feed it an image instead:
 * pollinations.ai renders a free reference image from the prompt (no auth),
 * and Hunyuan3D lifts that image to a 3D shape. The reference is saved next
 * to the GLB for inspection.
 */
async function textToImage(name, prompt) {
  // 3/4 elevated view — a top-down or straight-on reference makes the model
  // hallucinate the hidden side (learned the hard way with the gyroscope)
  const styled = `${prompt}, three-quarter perspective view from slightly above, single object centered, studio product photography, neutral light grey background, soft even lighting, no text, no watermark`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?width=1024&height=1024&nologo=true&seed=42`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`pollinations failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(resolve(OUT_DIR, `${name}-ref.png`), buf);
  console.log(`[${name}] reference image ${Math.round(buf.length / 1024)} KB → models-gen/${name}-ref.png`);
  return new Blob([buf], { type: 'image/png' });
}

async function main() {
  const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(PROMPTS);
  console.log(`Connecting to ${SPACE}…`);
  const client = await Client.connect(SPACE, { hf_token: token });

  for (const name of targets) {
    const prompt = PROMPTS[name];
    if (!prompt) {
      console.error(`unknown object "${name}" — valid: ${Object.keys(PROMPTS).join(', ')}`);
      continue;
    }
    try {
      console.log(`\n[${name}] rendering reference image…`);
      const image = await textToImage(name, prompt);
      console.log(`[${name}] lifting to 3D (≈1 min of GPU)…`);
      const result = await client.predict('/shape_generation', {
        caption: '',
        image,
        mv_image_front: null,
        mv_image_back: null,
        mv_image_left: null,
        mv_image_right: null,
        steps: 30,
        guidance_scale: 5,
        seed: 1234,
        octree_resolution: 256,
        check_box_rembg: true,
        num_chunks: 8000,
        randomize_seed: false,
      });

      // find the GLB in the outputs (file refs carry a url)
      const flat = JSON.stringify(result.data);
      const url =
        result.data?.flatMap?.((d) => (typeof d === 'object' && d ? [d.url ?? d.value?.url ?? d.path] : [d]))
          .find((u) => typeof u === 'string' && u.includes('.glb')) ??
        flat.match(/https?:[^"]+\.glb/)?.[0];

      if (!url) {
        console.error(`[${name}] no GLB in response — raw:`, flat.slice(0, 500));
        continue;
      }
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(resolve(OUT_DIR, `${name}.glb`), buf);
      console.log(`[${name}] saved ${Math.round(buf.length / 1024)} KB → public/models-gen/${name}.glb`);
    } catch (err) {
      const msg = String(err?.message ?? err);
      console.error(`[${name}] failed: ${msg.slice(0, 300)}`);
      if (/quota|exceeded|wait/i.test(msg)) {
        console.error('→ Free ZeroGPU quota likely exhausted for today. Re-run tomorrow with the remaining names.');
        break;
      }
    }
  }
  console.log('\nDone. Review public/models-gen/ before integration.');
  process.exit(0);
}

main();
