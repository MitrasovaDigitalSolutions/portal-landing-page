import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { TestimonialItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const testimonialsRepository = {
  async list(siteKey?: string): Promise<TestimonialItem[]> {
    const raw = await portalApi.tenantGet<
      TestimonialItem[] | PaginatedResponse<TestimonialItem>
    >("/admin/testimonials", { siteKey });
    return normalizeListResponse(raw).items;
  },

  create(formData: FormData, siteKey?: string): Promise<TestimonialItem> {
    return portalApi.tenantPost<TestimonialItem>(
      "/admin/testimonials",
      formData,
      { siteKey }
    );
  },

  update(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<TestimonialItem> {
    return portalApi.tenantPut<TestimonialItem>(
      `/admin/testimonials/${id}`,
      formData,
      { siteKey }
    );
  },

  delete(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/testimonials/${id}`, { siteKey });
  },
};
