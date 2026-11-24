import type { Metadata } from "next";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { MediaGalleryClient } from "@/features/media/components/media-gallery-client";
import { mediaRepository } from "@/features/media/repositories/media.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Galeri Media",
};

export default async function MediaPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Galeri Media"
          description="Kelola inventaris file gambar storage dan pemakaiannya di seluruh konten."
        />
        <NoTenantState isSuperadmin={Boolean(session?.user.is_superadmin)} />
      </div>
    );
  }

  const [mediaRes] = await Promise.allSettled([
    mediaRepository.list(siteContext.activeSiteKey),
  ]);
  const items = mediaRes.status === "fulfilled" ? mediaRes.value : [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title="Galeri Media"
        description={`Inventaris file gambar storage dan pelacakan pemakaian konten untuk ${siteContext.activeSite.name}.`}
      />
      <MediaGalleryClient items={items} />
    </div>
  );
}
