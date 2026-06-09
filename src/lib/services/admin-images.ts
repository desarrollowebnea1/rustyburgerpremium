import { deleteImageFromBlob, isVercelBlobUrl } from "@/lib/blob";
import { prisma } from "@/lib/prisma";

export type AdminImageRecord = {
  id: string;
  url: string;
  pathname: string | null;
  alt: string | null;
  type: string | null;
  createdAt: string;
};

export class ImageInUseError extends Error {
  constructor() {
    super("IMAGE_IN_USE");
  }
}

function serializeImage(row: {
  id: string;
  url: string;
  pathname: string | null;
  alt: string | null;
  type: string | null;
  createdAt: Date;
}): AdminImageRecord {
  return {
    id: row.id,
    url: row.url,
    pathname: row.pathname,
    alt: row.alt,
    type: row.type,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listAdminImages(limit = 100) {
  const take = Math.min(Math.max(limit, 1), 200);
  const rows = await prisma.imageAsset.findMany({
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map(serializeImage);
}

export async function getAdminImageById(id: string) {
  const row = await prisma.imageAsset.findUnique({ where: { id } });
  if (!row) return null;
  return serializeImage(row);
}

export async function createImageAsset(input: {
  url: string;
  pathname?: string | null;
  alt?: string | null;
  type?: string | null;
}) {
  const row = await prisma.imageAsset.create({
    data: {
      url: input.url,
      pathname: input.pathname ?? null,
      alt: input.alt ?? null,
      type: input.type ?? null,
    },
  });
  return serializeImage(row);
}

export async function updateImageAsset(
  id: string,
  input: { alt?: string | null; type?: string | null }
) {
  const row = await prisma.imageAsset.update({
    where: { id },
    data: {
      ...(input.alt !== undefined ? { alt: input.alt } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
    },
  });
  return serializeImage(row);
}

export async function isImageUrlInUse(url: string): Promise<boolean> {
  const [products, categories, promos] = await Promise.all([
    prisma.product.count({ where: { imageUrl: url } }),
    prisma.category.count({ where: { imageUrl: url } }),
    prisma.promo.count({ where: { imageUrl: url } }),
  ]);
  return products + categories + promos > 0;
}

export async function deleteAdminImage(id: string) {
  const asset = await prisma.imageAsset.findUnique({ where: { id } });
  if (!asset) return null;

  if (await isImageUrlInUse(asset.url)) {
    throw new ImageInUseError();
  }

  let blobDeleted = false;
  if (isVercelBlobUrl(asset.url)) {
    blobDeleted = await deleteImageFromBlob(asset.url);
  }

  await prisma.imageAsset.delete({ where: { id } });

  return {
    deleted: true,
    blobDeleted,
    url: asset.url,
  };
}
