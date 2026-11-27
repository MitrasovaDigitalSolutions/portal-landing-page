import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ServiceEditorForm } from "@/features/services/components/service-editor-form";
import { servicesRepository } from "@/features/services/repositories/services.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { ServiceType } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Tambah Layanan Baru",
};

export default async function CreateServicePage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader title="Tambah Layanan Baru" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let types: ServiceType[] = [];
  try {
    types = await servicesRepository.listTypes(siteContext.activeSiteKey);
  } catch {
    types = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Tambah Layanan Baru"
        description={`Tambahkan katalog produk atau layanan baru untuk ${siteContext.activeSite.name}.`}
      />
      <ServiceEditorForm service={null} types={types} />
    </div>
  );
}
