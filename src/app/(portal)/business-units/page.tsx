import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { BusinessUnitsTable } from "@/features/business-units/components/business-units-table";
import { businessUnitsRepository } from "@/features/business-units/repositories/business-units.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { BusinessUnitItem } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Unit Bisnis",
};

export default async function BusinessUnitsPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Unit Bisnis"
          description="Kelola daftar entitas atau unit usaha afiliasi."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let units: BusinessUnitItem[] = [];
  try {
    units = await businessUnitsRepository.list(siteContext.activeSiteKey);
  } catch {
    units = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Unit Bisnis"
        description={`Kelola daftar unit usaha terhubung untuk ${siteContext.activeSite.name}.`}
      />
      <BusinessUnitsTable units={units} />
    </div>
  );
}
