import { z } from "zod";
import type { TenantModulesState } from "@/config/modules";

const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const SERVICES_LAYOUT_VALUES = [
  "accordion",
  "carousel",
  "grid",
] as const;

export type ServicesLayoutOption = (typeof SERVICES_LAYOUT_VALUES)[number];

export const settingsFormSchema = z.object({
  logo: z
    .custom<File | null>(
      (val) => val === null || val instanceof File,
      "Format file logo tidak valid."
    )
    .nullable()
    .optional(),
  site_title: z.string().trim().max(150, "Nama situs maksimal 150 karakter."),
  tagline: z.string().trim().max(255, "Tagline maksimal 255 karakter."),
  meta_keywords: z.string().trim().max(500, "Kata kunci terlalu panjang."),
  brand_color: z
    .string()
    .trim()
    .refine(
      (val) => val.length === 0 || HEX_COLOR_PATTERN.test(val),
      "Gunakan format kode hex valid, contoh: #059669."
    ),
  badan_hukum: z.string().trim().max(200, "Nomor badan hukum terlalu panjang."),
  copyright: z.string().trim().max(255, "Teks hak cipta maksimal 255 karakter."),
  phone: z.string().trim().max(50, "Nomor telepon maksimal 50 karakter."),
  whatsapp: z.string().trim().max(30, "Nomor WhatsApp maksimal 30 karakter."),
  email: z
    .string()
    .trim()
    .refine(
      (val) => val.length === 0 || z.email().safeParse(val).success,
      "Format email tidak valid."
    ),
  address: z.string().trim().max(500, "Alamat maksimal 500 karakter."),
  maps_embed: z.string().trim().max(1000, "URL embed terlalu panjang."),
  instagram: z.string().trim().max(255, "URL Instagram terlalu panjang."),
  facebook: z.string().trim().max(255, "URL Facebook terlalu panjang."),
  linkedin: z.string().trim().max(255, "URL LinkedIn terlalu panjang."),
  tiktok: z.string().trim().max(255, "URL TikTok terlalu panjang."),
  modules_services: z.boolean(),
  modules_portfolios: z.boolean(),
  modules_business_units: z.boolean(),
  modules_branches: z.boolean(),
  modules_careers: z.boolean(),
  modules_news: z.boolean(),
  modules_contact: z.boolean(),
  extra_pages_active: z.record(z.string(), z.boolean()),
  seo_meta_title: z.string().trim().max(150, "Judul SEO maksimal 150 karakter."),
  seo_meta_description: z
    .string()
    .trim()
    .max(320, "Deskripsi SEO maksimal 320 karakter."),
  seo_alternate_names: z
    .string()
    .trim()
    .max(300, "Nama alternatif terlalu panjang."),
  seo_canonical_domain: z
    .string()
    .trim()
    .max(255, "Domain terlalu panjang.")
    .refine(
      (val) => val.length === 0 || /^https?:\/\/.+/.test(val),
      "Gunakan URL lengkap diawali http:// atau https://"
    ),
  seo_schema_type: z.string().trim().max(60, "Tipe schema tidak valid."),
  seo_google_verification: z
    .string()
    .trim()
    .max(200, "Kode verifikasi terlalu panjang."),
  seo_robots_index: z.boolean(),
  services_layout: z.enum(SERVICES_LAYOUT_VALUES),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export interface SettingItemPayload {
  group: string;
  key: string;
  value: string | TenantModulesState | null;
}

export interface SettingsBulkPayload {
  settings: SettingItemPayload[];
}
