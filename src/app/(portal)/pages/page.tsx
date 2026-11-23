import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PagesTable } from "@/features/pages/components/pages-table";
import { pagesRepository } from "@/features/pages/repositories/pages.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { PageSummary } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Halaman & Seksi",
};

export default async function PagesListPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Halaman & Seksi"
          description="Kelola struktur halaman, metadata SEO, dan konten section dinamis."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let pages: PageSummary[] = [];
  try {
    pages = await pagesRepository.list(siteContext.activeSiteKey);
  } catch {
    pages = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Halaman & Seksi"
        description={`Kelola struktur halaman dan section dinamis untuk ${siteContext.activeSite.name}.`}
      />
      <PagesTable pages={pages} />
    </div>
  );
}
