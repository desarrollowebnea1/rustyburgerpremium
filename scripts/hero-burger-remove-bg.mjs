/**
 * Recorte burger + mano + salsa con fondo transparente.
 * node scripts/hero-burger-remove-bg.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const products = path.join(__dirname, "..", "public", "rusty", "products");
const input = path.join(products, "hero-burger-real.png");
const output = path.join(products, "hero-burger-cutout.png");

function isDarkBg(r, g, b) {
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (lum < 92) return true;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  if (lum < 128 && spread < 42) return true;
  return false;
}

async function main() {
  const { default: sharp } = await import("sharp");
  if (!fs.existsSync(input)) {
    console.error("Missing", input);
    process.exit(1);
  }

  const cropped = await sharp(input)
    .extract({ left: 8, top: 72, width: 520, height: 640 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = cropped;
  const { width, height, channels } = info;
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
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isDarkBg(r, g, b)) continue;
    data[i + 3] = 0;
    if (x > 0) queue.push([x - 1, y]);
    if (x < width - 1) queue.push([x + 1, y]);
    if (y > 0) queue.push([x, y - 1]);
    if (y < height - 1) queue.push([x, y + 1]);
  }

  const tmp = path.join(products, ".tmp-hero-burger-cutout.png");
  await sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 8 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(tmp);

  fs.renameSync(tmp, output);
  const meta = await sharp(output).metadata();
  console.log("OK hero-burger-cutout.png", meta.width, "x", meta.height);
}

main().catch(console.error);
