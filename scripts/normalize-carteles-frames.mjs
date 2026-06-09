/**
 * Encuadra stickers en 4:3 (igual que foto del local) — imagen completa, sin bandas.
 * node scripts/normalize-carteles-frames.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "public", "rusty", "local", "carteles");

const W = 1200;
const H = 900;

const sources = [
  "sticker-feast-mode.png",
  "sticker-r-fire.png",
  "sticker-zero-regrets.png",
  "sticker-trotamundo.png",
  "sticker-rustypremium.png",
];

async function frameSticker(filename) {
  const input = path.join(dir, filename);
  const base = filename.replace(".png", "");
  const output = path.join(dir, `framed-${base}.jpg`);

  await sharp(input)
    .resize(W, H, { fit: "cover", position: "centre" })
    .jpeg({ quality: 93, mozjpeg: true })
    .toFile(output);

  console.log("framed", base);
}

fs.mkdirSync(dir, { recursive: true });
for (const file of sources) {
  await frameSticker(file);
}
