import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { PageSectionsManager } from "@/features/pages/components/page-sections-manager";
import { pagesRepository } from "@/features/pages/repositories/pages.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

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

  let pageDetail: Awaited<ReturnType<typeof pagesRepository.getById>> | null =
    null;
  try {
    pageDetail = await pagesRepository.getById(pageId, siteContext.activeSiteKey);
  } catch {
    pageDetail = null;
  }

  if (!pageDetail) {
    notFound();
  }

  return <PageSectionsManager page={pageDetail} />;
}
