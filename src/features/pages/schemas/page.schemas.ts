import { z } from "zod";

export type ParsedPayloadResult =
  | { ok: true; value: Record<string, unknown> | null }
  | { ok: false; error: string };

export function slugifyPageInput(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export function parseSectionPayloadJson(raw: string): ParsedPayloadResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, value: null };
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return {
        ok: false,
        error:
          "Payload JSON harus berupa objek JSON ({ ... }), bukan array atau teks.",
      };
    }
    return { ok: true, value: parsed as Record<string, unknown> };
  } catch {
    return {
      ok: false,
      error:
        "Format JSON tidak valid. Periksa koma, tanda kutip, atau kurung kurawal.",
    };
  }
}

export const pageFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Judul halaman minimal 2 karakter.")
    .max(150, "Judul halaman maksimal 150 karakter."),
  slug: z.string().trim().max(50, "Slug halaman maksimal 50 karakter."),
  meta_title: z.string().trim().max(200, "Meta title maksimal 200 karakter."),
  meta_desc: z
    .string()
    .trim()
    .max(300, "Meta description maksimal 300 karakter."),
  is_active: z.boolean(),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;

export const sectionJsonRequestSchema = z.object({
  key: z
    .string()
    .trim()
    .min(1, "Key section wajib diisi.")
    .max(50, "Key section maksimal 50 karakter."),
  order: z.number().int().min(0, "Urutan minimal 0."),
  title: z.string().trim().max(200).nullable(),
  subtitle: z.string().trim().max(255).nullable(),
  body: z.string().trim().nullable(),
  payload: z.record(z.string(), z.unknown()).nullable(),
  is_active: z.boolean(),
});

export type SectionJsonRequestValues = z.infer<typeof sectionJsonRequestSchema>;

export interface SectionFormValues {
  key: string;
  order: number;
  title: string;
  subtitle: string;
  body: string;
  payload_json: string;
  is_active: boolean;
  image: File | null;
}
