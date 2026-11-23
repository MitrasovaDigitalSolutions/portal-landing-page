import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartnersTable } from "@/features/partners/components/partners-table";
import { partnersRepository } from "@/features/partners/repositories/partners.repository";
import { TestimonialsTable } from "@/features/testimonials/components/testimonials-table";
import { testimonialsRepository } from "@/features/testimonials/repositories/testimonials.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Testimoni & Mitra",
};

interface ShowcasePageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function ShowcasePage({
  searchParams,
}: ShowcasePageProps): Promise<React.JSX.Element> {
  const [{ tab }, session] = await Promise.all([
    searchParams,
    getPortalSession(),
  ]);
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Testimoni & Mitra"
          description="Kelola ulasan testimoni klien dan daftar logo partner terpercaya."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [testimonialsRes, partnersRes] = await Promise.allSettled([
    testimonialsRepository.list(siteContext.activeSiteKey),
    partnersRepository.list(siteContext.activeSiteKey),
  ]);

  const testimonials =
    testimonialsRes.status === "fulfilled" ? testimonialsRes.value : [];
  const partners = partnersRes.status === "fulfilled" ? partnersRes.value : [];
  const defaultTab = tab === "partners" ? "partners" : "testimonials";

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Testimoni & Mitra"
        description={`Kelola ulasan testimoni klien dan logo partner terpercaya untuk ${siteContext.activeSite.name}.`}
      />

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="mb-4 h-10 rounded-xl bg-slate-100 p-1">
          <TabsTrigger
            value="testimonials"
            className="rounded-lg px-4 text-xs font-semibold sm:text-sm"
          >
            Testimoni ({testimonials.length})
          </TabsTrigger>
          <TabsTrigger
            value="partners"
            className="rounded-lg px-4 text-xs font-semibold sm:text-sm"
          >
            Logo Partner ({partners.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials">
          <TestimonialsTable testimonials={testimonials} />
        </TabsContent>

        <TabsContent value="partners">
          <PartnersTable partners={partners} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
