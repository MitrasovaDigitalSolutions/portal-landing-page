import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { InquiryItem, InquiryStatus } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const inquiriesRepository = {
  async list(siteKey?: string): Promise<InquiryItem[]> {
    const raw = await portalApi.tenantGet<
      InquiryItem[] | PaginatedResponse<InquiryItem>
    >("/admin/inquiries", { siteKey });
    return normalizeListResponse(raw).items;
  },

  updateStatus(
    id: number,
    payload: { status: InquiryStatus; notes: string | null },
    siteKey?: string
  ): Promise<InquiryItem> {
    return portalApi.tenantPatch<InquiryItem>(
      `/admin/inquiries/${id}/status`,
      payload,
      { siteKey }
    );
  },

  delete(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/inquiries/${id}`, { siteKey });
  },
};
