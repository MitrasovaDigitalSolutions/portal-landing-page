import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { FaqCategory, FaqItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export interface UpsertFaqCategoryPayload {
  name: string;
  slug?: string;
  order: number;
}

export interface UpsertFaqPayload {
  question: string;
  answer: string;
  faq_category_id: number | null;
  order: number;
  is_active: boolean;
}

export const faqsRepository = {
  async listCategories(siteKey?: string): Promise<FaqCategory[]> {
    const raw = await portalApi.tenantGet<
      FaqCategory[] | PaginatedResponse<FaqCategory>
    >("/admin/faq-categories", { siteKey });
    return normalizeListResponse(raw).items;
  },

  createCategory(
    payload: UpsertFaqCategoryPayload,
    siteKey?: string
  ): Promise<FaqCategory> {
    return portalApi.tenantPost<FaqCategory>("/admin/faq-categories", payload, {
      siteKey,
    });
  },

  updateCategory(
    id: number,
    payload: UpsertFaqCategoryPayload,
    siteKey?: string
  ): Promise<FaqCategory> {
    return portalApi.tenantPut<FaqCategory>(
      `/admin/faq-categories/${id}`,
      payload,
      { siteKey }
    );
  },

  deleteCategory(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/faq-categories/${id}`, { siteKey });
  },

  async listFaqs(siteKey?: string): Promise<FaqItem[]> {
    const raw = await portalApi.tenantGet<
      FaqItem[] | PaginatedResponse<FaqItem>
    >("/admin/faqs", { siteKey });
    return normalizeListResponse(raw).items;
  },

  createFaq(payload: UpsertFaqPayload, siteKey?: string): Promise<FaqItem> {
    return portalApi.tenantPost<FaqItem>("/admin/faqs", payload, { siteKey });
  },

  updateFaq(
    id: number,
    payload: UpsertFaqPayload,
    siteKey?: string
  ): Promise<FaqItem> {
    return portalApi.tenantPut<FaqItem>(`/admin/faqs/${id}`, payload, {
      siteKey,
    });
  },

  deleteFaq(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/faqs/${id}`, { siteKey });
  },
};
