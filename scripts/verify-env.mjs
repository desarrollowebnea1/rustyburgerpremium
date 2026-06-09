#!/usr/bin/env node
/**
 * Verifica variables obligatorias sin imprimir valores secretos.
 * Uso: node scripts/verify-env.mjs
 */
import { loadEnvFile } from "./load-env.mjs";

loadEnvFile(".env.local");
loadEnvFile(".env");

const REQUIRED = [
  { key: "DATABASE_URL", hint: "PostgreSQL / Neon" },
  { key: "JWT_SECRET", hint: "Sesión admin" },
  { key: "ADMIN_EMAIL", hint: "Admin seed / login E2E" },
  { key: "ADMIN_PASSWORD", hint: "Admin seed / login E2E" },
  { key: "NEXT_PUBLIC_APP_URL", hint: "URL pública (staging/prod)" },
  { key: "NEXT_PUBLIC_WHATSAPP_NUMBER", hint: "WhatsApp público" },
];

const OPTIONAL = [
  { key: "BLOB_READ_WRITE_TOKEN", hint: "Upload imágenes (opcional)" },
  { key: "NEXT_PUBLIC_WHATSAPP_MESSAGE", hint: "Mensaje WhatsApp" },
];

let missing = 0;

console.log("\n=== RustyBurger — verificación de variables ===\n");

for (const { key, hint } of REQUIRED) {
  const ok = Boolean(process.env[key]?.trim());
  console.log(`${ok ? "✅" : "❌"} ${key} — ${hint}`);
  if (!ok) missing++;
}

console.log("\n--- Opcionales ---\n");

for (const { key, hint } of OPTIONAL) {
  const ok = Boolean(process.env[key]?.trim());
  console.log(`${ok ? "✅" : "⚠️ "} ${key} — ${hint}`);
}

console.log(
  missing === 0
    ? "\n✅ Todas las variables obligatorias están definidas.\n"
    : `\n❌ Faltan ${missing} variable(s) obligatoria(s). Copiá .env.example → .env.local\n`
);

process.exit(missing === 0 ? 0 : 1);
