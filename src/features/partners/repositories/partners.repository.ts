import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { PartnerItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const partnersRepository = {
  async list(siteKey?: string): Promise<PartnerItem[]> {
    const raw = await portalApi.tenantGet<
      PartnerItem[] | PaginatedResponse<PartnerItem>
    >("/admin/partners", { siteKey });
    return normalizeListResponse(raw).items;
  },

  create(formData: FormData, siteKey?: string): Promise<PartnerItem> {
    return portalApi.tenantPost<PartnerItem>("/admin/partners", formData, {
      siteKey,
    });
  },

  update(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<PartnerItem> {
    return portalApi.tenantPut<PartnerItem>(`/admin/partners/${id}`, formData, {
      siteKey,
    });
  },

  delete(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/partners/${id}`, { siteKey });
  },
};
