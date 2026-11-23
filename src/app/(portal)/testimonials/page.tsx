import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { TestimonialsTable } from "@/features/testimonials/components/testimonials-table";
import { testimonialsRepository } from "@/features/testimonials/repositories/testimonials.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { TestimonialItem } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Testimoni",
};

export default async function TestimonialsPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Testimoni Klien"
          description="Kelola ulasan dan tingkat kepuasan pelanggan."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let testimonials: TestimonialItem[] = [];
  try {
    testimonials = await testimonialsRepository.list(siteContext.activeSiteKey);
  } catch {
    testimonials = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Testimoni Klien"
        description={`Kelola ulasan dan rating pelanggan untuk ${siteContext.activeSite.name}.`}
      />
      <TestimonialsTable testimonials={testimonials} />
    </div>
  );
}
