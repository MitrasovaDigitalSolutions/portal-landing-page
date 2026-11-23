import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { ArticleEditorForm } from "@/features/articles/components/article-editor-form";
import { articlesRepository } from "@/features/articles/repositories/articles.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Edit Artikel",
};

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const articleId = Number(id);
  if (!Number.isInteger(articleId) || articleId <= 0) {
    notFound();
  }

  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader title="Edit Artikel" />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [articleRes, categoriesRes] = await Promise.allSettled([
    articlesRepository.getById(articleId, siteContext.activeSiteKey),
    articlesRepository.listCategories(siteContext.activeSiteKey),
  ]);

  if (articleRes.status !== "fulfilled") {
    notFound();
  }

  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Edit Artikel"
        description={`Perbarui konten artikel untuk ${siteContext.activeSite.name}.`}
      />
      <ArticleEditorForm article={articleRes.value} categories={categories} />
    </div>
  );
}
