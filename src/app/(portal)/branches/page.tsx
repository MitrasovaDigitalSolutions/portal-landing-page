import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { BranchesTable } from "@/features/branches/components/branches-table";
import { branchesRepository } from "@/features/branches/repositories/branches.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { BranchItem } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Kantor Cabang",
};

export default async function BranchesPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Kantor Cabang"
          description="Kelola daftar lokasi kantor pusat dan cabang unit usaha."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let branches: BranchItem[] = [];
  try {
    branches = await branchesRepository.list(siteContext.activeSiteKey);
  } catch {
    branches = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Kantor Cabang"
        description={`Kelola lokasi kantor dan galeri foto cabang untuk ${siteContext.activeSite.name}.`}
      />
      <BranchesTable branches={branches} />
    </div>
  );
}
