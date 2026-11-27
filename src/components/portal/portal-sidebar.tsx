"use client";

import { ChevronsLeft, ChevronsRight, Landmark } from "lucide-react";
import Link from "next/link";
import { PortalMobileSidebar } from "@/components/portal/portal-mobile-sidebar";
import { PortalNavList } from "@/components/portal/portal-nav-list";
import { Scrollable } from "@/components/ui/scrollable";
import { cn } from "@/lib/utils";
import { useTenant } from "@/providers/tenant-provider";
import { useSidebarStore } from "@/stores/sidebar-store";

export function PortalSidebar(): React.JSX.Element {
  const { activeSite } = useTenant();
  const { isCollapsed, toggle } = useSidebarStore();

  const subtitle = activeSite ? `/${activeSite.slug}` : "Enterprise Console";

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-200 lg:flex",
          isCollapsed ? "w-16" : "w-60"
        )}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? "Perluas Sidebar" : "Ciutkan Sidebar"}
          title={isCollapsed ? "Perluas Menu" : "Sembunyikan Menu"}
          className="absolute top-2 -right-4 z-40 hidden h-12 w-4 cursor-pointer items-center justify-center rounded-r-lg border border-l-0 border-slate-200 bg-white text-slate-500 shadow-xs transition-all outline-none hover:bg-slate-50 hover:text-primary lg:flex"
        >
          {isCollapsed ? (
            <ChevronsRight className="size-3 stroke-[2.75]" />
          ) : (
            <ChevronsLeft className="size-3 stroke-[2.75]" />
          )}
        </button>

        <div
          className={cn(
            "flex h-14 items-center border-b border-slate-100",
            isCollapsed ? "justify-center px-2" : "px-4"
          )}
        >
          <Link
            href="/"
            className={cn(
              "flex min-w-0 items-center gap-2.5",
              isCollapsed && "justify-center"
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-2xs">
              <Landmark className="size-4" />
            </span>
            {isCollapsed ? null : (
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold tracking-tight text-slate-900">
                  Mitrasova CMS
                </span>
                <span className="block truncate text-[10px] font-medium text-slate-500">
                  {subtitle}
                </span>
              </span>
            )}
          </Link>
        </div>

        <Scrollable className="min-h-0 flex-1">
          <PortalNavList rail={isCollapsed} />
        </Scrollable>
      </aside>

      <PortalMobileSidebar brandName="Mitrasova CMS" />
    </>
  );
}
