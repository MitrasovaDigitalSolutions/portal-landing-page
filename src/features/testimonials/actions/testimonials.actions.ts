"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { testimonialsRepository } from "@/features/testimonials/repositories/testimonials.repository";
import type { TestimonialItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";

export async function saveTestimonialAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<TestimonialItem>> {
  const name = readFormString(formData, "name");
  const message = readFormString(formData, "message");

  if (!name || !message) {
    return {
      success: false,
      message: "Nama klien dan kutipan testimoni wajib diisi.",
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await testimonialsRepository.update(id, formData, siteKey)
      : await testimonialsRepository.create(formData, siteKey);

    revalidatePortalPaths(["/showcase", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Testimoni berhasil diperbarui."
        : "Testimoni baru berhasil ditambahkan.",
    };
  });
}

export async function deleteTestimonialAction(
  id: number
): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await testimonialsRepository.delete(id, siteKey);
    revalidatePortalPaths(["/showcase", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Testimoni berhasil dihapus.",
    };
  });
}
