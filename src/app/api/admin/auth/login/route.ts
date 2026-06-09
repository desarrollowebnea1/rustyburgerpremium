import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import {
  assertJwtSecret,
  setAdminSessionCookie,
  signAdminToken,
} from "@/lib/auth";
import { databaseUnavailableResponse, handleRepositoryError, isDatabaseConfigured } from "@/lib/db-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  try {
    assertJwtSecret();
  } catch {
    return fail("JWT_SECRET no está configurado. Definilo en .env.local.", 500);
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return fail("El cuerpo de la solicitud debe ser JSON válido.", 400);
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return fail("Email y contraseña son obligatorios.", 400);
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { email } });

    if (!admin) {
      return fail("Credenciales inválidas.", 401);
    }

    if (!admin.active) {
      return fail("Cuenta desactivada.", 403);
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return fail("Credenciales inválidas.", 401);
    }

    const token = await signAdminToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = ok({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    setAdminSessionCookie(response, token);
    return response;
  } catch (error) {
    return handleRepositoryError(error);
  }
}
