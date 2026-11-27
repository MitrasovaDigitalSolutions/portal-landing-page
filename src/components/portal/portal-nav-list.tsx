"use client";

import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PortalNavLink } from "@/components/portal/portal-nav-link";
import { isTenantModuleActive } from "@/config/modules";
import {
  getPortalNavGroups,
  isNavItemActive,
} from "@/config/navigation";
import { cn } from "@/lib/utils";
import { useTenant } from "@/providers/tenant-provider";

interface PortalNavListProps {
  rail?: boolean;
  onNavigate?: () => void;
}

export function PortalNavList({
  rail = false,
  onNavigate,
}: PortalNavListProps): React.JSX.Element {
  const pathname = usePathname();
  const { isSuperadmin, activeSite, modules } = useTenant();
  const groups = getPortalNavGroups({
    isSuperadmin,
    hasActiveSite: activeSite !== null,
  });
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});

  return (
    <nav className={cn("p-2.5", rail ? "space-y-1" : "space-y-2")}>
      {groups.map((group, groupIdx) => {
        const isOpen =
          group.label === null || (overrides[group.key] ?? true);
        const showItems = rail || isOpen;

        return (
          <div
            key={group.key}
            className={cn(
              rail && groupIdx > 0 && "border-t border-slate-100 pt-1"
            )}
          >
            {group.label !== null && !rail ? (
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => {
                  setOverrides((prev) => ({
                    ...prev,
                    [group.key]: !(prev[group.key] ?? true),
                  }));
                }}
                className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase transition-colors hover:text-slate-600"
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "size-3.5 transition-transform duration-150",
                    !isOpen && "-rotate-90"
                  )}
                />
              </button>
            ) : null}

            {showItems ? (
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <PortalNavLink
                    key={item.href}
                    item={item}
                    rail={rail}
                    active={isNavItemActive(pathname, item.href)}
                    moduleActive={isTenantModuleActive(modules, item.moduleKey)}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
