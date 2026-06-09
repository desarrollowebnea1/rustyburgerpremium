#!/usr/bin/env node
/**
 * Aplica migraciones y seed contra la DB configurada en .env.local
 * Uso: npm run db:setup
 */
import { spawnSync } from "child_process";
import { loadEnvFile } from "./load-env.mjs";

loadEnvFile(".env.local");

if (!process.env.DATABASE_URL?.trim()) {
  console.error("\n❌ DATABASE_URL no definida en .env.local");
  console.error("Copiá el valor desde Vercel → Settings → Environment Variables\n");
  process.exit(1);
}

function run(cmd, args) {
  console.log(`\n▶ ${cmd} ${args.join(" ")}\n`);
  const result = spawnSync(cmd, args, { stdio: "inherit", shell: true, env: process.env });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log("\n=== RustyBurger — setup DB (migrate + seed) ===\n");

run("npx", ["prisma", "generate"]);
run("npx", ["prisma", "migrate", "deploy"]);
run("npm", ["run", "db:seed"]);

console.log("\n✅ Migración y seed completados.\n");
