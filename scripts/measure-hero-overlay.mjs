/**
 * Auditoría forense — mide posiciones en capturas de referencia (1920×1080 base).
 * Uso: node scripts/measure-hero-overlay.mjs
 */
import { existsSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS = join(
  process.env.CURSOR_ASSETS ??
    "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets"
);

function findAsset(token) {
  if (!existsSync(ASSETS)) return null;
  const hit = readdirSync(ASSETS).find((f) => f.includes(token));
  return hit ? join(ASSETS, hit) : null;
}

const VICIO_REF = findAsset("image-2f7e35a4");
const RUSTY_REF = findAsset("image-d1323928");

/** Detecta bounding box de píxeles no-crema (contenido) en franjas horizontales */
async function analyzeStrip(imgPath, label) {
  if (!existsSync(imgPath)) {
    console.warn(`[skip] ${label}: archivo no encontrado`);
    return null;
  }

  const { data, info } = await sharp(imgPath)
    .resize(1920, 1080, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const cream = [241, 239, 232]; // #F1EFE8 aprox

  const isContent = (r, g, b) => {
    const dr = Math.abs(r - cream[0]);
    const dg = Math.abs(g - cream[1]);
    const db = Math.abs(b - cream[2]);
    return dr + dg + db > 38;
  };

  const rows = [];
  for (let y = 0; y < height; y += 8) {
    let minX = width;
    let maxX = 0;
    let count = 0;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      if (isContent(data[i], data[i + 1], data[i + 2])) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        count++;
      }
    }
    if (count > width * 0.02) {
      rows.push({ y, minX, maxX, span: maxX - minX, density: count / width });
    }
  }

  const leftCol = rows.filter((r) => r.maxX < width * 0.48);
  const centerCol = rows.filter((r) => r.minX > width * 0.38 && r.maxX < width * 0.92);
  const rightCol = rows.filter((r) => r.minX > width * 0.48);

  const burgerRows = leftCol.filter((r) => r.y > 80 && r.y < 780 && r.density > 0.08);
  const titleRows = rightCol.filter((r) => r.y > 60 && r.y < 280 && r.span > width * 0.25);
  const imageRows = centerCol.filter((r) => r.y > 200 && r.y < 620 && r.density > 0.12);
  const collectionRows = rows.filter((r) => r.y > 520 && r.y < 820 && r.span > width * 0.35);

  const bbox = (arr) => {
    if (!arr.length) return null;
    return {
      top: Math.min(...arr.map((r) => r.y)),
      bottom: Math.max(...arr.map((r) => r.y)),
      left: Math.min(...arr.map((r) => r.minX)),
      right: Math.max(...arr.map((r) => r.maxX)),
    };
  };

  const toPct = (box) =>
    box
      ? {
          top: `${((box.top / height) * 100).toFixed(1)}vh`,
          bottom: `${((box.bottom / height) * 100).toFixed(1)}vh`,
          left: `${((box.left / width) * 100).toFixed(1)}vw`,
          right: `${((box.right / width) * 100).toFixed(1)}vw`,
          width: `${(((box.right - box.left) / width) * 100).toFixed(1)}vw`,
          height: `${(((box.bottom - box.top) / height) * 100).toFixed(1)}vh`,
        }
      : null;

  return {
    label,
    viewport: `${width}×${height}`,
    burger: toPct(bbox(burgerRows)),
    title: toPct(bbox(titleRows)),
    images: toPct(bbox(imageRows)),
    collection: toPct(bbox(collectionRows)),
  };
}

console.log("=== AUDITORÍA FORENSE HERO (1920×1080 normalizado) ===\n");

const vicio = await analyzeStrip(VICIO_REF, "VICIO");
const rusty = await analyzeStrip(RUSTY_REF, "RUSTY");

const report = { generatedAt: new Date().toISOString(), captures: [vicio, rusty].filter(Boolean) };

for (const r of report.captures) {
  console.log(`--- ${r.label} ---`);
  for (const [k, v] of Object.entries(r)) {
    if (k === "label" || k === "viewport") console.log(`${k}: ${v}`);
    else if (v) console.log(`${k}:`, JSON.stringify(v, null, 2));
  }
  console.log();
}

const outPath = join(ROOT, "src/lib/data/hero-audit-captures.json");
writeFileSync(outPath, JSON.stringify(report, null, 2));
console.log(`Reporte guardado: ${outPath}`);
