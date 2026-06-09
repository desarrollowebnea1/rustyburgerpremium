/**
 * Exporta 6 burgers del hero collage en máxima calidad + @2x @3x.
 * node scripts/export-hero-collage-burgers.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir =
  "C:/Users/guigl/.cursor/projects/d-Users-guigl-OneDrive-Desktop-rustyburgerpremium/assets";
const outDir = path.join(__dirname, "..", "public", "rusty", "hero", "collage");

const MAP = [
  ["IMG_3174", "burger-chill-cheese"],
  ["IMG_3178", "burger-classica"],
  ["IMG_3181", "burger-feast-mode"],
  ["IMG_3182", "burger-pao-tostado"],
  ["IMG_3176", "burger-onion"],
  ["IMG_3179", "burger-melt"],
];

async function exportOne(sharp, srcPath, baseName) {
  const pipeline = sharp(srcPath)
    .rotate()
    .modulate({ brightness: 1.02, saturation: 1.06 })
    .sharpen({ sigma: 0.5, m1: 0.45, m2: 0.22 });

  const jpg = path.join(outDir, `${baseName}.jpg`);
  const webp = path.join(outDir, `${baseName}.webp`);

  await pipeline
    .clone()
    .jpeg({ quality: 96, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(jpg);

  await pipeline
    .clone()
    .webp({ quality: 94, effort: 6 })
    .toFile(webp);

  const meta = await sharp(jpg).metadata();

  for (const scale of [2, 3]) {
    await sharp(jpg)
      .resize({
        width: Math.round(meta.width * scale),
        height: Math.round(meta.height * scale),
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({ sigma: 0.3, m1: 0.3, m2: 0.15 })
      .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(path.join(outDir, `${baseName}@${scale}x.jpg`));
  }

  console.log("OK", baseName, `${meta.width}x${meta.height}`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const names = fs.readdirSync(assetsDir);
  const { default: sharp } = await import("sharp");

  for (const [id, base] of MAP) {
    const match = names.find((n) => n.includes(id));
    if (!match) {
      console.warn("missing", id);
      continue;
    }
    await exportOne(sharp, path.join(assetsDir, match), base);
  }
}

main().catch(console.error);
