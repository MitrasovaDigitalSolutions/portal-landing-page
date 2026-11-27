import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ServiceEditorForm } from "@/features/services/components/service-editor-form";
import { servicesRepository } from "@/features/services/repositories/services.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Edit Layanan",
};

interface EditServicePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({
  params,
}: EditServicePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const serviceId = Number(id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    notFound();
  }

  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader title="Edit Layanan" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [serviceRes, typesRes] = await Promise.allSettled([
    servicesRepository.getServiceById(serviceId, siteContext.activeSiteKey),
    servicesRepository.listTypes(siteContext.activeSiteKey),
  ]);

  const service = serviceRes.status === "fulfilled" ? serviceRes.value : null;
  if (!service) {
    notFound();
  }

  const types = typesRes.status === "fulfilled" ? typesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title={`Edit Layanan: ${service.name}`}
        description={`Perbarui informasi, keunggulan, dan media layanan untuk ${siteContext.activeSite.name}.`}
      />
      <ServiceEditorForm service={service} types={types} />
    </div>
  );
}
