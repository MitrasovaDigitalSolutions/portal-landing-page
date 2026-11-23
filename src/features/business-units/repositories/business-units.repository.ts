import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { BusinessUnitItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const businessUnitsRepository = {
  async list(siteKey?: string): Promise<BusinessUnitItem[]> {
    const raw = await portalApi.tenantGet<
      BusinessUnitItem[] | PaginatedResponse<BusinessUnitItem>
    >("/admin/business-units", { siteKey });
    return normalizeListResponse(raw).items;
  },

  create(formData: FormData, siteKey?: string): Promise<BusinessUnitItem> {
    return portalApi.tenantPost<BusinessUnitItem>(
      "/admin/business-units",
      formData,
      { siteKey }
    );
  },

  update(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<BusinessUnitItem> {
    return portalApi.tenantPut<BusinessUnitItem>(
      `/admin/business-units/${id}`,
      formData,
      { siteKey }
    );
  },

  delete(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/business-units/${id}`, { siteKey });
  },
};
