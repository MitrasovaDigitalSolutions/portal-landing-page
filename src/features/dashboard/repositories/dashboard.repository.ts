import { extractModulesState } from "@/config/modules";
import { portalApi } from "@/lib/http/portal-api";
import { normalizeListResponse } from "@/lib/http/pagination";
import type { PaginatedResponse } from "@/types/http.types";
import type {
  DashboardInquiryBrief,
  PortalSiteSettingsSummary,
  RawSettingsMap,
  TenantDashboardOverview,
} from "@/features/dashboard/types/dashboard.types";

function readStringField(
  group: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = group?.[key];
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export async function getTenantSettingsSummary(
  siteKey: string
): Promise<PortalSiteSettingsSummary> {
  try {
    const rawSettings = await portalApi.tenantGet<RawSettingsMap>(
      "/admin/settings",
      { siteKey }
    );

    const general = rawSettings.general;
    return {
      siteTitle: readStringField(general, "site_title"),
      brandColor: readStringField(general, "brand_color"),
      logoUrl: readStringField(general, "logo_url"),
      modules: extractModulesState(rawSettings),
      rawSettings,
    };
  } catch {
    return {
      modules: {},
      rawSettings: {},
    };
  }
}

async function fetchCount(path: string, siteKey: string): Promise<number> {
  try {
    const res = await portalApi.tenantGet<unknown[] | PaginatedResponse<unknown>>(
      path,
      { siteKey, query: { per_page: 1 } }
    );
    return normalizeListResponse(res).total;
  } catch {
    return 0;
  }
}

async function fetchInquiriesSummary(siteKey: string): Promise<{
  total: number;
  newCount: number;
  recent: DashboardInquiryBrief[];
}> {
  try {
    const res = await portalApi.tenantGet<
      DashboardInquiryBrief[] | PaginatedResponse<DashboardInquiryBrief>
    >("/admin/inquiries", { siteKey, query: { per_page: 5 } });
    const normalized = normalizeListResponse(res);
    const newCount = normalized.items.filter(
      (item) => item.status === "new"
    ).length;

    return {
      total: normalized.total,
      newCount,
      recent: normalized.items.slice(0, 5),
    };
  } catch {
    return { total: 0, newCount: 0, recent: [] };
  }
}

export async function getTenantDashboardOverview(
  siteKey: string
): Promise<TenantDashboardOverview> {
  const [
    pagesCount,
    servicesCount,
    portfoliosCount,
    businessUnitsCount,
    branchesCount,
    testimonialsCount,
    partnersCount,
    articlesCount,
    faqsCount,
    inquiries,
  ] = await Promise.all([
    fetchCount("/admin/pages", siteKey),
    fetchCount("/admin/services", siteKey),
    fetchCount("/admin/portfolios", siteKey),
    fetchCount("/admin/business-units", siteKey),
    fetchCount("/admin/branches", siteKey),
    fetchCount("/admin/testimonials", siteKey),
    fetchCount("/admin/partners", siteKey),
    fetchCount("/admin/articles", siteKey),
    fetchCount("/admin/faqs", siteKey),
    fetchInquiriesSummary(siteKey),
  ]);

  return {
    pagesCount,
    servicesCount,
    portfoliosCount,
    businessUnitsCount,
    branchesCount,
    testimonialsCount,
    partnersCount,
    articlesCount,
    faqsCount,
    inquiriesCount: inquiries.total,
    newInquiriesCount: inquiries.newCount,
    recentInquiries: inquiries.recent,
  };
}
