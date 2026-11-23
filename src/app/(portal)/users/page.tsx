import type { Metadata } from "next";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { SuperadminGuard } from "@/features/tenants/components/superadmin-guard";
import { UsersTable } from "@/features/tenants/components/users-table";
import { tenantsRepository } from "@/features/tenants/repositories/tenants.repository";
import { getPortalSession } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Manajemen User",
};

export default async function UsersPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();

  if (!session?.accessToken || !session.user.is_superadmin) {
    return (
      <SuperadminGuard
        title="Manajemen User & Role"
        description="Kelola akun administrator dan penugasan akses ke masing-masing tenant."
      />
    );
  }

  const [usersResult, sitesResult] = await Promise.allSettled([
    tenantsRepository.listUsers(session.accessToken),
    tenantsRepository.listSites(session.accessToken),
  ]);

  const users = usersResult.status === "fulfilled" ? usersResult.value : [];
  const sites = sitesResult.status === "fulfilled" ? sitesResult.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Manajemen User & Role"
        description="Kelola akun Superadmin, Admin Site, Editor, dan hak akses tiap unit usaha."
      />
      <UsersTable users={users} sites={sites} />
    </div>
  );
}
