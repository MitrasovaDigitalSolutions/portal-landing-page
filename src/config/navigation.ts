import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  FolderKanban,
  Globe,
  Handshake,
  HelpCircle,
  Layers,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import type { TenantModuleKey } from "@/config/modules";

export type NavScope = "global" | "tenant";

export interface PortalNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  scope: NavScope;
  moduleKey?: TenantModuleKey;
  superadminOnly?: boolean;
}

export interface PortalNavGroup {
  key: string;
  label: string | null;
  items: PortalNavItem[];
}

const PORTAL_NAV_GROUPS: readonly PortalNavGroup[] = [
  {
    key: "overview",
    label: null,
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        scope: "global",
      },
    ],
  },
  {
    key: "platform",
    label: "Platform Global",
    items: [
      {
        label: "Kelola Tenant",
        href: "/sites",
        icon: Globe,
        scope: "global",
        superadminOnly: true,
      },
      {
        label: "Manajemen User",
        href: "/users",
        icon: Users,
        scope: "global",
        superadminOnly: true,
      },
    ],
  },
  {
    key: "website",
    label: "Website & Tampilan",
    items: [
      {
        label: "Pengaturan Situs",
        href: "/settings",
        icon: Settings,
        scope: "tenant",
      },
      {
        label: "Halaman & Seksi",
        href: "/pages",
        icon: Layers,
        scope: "tenant",
      },
    ],
  },
  {
    key: "content",
    label: "Konten & Layanan",
    items: [
      {
        label: "Layanan / Produk",
        href: "/services",
        icon: Briefcase,
        scope: "tenant",
        moduleKey: "services",
      },
      {
        label: "Portofolio",
        href: "/portfolios",
        icon: FolderKanban,
        scope: "tenant",
        moduleKey: "portfolios",
      },
      {
        label: "Unit Bisnis",
        href: "/business-units",
        icon: Building2,
        scope: "tenant",
        moduleKey: "business_units",
      },
      {
        label: "Kantor Cabang",
        href: "/branches",
        icon: MapPin,
        scope: "tenant",
        moduleKey: "branches",
      },
      {
        label: "Testimoni",
        href: "/testimonials",
        icon: MessageSquareQuote,
        scope: "tenant",
      },
      {
        label: "Mitra / Partner",
        href: "/partners",
        icon: Handshake,
        scope: "tenant",
      },
    ],
  },
  {
    key: "engagement",
    label: "Publikasi & Interaksi",
    items: [
      {
        label: "Berita & Artikel",
        href: "/articles",
        icon: Newspaper,
        scope: "tenant",
        moduleKey: "news",
      },
      {
        label: "FAQ & Bantuan",
        href: "/faqs",
        icon: HelpCircle,
        scope: "tenant",
      },
      {
        label: "Pesan Masuk",
        href: "/inquiries",
        icon: Mail,
        scope: "tenant",
        moduleKey: "contact",
      },
    ],
  },
];

export interface PortalNavFilterOptions {
  isSuperadmin: boolean;
  hasActiveSite: boolean;
}

export function getPortalNavGroups({
  isSuperadmin,
  hasActiveSite,
}: PortalNavFilterOptions): PortalNavGroup[] {
  return PORTAL_NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.superadminOnly && !isSuperadmin) {
        return false;
      }
      if (item.scope === "tenant" && !hasActiveSite) {
        return false;
      }
      return true;
    }),
  })).filter((group) => group.items.length > 0);
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
