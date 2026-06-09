import { Prisma, PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FEATURED_PRODUCTS } from "../src/lib/data/products";
import { RUSTY_PROMOS } from "../src/lib/data/promos";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  SITE,
  WHATSAPP_MESSAGE,
  WHATSAPP_NUMBER,
} from "../src/lib/constants";

const prisma = new PrismaClient();

/** Convierte "R$ 38", "38,00", "38.00" → Decimal Prisma */
export function parsePrice(raw: string): Prisma.Decimal {
  const cleaned = raw
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const num = parseFloat(cleaned);
  if (!Number.isFinite(num) || num < 0) {
    return new Prisma.Decimal(0);
  }
  return new Prisma.Decimal(num.toFixed(2));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORIES = [
  { slug: "burgers", name: "Burgers", sortOrder: 0 },
  { slug: "combos", name: "Combos", sortOrder: 1 },
  { slug: "promos", name: "Promos", sortOrder: 2 },
  { slug: "bebidas", name: "Bebidas", sortOrder: 3 },
  { slug: "extras", name: "Extras", sortOrder: 4 },
] as const;

const SITE_SETTINGS: Record<string, Prisma.InputJsonValue> = {
  businessName: SITE.name,
  tagline: SITE.tagline,
  phone: SITE.phone,
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappMessage: WHATSAPP_MESSAGE,
  instagram: INSTAGRAM_HANDLE,
  instagramUrl: INSTAGRAM_URL,
  address: SITE.address,
  hours: SITE.hours,
  deliveryActive: true,
  takeawayActive: true,
  deliveryFee: 0,
  minimumOrder: 0,
  topMessage: "Feast Mode On",
  ifoodUrl: "",
  seoTitle: "Rusty Burger | Feast Mode On",
  seoDescription:
    "Hamburguesas oscuras, queso brutal y sabor callejero. Rusty Food House — pedí por WhatsApp o iFood.",
};

async function seedCategories() {
  const map = new Map<string, string>();

  for (const cat of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        active: true,
      },
      update: {
        name: cat.name,
        sortOrder: cat.sortOrder,
        active: true,
      },
    });
    map.set(cat.slug, row.id);
  }

  return map;
}

async function seedProducts(burgersCategoryId: string) {
  for (let i = 0; i < FEATURED_PRODUCTS.length; i++) {
    const p = FEATURED_PRODUCTS[i];
    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        categoryId: burgersCategoryId,
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.description,
        price: parsePrice(p.price),
        imageUrl: p.image,
        badge: p.badge ?? null,
        active: true,
        available: true,
        featured: true,
        sortOrder: i,
      },
      update: {
        categoryId: burgersCategoryId,
        name: p.name,
        description: p.description,
        shortDescription: p.description,
        price: parsePrice(p.price),
        imageUrl: p.image,
        badge: p.badge ?? null,
        active: true,
        available: true,
        featured: true,
        sortOrder: i,
      },
    });
  }
}

async function seedPromos() {
  for (let i = 0; i < RUSTY_PROMOS.length; i++) {
    const promo = RUSTY_PROMOS[i];
    const slug = slugify(promo.name);

    await prisma.promo.upsert({
      where: { slug },
      create: {
        title: promo.name,
        slug,
        tagline: promo.tagline,
        description: promo.description,
        price: parsePrice(promo.price),
        imageUrl: promo.image,
        active: true,
        sortOrder: promo.number - 1,
      },
      update: {
        title: promo.name,
        tagline: promo.tagline,
        description: promo.description,
        price: parsePrice(promo.price),
        imageUrl: promo.image,
        active: true,
        sortOrder: promo.number - 1,
      },
    });
  }
}

async function seedSettings() {
  for (const [key, value] of Object.entries(SITE_SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ℹ️  ADMIN_EMAIL / ADMIN_PASSWORD no definidos — admin omitido.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    create: {
      email,
      name: "Rusty Owner",
      passwordHash,
      role: AdminRole.OWNER,
      active: true,
    },
    update: {
      passwordHash,
      role: AdminRole.OWNER,
      active: true,
    },
  });

  console.log(`✓ Admin upsert: ${email}`);
}

async function main() {
  console.log("🌱 RustyBurger seed — inicio");

  const categoryMap = await seedCategories();
  const burgersId = categoryMap.get("burgers");

  if (!burgersId) {
    throw new Error("Categoría burgers no encontrada");
  }

  await seedProducts(burgersId);
  console.log(`✓ Productos: ${FEATURED_PRODUCTS.length}`);

  await seedPromos();
  console.log(`✓ Promos: ${RUSTY_PROMOS.length}`);

  await seedSettings();
  console.log(`✓ Settings: ${Object.keys(SITE_SETTINGS).length}`);

  await seedAdmin();

  console.log("🌱 Seed completado.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
