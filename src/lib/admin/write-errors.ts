import { Prisma } from "@prisma/client";
import { fail } from "@/lib/api-response";
import { handleRepositoryError } from "@/lib/db-errors";

export function handleAdminWriteError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (Array.isArray(target) && target.includes("slug")) {
        return fail("Ya existe un registro con ese slug. Elegí otro.", 409);
      }
      return fail("Ya existe un registro con esos datos.", 409);
    }
    if (error.code === "P2025") {
      return fail("Registro no encontrado.", 404);
    }
  }
  return handleRepositoryError(error);
}
