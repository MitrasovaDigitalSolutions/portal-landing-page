import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { BranchItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const branchesRepository = {
  async list(siteKey?: string): Promise<BranchItem[]> {
    const raw = await portalApi.tenantGet<
      BranchItem[] | PaginatedResponse<BranchItem>
    >("/admin/branches", { siteKey });
    return normalizeListResponse(raw).items;
  },

  create(formData: FormData, siteKey?: string): Promise<BranchItem> {
    return portalApi.tenantPost<BranchItem>("/admin/branches", formData, {
      siteKey,
    });
  },

  update(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<BranchItem> {
    return portalApi.tenantPut<BranchItem>(`/admin/branches/${id}`, formData, {
      siteKey,
    });
  },

  delete(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/branches/${id}`, { siteKey });
  },
};
