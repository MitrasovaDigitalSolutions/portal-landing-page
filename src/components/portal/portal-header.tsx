"use client";

import { Menu } from "lucide-react";
import { PortalUserMenu } from "@/components/portal/portal-user-menu";
import { TenantSwitcher } from "@/components/portal/tenant-switcher";
import { Button } from "@/components/ui/button";
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

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={toggleMobile}
          aria-label="Menu Admin"
          className="rounded-lg border-slate-200 lg:hidden"
        >
          <Menu className="size-4" />
        </Button>

        <TenantSwitcher />
      </div>

      <PortalUserMenu
        userName={userName}
        userEmail={userEmail}
        isSuperadmin={isSuperadmin}
      />
    </header>
  );
}
