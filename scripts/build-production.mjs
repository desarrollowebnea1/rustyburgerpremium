#!/usr/bin/env node
/**
 * Build con migrate + seed si DATABASE_URL está definida (Vercel Production).
 * Sin DATABASE_URL (dev local sin .env) → solo generate + next build.
 */
import { spawnSync } from "child_process";
import { loadEnvFile } from "./load-env.mjs";

loadEnvFile(".env.local");

function run(label, cmd, args) {
  console.log(`\n▶ ${label}\n`);
  const result = spawnSync(cmd, args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("prisma generate", "npx", ["prisma", "generate"]);

const hasDb = Boolean(process.env.DATABASE_URL?.trim());

if (hasDb) {
  run("prisma migrate deploy", "npx", ["prisma", "migrate", "deploy"]);

  const hasAdmin =
    Boolean(process.env.ADMIN_EMAIL?.trim()) &&
    Boolean(process.env.ADMIN_PASSWORD?.trim());

  if (hasAdmin) {
    run("prisma db seed", "npx", ["prisma", "db", "seed"]);
  } else {
    console.log("\n⚠️  ADMIN_EMAIL / ADMIN_PASSWORD no definidos — seed omitido.\n");
  }
} else {
  console.log(
    "\nℹ️  DATABASE_URL no definida — migrate/seed omitidos (OK para build local sin DB).\n"
  );
}

run("next build", "npx", ["next", "build"]);
