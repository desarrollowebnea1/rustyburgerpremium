/**
 * Limpia los 3 stickers hero — fondo transparente, sin madera/suciedad.
 * node scripts/clean-hero-stickers.mjs
 */
import sharp from "sharp";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "rusty", "stickers");

const STICKERS = [
  { base: "sticker-r-fire", sat: 1.2 },
  { base: "sticker-feast-mode", sat: 1.14 },
  { base: "sticker-zero-regrets", sat: 1.16 },
];

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

function isBgPixel(r, g, b, a) {
  if (a < 14) return true;
  if (r > 228 && g > 225 && b > 218) return true;
  if (lum(r, g, b) < 52) return true;
  if (Math.abs(r - g) < 10 && Math.abs(g - b) < 14 && lum(r, g, b) > 168 && lum(r, g, b) < 248)
    return true;
  return false;
}

function isWood(r, g, b, a) {
  if (a < 18) return true;
  const l = lum(r, g, b);
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  if (l > 55 && l < 195 && chroma < 55 && r >= g && g >= b - 8) return true;
  return false;
}

function isSmoke(r, g, b, a) {
  if (a < 18) return true;
  const l = lum(r, g, b);
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  return l < 108 && chroma < 42;
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
  applyMask(out, floodMask(out, w, h, isWood), w, h);
  applyMask(out, floodMask(out, w, h, isSmoke), w, h);
  for (let i = 0; i < out.length; i += 4) {
    if (out[i + 3] === 0) out[i] = out[i + 1] = out[i + 2] = 0;
  }
  return out;
}

async function exportOne(inputPath, baseName, saturation) {
  const base = await sharp(inputPath).ensureAlpha().png().toBuffer();
  const meta = await sharp(base).metadata();

  for (const { suffix, scale } of [
    { suffix: "", scale: 1 },
    { suffix: "@2x", scale: 1.5 },
    { suffix: "@3x", scale: 2 },
  ]) {
    const width = Math.round(meta.width * scale);
    const { data, info } = await sharp(base)
      .resize(width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const cleaned = clean(data, info.width, info.height);
    const name = `${baseName}${suffix}.png`;

    await sharp(cleaned, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim({ threshold: 10 })
      .modulate({ saturation, brightness: 1.05 })
      .sharpen({ sigma: 0.5 })
      .png({ compressionLevel: 9 })
      .toFile(join(OUT, name));

    const alpha = await sharp(join(OUT, name)).metadata();
    console.log("  ✓", name, alpha.hasAlpha ? "alpha OK" : "WARN no alpha");
  }
}

for (const item of STICKERS) {
  const input = join(OUT, `${item.base}.png`);
  if (!existsSync(input)) {
    console.warn("⚠ missing", input);
    continue;
  }
  console.log("→", item.base);
  await exportOne(input, item.base, item.sat);
}

console.log("\n3 stickers limpios — transparentes.");
