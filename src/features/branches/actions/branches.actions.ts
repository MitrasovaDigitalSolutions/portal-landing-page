"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { branchesRepository } from "@/features/branches/repositories/branches.repository";
import type { BranchItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";

export async function saveBranchAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<BranchItem>> {
  const name = readFormString(formData, "name");
  const address = readFormString(formData, "address");

  if (!name || !address) {
    return {
      success: false,
      message: "Nama kantor/cabang dan alamat lengkap wajib diisi.",
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await branchesRepository.update(id, formData, siteKey)
      : await branchesRepository.create(formData, siteKey);

    revalidatePortalPaths(["/branches", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Data cabang berhasil diperbarui."
        : "Kantor cabang baru berhasil ditambahkan.",
    };
  });
}

export async function deleteBranchAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await branchesRepository.delete(id, siteKey);
    revalidatePortalPaths(["/branches", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Kantor cabang berhasil dihapus.",
    };
  });
}
