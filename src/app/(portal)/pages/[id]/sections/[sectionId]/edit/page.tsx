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
  title: "Edit Section Halaman",
};

interface EditSectionPageProps {
  params: Promise<{ id: string; sectionId: string }>;
}

export default async function EditSectionPage({
  params,
}: EditSectionPageProps): Promise<React.JSX.Element> {
  const { id, sectionId: rawSectionId } = await params;
  const pageId = Number(id);
  const sectionId = Number(rawSectionId);
  if (
    !Number.isInteger(pageId) ||
    pageId <= 0 ||
    !Number.isInteger(sectionId) ||
    sectionId <= 0
  ) {
    notFound();
  }

  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader title="Edit Section Halaman" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [pageRes, typesRes] = await Promise.allSettled([
    pagesRepository.getById(pageId, siteContext.activeSiteKey),
    sectionTypesRepository.list(siteContext.activeSiteKey),
  ]);

  const pageDetail = pageRes.status === "fulfilled" ? pageRes.value : null;
  const targetSection = pageDetail?.sections.find((s) => s.id === sectionId);
  if (!pageDetail || !targetSection) {
    notFound();
  }

  const sectionTypes: SectionTypeDefinition[] =
    typesRes.status === "fulfilled" ? typesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title={`Edit Section: ${targetSection.title ?? targetSection.key}`}
        description={`Perbarui isi section (${targetSection.key}) untuk halaman ${pageDetail.title} (/${pageDetail.slug}).`}
      />
      <SectionEditorForm
        page={pageDetail}
        section={targetSection}
        initialSectionTypes={sectionTypes}
        defaultOrder={targetSection.order}
      />
    </div>
  );
}
