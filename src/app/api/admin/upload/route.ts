import { ok, fail } from "@/lib/api-response";
import { requireAdminSession } from "@/lib/admin/require-admin";
import {
  BlobNotConfiguredError,
  UploadValidationError,
  isBlobConfigured,
  uploadImageToBlob,
} from "@/lib/blob";
import { databaseUnavailableResponse, isDatabaseConfigured } from "@/lib/db-errors";
import { createImageAsset } from "@/lib/services/admin-images";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;

  if (!isDatabaseConfigured()) {
    return databaseUnavailableResponse();
  }

  if (!isBlobConfigured()) {
    return fail(
      "Upload no disponible: falta BLOB_READ_WRITE_TOKEN en las variables de entorno.",
      503
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return fail("No se pudo leer el formulario de subida.", 400);
  }

  const fileEntry = formData.get("file");
  if (!fileEntry || !(fileEntry instanceof File)) {
    return fail("Archivo inválido. Enviá un campo 'file' con una imagen.", 400);
  }

  const alt = formData.get("alt");
  const type = formData.get("type");

  try {
    const uploaded = await uploadImageToBlob(fileEntry);
    const asset = await createImageAsset({
      url: uploaded.url,
      pathname: uploaded.pathname,
      alt: typeof alt === "string" && alt.trim() ? alt.trim() : null,
      type: typeof type === "string" && type.trim() ? type.trim() : null,
    });

    return ok(
      {
        url: asset.url,
        id: asset.id,
        pathname: asset.pathname,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof BlobNotConfiguredError) {
      return fail(
        "Upload no disponible: falta BLOB_READ_WRITE_TOKEN en las variables de entorno.",
        503
      );
    }
    if (error instanceof UploadValidationError) {
      return fail(error.message, error.status);
    }
    console.error("[upload]", error);
    return fail("No se pudo subir la imagen. Intentá de nuevo.", 500);
  }
}
