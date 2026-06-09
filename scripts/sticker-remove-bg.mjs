/**
 * Fondo transparente — flood fill desde bordes (madera/mesa).
 * node scripts/sticker-remove-bg.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "rusty", "stickers");

const files = [
  "sticker-r-fire.png",
  "sticker-zero-regrets.png",
  "sticker-rusty-burger.png",
];

function isBackground(r, g, b, refs) {
  for (const [rr, gg, bb] of refs) {
    if (Math.hypot(r - rr, g - gg, b - bb) < 72) return true;
  }
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum < 62) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 28 && lum < 95) return true;
  return false;
}

async function processFile(sharp, file) {
  const input = path.join(dir, file);
  if (!fs.existsSync(input)) {
    console.warn("skip missing", file);
    return;
  }

  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const queue = [];
  const refs = [];

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
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isBackground(r, g, b, refs)) continue;
    data[i + 3] = 0;
    if (x > 0) queue.push([x - 1, y]);
    if (x < width - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < height - 1) queue.push([x, y + 1]);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (data[i + 3] === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 248 && Math.abs(r - g) < 12 && Math.abs(g - b) < 12) {
        data[i + 3] = 0;
      }
    }
  }

  const tmp = path.join(dir, `.tmp-${file}`);
  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tmp);
  fs.renameSync(tmp, input);
  console.log("OK", file);
}

async function main() {
  const feast = path.join(dir, "sticker-feast-mode.png");
  const rusty = path.join(dir, "sticker-rusty-burger.png");
  if (fs.existsSync(feast) && !fs.existsSync(rusty)) {
    fs.copyFileSync(feast, rusty);
  }

  const { default: sharp } = await import("sharp");
  for (const file of files) {
    await processFile(sharp, file);
  }
}

main().catch(console.error);
