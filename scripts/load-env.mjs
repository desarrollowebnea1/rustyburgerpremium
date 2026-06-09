import fs from "fs";
import path from "path";

/** Carga .env.local sin dependencia dotenv (no sobrescribe vars ya definidas). */
export function loadEnvFile(filename = ".env.local") {
  const filePath = path.join(process.cwd(), filename);
  const loaded = {};

  if (!fs.existsSync(filePath)) {
    return loaded;
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    loaded[key] = value;
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }

  return loaded;
}
