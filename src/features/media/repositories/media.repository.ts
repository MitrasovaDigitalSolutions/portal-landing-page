import { portalApi } from "@/lib/http/portal-api";
import type {
  DeleteMediaResult,
  MediaItem,
  ReplaceMediaResult,
} from "@/types/cms.types";

export interface MediaListFilters {
  unused?: boolean;
  q?: string;
  dir?: string;
}

export const mediaRepository = {
  async list(siteKey: string, filters?: MediaListFilters): Promise<MediaItem[]> {
    const data = await portalApi.tenantGet<MediaItem[]>("/admin/media", {
      siteKey,
      query: {
        unused: filters?.unused ? 1 : undefined,
        q: filters?.q,
        dir: filters?.dir,
      },
    });
    return Array.isArray(data) ? data : [];
  },

  replace(formData: FormData, siteKey: string): Promise<ReplaceMediaResult> {
    return portalApi.tenantPost<ReplaceMediaResult>(
      "/admin/media/replace",
      formData,
      { siteKey }
    );
  },

  remove(
    path: string,
    force: boolean,
    siteKey: string
  ): Promise<DeleteMediaResult> {
    return portalApi.tenantDelete<DeleteMediaResult>("/admin/media", {
      siteKey,
      query: {
        path,
        ...(force ? { force: 1 } : {}),
      },
    });
  },
};
