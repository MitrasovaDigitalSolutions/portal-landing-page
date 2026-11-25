"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { sectionTypesRepository } from "@/features/pages/repositories/section-types.repository";
import type {
  MediaItem,
  SectionTypeDefinition,
  UploadedMediaResult,
} from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";

export async function listSectionTypesAction(): Promise<
  ActionResult<SectionTypeDefinition[]>
> {
  return withTenantAction(async ({ siteKey }) => {
    const data = await sectionTypesRepository.list(siteKey);
    return { success: true, data };
  });
}

export async function listPickerMediaAction(): Promise<
  ActionResult<MediaItem[]>
> {
  return withTenantAction(async ({ siteKey }) => {
    const data = await sectionTypesRepository.listMedia(siteKey);
    return { success: true, data };
  });
}

export async function uploadPickerMediaAction(
  formData: FormData
): Promise<ActionResult<UploadedMediaResult>> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Pilih file gambar terlebih dahulu." };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = await sectionTypesRepository.uploadMedia(formData, siteKey);
    revalidatePortalPaths(["/media"]);
    return {
      success: true,
      data,
      message: "Gambar berhasil diunggah ke galeri media.",
    };
  });
}
