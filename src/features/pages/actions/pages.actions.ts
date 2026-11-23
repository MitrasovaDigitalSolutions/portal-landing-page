"use server";

import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import {
  pagesRepository,
  type UpsertPagePayload,
} from "@/features/pages/repositories/pages.repository";
import {
  pageFormSchema,
  sectionJsonRequestSchema,
  slugifyPageInput,
  type PageFormValues,
  type SectionJsonRequestValues,
} from "@/features/pages/schemas/page.schemas";
import type { PageDetail, PageSection } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { readFormString } from "@/utils/form-data";
import { extractZodFieldErrors } from "@/utils/zod-errors";

function buildPagePayload(
  values: PageFormValues,
  isHomeLocked: boolean
): UpsertPagePayload {
  const resolvedSlug = isHomeLocked
    ? "home"
    : slugifyPageInput(values.slug) || slugifyPageInput(values.title);

  return {
    title: values.title.trim(),
    meta_title: values.meta_title.trim() || null,
    meta_desc: values.meta_desc.trim() || null,
    is_active: values.is_active,
    ...(resolvedSlug ? { slug: resolvedSlug } : {}),
  };
}

export async function createPageAction(
  values: PageFormValues
): Promise<ActionResult<PageDetail>> {
  const parsed = pageFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data halaman belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = await pagesRepository.createPage(
      buildPagePayload(parsed.data, false),
      siteKey
    );
    revalidatePortalPaths(["/pages", "/"]);
    return {
      success: true,
      data,
      message: "Halaman baru berhasil dibuat.",
    };
  });
}

export async function updatePageAction(
  id: number,
  currentSlug: string,
  values: PageFormValues
): Promise<ActionResult<PageDetail>> {
  const parsed = pageFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data halaman belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const isHomeLocked = currentSlug === "home";
    const data = await pagesRepository.updatePage(
      id,
      buildPagePayload(parsed.data, isHomeLocked),
      siteKey
    );
    revalidatePortalPaths(["/pages", `/pages/${id}`, "/"]);
    return {
      success: true,
      data,
      message: "Pengaturan halaman berhasil diperbarui.",
    };
  });
}

export async function deletePageAction(
  id: number,
  slug: string
): Promise<ActionResult> {
  if (slug === "home") {
    return {
      success: false,
      message: "Halaman utama (/home) tidak dapat dihapus.",
      status: 400,
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    await pagesRepository.deletePage(id, siteKey);
    revalidatePortalPaths(["/pages", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Halaman berhasil dihapus.",
    };
  });
}

export async function saveSectionJsonAction(
  pageId: number,
  sectionId: number | null,
  values: SectionJsonRequestValues
): Promise<ActionResult<PageSection>> {
  const parsed = sectionJsonRequestSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Data section belum valid.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = sectionId
      ? await pagesRepository.updateSection(sectionId, parsed.data, siteKey)
      : await pagesRepository.createSection(pageId, parsed.data, siteKey);

    revalidatePortalPaths(["/pages", `/pages/${pageId}`]);
    return {
      success: true,
      data,
      message: sectionId
        ? "Section halaman berhasil diperbarui."
        : "Section baru berhasil ditambahkan.",
    };
  });
}

export async function saveSectionMultipartAction(
  pageId: number,
  sectionId: number | null,
  formData: FormData
): Promise<ActionResult<PageSection>> {
  const key = readFormString(formData, "key");
  if (!key || key.length > 50) {
    return {
      success: false,
      message: "Key section wajib diisi (maks. 50 karakter).",
      fieldErrors: { key: ["Key section wajib diisi (maks. 50 karakter)."] },
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    const data = sectionId
      ? await pagesRepository.updateSection(sectionId, formData, siteKey)
      : await pagesRepository.createSection(pageId, formData, siteKey);

    revalidatePortalPaths(["/pages", `/pages/${pageId}`]);
    return {
      success: true,
      data,
      message: sectionId
        ? "Section halaman berhasil diperbarui."
        : "Section baru berhasil ditambahkan.",
    };
  });
}

export async function deleteSectionAction(
  sectionId: number,
  pageId: number
): Promise<ActionResult> {
  return withTenantAction(async ({ siteKey }) => {
    await pagesRepository.deleteSection(sectionId, siteKey);
    revalidatePortalPaths(["/pages", `/pages/${pageId}`]);
    return {
      success: true,
      data: undefined,
      message: "Section halaman berhasil dihapus.",
    };
  });
}
