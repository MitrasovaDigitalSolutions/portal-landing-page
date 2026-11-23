import { z } from "zod";

export const serviceTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama tipe layanan minimal 2 karakter.")
    .max(100, "Nama tipe layanan maksimal 100 karakter."),
  slug: z.string().trim().max(120, "Slug maksimal 120 karakter."),
  description: z.string().trim(),
  icon: z.string().trim().max(255, "Nama ikon maksimal 255 karakter."),
  order: z.number().int().min(0, "Urutan minimal 0."),
});

export type ServiceTypeFormValues = z.infer<typeof serviceTypeSchema>;

export interface ServiceFormValues {
  name: string;
  slug: string;
  service_type_id: string;
  short_desc: string;
  body: string;
  features: string[];
  order: number;
  is_active: boolean;
  is_featured: boolean;
  thumbnail: File | null;
  icon: File | null;
}
