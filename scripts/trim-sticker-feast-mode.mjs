/**
 * Feast Mode — PNG transparente sin fondo blanco ni halftone punteado.
 * Uso: node scripts/trim-sticker-feast-mode.mjs
 */
import sharp from "sharp";
import { existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CURSOR_ASSETS =
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets";

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;

function resolveSource() {
  if (!existsSync(CURSOR_ASSETS)) {
    return join(ROOT, "public", "rusty", "stickers", "sticker-feast-mode.png");
  }
  const f = readdirSync(CURSOR_ASSETS).find((n) => n.includes("41468209"));
  return f ? join(CURSOR_ASSETS, f) : join(ROOT, "public", "rusty", "stickers", "sticker-feast-mode.png");
}

function floodOuterWhite(data, w, h) {
  const bg = new Uint8Array(w * h);
  const q = [];

  const isOuterWhite = (x, y) => {
    const i = (y * w + x) * 4;
    return data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 228;
  };

  for (let x = 0; x < w; x++) q.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) q.push([0, y], [w - 1, y]);

  while (q.length) {
    const [x, y] = q.pop();
    const idx = y * w + x;
    if (bg[idx]) continue;
    if (!isOuterWhite(x, y)) continue;
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
      if (lum(data[i], data[i + 1], data[i + 2]) < 175) continue;

      let dark = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (!dx && !dy) continue;
          const j = ((y + dy) * w + (x + dx)) * 4;
          if (lum(data[j], data[j + 1], data[j + 2]) < 55) dark++;
        }
      }

      if (dark >= 6) out[i + 3] = 0;
    }
  }
  return out;
}

async function buildPng(data, w, h) {
  const bg = floodOuterWhite(data, w, h);
  const out = Buffer.from(data);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (bg[y * w + x]) out[(y * w + x) * 4 + 3] = 0;
    }
  }

  const cleaned = removeHalftoneSpeckles(out, w, h);
  return sharp(cleaned, { raw: { width: w, height: h, channels: 4 } }).png();
}

async function main() {
  const src = resolveSource();
  const base = await sharp(src).ensureAlpha().png().toBuffer();
  const meta = await sharp(base).metadata();

  const outDir = join(ROOT, "public", "rusty", "stickers");
  const sizes = [
    { name: "sticker-feast-mode.png", width: meta.width },
    { name: "sticker-feast-mode@2x.png", width: Math.round(meta.width * 1.5) },
    { name: "sticker-feast-mode@3x.png", width: Math.round(meta.width * 2) },
  ];

  for (const { name, width } of sizes) {
    const { data, info } = await sharp(base)
      .resize(width)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const png = await buildPng(data, info.width, info.height);
    await png.toFile(join(outDir, name));
    console.log("✓", name, `${info.width}×${info.height}`);
  }

  console.log("Feast Mode — sin fondo.");
}

main();
