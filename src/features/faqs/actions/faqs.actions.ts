"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import {
  faqsRepository,
  type UpsertFaqCategoryPayload,
  type UpsertFaqPayload,
} from "@/features/faqs/repositories/faqs.repository";
import {
  faqCategorySchema,
  faqSchema,
  type FaqCategoryFormValues,
  type FaqFormValues,
} from "@/features/faqs/schemas/faq.schemas";
import type { FaqCategory, FaqItem } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { extractZodFieldErrors } from "@/utils/zod-errors";

export async function saveFaqCategoryAction(
  id: number | null,
  values: FaqCategoryFormValues
): Promise<ActionResult<FaqCategory>> {
  const parsed = faqCategorySchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data kategori FAQ belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const payload: UpsertFaqCategoryPayload = {
      name: parsed.data.name,
      ...(parsed.data.slug ? { slug: parsed.data.slug } : {}),
      order: parsed.data.order,
    };

    const data = id
      ? await faqsRepository.updateCategory(id, payload, siteKey)
      : await faqsRepository.createCategory(payload, siteKey);

    revalidatePortalPaths(["/faqs"]);
    return {
      success: true,
      data,
      message: id
        ? "Kategori FAQ berhasil diperbarui."
        : "Kategori FAQ baru berhasil ditambahkan.",
    };
  });
}

export async function deleteFaqCategoryAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await faqsRepository.deleteCategory(id, siteKey);
    revalidatePortalPaths(["/faqs"]);
    return {
      success: true,
      data: undefined,
      message: "Kategori FAQ berhasil dihapus.",
    };
  });
}

export async function saveFaqAction(
  id: number | null,
  values: FaqFormValues
): Promise<ActionResult<FaqItem>> {
  const parsed = faqSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data FAQ belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const rawCat = parsed.data.faq_category_id.trim();
    const categoryId = rawCat ? Number(rawCat) : null;

    const payload: UpsertFaqPayload = {
      question: parsed.data.question,
      answer: parsed.data.answer,
      faq_category_id:
        categoryId !== null && Number.isFinite(categoryId) ? categoryId : null,
      order: parsed.data.order,
      is_active: parsed.data.is_active,
    };

    const data = id
      ? await faqsRepository.updateFaq(id, payload, siteKey)
      : await faqsRepository.createFaq(payload, siteKey);

    revalidatePortalPaths(["/faqs", "/"]);
    return {
      success: true,
      data,
      message: id ? "FAQ berhasil diperbarui." : "FAQ baru berhasil ditambahkan.",
    };
  });
}

export async function deleteFaqAction(id: number): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await faqsRepository.deleteFaq(id, siteKey);
    revalidatePortalPaths(["/faqs", "/"]);
    return {
      success: true,
      data: undefined,
      message: "FAQ berhasil dihapus.",
    };
  });
}
