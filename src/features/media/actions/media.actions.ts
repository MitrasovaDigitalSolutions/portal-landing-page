"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { mediaRepository } from "@/features/media/repositories/media.repository";
import type { DeleteMediaResult, ReplaceMediaResult } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";

const MEDIA_REVALIDATE_PATHS = [
  "/media",
  "/",
  "/pages",
  "/articles",
  "/services",
  "/portfolios",
  "/branches",
  "/business-units",
  "/showcase",
  "/settings",
] as const;

export async function replaceMediaAction(
  formData: FormData
): Promise<ActionResult<ReplaceMediaResult>> {
  const path = readFormString(formData, "path");
  const file = formData.get("file");

  if (!path) {
    return { success: false, message: "Path gambar target tidak valid." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Pilih file gambar pengganti terlebih dahulu." };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = await mediaRepository.replace(formData, siteKey);
    revalidatePortalPaths(MEDIA_REVALIDATE_PATHS);

    const refSuffix =
      data.references_updated > 0
        ? ` (${data.references_updated} referensi konten diperbarui)`
        : "";

    return {
      success: true,
      data,
      message: `Gambar berhasil diganti${refSuffix}.`,
    };
  });
}

export async function deleteMediaAction(
  path: string,
  force = false
): Promise<ActionResult<DeleteMediaResult>> {
  const cleanPath = path.trim();
  if (!cleanPath) {
    return { success: false, message: "Path gambar tidak boleh kosong." };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = await mediaRepository.remove(cleanPath, force, siteKey);
    revalidatePortalPaths(MEDIA_REVALIDATE_PATHS);

    return {
      success: true,
      data,
      message: "Gambar berhasil dihapus dari storage.",
    };
  });
}
