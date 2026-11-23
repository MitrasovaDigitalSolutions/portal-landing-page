import { z } from "zod";
import type { ArticleStatus } from "@/types/cms.types";

export const articleCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama kategori minimal 2 karakter.")
    .max(100, "Nama kategori maksimal 100 karakter."),
  slug: z.string().trim().max(120, "Slug maksimal 120 karakter."),
  description: z.string().trim(),
  order: z.number().int().min(0, "Urutan minimal 0."),
});

export type ArticleCategoryFormValues = z.infer<typeof articleCategorySchema>;

export interface ArticleEditorValues {
  title: string;
  slug: string;
  article_category_id: string;
  status: ArticleStatus;
  published_at: string;
  excerpt: string;
  body: string;
  thumbnail: File | null;
}
