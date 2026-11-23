import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { ArticleCategory, ArticleItem } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export interface UpsertArticleCategoryPayload {
  name: string;
  slug?: string;
  description: string | null;
  order: number;
}

export const articlesRepository = {
  async listCategories(siteKey?: string): Promise<ArticleCategory[]> {
    const raw = await portalApi.tenantGet<
      ArticleCategory[] | PaginatedResponse<ArticleCategory>
    >("/admin/article-categories", { siteKey });
    return normalizeListResponse(raw).items;
  },

  createCategory(
    payload: UpsertArticleCategoryPayload,
    siteKey?: string
  ): Promise<ArticleCategory> {
    return portalApi.tenantPost<ArticleCategory>(
      "/admin/article-categories",
      payload,
      { siteKey }
    );
  },

  updateCategory(
    id: number,
    payload: UpsertArticleCategoryPayload,
    siteKey?: string
  ): Promise<ArticleCategory> {
    return portalApi.tenantPut<ArticleCategory>(
      `/admin/article-categories/${id}`,
      payload,
      { siteKey }
    );
  },

  deleteCategory(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/article-categories/${id}`, {
      siteKey,
    });
  },

  async listArticles(siteKey?: string): Promise<ArticleItem[]> {
    const raw = await portalApi.tenantGet<
      ArticleItem[] | PaginatedResponse<ArticleItem>
    >("/admin/articles", { siteKey });
    return normalizeListResponse(raw).items;
  },

  getById(id: number, siteKey?: string): Promise<ArticleItem> {
    return portalApi.tenantGet<ArticleItem>(`/admin/articles/${id}`, {
      siteKey,
    });
  },

  createArticle(formData: FormData, siteKey?: string): Promise<ArticleItem> {
    return portalApi.tenantPost<ArticleItem>("/admin/articles", formData, {
      siteKey,
    });
  },

  updateArticle(
    id: number,
    formData: FormData,
    siteKey?: string
  ): Promise<ArticleItem> {
    return portalApi.tenantPut<ArticleItem>(`/admin/articles/${id}`, formData, {
      siteKey,
    });
  },

  deleteArticle(id: number, siteKey?: string): Promise<undefined> {
    return portalApi.tenantDelete(`/admin/articles/${id}`, { siteKey });
  },
};
