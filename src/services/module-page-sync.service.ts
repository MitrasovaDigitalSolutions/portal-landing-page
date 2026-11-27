import {
  extractModulesState,
  resolveModuleKeyByPageSlug,
  TENANT_MODULE_KEYS,
  type TenantModuleKey,
} from "@/config/modules";
import { normalizeListResponse } from "@/lib/http/pagination";
import { portalApi } from "@/lib/http/portal-api";
import type { PageSummary } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export async function syncModulePagesActiveState(
  flags: Record<TenantModuleKey, boolean>,
  siteKey: string,
  extraPageFlags?: Record<string, boolean>
): Promise<void> {
  try {
    const raw = await portalApi.tenantGet<
      PageSummary[] | PaginatedResponse<PageSummary>
    >("/admin/pages", { siteKey });
    const pages = normalizeListResponse(raw).items;

    const updates = pages.flatMap((page) => {
      const moduleKey = resolveModuleKeyByPageSlug(page.slug);
      let nextActive: boolean | undefined;

      if (moduleKey) {
        nextActive = flags[moduleKey];
      } else if (
        page.slug.trim().toLowerCase() !== "home" &&
        extraPageFlags &&
        Object.hasOwn(extraPageFlags, String(page.id))
      ) {
        nextActive = extraPageFlags[String(page.id)];
      }

      if (typeof nextActive !== "boolean" || page.is_active === nextActive) {
        return [];
      }

      return [
        portalApi.tenantPut(
          `/admin/pages/${page.id}`,
          {
            title: page.title,
            slug: page.slug,
            meta_title: page.meta_title,
            meta_desc: page.meta_desc,
            is_active: nextActive,
          },
          { siteKey }
        ),
      ];
    });

    if (updates.length > 0) {
      await Promise.allSettled(updates);
    }
  } catch {
    // Best-effort sync agar gagal sinkronisasi halaman tidak menggagalkan penyimpanan pengaturan.
  }
}

export async function syncPageModuleVisibility(
  slug: string,
  isActive: boolean,
  siteKey: string
): Promise<void> {
  const moduleKey = resolveModuleKeyByPageSlug(slug);
  if (!moduleKey) {
    return;
  }

  try {
    const rawSettings = await portalApi.tenantGet<
      Record<string, Record<string, unknown>>
    >("/admin/settings", { siteKey });
    const current = extractModulesState(rawSettings);

    const nextFlags = {} as Record<TenantModuleKey, boolean>;
    for (const key of TENANT_MODULE_KEYS) {
      nextFlags[key] = current[key] ?? true;
    }
    nextFlags[moduleKey] = isActive;

    await portalApi.tenantPost(
      "/admin/settings",
      {
        settings: [
          {
            group: "modules",
            key: "is_active",
            value: nextFlags,
          },
        ],
      },
      { siteKey }
    );
  } catch {
    // Best-effort sync agar update halaman tetap tersimpan meski sinkronisasi modul gagal.
  }
}
