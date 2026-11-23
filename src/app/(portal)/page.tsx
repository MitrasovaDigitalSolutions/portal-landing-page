import type { Metadata } from "next";
import Link from "next/link";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Card } from "@/components/ui/card";
import { DashboardStatsCard } from "@/features/dashboard/components/dashboard-stats-card";
import { RecentInquiryRow } from "@/features/dashboard/components/recent-inquiry-row";
import { SuperadminPlatformBanner } from "@/features/dashboard/components/superadmin-platform-banner";
import { TenantModulesStatus } from "@/features/dashboard/components/tenant-modules-status";
import {
  getTenantDashboardOverview,
  getTenantSettingsSummary,
} from "@/features/dashboard/repositories/dashboard.repository";
import { buildDashboardStats } from "@/features/dashboard/utils/build-dashboard-stats";
import { getPortalSession } from "@/lib/auth/auth";
import { resolveActiveSiteContext } from "@/lib/tenant/active-tenant";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage(): Promise<React.JSX.Element> {
  const session = await getPortalSession();
  const siteContext = await resolveActiveSiteContext(session);
  const isSuperadmin = Boolean(session?.user.is_superadmin);

  if (!siteContext.activeSite || !siteContext.activeSiteKey) {
    return (
      <div className="space-y-6">
        <PortalPageHeader
          title="Dashboard Portal"
          description="Kelola multi-tenant landing page Mitrasova dalam satu kendali terpusat."
        />
        <NoTenantState isSuperadmin={isSuperadmin} />
      </div>
    );
  }

  const [overview, settings] = await Promise.all([
    getTenantDashboardOverview(siteContext.activeSiteKey),
    getTenantSettingsSummary(siteContext.activeSiteKey),
  ]);

  const statCards = buildDashboardStats(overview, settings.modules);

  return (
    <div className="space-y-6">
      <PortalPageHeader
        title={`Ringkasan ${siteContext.activeSite.name}`}
        description={
          settings.siteTitle ??
          `Pantau statistik konten dan pesan masuk untuk tenant /${siteContext.activeSite.slug}.`
        }
      />

      {isSuperadmin ? (
        <SuperadminPlatformBanner
          totalSites={siteContext.availableSites.length}
          activeSites={siteContext.availableSites.length}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <DashboardStatsCard
            key={card.href}
            label={card.label}
            value={card.value}
            sublabel={card.sublabel}
            icon={card.icon}
            href={card.href}
            badge={card.badge}
            moduleDisabled={card.disabled}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pesan Masuk Terbaru
              </h2>
              <p className="text-[11px] text-slate-500">
                5 pesan terakhir dari pengunjung website tenant ini.
              </p>
            </div>
            <Link
              href="/inquiries"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {overview.recentInquiries.length === 0 ? (
            <div className="px-4 py-10 text-center text-xs text-slate-400">
              Belum ada pesan masuk untuk tenant ini.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {overview.recentInquiries.map((item) => (
                <RecentInquiryRow key={item.id} inquiry={item} />
              ))}
            </div>
          )}
        </Card>

        <TenantModulesStatus
          modules={settings.modules}
          siteName={siteContext.activeSite.name}
        />
      </div>
    </div>
  );
}
