"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { portfoliosRepository } from "@/features/portfolios/repositories/portfolios.repository";
import type { PortfolioItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";

export async function savePortfolioAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<PortfolioItem>> {
  const title = readFormString(formData, "title");
  if (title.length < 2) {
    return {
      success: false,
      message: "Judul proyek portofolio wajib diisi minimal 2 karakter.",
      fieldErrors: { title: ["Judul proyek wajib diisi."] },
    };
  }

  if (!id && !(formData.get("thumbnail") instanceof File)) {
    return {
      success: false,
      message: "Foto thumbnail wajib diunggah saat membuat portofolio baru.",
      fieldErrors: { thumbnail: ["Thumbnail wajib diunggah."] },
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await portfoliosRepository.update(id, formData, siteKey)
      : await portfoliosRepository.create(formData, siteKey);

    revalidatePortalPaths(["/portfolios", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Portofolio berhasil diperbarui."
        : "Portofolio baru berhasil ditambahkan.",
    };
  });
}

export async function deletePortfolioAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await portfoliosRepository.delete(id, siteKey);
    revalidatePortalPaths(["/portfolios", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Portofolio berhasil dihapus.",
    };
  });
}
