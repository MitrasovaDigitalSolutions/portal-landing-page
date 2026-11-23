"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { businessUnitsRepository } from "@/features/business-units/repositories/business-units.repository";
import type { BusinessUnitItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";

export async function saveBusinessUnitAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<BusinessUnitItem>> {
  const name = readFormString(formData, "name");
  if (name.length < 2) {
    return {
      success: false,
      message: "Nama unit bisnis wajib diisi minimal 2 karakter.",
      fieldErrors: { name: ["Nama unit bisnis wajib diisi."] },
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await businessUnitsRepository.update(id, formData, siteKey)
      : await businessUnitsRepository.create(formData, siteKey);

    revalidatePortalPaths(["/business-units", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Unit bisnis berhasil diperbarui."
        : "Unit bisnis baru berhasil ditambahkan.",
    };
  });
}

export async function deleteBusinessUnitAction(
  id: number
): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await businessUnitsRepository.delete(id, siteKey);
    revalidatePortalPaths(["/business-units", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Unit bisnis berhasil dihapus.",
    };
  });
}
