import { portalApi } from "@/lib/http/portal-api";
import type { SiteSettingsMap } from "@/types/cms.types";
import type { SettingsBulkPayload } from "@/features/settings/schemas/settings.schema";

export const settingsRepository = {
  getAll(siteKey?: string): Promise<SiteSettingsMap> {
    return portalApi.tenantGet<SiteSettingsMap>("/admin/settings", { siteKey });
  },

  bulkUpdate(
    payload: SettingsBulkPayload,
    siteKey?: string
  ): Promise<unknown> {
    return portalApi.tenantPost("/admin/settings", payload, { siteKey });
  },

  uploadLogo(
    formData: FormData,
    siteKey?: string
  ): Promise<{ logo_path: string; logo_url: string } | null> {
    return portalApi.tenantPost<{ logo_path: string; logo_url: string } | null>(
      "/admin/settings",
      formData,
      { siteKey }
    );
  },
};
