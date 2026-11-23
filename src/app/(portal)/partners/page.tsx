import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PartnersTable } from "@/features/partners/components/partners-table";
import { partnersRepository } from "@/features/partners/repositories/partners.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { PartnerItem } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Mitra & Partner",
};

export default async function PartnersPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Mitra / Partner"
          description="Kelola daftar logo partner dan kemitraan perusahaan."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let partners: PartnerItem[] = [];
  try {
    partners = await partnersRepository.list(siteContext.activeSiteKey);
  } catch {
    partners = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Mitra / Partner"
        description={`Kelola logo mitra dan relasi bisnis untuk ${siteContext.activeSite.name}.`}
      />
      <PartnersTable partners={partners} />
    </div>
  );
}
