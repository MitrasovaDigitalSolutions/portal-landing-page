"use client";

import { Menu } from "lucide-react";
import { PortalUserMenu } from "@/components/portal/portal-user-menu";
import { TenantSwitcher } from "@/components/portal/tenant-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/providers/tenant-provider";
import { useSidebarStore } from "@/stores/sidebar-store";

interface PortalHeaderProps {
  userName: string;
  userEmail: string;
  isSuperadmin: boolean;
}

export function PortalHeader({
  userName,
  userEmail,
  isSuperadmin,
}: PortalHeaderProps): React.JSX.Element {
  const { toggleMobile } = useSidebarStore();
  const { activeSite } = useTenant();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleMobile}
          aria-label="Buka navigasi"
          className="md:hidden"
        >
          <Menu className="size-5" />
        </Button>

        <TenantSwitcher />

        {activeSite ? (
          <Badge
            variant="secondary"
            className="hidden capitalize sm:inline-flex"
          >
            Role: {isSuperadmin ? "superadmin" : activeSite.role}
          </Badge>
        ) : null}
      </div>

      <PortalUserMenu
        userName={userName}
        userEmail={userEmail}
        isSuperadmin={isSuperadmin}
      />
    </header>
  );
}
