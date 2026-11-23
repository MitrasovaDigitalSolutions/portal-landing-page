import { Layers, Network, Settings } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { NoTenantState } from "@/components/portal/no-tenant-state";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { CompactModulesBar } from "@/features/dashboard/components/compact-modules-bar";
import { DashboardStatsCard } from "@/features/dashboard/components/dashboard-stats-card";
import { RecentInquiriesPanel } from "@/features/dashboard/components/recent-inquiries-panel";
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
      <div className="space-y-4">
        <PortalPageHeader
          title="Dashboard Operasional"
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
  const siteTitle = settings.siteTitle ?? siteContext.activeSite.name;

  return (
    <div className="space-y-4">
      <PortalPageHeader
        title="Dashboard Operasional"
        description={`Ringkasan katalog, publikasi, dan konsultasi masuk — ${siteTitle}.`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {isSuperadmin ? (
              <Link
                href="/users?tab=sites"
                className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
              >
                <Network className="size-3.5 text-primary" />
                <span>Situs & Pengguna</span>
              </Link>
            ) : null}
            <Link
              href="/settings"
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
            >
              <Settings className="size-3.5 text-primary" />
              <span>Pengaturan Situs</span>
            </Link>
            <Link
              href="/pages"
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-2xs transition-opacity hover:opacity-95"
            >
              <Layers className="size-3.5" />
              <span>Kelola Halaman</span>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-4">
          {statCards.map((card) => (
            <DashboardStatsCard
              key={card.href}
              label={card.label}
              value={card.value}
              sublabel={card.sublabel}
              icon={card.icon}
              href={card.href}
              moduleDisabled={card.disabled}
            />
          ))}
        </div>

        <RecentInquiriesPanel
          inquiries={overview.recentInquiries}
          totalCount={overview.inquiriesCount}
          newCount={overview.newInquiriesCount}
        />
      </div>

      <CompactModulesBar modules={settings.modules} />
    </div>
  );
}
