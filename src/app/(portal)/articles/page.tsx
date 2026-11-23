import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCategoriesTable } from "@/features/articles/components/article-categories-table";
import { ArticlesTable } from "@/features/articles/components/articles-table";
import { articlesRepository } from "@/features/articles/repositories/articles.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Berita & Artikel",
};

export default async function ArticlesPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Berita & Artikel"
          description="Kelola publikasi berita dan kategori artikel website."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [articlesRes, categoriesRes] = await Promise.allSettled([
    articlesRepository.listArticles(siteContext.activeSiteKey),
    articlesRepository.listCategories(siteContext.activeSiteKey),
  ]);

  const articles =
    articlesRes.status === "fulfilled" ? articlesRes.value : [];
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Berita & Artikel"
        description={`Kelola berita, publikasi, dan kategori artikel untuk ${siteContext.activeSite.name}.`}
      />

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="articles" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Daftar Artikel ({articles.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Kategori Artikel ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          <ArticlesTable articles={articles} categories={categories} />
        </TabsContent>

        <TabsContent value="categories">
          <ArticleCategoriesTable categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
