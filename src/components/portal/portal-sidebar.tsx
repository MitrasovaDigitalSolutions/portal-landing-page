"use client";

import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PortalMobileSidebar } from "@/components/portal/portal-mobile-sidebar";
import { PortalNavList } from "@/components/portal/portal-nav-list";
import { Scrollable } from "@/components/ui/scrollable";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";
import { useTenant } from "@/providers/tenant-provider";
import { useSidebarStore } from "@/stores/sidebar-store";

export function PortalSidebar(): React.JSX.Element {
  const { activeSite } = useTenant();
  const { isCollapsed, toggle } = useSidebarStore();

  const brandName = activeSite?.name ?? env.NEXT_PUBLIC_APP_NAME;

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 md:flex",
          isCollapsed ? "w-[70px]" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-slate-100",
            isCollapsed ? "justify-center px-2" : "justify-between px-4"
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
              <Building2 className="size-4" />
            </span>
            {isCollapsed ? null : (
              <span className="min-w-0">
                <span className="block truncate text-xs font-extrabold tracking-tight text-slate-900">
                  {brandName}
                </span>
                <span className="block truncate text-[10px] font-medium text-slate-400">
                  {activeSite ? `/${activeSite.slug}` : "Multi-Tenant CMS"}
                </span>
              </span>
            )}
          </Link>

          {!isCollapsed ? (
            <button
              type="button"
              onClick={toggle}
              aria-label="Perkecil sidebar"
              className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronLeft className="size-4" />
            </button>
          ) : null}
        </div>

        {isCollapsed ? (
          <div className="flex justify-center border-b border-slate-100 py-2">
            <button
              type="button"
              onClick={toggle}
              aria-label="Perluas sidebar"
              className="flex size-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        ) : null}

        <Scrollable className="flex-1">
          <PortalNavList rail={isCollapsed} />
        </Scrollable>
      </aside>

      <PortalMobileSidebar brandName={brandName} />
    </>
  );
}
