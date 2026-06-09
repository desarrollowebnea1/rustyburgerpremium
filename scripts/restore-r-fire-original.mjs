/**
 * Restaura sticker R+fuego original — mismo look, sin madera ni marco exterior.
 * node scripts/restore-r-fire-original.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "rusty", "stickers");
const ORIGINAL =
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets/c__Users_guigl_AppData_Roaming_Cursor_User_workspaceStorage_8d4f3cf81645045936bcb85a19247517_images_180f23c0-9aad-4937-8c9c-ae3555484833-fbc3a205-96ce-4881-a740-2fcdd987eb48.png";

const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
const chroma = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);

function isCream(r, g, b) {
  const l = lum(r, g, b);
  return r > 138 && g > 128 && b > 108 && l > 132 && chroma(r, g, b) < 72;
}

function isOrange(r, g, b) {
  const l = lum(r, g, b);
  return r > 82 && r > g + 6 && r - b > 12 && l > 42 && l < 252;
}

function isInk(r, g, b) {
  const l = lum(r, g, b);
  return l < 54 && chroma(r, g, b) < 16;
}

function isPart(r, g, b) {
  return isCream(r, g, b) || isOrange(r, g, b) || isInk(r, g, b);
}

function killEdges(data, w, h) {
  const kill = new Uint8Array(w * h);
  const q = [];
  for (let x = 0; x < w; x++) q.push([x, 0], [x, h - 1]);
  for (let y = 0; y < h; y++) q.push([0, y], [w - 1, y]);
  while (q.length) {
    const [x, y] = q.pop();
    const idx = y * w + x;
    if (kill[idx]) continue;
    const i = idx * 4;
    if (isOrange(data[i], data[i + 1], data[i + 2])) continue;
    kill[idx] = 1;
    if (x > 0) q.push([x - 1, y]);
    if (x < w - 1) q.push([x + 1, y]);
    if (y > 0) q.push([x, y - 1]);
    if (y < h - 1) q.push([x, y + 1]);
  }
  return kill;
}

function keepMask(data, w, h) {
  const mask = new Uint8Array(w * h);
  const q = [];

  for (let y = Math.floor(h * 0.15); y < h; y++) {
    for (let x = 0; x < Math.floor(w * 0.7); x++) {
      const i = (y * w + x) * 4;
      if (!isOrange(data[i], data[i + 1], data[i + 2])) continue;
      mask[y * w + x] = 1;
      q.push([x, y]);
    }
  }

  while (q.length) {
    const [x, y] = q.pop();
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
      [x - 1, y - 1],
      [x + 1, y - 1],
      [x - 1, y + 1],
      [x + 1, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const idx = ny * w + nx;
      if (mask[idx]) continue;
      const i = idx * 4;
      if (!isPart(data[i], data[i + 1], data[i + 2])) continue;
      mask[idx] = 1;
      q.push([nx, ny]);
    }
  }

  const seen = new Uint8Array(w * h);
  let best = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = y * w + x;
      if (!mask[s] || seen[s]) continue;
      const comp = [];
      const cq = [[x, y]];
      seen[s] = 1;
      while (cq.length) {
        const [cx, cy] = cq.pop();
        comp.push([cx, cy]);
        for (const [nx, ny] of [
          [cx - 1, cy],
          [cx + 1, cy],
          [cx, cy - 1],
          [cx, cy + 1],
        ]) {
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const ni = ny * w + nx;
          if (!mask[ni] || seen[ni]) continue;
          seen[ni] = 1;
          cq.push([nx, ny]);
        }
      }
      if (comp.length > best.length) best = comp;
    }
  }

  const out = new Uint8Array(w * h);
  for (const [x, y] of best) out[y * w + x] = 1;

  const dist = new Int32Array(w * h).fill(9999);
  const dq = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!out[idx]) continue;
      const i = idx * 4;
      if (!isOrange(data[i], data[i + 1], data[i + 2])) continue;
      dist[idx] = 0;
      dq.push([x, y, 0]);
    }
  }

  while (dq.length) {
    const [x, y, d] = dq.shift();
    if (d > 30) continue;
    for (const [nx, ny] of [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ]) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const idx = ny * w + nx;
      if (!out[idx] || dist[idx] <= d + 1) continue;
      const i = idx * 4;
      if (!isPart(data[i], data[i + 1], data[i + 2])) continue;
      dist[idx] = d + 1;
      dq.push([nx, ny, d + 1]);
    }
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (dist[idx] > 30) out[idx] = 0;
    }
  }

  return out;
}

function isolate(data, w, h) {
  const out = Buffer.from(data);
  const kill = killEdges(data, w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!kill[y * w + x]) continue;
      const i = (y * w + x) * 4;
      out[i] = out[i + 1] = out[i + 2] = 0;
      out[i + 3] = 0;
    }
  }

  const keep = keepMask(out, w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const i = idx * 4;
      if (keep[idx] && isPart(out[i], out[i + 1], out[i + 2])) continue;
      out[i] = out[i + 1] = out[i + 2] = 0;
      out[i + 3] = 0;
    }
  }
  return out;
}

function bbox(data, w, h, pad = 10) {
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < 18) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  const left = Math.max(0, minX - pad);
  const top = Math.max(0, minY - pad);
  return {
    left,
    top,
    width: Math.min(w - left, maxX - minX + 1 + pad * 2),
    height: Math.min(h - top, maxY - minY + 1 + pad * 2),
  };
}

const buf = readFileSync(ORIGINAL);
const meta = await sharp(buf).metadata();

const { data, info } = await sharp(buf)
  .extract({ left: 0, top: 0, width: 182, height: meta.height })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const cleaned = isolate(data, info.width, info.height);
const box = bbox(cleaned, info.width, info.height, 12);

const master = await sharp(cleaned, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .extract(box)
  .png()
  .toBuffer();

const m = await sharp(master).metadata();
console.log(`master ${m.width}×${m.height}`);

for (const [name, scale] of [
  ["sticker-r-fire.png", 1],
  ["sticker-r-fire@2x.png", 1.5],
  ["sticker-r-fire@3x.png", 2],
]) {
  const out = await sharp(master)
    .resize(Math.round(m.width * scale), null, { kernel: sharp.kernel.lanczos3 })
    .png({ compressionLevel: 9 })
    .toBuffer();
  writeFileSync(join(OUT, name), out);
  const s = await sharp(out).metadata();
  console.log("✓", name, `${s.width}×${s.height}`);
}

console.log("Original restaurado.");
