import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ArticleEditorForm } from "@/features/articles/components/article-editor-form";
import { articlesRepository } from "@/features/articles/repositories/articles.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { ArticleCategory } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Tulis Artikel Baru",
};

export default async function CreateArticlePage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader title="Tulis Artikel Baru" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let categories: ArticleCategory[] = [];
  try {
    categories = await articlesRepository.listCategories(
      siteContext.activeSiteKey
    );
  } catch {
    categories = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Tulis Artikel Baru"
        description={`Publikasikan berita atau artikel edukasi baru untuk ${siteContext.activeSite.name}.`}
      />
      <ArticleEditorForm article={null} categories={categories} />
    </div>
  );
}
