import { z } from "zod";

export const faqCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama kategori minimal 2 karakter.")
    .max(100, "Nama kategori maksimal 100 karakter."),
  slug: z.string().trim().max(120, "Slug maksimal 120 karakter."),
  order: z.number().int().min(0, "Urutan minimal 0."),
});

export type FaqCategoryFormValues = z.infer<typeof faqCategorySchema>;

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Pertanyaan minimal 3 karakter."),
  answer: z.string().trim().min(3, "Jawaban minimal 3 karakter."),
  faq_category_id: z.string(),
  order: z.number().int().min(0, "Urutan minimal 0."),
  is_active: z.boolean(),
});

export type FaqFormValues = z.infer<typeof faqSchema>;
