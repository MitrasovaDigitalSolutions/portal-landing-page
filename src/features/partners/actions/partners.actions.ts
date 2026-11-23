"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { partnersRepository } from "@/features/partners/repositories/partners.repository";
import type { PartnerItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";

export async function savePartnerAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<PartnerItem>> {
  const name = readFormString(formData, "name");
  if (!name) {
    return {
      success: false,
      message: "Nama mitra/partner wajib diisi.",
      fieldErrors: { name: ["Nama mitra wajib diisi."] },
    };
  }

  if (!id && !(formData.get("logo") instanceof File)) {
    return {
      success: false,
      message: "File logo wajib diunggah saat menambahkan partner baru.",
      fieldErrors: { logo: ["File logo wajib diunggah."] },
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await partnersRepository.update(id, formData, siteKey)
      : await partnersRepository.create(formData, siteKey);

    revalidatePortalPaths(["/showcase", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Data partner berhasil diperbarui."
        : "Partner baru berhasil ditambahkan.",
    };
  });
}

export async function deletePartnerAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await partnersRepository.delete(id, siteKey);
    revalidatePortalPaths(["/showcase", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Partner berhasil dihapus.",
    };
  });
}
