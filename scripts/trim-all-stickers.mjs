/**
 * Todos los stickers PNG — fondo transparente real (sin caja negra/blanca/halftone).
 * Uso: node scripts/trim-all-stickers.mjs
 */
import sharp from "sharp";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "rusty", "stickers");
const CURSOR_ASSETS =
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets";

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

const SOURCES = [
  { id: "180f23c0", base: "sticker-r-fire" },
  { id: "774e9a50", base: "sticker-zero-regrets" },
  { id: "41468209", base: "sticker-feast-mode" },
];

function findAssetBuffer(id) {
  if (!existsSync(CURSOR_ASSETS)) return null;
  const f = readdirSync(CURSOR_ASSETS).find((n) => n.includes(id));
  if (!f) return null;
  return readFileSync(join(CURSOR_ASSETS, f));
}

function isOuterBg(r, g, b, a) {
  if (a < 12) return true;
  if (r > 228 && g > 228 && b > 224) return true;
  if (lum(r, g, b) < 42) return true;
  return false;
}

function floodBackground(data, w, h) {
  const bg = new Uint8Array(w * h);
  const q = [];

  for (let x = 0; x < w; x++) q.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) q.push([0, y], [w - 1, y]);

  while (q.length) {
    const [x, y] = q.pop();
    const idx = y * w + x;
    if (bg[idx]) continue;
    const i = idx * 4;
    if (!isOuterBg(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
    bg[idx] = 1;
    if (x > 0) q.push([x - 1, y]);
    if (x < w - 1) q.push([x + 1, y]);
    if (y > 0) q.push([x, y - 1]);
    if (y < h - 1) q.push([x, y + 1]);
  }

  return bg;
}

function removeHalftoneSpeckles(data, w, h) {
  const out = Buffer.from(data);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      const i = (y * w + x) * 4;
      if (lum(data[i], data[i + 1], data[i + 2]) < 170) continue;

      let dark = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (!dx && !dy) continue;
          const j = ((y + dy) * w + (x + dx)) * 4;
          if (lum(data[j], data[j + 1], data[j + 2]) < 58) dark++;
        }
      }
      if (dark >= 5) out[i + 3] = 0;
    }
  }
  return out;
}

function cleanBuffer(data, w, h) {
  const bg = floodBackground(data, w, h);
  let out = Buffer.from(data);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (bg[y * w + x]) out[i + 3] = 0;
      if (out[i + 3] === 0) {
        out[i] = 0;
        out[i + 1] = 0;
        out[i + 2] = 0;
      }
    }
  }

  out = removeHalftoneSpeckles(out, w, h);

  for (let i = 3; i < out.length; i += 4) {
    if (out[i] === 0) {
      out[i - 3] = 0;
      out[i - 2] = 0;
      out[i - 1] = 0;
    }
  }

  return out;
}

async function exportSizes(baseBuffer, baseName, meta) {
  const sizes = [
    { suffix: "", scale: 1 },
    { suffix: "@2x", scale: 1.5 },
    { suffix: "@3x", scale: 2 },
  ];

  for (const { suffix, scale } of sizes) {
    const width = Math.round(meta.width * scale);
    const { data, info } = await sharp(baseBuffer)
      .resize(width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const cleaned = cleanBuffer(data, info.width, info.height);
    const name = `${baseName}${suffix}.png`;
    await sharp(cleaned, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 12 })
      .png()
      .toFile(join(OUT, name));
    console.log("  ✓", name);
  }
}

async function processOne({ id, base }) {
  const buf = findAssetBuffer(id);
  if (!buf) {
    console.warn("⚠ sin asset", base);
    return;
  }

  const baseBuffer = await sharp(buf).ensureAlpha().png().toBuffer();
  const meta = await sharp(baseBuffer).metadata();
  console.log("→", base, `${meta.width}×${meta.height}`);
  await exportSizes(baseBuffer, base, meta);
}

console.log("Procesando stickers…\n");
for (const item of SOURCES) {
  await processOne(item);
}
console.log("\nListo — todos sin fondo.");
