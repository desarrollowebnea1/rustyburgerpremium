import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public", "rusty");

function svg({ w, h, title, subtitle, bg = "#141414", accent = "#F18700" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${bg}"/><stop offset="100%" stop-color="#090909"/></linearGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="0" y="0" width="100%" height="100%" fill="${accent}" opacity="0.08"/>
  <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="${accent}" font-family="Arial Black,sans-serif" font-size="${Math.min(w,h)/8}" font-weight="900">${title}</text>
  ${subtitle ? `<text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#F2EFEA" opacity="0.5" font-family="Arial,sans-serif" font-size="${Math.min(w,h)/16}">${subtitle}</text>` : ""}
  <text x="50%" y="92%" dominant-baseline="middle" text-anchor="middle" fill="#3A3A3A" font-family="Arial,sans-serif" font-size="12">PLACEHOLDER — reemplazar asset real</text>
</svg>`;
}

const dirs = ["logo", "products", "stickers", "textures", "local", "promos"];
dirs.forEach((d) => fs.mkdirSync(path.join(root, d), { recursive: true }));

fs.writeFileSync(
  path.join(root, "logo", "rusty-logo.svg"),
  svg({ w: 320, h: 120, title: "RUSTY", subtitle: "BURGER", accent: "#F18700" })
);

fs.writeFileSync(
  path.join(root, "products", "hero-burger.svg"),
  svg({ w: 560, h: 560, title: "BURGER", subtitle: "hero-burger.png", bg: "#1a0f00" })
);

const products = [
  "chill-cheese",
  "molho-rusty",
  "classica",
  "bacon-cheddar",
  "onion",
  "pao-tostado",
  "smash-night",
  "rusty-box",
  "feast-duo",
  "zero-regrets",
];
products.forEach((slug) => {
  const label = slug.replace(/-/g, " ").toUpperCase();
  fs.writeFileSync(
    path.join(root, "products", `${slug}.svg`),
    svg({ w: 800, h: 600, title: label, subtitle: `${slug}.jpg` })
  );
});

["fachada", "barra", "carteles", "interior"].forEach((name) => {
  fs.writeFileSync(
    path.join(root, "local", `${name}.svg`),
    svg({ w: 900, h: 675, title: name.toUpperCase(), subtitle: "local/" + name + ".jpg" })
  );
});

fs.writeFileSync(
  path.join(root, "promos", "promo-1.svg"),
  svg({ w: 800, h: 800, title: "PROMO #1", subtitle: "burger + fritas + bebida", accent: "#E5391D" })
);

console.log("Placeholders generated in public/rusty/");
