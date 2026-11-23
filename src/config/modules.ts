export const TENANT_MODULE_KEYS = [
  "services",
  "portfolios",
  "business_units",
  "branches",
  "careers",
  "news",
  "contact",
] as const;

export type TenantModuleKey = (typeof TENANT_MODULE_KEYS)[number];

export type TenantModulesState = Partial<Record<TenantModuleKey, boolean>>;

export interface TenantModuleDefinition {
  key: TenantModuleKey;
  label: string;
  description: string;
}

export const TENANT_MODULE_DEFINITIONS: readonly TenantModuleDefinition[] = [
  {
    key: "services",
    label: "Layanan & Produk",
    description: "Katalog layanan utama, unggulan, dan produk yang ditampilkan di landing page.",
  },
  {
    key: "portfolios",
    label: "Portofolio",
    description: "Daftar proyek, studi kasus, dan galeri hasil pekerjaan perusahaan.",
  },
  {
    key: "business_units",
    label: "Unit Bisnis",
    description: "Daftar unit usaha atau entitas operasional di bawah perusahaan.",
  },
  {
    key: "branches",
    label: "Kantor Cabang",
    description: "Lokasi kantor cabang, koordinat peta, dan kontak area.",
  },
  {
    key: "careers",
    label: "Karier & Lowongan",
    description: "Portal lowongan kerja beserta pengaturan kategori dan penutupan pendaftaran.",
  },
  {
    key: "news",
    label: "Berita & Artikel",
    description: "Publikasi berita perusahaan, artikel edukasi, dan siaran pers.",
  },
  {
    key: "contact",
    label: "Kontak & Pesan Masuk",
    description: "Formulir hubungi kami dan kotak masuk pesan dari pengunjung.",
  },
];

export function isTenantModuleActive(
  modules: TenantModulesState | null | undefined,
  key?: TenantModuleKey
): boolean {
  if (!key || !modules) {
    return true;
  }
  return modules[key] ?? true;
}

export function extractModulesState(
  settings: Record<string, Record<string, unknown>> | null | undefined
): TenantModulesState {
  const rawModulesGroup = settings?.modules;
  const rawIsActive = rawModulesGroup?.is_active;
  if (!rawIsActive || typeof rawIsActive !== "object" || Array.isArray(rawIsActive)) {
    return {};
  }

  const record = rawIsActive as Record<string, unknown>;
  const result: TenantModulesState = {};

  for (const key of TENANT_MODULE_KEYS) {
    if (typeof record[key] === "boolean") {
      result[key] = record[key];
    }
  }

  return result;
}
