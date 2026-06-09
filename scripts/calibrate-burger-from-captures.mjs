/**
 * Compara capturas Rusty vs Vicio y calcula posición/tamaño de la burger.
 */
import { existsSync, readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ASSETS =
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets";

function findAsset(token) {
  const hit = readdirSync(ASSETS).find((f) => f.includes(token));
  return hit ? join(ASSETS, hit) : null;
}

const RUSTY = findAsset("image-0eb852ae");
const VICIO = findAsset("image-e839d673");

async function detectBurger(imgPath, label) {
  const targetW = 1920;
  const targetH = 1080;

  const { data, info } = await sharp(imgPath)
    .resize(targetW, targetH, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const cream = [241, 239, 232];

  const isBurgerPixel = (r, g, b, a, x) => {
    if (x > width * 0.55) return false;
    const dr = Math.abs(r - cream[0]);
    const dg = Math.abs(g - cream[1]);
    const db = Math.abs(b - cream[2]);
    const dist = dr + dg + db;
    if (dist < 42) return false;
    if (r > 230 && g > 220 && b > 200) return false;
    return true;
  };

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0,
    count = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = channels === 4 ? data[i + 3] : 255;
      if (isBurgerPixel(r, g, b, a, x)) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        count++;
      }
    }
  }

  return {
    label,
    bbox: { left: minX, top: minY, width: maxX - minX, height: maxY - minY },
    area: count,
  };
}

const rusty = await detectBurger(RUSTY, "RUSTY");
const vicio = await detectBurger(VICIO, "VICIO");

const delta = {
  left: vicio.bbox.left - rusty.bbox.left,
  top: vicio.bbox.top - rusty.bbox.top,
  width: vicio.bbox.width - rusty.bbox.width,
  height: vicio.bbox.height - rusty.bbox.height,
};

const current = { left: 108, top: 112, width: 768 };
const recommended = {
  left: Math.round(current.left + delta.left),
  top: Math.round(current.top + delta.top),
  width: Math.round(current.width + delta.width),
};

const report = { rusty, vicio, delta, current, recommended };
console.log(JSON.stringify(report, null, 2));
writeFileSync(join(ROOT, "src/lib/data/hero-burger-calibration.json"), JSON.stringify(report, null, 2));
