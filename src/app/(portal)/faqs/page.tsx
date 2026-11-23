import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqCategoriesTable } from "@/features/faqs/components/faq-categories-table";
import { FaqsTable } from "@/features/faqs/components/faqs-table";
import { faqsRepository } from "@/features/faqs/repositories/faqs.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "FAQ & Bantuan",
};

export default async function FaqsPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="FAQ & Bantuan"
          description="Kelola daftar pertanyaan umum dan kategorinya."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [faqsRes, categoriesRes] = await Promise.allSettled([
    faqsRepository.listFaqs(siteContext.activeSiteKey),
    faqsRepository.listCategories(siteContext.activeSiteKey),
  ]);

  const faqs = faqsRes.status === "fulfilled" ? faqsRes.value : [];
  const categories =
    categoriesRes.status === "fulfilled" ? categoriesRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="FAQ & Bantuan"
        description={`Kelola tanya jawab umum dan kategori FAQ untuk ${siteContext.activeSite.name}.`}
      />

      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="faqs" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Daftar FAQ ({faqs.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-lg px-4 text-xs font-semibold sm:text-sm">
            Kategori FAQ ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faqs">
          <FaqsTable faqs={faqs} categories={categories} />
        </TabsContent>

        <TabsContent value="categories">
          <FaqCategoriesTable categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
