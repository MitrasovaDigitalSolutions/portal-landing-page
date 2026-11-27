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
  pageSlugs: readonly string[];
}

export const TENANT_MODULE_DEFINITIONS: readonly TenantModuleDefinition[] = [
  {
    key: "services",
    label: "Layanan & Produk",
    description:
      "Katalog layanan utama, unggulan, dan produk yang ditampilkan di landing page.",
    pageSlugs: ["produk", "layanan", "services"],
  },
  {
    key: "portfolios",
    label: "Portofolio",
    description:
      "Daftar proyek, studi kasus, dan galeri hasil pekerjaan perusahaan.",
    pageSlugs: ["portofolio", "portfolio", "portfolios"],
  },
  {
    key: "business_units",
    label: "Unit Bisnis",
    description:
      "Daftar unit usaha atau entitas operasional di bawah perusahaan.",
    pageSlugs: ["unit-usaha", "business-units"],
  },
  {
    key: "branches",
    label: "Kantor Cabang",
    description: "Lokasi kantor cabang, koordinat peta, dan kontak area.",
    pageSlugs: ["cabang", "branches"],
  },
  {
    key: "careers",
    label: "Karier & Lowongan",
    description:
      "Portal lowongan kerja beserta pengaturan kategori dan penutupan pendaftaran.",
    pageSlugs: ["karir", "karier", "careers"],
  },
  {
    key: "news",
    label: "Berita & Artikel",
    description:
      "Publikasi berita perusahaan, artikel edukasi, dan siaran pers.",
    pageSlugs: ["berita", "artikel", "news", "articles"],
  },
  {
    key: "contact",
    label: "Kontak & Pesan Masuk",
    description:
      "Formulir hubungi kami dan kotak masuk pesan dari pengunjung.",
    pageSlugs: ["kontak", "contact"],
  },
];

function coerceModuleBoolean(raw: unknown): boolean | undefined {
  if (typeof raw === "boolean") {
    return raw;
  }
  if (typeof raw === "number") {
    if (raw === 1) return true;
    if (raw === 0) return false;
    return undefined;
  }
  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return undefined;
}

function parseRawModulesRecord(rawIsActive: unknown): Record<string, unknown> | null {
  let candidate: unknown = rawIsActive;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate) as unknown;
    } catch {
      return null;
    }
  }
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    return null;
  }
  return candidate as Record<string, unknown>;
}

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
  const record = parseRawModulesRecord(rawModulesGroup?.is_active);
  if (!record) {
    return {};
  }

  const result: TenantModulesState = {};
  for (const key of TENANT_MODULE_KEYS) {
    const coerced = coerceModuleBoolean(record[key]);
    if (typeof coerced === "boolean") {
      result[key] = coerced;
    }
  }

  return result;
}

export function resolveModuleKeyByPageSlug(
  slug: string
): TenantModuleKey | null {
  const cleanSlug = slug.trim().toLowerCase();
  if (!cleanSlug) {
    return null;
  }
  const matched = TENANT_MODULE_DEFINITIONS.find((def) =>
    def.pageSlugs.includes(cleanSlug)
  );
  return matched?.key ?? null;
}

export function findLinkedPageForModule<T extends { slug: string }>(
  pages: readonly T[],
  key: TenantModuleKey
): T | null {
  const def = TENANT_MODULE_DEFINITIONS.find((item) => item.key === key);
  if (!def) {
    return null;
  }
  for (const slugCandidate of def.pageSlugs) {
    const found = pages.find(
      (page) => page.slug.trim().toLowerCase() === slugCandidate
    );
    if (found) {
      return found;
    }
  }
  return null;
}
