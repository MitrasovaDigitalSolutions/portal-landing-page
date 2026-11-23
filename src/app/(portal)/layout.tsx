import { redirect } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { PortalHeader } from "@/components/portal/portal-header";
import { PortalSidebar } from "@/components/portal/portal-sidebar";
import { getTenantSettingsSummary } from "@/features/dashboard/repositories/dashboard.repository";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";
import { TenantProvider } from "@/providers/tenant-provider";
import { generateBrandCssVariables } from "@/utils/color";

interface PortalLayoutProps {
  children: ReactNode;
}

export default async function PortalLayout({
  children,
}: PortalLayoutProps): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  if (!session?.accessToken) {
    redirect("/login");
  }

  const siteContext = await resolveActiveSiteContext(session);
  const settings = siteContext.activeSiteKey
    ? await getTenantSettingsSummary(siteContext.activeSiteKey)
    : { modules: {}, rawSettings: {} };

  const brandStyles = generateBrandCssVariables(
    settings.brandColor
  ) as CSSProperties;

  return (
    <TenantProvider
      value={{
        activeSite: siteContext.activeSite,
        availableSites: siteContext.availableSites,
        isSuperadmin: session.user.is_superadmin,
        modules: settings.modules,
        brandColor: settings.brandColor,
        siteTitle: settings.siteTitle,
        logoUrl: settings.logoUrl,
      }}
    >
      <div
        style={brandStyles}
        className="flex min-h-screen w-full bg-slate-50 text-slate-900"
      >
        <PortalSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <PortalHeader
            userName={session.user.name}
            userEmail={session.user.email}
            isSuperadmin={session.user.is_superadmin}
          />
          <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </TenantProvider>
  );
}
