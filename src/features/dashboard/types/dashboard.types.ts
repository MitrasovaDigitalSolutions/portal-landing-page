import type { TenantModulesState } from "@/config/modules";

export type RawSettingsMap = Record<string, Record<string, unknown>>;

export interface DashboardInquiryBrief {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  subject: string | null;
  status: string;
  created_at: string;
}

export interface TenantDashboardOverview {
  servicesCount: number;
  featuredServicesCount: number;
  portfoliosCount: number;
  businessUnitsCount: number;
  branchesCount: number;
  testimonialsCount: number;
  partnersCount: number;
  articlesCount: number;
  publishedArticlesCount: number;
  faqsCount: number;
  inquiriesCount: number;
  newInquiriesCount: number;
  pagesCount: number;
  recentInquiries: DashboardInquiryBrief[];
}

export interface PortalSiteSettingsSummary {
  siteTitle?: string;
  logoUrl?: string;
  modules: TenantModulesState;
  rawSettings: RawSettingsMap;
}
