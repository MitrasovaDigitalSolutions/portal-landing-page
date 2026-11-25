import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PageSectionsManager } from "@/features/pages/components/page-sections-manager";
import { pagesRepository } from "@/features/pages/repositories/pages.repository";
import { sectionTypesRepository } from "@/features/pages/repositories/section-types.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { SectionTypeDefinition } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Kelola Section Halaman",
};

interface PageDetailRouteProps {
  params: Promise<{ id: string }>;
}

export default async function PageDetailPage({
  params,
}: PageDetailRouteProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const pageId = Number(id);
  if (!Number.isInteger(pageId) || pageId <= 0) {
    notFound();
  }

  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader title="Detail Halaman" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [pageRes, typesRes] = await Promise.allSettled([
    pagesRepository.getById(pageId, siteContext.activeSiteKey),
    sectionTypesRepository.list(siteContext.activeSiteKey),
  ]);

  const pageDetail = pageRes.status === "fulfilled" ? pageRes.value : null;
  const sectionTypes: SectionTypeDefinition[] =
    typesRes.status === "fulfilled" ? typesRes.value : [];

  if (!pageDetail) {
    notFound();
  }

  return (
    <PageSectionsManager
      page={pageDetail}
      initialSectionTypes={sectionTypes}
    />
  );
}
