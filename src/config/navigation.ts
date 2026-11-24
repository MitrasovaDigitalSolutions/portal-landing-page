import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building,
  FileText,
  FolderKanban,
  HelpCircle,
  Images,
  Inbox,
  Layers,
  LayoutDashboard,
  Network,
  Settings,
  Star,
  Store,
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
    key: "main",
    label: null,
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        scope: "global",
      },
      {
        label: "Pesan Masuk",
        href: "/inquiries",
        icon: Inbox,
        scope: "tenant",
        moduleKey: "contact",
      },
    ],
  },
  {
    key: "website",
    label: "Website",
    items: [
      {
        label: "Halaman",
        href: "/pages",
        icon: Layers,
        scope: "tenant",
      },
      {
        label: "Artikel & Berita",
        href: "/articles",
        icon: FileText,
        scope: "tenant",
        moduleKey: "news",
      },
      {
        label: "FAQ",
        href: "/faqs",
        icon: HelpCircle,
        scope: "tenant",
      },
      {
        label: "Testimoni & Mitra",
        href: "/showcase",
        icon: Star,
        scope: "tenant",
      },
      {
        label: "Galeri Media",
        href: "/media",
        icon: Images,
        scope: "tenant",
      },
    ],
  },
  {
    key: "business",
    label: "Business",
    items: [
      {
        label: "Produk & Layanan",
        href: "/services",
        icon: Briefcase,
        scope: "tenant",
        moduleKey: "services",
      },
      {
        label: "Portfolio",
        href: "/portfolios",
        icon: FolderKanban,
        scope: "tenant",
        moduleKey: "portfolios",
      },
    ],
  },
  {
    key: "organization",
    label: "Organization",
    items: [
      {
        label: "Kantor & Cabang",
        href: "/branches",
        icon: Building,
        scope: "tenant",
        moduleKey: "branches",
      },
      {
        label: "Unit Usaha",
        href: "/business-units",
        icon: Store,
        scope: "tenant",
        moduleKey: "business_units",
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    items: [
      {
        label: "Pengaturan Situs",
        href: "/settings",
        icon: Settings,
        scope: "tenant",
      },
      {
        label: "Situs & Pengguna",
        href: "/users",
        icon: Network,
        scope: "global",
        superadminOnly: true,
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
  const normalizedCurrent = pathname.replace(/\/+$/, "") || "/";
  const normalizedHref = href.replace(/\/+$/, "") || "/";

  if (normalizedHref === "/") {
    return normalizedCurrent === "/";
  }

  if (
    normalizedHref === "/showcase" &&
    (normalizedCurrent.startsWith("/testimonials") ||
      normalizedCurrent.startsWith("/partners"))
  ) {
    return true;
  }

  if (normalizedHref === "/users" && normalizedCurrent.startsWith("/sites")) {
    return true;
  }

  return (
    normalizedCurrent === normalizedHref ||
    normalizedCurrent.startsWith(`${normalizedHref}/`)
  );
}
