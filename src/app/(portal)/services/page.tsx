import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceTypesTable } from "@/features/services/components/service-types-table";
import { ServicesTable } from "@/features/services/components/services-table";
import { servicesRepository } from "@/features/services/repositories/services.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Layanan & Produk",
};

export default async function ServicesPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Layanan & Produk"
          description="Kelola katalog layanan dan kategori tipe layanan unit usaha."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [servicesRes, typesRes] = await Promise.allSettled([
    servicesRepository.listServices(siteContext.activeSiteKey),
    servicesRepository.listTypes(siteContext.activeSiteKey),
  ]);

  const services = servicesRes.status === "fulfilled" ? servicesRes.value : [];
  const types = typesRes.status === "fulfilled" ? typesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Layanan & Produk"
        description={`Kelola katalog layanan dan tipe layanan untuk ${siteContext.activeSite.name}.`}
      />

      <Tabs defaultValue="services" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="services" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Daftar Layanan ({services.length})
          </TabsTrigger>
          <TabsTrigger value="types" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Tipe Layanan ({types.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServicesTable services={services} types={types} />
        </TabsContent>

        <TabsContent value="types">
          <ServiceTypesTable types={types} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
