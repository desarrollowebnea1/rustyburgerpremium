/**
 * Sticker R fuego — SOLO R naranja + llamas + contorno negro.
 * node scripts/trim-r-fire-only.mjs
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

function isOrange(r, g, b) {
  const l = lum(r, g, b);
  const c = chroma(r, g, b);
  return r > 100 && r > g + 16 && r - b > 32 && l > 58 && l < 215 && c > 42;
}

function isWood(r, g, b) {
  const l = lum(r, g, b);
  return l > 35 && l < 145 && r > g && g >= b - 15 && r - b > 8;
}

function isInk(r, g, b) {
  const l = lum(r, g, b);
  return l < 50 && chroma(r, g, b) < 18;
}

function floodEdges(data, w, h) {
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

function maskFromOrange(data, w, h) {
  const mask = new Uint8Array(w * h);
  const q = [];
  const y0 = Math.floor(h * 0.2);

  for (let y = y0; y < h; y++) {
    for (let x = 0; x < w; x++) {
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
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (!isOrange(r, g, b) && !isInk(r, g, b) && !isWood(r, g, b)) continue;
      if (isWood(r, g, b)) continue;
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
  return out;
}

function isolate(data, w, h) {
  const out = Buffer.from(data);
  const kill = floodEdges(data, w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!kill[y * w + x]) continue;
      const i = (y * w + x) * 4;
      out[i] = out[i + 1] = out[i + 2] = 0;
      out[i + 3] = 0;
    }
  }

  const keep = maskFromOrange(out, w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      const i = idx * 4;
      const r = out[i];
      const g = out[i + 1];
      const b = out[i + 2];
      const ok =
        keep[idx] &&
        !isWood(r, g, b) &&
        lum(r, g, b) < 210 &&
        (isOrange(r, g, b) || isInk(r, g, b));
      if (ok) continue;
      out[i] = out[i + 1] = out[i + 2] = 0;
      out[i + 3] = 0;
    }
  }
  return out;
}

function bbox(data, w, h, pad = 22) {
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] < 20) continue;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(w - Math.max(0, minX - pad), maxX - minX + 1 + pad * 2),
    height: Math.min(h - Math.max(0, minY - pad), maxY - minY + 1 + pad * 2),
  };
}

async function buildMaster() {
  const buf = readFileSync(ORIGINAL);
  const meta = await sharp(buf).metadata();

  const { data, info } = await sharp(buf)
    .extract({ left: 0, top: 0, width: 188, height: meta.height })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cleaned = isolate(data, info.width, info.height);
  const box = bbox(cleaned, info.width, info.height);

  return sharp(cleaned, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract(box)
    .png()
    .toBuffer();
}

async function exportAll() {
  const master = await buildMaster();
  const meta = await sharp(master).metadata();
  console.log(`master ${meta.width}×${meta.height}`);

  for (const [name, scale] of [
    ["sticker-r-fire.png", 1],
    ["sticker-r-fire@2x.png", 1.5],
    ["sticker-r-fire@3x.png", 2],
  ]) {
    const out = await sharp(master)
      .resize(Math.round(meta.width * scale), null, {
        kernel: sharp.kernel.lanczos3,
      })
      .modulate({ saturation: 1.15 })
      .png({ compressionLevel: 9 })
      .toBuffer();
    writeFileSync(join(OUT, name), out);
    const m = await sharp(out).metadata();
    console.log("✓", name, `${m.width}×${m.height}`);
  }

  await sharp(master)
    .flatten({ background: { r: 245, g: 242, b: 236 } })
    .jpeg({ quality: 90 })
    .toFile(join(OUT, "_verify-cream.jpg"));
}

await exportAll();
