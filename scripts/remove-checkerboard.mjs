/**
 * PNG hero premium: restaura originales, quita fondos, defringe, afila, exporta @2x.
 * node scripts/remove-checkerboard.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "rusty");
const assetsDirs = [
  path.join(__dirname, "..", "assets"),
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets",
].filter((dir) => fs.existsSync(dir));

const ASSET_MAP = [
  { id: "IMG_3205", out: "products/hero-burger-cutout.png" },
  { id: "IMG_3212", out: "stickers/sticker-r-fire.png" },
  { id: "IMG_3210", out: "stickers/sticker-zero-regrets.png" },
  { id: "IMG_3211", out: "stickers/sticker-feast-mode.png" },
];

/** Fondo neutro: checkerboard, blanco de sticker, mesa gris */
function isNeutralBackground(r, g, b, a, { allowDark = false, allowWhite = false } = {}) {
  if (a < 10) return true;

  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  if (spread >= 3 && spread <= 40 && r >= g && g >= b - 6 && lum >= 205 && lum <= 252) {
    return false;
  }

  if (lum >= 215 && r > b + 6 && spread <= 35) return false;

  if (allowDark && spread <= 30 && lum >= 38 && lum <= 98) return true;

  if (allowWhite && lum >= 222 && spread <= 28) return true;

  if (lum >= 238 && spread <= 22) return true;

  if (spread <= 34) {
    if (lum >= 165 && lum <= 248) return true;
    if (lum >= 108 && lum <= 168) return true;
    if (lum >= 72 && lum <= 112) return true;
  }

  return false;
}

/** Halo blanco/gris del recorte automático */
function isFringePixel(r, g, b, a) {
  if (a < 8) return false;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  if (lum >= 248 && spread <= 18) return true;
  if (lum >= 200 && spread <= 28) return true;
  if (lum >= 165 && spread <= 22) return true;

  return false;
}

function restoreAssets() {
  if (!assetsDirs.length) return;
  const names = assetsDirs.flatMap((dir) =>
    fs.readdirSync(dir).map((name) => ({ dir, name }))
  );
  for (const { id, out } of ASSET_MAP) {
    const match = names.find((entry) => entry.name.includes(id));
    if (!match) {
      console.warn("asset missing", id);
      continue;
    }
    const dest = path.join(root, out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(match.dir, match.name), dest);
    console.log("restored", out);
  }
}

function floodFromEdges(data, width, height, channels, opts = {}) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push([x, 0], [x, height - 1]);
  }
  for (let y = 1; y < height - 1; y++) {
    queue.push([0, y], [width - 1, y]);
  }

  while (queue.length) {
    const [x, y] = queue.pop();
    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    const i = idx * channels;
    if (!isNeutralBackground(data[i], data[i + 1], data[i + 2], data[i + 3], opts)) continue;
    data[i + 3] = 0;
    if (x > 0) queue.push([x - 1, y]);
    if (x < width - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < height - 1) queue.push([x, y + 1]);
  }
}

function removeBackgroundIslands(data, width, height, channels, opts = {}) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (data[i + 3] === 0) continue;
      if (isNeutralBackground(data[i], data[i + 1], data[i + 2], data[i + 3], opts)) {
        data[i + 3] = 0;
      }
    }
  }
}

function erodeNeutralHalos(data, width, height, channels, passes = 3, opts = {}) {
  for (let pass = 0; pass < passes; pass++) {
    const alpha = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        alpha[y * width + x] = data[(y * width + x) * channels + 3];
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const i = idx * channels;
        if (alpha[idx] === 0) continue;

        let touchesTransparent = false;
        for (let dy = -1; dy <= 1 && !touchesTransparent; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
              touchesTransparent = true;
              break;
            }
            if (alpha[ny * width + nx] === 0) {
              touchesTransparent = true;
              break;
            }
          }
        }

        if (!touchesTransparent) continue;

        if (isNeutralBackground(data[i], data[i + 1], data[i + 2], data[i + 3], opts)) {
          data[i + 3] = 0;
        }
      }
    }
  }
}

/** Quita borde blanco dentado del recorte */
function defringe(data, width, height, channels, passes = 5) {
  for (let pass = 0; pass < passes; pass++) {
    const alpha = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        alpha[y * width + x] = data[(y * width + x) * channels + 3];
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        const i = idx * channels;
        if (alpha[idx] === 0) continue;

        let touchesTransparent = false;
        for (let dy = -1; dy <= 1 && !touchesTransparent; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
              touchesTransparent = true;
              break;
            }
            if (alpha[ny * width + nx] === 0) {
              touchesTransparent = true;
              break;
            }
          }
        }

        if (!touchesTransparent) continue;

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (isFringePixel(r, g, b, data[i + 3])) {
          data[i + 3] = 0;
        } else if (data[i + 3] < 255) {
          data[i + 3] = Math.min(data[i + 3], 220);
        }
      }
    }
  }
}

function premiumPipeline(sharp, data, width, height, channels, { isSticker = false } = {}) {
  let pipe = sharp(data, { raw: { width, height, channels: 4 } }).trim({ threshold: 1 });

  if (!isSticker) {
    pipe = pipe.modulate({ brightness: 1.03, saturation: 1.12 });
  } else {
    pipe = pipe.modulate({ brightness: 1.02, saturation: 1.08 });
  }

  return pipe.sharpen({ sigma: 0.55, m1: 0.5, m2: 0.25, x1: 2, y2: 10 });
}

async function exportRetinaVariants(sharp, input, scales = [2, 3]) {
  const meta = await sharp(input).metadata();
  for (const scale of scales) {
    const out = input.replace(/\.png$/, `@${scale}x.png`);
    await sharp(input)
      .resize({
        width: Math.round(meta.width * scale),
        height: Math.round(meta.height * scale),
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({ sigma: 0.35, m1: 0.35, m2: 0.18 })
      .png({ compressionLevel: 2, adaptiveFiltering: true, effort: 10 })
      .toFile(out);
  }
}

async function processFile(sharp, rel) {
  const input = path.join(root, rel);
  if (!fs.existsSync(input)) {
    console.warn("skip", rel);
    return;
  }

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const isSticker = rel.includes("sticker");
  const bgOpts = {
    allowDark: isSticker,
    allowWhite: isSticker,
  };

  floodFromEdges(data, width, height, channels, bgOpts);
  removeBackgroundIslands(data, width, height, channels, bgOpts);
  erodeNeutralHalos(data, width, height, channels, isSticker ? 7 : 4, bgOpts);
  defringe(data, width, height, channels, isSticker ? 4 : 6);

  const pipeline = premiumPipeline(sharp, data, width, height, channels, { isSticker });
  const meta = await pipeline.clone().metadata();

  const tmp = path.join(root, `.tmp-${path.basename(rel)}`);
  await pipeline
    .png({ compressionLevel: 2, adaptiveFiltering: true, effort: 10 })
    .toFile(tmp);
  fs.renameSync(tmp, input);

  await exportRetinaVariants(sharp, input, [2, 3]);

  console.log("OK", rel, `${meta.width}x${meta.height}`, "+ @2x @3x");
}

async function main() {
  restoreAssets();
  const { default: sharp } = await import("sharp");
  for (const { out } of ASSET_MAP) {
    await processFile(sharp, out);
  }
}

main().catch(console.error);
