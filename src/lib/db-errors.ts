import { Prisma } from "@prisma/client";
import { fail } from "@/lib/api-response";

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function databaseUnavailableResponse() {
  return fail(
    "Base de datos no configurada. Definí DATABASE_URL en .env.local y ejecutá las migraciones.",
    503
  );
}

export function handleRepositoryError(error: unknown) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return fail(
      "No se pudo conectar a la base de datos. Verificá DATABASE_URL y que PostgreSQL esté activo.",
      503
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return fail("Error al consultar la base de datos.", 500, { code: error.code });
  }

  console.error("[db]", error);
  return fail("Error interno al acceder a la base de datos.", 500);
}
