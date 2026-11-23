import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { InquiriesTable } from "@/features/inquiries/components/inquiries-table";
import { inquiriesRepository } from "@/features/inquiries/repositories/inquiries.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import type { InquiryItem } from "@/types/cms.types";

export const metadata: Metadata = {
  title: "Pesan Masuk",
};

export default async function InquiriesPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Pesan Masuk (Inquiries)"
          description="Pantau dan tindak lanjuti pesan konsultasi dari pengunjung."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  let inquiries: InquiryItem[] = [];
  try {
    inquiries = await inquiriesRepository.list(siteContext.activeSiteKey);
  } catch {
    inquiries = [];
  }

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Pesan Masuk (Inquiries)"
        description={`Pantau pesan kontak dan catatan tindak lanjut untuk ${siteContext.activeSite.name}.`}
      />
      <InquiriesTable inquiries={inquiries} />
    </div>
  );
}
