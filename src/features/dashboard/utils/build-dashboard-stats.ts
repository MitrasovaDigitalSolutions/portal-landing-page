import {
  Briefcase,
  Building,
  FileText,
  type LucideIcon,
  Star,
} from "lucide-react";
import { isTenantModuleActive, type TenantModulesState } from "@/config/modules";
import type { TenantDashboardOverview } from "@/features/dashboard/types/dashboard.types";

export interface DashboardStatItem {
  label: string;
  value: string;
  sublabel: string;
  icon: LucideIcon;
  href: string;
  disabled: boolean;
}

export function buildDashboardStats(
  overview: TenantDashboardOverview,
  modules: TenantModulesState
): DashboardStatItem[] {
  return [
    {
      label: "Katalog & Portofolio",
      value: `${overview.servicesCount} Layanan`,
      sublabel: `${overview.featuredServicesCount} unggulan • ${overview.portfoliosCount} portofolio`,
      icon: Briefcase,
      href: "/services",
      disabled: !isTenantModuleActive(modules, "services"),
    },
    {
      label: "Publikasi & Edukasi",
      value: `${overview.articlesCount} Artikel`,
      sublabel: `${overview.publishedArticlesCount} terbit • ${overview.faqsCount} FAQ`,
      icon: FileText,
      href: "/articles",
      disabled: !isTenantModuleActive(modules, "news"),
    },
    {
      label: "Kredibilitas & Kemitraan",
      value: `${overview.testimonialsCount + overview.partnersCount} Entri`,
      sublabel: `${overview.testimonialsCount} testimoni • ${overview.partnersCount} partner`,
      icon: Star,
      href: "/showcase",
      disabled: false,
    },
    {
      label: "Organisasi & Jaringan",
      value: `${overview.branchesCount} Cabang`,
      sublabel: `${overview.businessUnitsCount} unit usaha • ${overview.pagesCount} halaman`,
      icon: Building,
      href: "/branches",
      disabled: !isTenantModuleActive(modules, "branches"),
    },
  ];
}
