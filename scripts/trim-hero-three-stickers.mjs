/**
 * Solo 3 stickers hero: r-fire, feast-mode, zero-regrets.
 * Sin fondo + color premium. No toca código ni otros assets.
 */
import sharp from "sharp";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "rusty", "stickers");
const CURSOR_ASSETS =
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets";

const ONLY = [
  { id: "180f23c0", base: "sticker-r-fire", sat: 1.22 },
  { id: "774e9a50", base: "sticker-zero-regrets", sat: 1.16 },
  { id: "41468209", base: "sticker-feast-mode", sat: 1.14 },
];

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

function findBuffer(id) {
  if (!existsSync(CURSOR_ASSETS)) return null;
  const f = readdirSync(CURSOR_ASSETS).find((n) => n.includes(id));
  return f ? readFileSync(join(CURSOR_ASSETS, f)) : null;
}

function isBgPixel(r, g, b, a) {
  if (a < 14) return true;
  if (r > 225 && g > 225 && b > 220) return true;
  if (lum(r, g, b) < 48) return true;
  if (Math.abs(r - g) < 8 && Math.abs(g - b) < 12 && lum(r, g, b) > 175 && lum(r, g, b) < 245)
    return true;
  return false;
}

function floodBg(data, w, h) {
  const bg = new Uint8Array(w * h);
  const q = [];
  for (let x = 0; x < w; x++) q.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) q.push([0, y], [w - 1, y]);
  while (q.length) {
    const [x, y] = q.pop();
    const idx = y * w + x;
    if (bg[idx]) continue;
    const i = idx * 4;
    if (!isBgPixel(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
    bg[idx] = 1;
    if (x > 0) q.push([x - 1, y]);
    if (x < w - 1) q.push([x + 1, y]);
    if (y > 0) q.push([x, y - 1]);
    if (y < h - 1) q.push([x, y + 1]);
  }
  return bg;
}

function isSmoke(r, g, b, a) {
  if (a < 18) return true;
  const l = lum(r, g, b);
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return l < 105 && chroma < 40;
}

function floodMask(data, w, h, test) {
  const bg = new Uint8Array(w * h);
  const q = [];
  for (let x = 0; x < w; x++) q.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) q.push([0, y], [w - 1, y]);
  while (q.length) {
    const [x, y] = q.pop();
    const idx = y * w + x;
    if (bg[idx]) continue;
    const i = idx * 4;
    if (!test(data[i], data[i + 1], data[i + 2], data[i + 3])) continue;
    bg[idx] = 1;
    if (x > 0) q.push([x - 1, y]);
    if (x < w - 1) q.push([x + 1, y]);
    if (y > 0) q.push([x, y - 1]);
    if (y < h - 1) q.push([x, y + 1]);
  }
  return bg;
}

function stripHalftone(data, w, h) {
  const out = Buffer.from(data);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      const i = (y * w + x) * 4;
      const l = lum(data[i], data[i + 1], data[i + 2]);
      if (l < 165) continue;
      let dark = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (!dx && !dy) continue;
          const j = ((y + dy) * w + (x + dx)) * 4;
          if (lum(data[j], data[j + 1], data[j + 2]) < 62) dark++;
        }
      }
      if (dark >= 4) out[i + 3] = 0;
    }
  }
  return out;
}

function applyMask(out, mask, w, h) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!mask[y * w + x]) continue;
      const i = (y * w + x) * 4;
      out[i + 3] = 0;
      out[i] = out[i + 1] = out[i + 2] = 0;
    }
  }
}

function clean(data, w, h) {
  let out = Buffer.from(data);
  applyMask(out, floodMask(data, w, h, isBgPixel), w, h);
  applyMask(out, floodMask(out, w, h, isSmoke), w, h);
  out = stripHalftone(out, w, h);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) out[i] = out[i + 1] = out[i + 2] = 0;
  }
  return out;
}

async function exportOne(baseBuffer, baseName, meta, saturation) {
  for (const { suffix, scale } of [
    { suffix: "", scale: 1 },
    { suffix: "@2x", scale: 1.5 },
    { suffix: "@3x", scale: 2 },
  ]) {
    const width = Math.round(meta.width * scale);
    const { data, info } = await sharp(baseBuffer)
      .resize(width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const cleaned = clean(data, info.width, info.height);
    const name = `${baseName}${suffix}.png`;

    await sharp(cleaned, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 8 })
      .modulate({ saturation, brightness: 1.04 })
      .sharpen({ sigma: 0.45 })
      .png({ compressionLevel: 9 })
      .toFile(join(OUT, name));

    console.log("  ✓", name);
  }
}

for (const item of ONLY) {
  const buf = findBuffer(item.id);
  if (!buf) {
    console.warn("⚠", item.base, "sin original");
    continue;
  }
  const base = await sharp(buf).ensureAlpha().png().toBuffer();
  const meta = await sharp(base).metadata();
  console.log("→", item.base, `${meta.width}×${meta.height}`);
  await exportOne(base, item.base, meta, item.sat);
}

console.log("\n3 stickers listos — sin fondo, color premium.");
