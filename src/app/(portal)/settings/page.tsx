import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { settingsRepository } from "@/features/settings/repositories/settings.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { SiteSettingsMap } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Pengaturan Situs",
};

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Pengaturan Situs"
          description="Kelola identitas, kontak resmi, media sosial, dan visibilitas modul website."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let settings: SiteSettingsMap = {};
  try {
    settings = await settingsRepository.getAll(siteContext.activeSiteKey);
  } catch {
    settings = {};
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title={`Pengaturan: ${siteContext.activeSite.name}`}
        description="Kelola identitas branding, kontak resmi, media sosial, legalitas, dan kontrol modul aktif."
      />
      <SettingsForm
        initialSettings={settings}
        siteKey={siteContext.activeSiteKey}
      />
    </div>
  );
}
