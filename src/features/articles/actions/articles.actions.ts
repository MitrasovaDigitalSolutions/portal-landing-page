"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import {
  articlesRepository,
  type UpsertArticleCategoryPayload,
} from "@/features/articles/repositories/articles.repository";
import {
  articleCategorySchema,
  type ArticleCategoryFormValues,
} from "@/features/articles/schemas/article.schemas";
import type { ArticleCategory, ArticleItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";
import { extractZodFieldErrors } from "@/utils/zod-errors";

export async function saveArticleCategoryAction(
  id: number | null,
  values: ArticleCategoryFormValues
): Promise<ActionResult<ArticleCategory>> {
  const parsed = articleCategorySchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data kategori artikel belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const payload: UpsertArticleCategoryPayload = {
      name: parsed.data.name,
      ...(parsed.data.slug ? { slug: parsed.data.slug } : {}),
      description: parsed.data.description || null,
      order: parsed.data.order,
    };

    const data = id
      ? await articlesRepository.updateCategory(id, payload, siteKey)
      : await articlesRepository.createCategory(payload, siteKey);

    revalidatePortalPaths(["/articles"]);
    return {
      success: true,
      data,
      message: id
        ? "Kategori artikel berhasil diperbarui."
        : "Kategori artikel baru berhasil ditambahkan.",
    };
  });
}

export async function deleteArticleCategoryAction(
  id: number
): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await articlesRepository.deleteCategory(id, siteKey);
    revalidatePortalPaths(["/articles"]);
    return {
      success: true,
      data: undefined,
      message: "Kategori artikel berhasil dihapus.",
    };
  });
}

export async function saveArticleAction(
  id: number | null,
  formData: FormData
): Promise<ActionResult<ArticleItem>> {
  const title = readFormString(formData, "title");
  const body = readFormString(formData, "body");
  if (!title || !body) {
    return {
      success: false,
      message: "Judul dan isi artikel wajib diisi.",
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = id
      ? await articlesRepository.updateArticle(id, formData, siteKey)
      : await articlesRepository.createArticle(formData, siteKey);

    revalidatePortalPaths(["/articles", "/"]);
    return {
      success: true,
      data,
      message: id
        ? "Artikel berhasil diperbarui."
        : "Artikel baru berhasil disimpan.",
    };
  });
}

export async function deleteArticleAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await articlesRepository.deleteArticle(id, siteKey);
    revalidatePortalPaths(["/articles", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Artikel berhasil dihapus.",
    };
  });
}
