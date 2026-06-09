#!/usr/bin/env node
/**
 * E2E smoke test contra staging/producción o local con DB real.
 *
 * Uso:
 *   node scripts/e2e-production.mjs
 *   node scripts/e2e-production.mjs https://tu-app.vercel.app
 *
 * Requiere .env.local con DATABASE_URL (para contexto) y credenciales admin.
 * El test golpea HTTP; la app debe estar corriendo (npm run dev / Vercel deploy).
 */
import fs from "fs";
import path from "path";
import { loadEnvFile } from "./load-env.mjs";

loadEnvFile(".env.local");

const BASE_URL = (process.argv[2] || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001").replace(
  /\/$/,
  ""
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim();
const HAS_BLOB = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

const results = [];

function log(step, ok, detail = "") {
  const icon = ok ? "✅" : "❌";
  const line = `${icon} ${step}${detail ? ` — ${detail}` : ""}`;
  console.log(line);
  results.push({ step, ok, detail });
}

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function extractSessionCookie(setCookieHeader) {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(/rusty_admin_session=([^;]+)/);
  return match ? `rusty_admin_session=${match[1]}` : null;
}

async function main() {
  console.log(`\n=== RustyBurger E2E — ${BASE_URL} ===\n`);

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ Faltan ADMIN_EMAIL / ADMIN_PASSWORD en .env.local");
    process.exit(1);
  }

  // 1. Páginas públicas
  for (const route of ["/", "/menu", "/checkout"]) {
    try {
      const res = await fetch(`${BASE_URL}${route}`, { redirect: "follow" });
      log(`GET ${route}`, res.ok, `status ${res.status}`);
    } catch (e) {
      log(`GET ${route}`, false, String(e.message || e));
    }
  }

  // 2. API productos
  let product = null;
  try {
    const res = await fetch(`${BASE_URL}/api/public/products`);
    const json = await parseJson(res);
    const ok = res.ok && json?.ok && Array.isArray(json.data);
    if (ok && json.data.length > 0) {
      product = json.data[0];
    }
    log("GET /api/public/products", ok, ok ? `${json.data.length} producto(s)` : json?.error || `status ${res.status}`);
  } catch (e) {
    log("GET /api/public/products", false, String(e.message || e));
  }

  // 3. Crear pedido
  let orderCode = null;
  let orderId = null;
  const orderPayload = {
    customerName: "E2E Test Cliente",
    customerPhone: "5547999999999",
    deliveryType: "TAKEAWAY",
    paymentMethod: "CASH",
    items: [
      {
        productId: product?.id,
        slug: product?.slug || "e2e-test",
        name: product?.name || "Producto E2E",
        quantity: 1,
        unitPrice: product?.price ? parseFloat(product.price) : 38,
      },
    ],
  };

  try {
    const res = await fetch(`${BASE_URL}/api/public/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    const json = await parseJson(res);
    const ok = res.ok && json?.ok && json.data?.code;
    if (ok) {
      orderCode = json.data.code;
      orderId = json.data.orderId;
    }
    log("POST /api/public/orders", ok, ok ? orderCode : json?.error || `status ${res.status}`);
  } catch (e) {
    log("POST /api/public/orders", false, String(e.message || e));
  }

  // 4. Delivery sin dirección debe fallar
  try {
    const res = await fetch(`${BASE_URL}/api/public/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderPayload,
        deliveryType: "DELIVERY",
        address: "",
      }),
    });
    const json = await parseJson(res);
    log("POST pedido sin dirección (debe fallar)", !res.ok && json?.ok === false, json?.error || `status ${res.status}`);
  } catch (e) {
    log("POST pedido sin dirección", false, String(e.message || e));
  }

  // 5. Seguimiento pedido
  if (orderCode) {
    try {
      const res = await fetch(`${BASE_URL}/api/public/orders/${encodeURIComponent(orderCode)}`);
      const json = await parseJson(res);
      log("GET /api/public/orders/[code]", res.ok && json?.ok, orderCode);
    } catch (e) {
      log("GET seguimiento pedido", false, String(e.message || e));
    }

    try {
      const res = await fetch(`${BASE_URL}/pedido/${encodeURIComponent(orderCode)}`);
      log("GET /pedido/[code] página", res.ok, `status ${res.status}`);
    } catch (e) {
      log("GET /pedido/[code]", false, String(e.message || e));
    }
  } else {
    log("GET seguimiento pedido", false, "sin código de pedido");
    log("GET /pedido/[code]", false, "sin código de pedido");
  }

  // 6. Admin login
  let sessionCookie = null;
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const json = await parseJson(res);
    sessionCookie = extractSessionCookie(res.headers.get("set-cookie"));
    log("POST /api/admin/auth/login", res.ok && json?.ok && !!sessionCookie, json?.error || (sessionCookie ? "cookie ok" : "sin cookie"));
  } catch (e) {
    log("POST admin login", false, String(e.message || e));
  }

  // 7. Dashboard stats
  if (sessionCookie) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard/stats`, {
        headers: { Cookie: sessionCookie },
      });
      const json = await parseJson(res);
      log("GET /api/admin/dashboard/stats", res.ok && json?.ok, json?.error || "ok");
    } catch (e) {
      log("GET dashboard stats", false, String(e.message || e));
    }
  }

  // 8. Cambiar estado pedido
  if (sessionCookie && orderId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Cookie: sessionCookie },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });
      const json = await parseJson(res);
      log("PATCH estado → CONFIRMED", res.ok && json?.ok, json?.error || "ok");
    } catch (e) {
      log("PATCH estado pedido", false, String(e.message || e));
    }

    if (orderCode) {
      try {
        const res = await fetch(`${BASE_URL}/api/public/orders/${encodeURIComponent(orderCode)}`);
        const json = await parseJson(res);
        const statusOk = json?.data?.status === "CONFIRMED";
        log("GET pedido tras cambio estado", statusOk, json?.data?.status || json?.error);
      } catch (e) {
        log("GET pedido tras cambio", false, String(e.message || e));
      }
    }
  } else {
    log("PATCH estado pedido", false, "sin sesión o orderId");
  }

  // 9. Upload Blob (si token en servidor remoto)
  if (sessionCookie && HAS_BLOB) {
    const svgPath = path.join(process.cwd(), "public/rusty/logo/rusty-logo.svg");
    if (fs.existsSync(svgPath)) {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/upload`, {
          method: "POST",
          headers: { Cookie: sessionCookie, "Content-Type": "image/svg+xml" },
          body: fs.readFileSync(svgPath),
        });
        const json = await parseJson(res);
        // SVG debe rechazarse (solo jpeg/png/webp)
        log("Upload SVG rechazado (esperado)", !res.ok, json?.error || `status ${res.status}`);
      } catch (e) {
        log("Upload SVG rechazado", false, String(e.message || e));
      }
    }

    // Mini PNG válido 1x1
    const pngBase64 =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
    const pngBuffer = Buffer.from(pngBase64, "base64");

    try {
      const form = new FormData();
      form.append("file", new Blob([pngBuffer], { type: "image/png" }), "e2e-test.png");
      form.append("type", "e2e");

      const res = await fetch(`${BASE_URL}/api/admin/upload`, {
        method: "POST",
        headers: { Cookie: sessionCookie },
        body: form,
      });
      const json = await parseJson(res);
      log("Upload PNG 1x1", res.ok && json?.ok, json?.data?.url ? "url ok" : json?.error || `status ${res.status}`);
    } catch (e) {
      log("Upload PNG", false, String(e.message || e));
    }
  } else {
    log("Upload Blob", false, HAS_BLOB ? "sin sesión admin" : "BLOB_READ_WRITE_TOKEN no definido localmente (verificar en Vercel)");
  }

  // 10. APIs públicas settings/promos
  for (const route of ["/api/public/settings", "/api/public/promos", "/api/public/categories"]) {
    try {
      const res = await fetch(`${BASE_URL}${route}`);
      const json = await parseJson(res);
      log(`GET ${route}`, res.ok && json?.ok, json?.error || "ok");
    } catch (e) {
      log(`GET ${route}`, false, String(e.message || e));
    }
  }

  const failed = results.filter((r) => !r.ok).length;
  const passed = results.length - failed;

  console.log(`\n=== Resultado: ${passed}/${results.length} OK ===`);
  if (orderCode) {
    console.log(`Pedido de prueba: ${orderCode}`);
  }

  process.exit(failed === 0 ? 0 : 1);
}

main();
