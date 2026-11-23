import type { Metadata } from "next";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { SitesTable } from "@/features/tenants/components/sites-table";
import { SuperadminGuard } from "@/features/tenants/components/superadmin-guard";
import { tenantsRepository } from "@/features/tenants/repositories/tenants.repository";
import { getPortalSession } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Kelola Tenant",
};

export default async function SitesPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();

  if (!session?.accessToken || !session.user.is_superadmin) {
    return (
      <SuperadminGuard
        title="Kelola Tenant (Unit Usaha)"
        description="Daftar seluruh website unit usaha yang terdaftar pada platform Mitrasova."
      />
    );
  }

  let sites: Awaited<ReturnType<typeof tenantsRepository.listSites>> = [];
  try {
    sites = await tenantsRepository.listSites(session.accessToken);
  } catch {
    sites = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Kelola Tenant (Unit Usaha)"
        description="Tambah, ubah, aktifkan, atau kelola daftar tenant beserta API Key dan domainnya."
      />
      <SitesTable sites={sites} />
    </div>
  );
}
