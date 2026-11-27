import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { pagesRepository } from "@/features/pages/repositories/pages.repository";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { settingsRepository } from "@/features/settings/repositories/settings.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { PageSummary, SiteSettingsMap } from "@/types/cms.types";

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

  const [settingsRes, pagesRes] = await Promise.allSettled([
    settingsRepository.getAll(siteContext.activeSiteKey),
    pagesRepository.list(siteContext.activeSiteKey),
  ]);

  const settings: SiteSettingsMap =
    settingsRes.status === "fulfilled" ? settingsRes.value : {};
  const pages: PageSummary[] =
    pagesRes.status === "fulfilled" ? pagesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title={`Pengaturan: ${siteContext.activeSite.name}`}
        description="Kelola identitas branding, kontak resmi, media sosial, legalitas, dan kontrol modul aktif."
      />
      <SettingsForm
        initialSettings={settings}
        pages={pages}
        siteKey={siteContext.activeSiteKey}
      />
    </div>
  );
}
