import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { SectionEditorForm } from "@/features/pages/components/section-editor-form";
import { pagesRepository } from "@/features/pages/repositories/pages.repository";
import { sectionTypesRepository } from "@/features/pages/repositories/section-types.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { SectionTypeDefinition } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Tambah Section Halaman",
};

interface CreateSectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreateSectionPage({
  params,
}: CreateSectionPageProps): Promise<React.JSX.Element> {
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
        <PortalPageHeader title="Tambah Section Baru" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [pageRes, typesRes] = await Promise.allSettled([
    pagesRepository.getById(pageId, siteContext.activeSiteKey),
    sectionTypesRepository.list(siteContext.activeSiteKey),
  ]);

  const pageDetail = pageRes.status === "fulfilled" ? pageRes.value : null;
  if (!pageDetail) {
    notFound();
  }

  const sectionTypes: SectionTypeDefinition[] =
    typesRes.status === "fulfilled" ? typesRes.value : [];
  const lastOrder = [...pageDetail.sections]
    .sort((a, b) => a.order - b.order)
    .at(-1)?.order;
  const nextOrder = lastOrder !== undefined ? lastOrder + 1 : 0;

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Tambah Section Baru"
        description={`Susun konten section baru untuk halaman ${pageDetail.title} (/${pageDetail.slug}) pada ${siteContext.activeSite.name}.`}
      />
      <SectionEditorForm
        page={pageDetail}
        section={null}
        initialSectionTypes={sectionTypes}
        defaultOrder={nextOrder}
      />
    </div>
  );
}
