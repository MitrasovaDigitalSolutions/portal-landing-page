import type { Metadata } from "next";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SitesTable } from "@/features/tenants/components/sites-table";
import { SuperadminGuard } from "@/features/tenants/components/superadmin-guard";
import { UsersTable } from "@/features/tenants/components/users-table";
import { tenantsRepository } from "@/features/tenants/repositories/tenants.repository";
import { getPortalSession } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Situs & Pengguna",
};

interface UsersPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function UsersPage({
  searchParams,
}: UsersPageProps): Promise<React.JSX.Element> {
  const [{ tab }, session] = await Promise.all([
    searchParams,
    getPortalSession(),
  ]);

  if (!session?.accessToken || !session.user.is_superadmin) {
    return (
      <SuperadminGuard
        title="Situs & Pengguna"
        description="Kelola daftar tenant unit usaha, akun admin, dan penugasan role per site."
      />
    );
  }

  const [usersResult, sitesResult] = await Promise.allSettled([
    tenantsRepository.listUsers(session.accessToken),
    tenantsRepository.listSites(session.accessToken),
  ]);

  const users = usersResult.status === "fulfilled" ? usersResult.value : [];
  const sites = sitesResult.status === "fulfilled" ? sitesResult.value : [];
  const defaultTab = tab === "sites" ? "sites" : "users";

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Situs & Pengguna"
        description="Kelola daftar tenant unit usaha (sites), akun administrator, dan penugasan role per site."
      />

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger
            value="users"
            className="rounded-lg px-4 text-xs font-semibold sm:text-sm"
          >
            Pengguna & Akses Site ({users.length})
          </TabsTrigger>
          <TabsTrigger
            value="sites"
            className="rounded-lg px-4 text-xs font-semibold sm:text-sm"
          >
            Unit Usaha / Tenant Sites ({sites.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTable users={users} sites={sites} />
        </TabsContent>

        <TabsContent value="sites">
          <SitesTable sites={sites} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
