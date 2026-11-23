"use server";

import { revalidatePath } from "next/cache";
import { revalidatePortalPaths, withTenantAction } from "@/lib/actions/action-runner";
import { settingsRepository } from "@/features/settings/repositories/settings.repository";
import {
  settingsFormSchema,
  type SettingsBulkPayload,
  type SettingsFormValues,
} from "@/features/settings/schemas/settings.schema";
import type { ActionResult } from "@/types/http.types";
import { extractZodFieldErrors } from "@/utils/zod-errors";

function nullableText(raw: string): string | null {
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function buildBulkPayload(values: SettingsFormValues): SettingsBulkPayload {
  return {
    settings: [
      { group: "general", key: "site_title", value: nullableText(values.site_title) },
      { group: "general", key: "tagline", value: nullableText(values.tagline) },
      { group: "general", key: "meta_keywords", value: nullableText(values.meta_keywords) },
      { group: "general", key: "brand_color", value: nullableText(values.brand_color) },
      { group: "legal", key: "badan_hukum", value: nullableText(values.badan_hukum) },
      { group: "legal", key: "copyright", value: nullableText(values.copyright) },
      { group: "contact", key: "phone", value: nullableText(values.phone) },
      { group: "contact", key: "whatsapp", value: nullableText(values.whatsapp) },
      { group: "contact", key: "email", value: nullableText(values.email) },
      { group: "contact", key: "address", value: nullableText(values.address) },
      { group: "contact", key: "maps_embed", value: nullableText(values.maps_embed) },
      { group: "social", key: "instagram", value: nullableText(values.instagram) },
      { group: "social", key: "facebook", value: nullableText(values.facebook) },
      { group: "social", key: "linkedin", value: nullableText(values.linkedin) },
      { group: "social", key: "tiktok", value: nullableText(values.tiktok) },
      {
        group: "modules",
        key: "is_active",
        value: {
          services: values.modules_services,
          portfolios: values.modules_portfolios,
          business_units: values.modules_business_units,
          branches: values.modules_branches,
          careers: values.modules_careers,
          news: values.modules_news,
          contact: values.modules_contact,
        },
      },
    ],
  };
}

export async function saveSettingsAction(
  values: SettingsFormValues
): Promise<ActionResult> {
  const parsed = settingsFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      message: "Beberapa pengaturan belum valid. Periksa kembali isian Anda.",
      fieldErrors: extractZodFieldErrors(parsed.error),
    };
  }

  return withTenantAction(async ({ siteKey }) => {
    await settingsRepository.bulkUpdate(buildBulkPayload(parsed.data), siteKey);
    revalidatePath("/", "layout");
    revalidatePortalPaths(["/settings", "/"]);
    return {
      success: true,
      data: undefined,
      message: "Pengaturan situs dan modul berhasil disimpan.",
    };
  });
}
