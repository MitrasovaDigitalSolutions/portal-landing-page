import {
  Briefcase,
  Building2,
  FolderKanban,
  Handshake,
  HelpCircle,
  Layers,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquareQuote,
  Newspaper,
} from "lucide-react";
import { isTenantModuleActive, type TenantModulesState } from "@/config/modules";
import type { TenantDashboardOverview } from "@/features/dashboard/types/dashboard.types";

export interface DashboardStatItem {
  label: string;
  value: number | string;
  sublabel?: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  disabled: boolean;
}

export function buildDashboardStats(
  overview: TenantDashboardOverview,
  modules: TenantModulesState
): DashboardStatItem[] {
  return [
    {
      label: "Layanan / Produk",
      value: overview.servicesCount,
      icon: Briefcase,
      href: "/services",
      disabled: !isTenantModuleActive(modules, "services"),
    },
    {
      label: "Portofolio",
      value: overview.portfoliosCount,
      icon: FolderKanban,
      href: "/portfolios",
      disabled: !isTenantModuleActive(modules, "portfolios"),
    },
    {
      label: "Berita & Artikel",
      value: overview.articlesCount,
      icon: Newspaper,
      href: "/articles",
      disabled: !isTenantModuleActive(modules, "news"),
    },
    {
      label: "Unit Bisnis",
      value: overview.businessUnitsCount,
      icon: Building2,
      href: "/business-units",
      disabled: !isTenantModuleActive(modules, "business_units"),
    },
    {
      label: "Kantor Cabang",
      value: overview.branchesCount,
      icon: MapPin,
      href: "/branches",
      disabled: !isTenantModuleActive(modules, "branches"),
    },
    {
      label: "Halaman & Seksi",
      value: overview.pagesCount,
      icon: Layers,
      href: "/pages",
      disabled: false,
    },
    {
      label: "Testimoni & Partner",
      value: `${overview.testimonialsCount} / ${overview.partnersCount}`,
      sublabel: "Testimoni & Mitra",
      icon: MessageSquareQuote,
      href: "/testimonials",
      disabled: false,
    },
    {
      label: "FAQ & Bantuan",
      value: overview.faqsCount,
      icon: HelpCircle,
      href: "/faqs",
      disabled: false,
    },
    {
      label: "Pesan Masuk",
      value: overview.inquiriesCount,
      badge:
        overview.newInquiriesCount > 0
          ? `${overview.newInquiriesCount} Baru`
          : undefined,
      icon: Mail,
      href: "/inquiries",
      disabled: !isTenantModuleActive(modules, "contact"),
    },
    {
      label: "Mitra / Partner",
      value: overview.partnersCount,
      icon: Handshake,
      href: "/partners",
      disabled: false,
    },
  ];
}
