/**
 * Limpia puertos 3000/3001, borra .next y arranca dev en 3001.
 * Uso: npm run dev:clean
 */
import { execSync, spawn } from "child_process";
import { existsSync, rmSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORTS = [3000, 3001];

for (const port of PORTS) {
  try {
    const out = execSync(`netstat -ano | findstr ":${port}"`, { encoding: "utf8" });
    const pids = new Set();
    for (const line of out.split("\n")) {
      const m = line.match(/LISTENING\s+(\d+)/);
      if (m) pids.add(m[1]);
    }
    for (const pid of pids) {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`Detenido PID ${pid} (puerto ${port})`);
      } catch {
        /* ya terminado */
      }
    }
  } catch {
    /* puerto libre */
  }
}

const nextDir = join(ROOT, ".next");
if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("Cache .next eliminada");
}

console.log("\n▶ Iniciando http://localhost:3001 ...\n");

const child = spawn("npx", ["next", "dev", "-p", "3001"], {
  cwd: ROOT,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
