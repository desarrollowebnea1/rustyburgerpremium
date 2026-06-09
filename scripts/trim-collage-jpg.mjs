/**
 * Recorta bandas negras + exporta al aspecto panel Vicio (378×434).
 * Lee desde collage/_originals/, escribe en collage/.
 * Uso: node scripts/trim-collage-jpg.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COLLAGE_DIR = path.join(__dirname, "..", "public", "rusty", "hero", "collage");
const SOURCE_DIR = path.join(COLLAGE_DIR, "_originals");

/** Recorte superior/inferior por asset (px @ 1x) — quita bandas negras y footers */
const CROP_INSETS = {
  "burger-chill-cheese": { top: 52, bottom: 145 },
  "burger-classica": { top: 0, bottom: 90 },
  "burger-feast-mode": { top: 52, bottom: 130 },
  "burger-pao-tostado": { top: 52, bottom: 130 },
  "burger-onion": { top: 112, bottom: 30 },
  "burger-melt": { top: 0, bottom: 100 },
};

const PANEL_W = 378;
const PANEL_H = 434;
const PANEL_AR = PANEL_W / PANEL_H;

function parseScale(filename) {
  const m = filename.match(/@(\d+)x\./);
  return m ? Number(m[1]) : 1;
}

function baseKey(filename) {
  return filename.replace(/@\d+x/, "").replace(".jpg", "");
}

async function cropOne(filename) {
  const src = path.join(SOURCE_DIR, filename);
  const dest = path.join(COLLAGE_DIR, filename);
  if (!fs.existsSync(src)) {
    console.warn(`Skip (sin original): ${filename}`);
    return;
  }

  const scale = parseScale(filename);
  const inset = CROP_INSETS[baseKey(filename)];
  if (!inset) {
    console.warn(`Skip (sin reglas): ${filename}`);
    return;
  }

  const top = Math.round(inset.top * scale);
  const bottom = Math.round(inset.bottom * scale);
  const outW = PANEL_W * scale;
  const outH = PANEL_H * scale;

  const meta = await sharp(src).metadata();
  const extractH = meta.height - top - bottom;
  if (extractH <= 0) throw new Error(`${filename}: recorte inválido`);

  let pipeline = sharp(src).extract({
    left: 0,
    top,
    width: meta.width,
    height: extractH,
  });

  const mid = await pipeline.toBuffer({ resolveWithObject: true });
  const w = mid.info.width;
  const h = mid.info.height;
  const ar = w / h;

  let cropW;
  let cropH;
  let cropL;
  let cropT;

  if (ar > PANEL_AR) {
    cropH = h;
    cropW = Math.round(h * PANEL_AR);
    cropL = Math.round((w - cropW) / 2);
    cropT = 0;
  } else {
    cropW = w;
    cropH = Math.round(w / PANEL_AR);
    cropL = 0;
    cropT = Math.round((h - cropH) / 2);
  }

  await sharp(mid.data)
    .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
    .resize(outW, outH, { fit: "fill" })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(dest);

  console.log(`${filename}: ${meta.width}×${meta.height} → ${outW}×${outH}`);
}

const files = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith(".jpg")).sort();
console.log(`Procesando ${files.length} JPG (aspecto Vicio ${PANEL_W}×${PANEL_H})\n`);

for (const file of files) {
  await cropOne(file);
}

console.log("\n✓ Collage recortado. Originales intactos en _originals/");
