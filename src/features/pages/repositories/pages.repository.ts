import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { PageDetail, PageSection, PageSummary } from "@/types/cms.types";
import type { ApiEnvelopeResult, PaginatedResponse } from "@/types/http.types";

export interface UpsertPagePayload {
  title: string;
  slug?: string;
  meta_title: string | null;
  meta_desc: string | null;
  is_active: boolean;
}

export const pagesRepository = {
  async list(siteKey?: string): Promise<PageSummary[]> {
    const raw = await portalApi.tenantGet<
      PageSummary[] | PaginatedResponse<PageSummary>
    >("/admin/pages", { siteKey });
    return normalizeListResponse(raw).items;
  },

  getById(id: number, siteKey?: string): Promise<PageDetail> {
    return portalApi.tenantGet<PageDetail>(`/admin/pages/${id}`, { siteKey });
  },

  createPage(payload: UpsertPagePayload, siteKey?: string): Promise<PageDetail> {
    return portalApi.tenantPost<PageDetail>("/admin/pages", payload, { siteKey });
  },

  updatePage(
    id: number,
    payload: UpsertPagePayload,
    siteKey?: string
  ): Promise<PageDetail> {
    return portalApi.tenantPut<PageDetail>(`/admin/pages/${id}`, payload, {
      siteKey,
    });
  },

  deletePage(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/pages/${id}`, { siteKey });
  },

  createSection(
    pageId: number,
    body: FormData | Record<string, unknown>,
    siteKey?: string
  ): Promise<PageSection> {
    return portalApi.tenantPost<PageSection>(
      `/admin/pages/${pageId}/sections`,
      body,
      { siteKey }
    );
  },

  updateSection(
    sectionId: number,
    body: FormData | Record<string, unknown>,
    siteKey?: string
  ): Promise<PageSection> {
    return portalApi.tenantPut<PageSection>(`/admin/sections/${sectionId}`, body, {
      siteKey,
    });
  },

  createSectionWithMeta(
    pageId: number,
    body: FormData | Record<string, unknown>,
    siteKey?: string
  ): Promise<ApiEnvelopeResult<PageSection>> {
    return portalApi.tenantPostWithMeta<PageSection>(
      `/admin/pages/${pageId}/sections`,
      body,
      { siteKey }
    );
  },

  updateSectionWithMeta(
    sectionId: number,
    body: FormData | Record<string, unknown>,
    siteKey?: string
  ): Promise<ApiEnvelopeResult<PageSection>> {
    return portalApi.tenantPutWithMeta<PageSection>(
      `/admin/sections/${sectionId}`,
      body,
      { siteKey }
    );
  },

  deleteSection(sectionId: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/sections/${sectionId}`, { siteKey });
  },
};
