import { z } from "zod";
import type { TenantModulesState } from "@/config/modules";

const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export const settingsFormSchema = z.object({
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
