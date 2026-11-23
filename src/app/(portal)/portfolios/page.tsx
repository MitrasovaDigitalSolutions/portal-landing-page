import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PortfoliosTable } from "@/features/portfolios/components/portfolios-table";
import { portfoliosRepository } from "@/features/portfolios/repositories/portfolios.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { normalizeListResponse } from "@/lib/http/pagination";
import { portalApi } from "@/lib/http/portal-api";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { ServiceType } from "@/types/cms.types";
import type { PaginatedResponse } from "@/types/http.types";

export const metadata: Metadata = {
  title: "Portofolio",
};

export default async function PortfoliosPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Portofolio Proyek"
          description="Kelola studi kasus dan hasil proyek perusahaan."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [portfoliosRes, typesRes] = await Promise.allSettled([
    portfoliosRepository.list(siteContext.activeSiteKey),
    portalApi
      .tenantGet<ServiceType[] | PaginatedResponse<ServiceType>>(
        "/admin/service-types",
        { siteKey: siteContext.activeSiteKey }
      )
      .then((res) => normalizeListResponse(res).items),
  ]);

  const portfolios =
    portfoliosRes.status === "fulfilled" ? portfoliosRes.value : [];
  const types = typesRes.status === "fulfilled" ? typesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Portofolio Proyek"
        description={`Kelola daftar proyek dan galeri portofolio untuk ${siteContext.activeSite.name}.`}
      />
      <PortfoliosTable portfolios={portfolios} types={types} />
    </div>
  );
}
