/**
 * Exporta SVGs editoriales del hero a PNG para evitar huecos/imágenes rotas.
 * node scripts/export-hero-collage-png.mjs
 */
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const hero = path.join(__dirname, "..", "public", "rusty", "hero");

const exports = [
  { src: "cutout-interior-editorial.svg", out: "cutout-interior.png", w: 900, h: 620 },
  { src: "cutout-vertical-editorial.svg", out: "cutout-vertical.png", w: 480, h: 900 },
  { src: "rusty-wordmark.svg", out: "rusty-wordmark.png", w: 1200, h: 520 },
];

async function main() {
  const { default: sharp } = await import("sharp");
  for (const item of exports) {
    await sharp(path.join(hero, item.src), { density: 150 })
      .resize(item.w, item.h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(hero, item.out));
    console.log("OK", item.out);
  }
}

main().catch(console.error);
