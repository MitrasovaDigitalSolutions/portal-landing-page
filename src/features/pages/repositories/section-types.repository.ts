import { portalApi } from "@/lib/http/portal-api";
import type {
  MediaItem,
  SectionTypeDefinition,
  UploadedMediaResult,
} from "@/types/cms.types";

export const sectionTypesRepository = {
  async list(siteKey?: string): Promise<SectionTypeDefinition[]> {
    const data = await portalApi.tenantGet<SectionTypeDefinition[]>(
      "/admin/section-types",
      { siteKey }
    );
    return Array.isArray(data) ? data : [];
  },

  async listMedia(siteKey?: string): Promise<MediaItem[]> {
    const data = await portalApi.tenantGet<MediaItem[]>("/admin/media", {
      siteKey,
    });
    return Array.isArray(data) ? data : [];
  },

  uploadMedia(
    formData: FormData,
    siteKey?: string
  ): Promise<UploadedMediaResult> {
    return portalApi.tenantPost<UploadedMediaResult>("/admin/media", formData, {
      siteKey,
    });
  },
};
