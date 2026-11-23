import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { PortfolioItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const portfoliosRepository = {
  async list(siteKey?: string): Promise<PortfolioItem[]> {
    const raw = await portalApi.tenantGet<
      PortfolioItem[] | PaginatedResponse<PortfolioItem>
    >("/admin/portfolios", { siteKey });
    return normalizeListResponse(raw).items;
  },

  create(formData: FormData, siteKey?: string): Promise<PortfolioItem> {
    return portalApi.tenantPost<PortfolioItem>("/admin/portfolios", formData, {
      siteKey,
    });
  },

  update(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<PortfolioItem> {
    return portalApi.tenantPut<PortfolioItem>(
      `/admin/portfolios/${id}`,
      formData,
      { siteKey }
    );
  },

  delete(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/portfolios/${id}`, { siteKey });
  },
};
