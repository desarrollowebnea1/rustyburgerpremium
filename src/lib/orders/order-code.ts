import type { PrismaClient } from "@prisma/client";

const MAX_ATTEMPTS = 8;

function padCode(n: number): string {
  return `RB-${String(n).padStart(6, "0")}`;
}

function randomSuffix(): string {
  return `RB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

/** Genera código único RB-000001. Reintenta si hay colisión. */
export async function generateOrderCode(prisma: PrismaClient): Promise<string> {
  const baseCount = await prisma.order.count();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = padCode(baseCount + 1 + attempt);
    const exists = await prisma.order.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!exists) return code;
  }

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const code = randomSuffix();
    const exists = await prisma.order.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!exists) return code;
  }

  throw new Error("No se pudo generar un código de pedido único.");
}
