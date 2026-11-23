import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const siteFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama tenant minimal 2 karakter.")
    .max(100, "Nama tenant maksimal 100 karakter."),
  slug: z
    .string()
    .trim()
    .max(50, "Slug maksimal 50 karakter.")
    .refine(
      (val) => val.length === 0 || SLUG_PATTERN.test(val),
      "Slug hanya boleh huruf kecil, angka, dan tanda hubung (-)."
    ),
  domain: z.string().trim().max(150, "Domain maksimal 150 karakter."),
  is_active: z.boolean(),
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;

const baseUserFields = {
  name: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter.")
    .max(100, "Nama lengkap maksimal 100 karakter."),
  email: z.email({ message: "Format email tidak valid." }),
  is_superadmin: z.boolean(),
};

export const createUserSchema = z.object({
  ...baseUserFields,
  password: z
    .string()
    .min(8, "Password minimal 8 karakter untuk admin baru."),
});

export const updateUserSchema = z.object({
  ...baseUserFields,
  password: z
    .string()
    .refine(
      (val) => val.length === 0 || val.length >= 8,
      "Password baru minimal 8 karakter jika diisi."
    ),
});

export type UserFormValues = z.infer<typeof updateUserSchema>;

export const assignUserSiteSchema = z.object({
  site_id: z.string().min(1, "Pilih unit usaha terlebih dahulu."),
  role: z.enum(["admin", "editor"], {
    message: "Role akses harus admin atau editor.",
  }),
});

export type AssignUserSiteValues = z.infer<typeof assignUserSiteSchema>;
