/**
 * Genera stickers estilo marca para panel Local (carteles).
 * node scripts/generate-local-stickers.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "public", "rusty", "local", "carteles");

function stickerSvg({ titleLines, accentWord, iconPath }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="100%" height="100%" fill="#090909"/>
  <rect x="36" y="36" width="1128" height="828" rx="40" fill="none" stroke="#F2EFEA" stroke-width="14"/>
  <g transform="translate(90,170)">${iconPath}</g>
  <text x="560" y="300" fill="#F2EFEA" font-family="Arial Black, Impact, sans-serif" font-size="52" font-weight="900" letter-spacing="2">${titleLines[0]}</text>
  <text x="560" y="365" fill="#F2EFEA" font-family="Arial Black, Impact, sans-serif" font-size="52" font-weight="900" letter-spacing="2">${titleLines[1]}</text>
  <text x="560" y="500" fill="#F18700" font-family="Arial Black, Impact, sans-serif" font-size="72" font-weight="900" letter-spacing="1">${accentWord}</text>
</svg>`;
}

const stickers = [
  {
    name: "sticker-trotamundo",
    svg: stickerSvg({
      titleLines: ["RUSTY", "BURGER"],
      accentWord: "TROTAMUNDO",
      iconPath: `<circle cx="100" cy="100" r="92" fill="none" stroke="#F2EFEA" stroke-width="10"/>
        <ellipse cx="100" cy="100" rx="92" ry="36" fill="none" stroke="#F18700" stroke-width="8"/>
        <path d="M24 100h152M100 24v152" stroke="#F2EFEA" stroke-width="8"/>
        <path d="M176 78l40 22-40 22V78z" fill="#F18700"/>`,
    }),
  },
  {
    name: "sticker-rustypremium",
    svg: stickerSvg({
      titleLines: ["RUSTY", "BURGER"],
      accentWord: "PREMIUM",
      iconPath: `<path d="M100 24l24 72h80l-64 48 24 72-64-48-64 48 24-72-64-48h80z" fill="none" stroke="#F18700" stroke-width="12" stroke-linejoin="round"/>
        <circle cx="100" cy="170" r="28" fill="#F18700"/>`,
    }),
  },
];

fs.mkdirSync(outDir, { recursive: true });

for (const item of stickers) {
  const svgPath = path.join(outDir, `${item.name}.svg`);
  const pngPath = path.join(outDir, `${item.name}.png`);
  fs.writeFileSync(svgPath, item.svg);
  await sharp(Buffer.from(item.svg)).png().toFile(pngPath);
  console.log("OK", item.name);
}
