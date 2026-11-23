"use client";

import { Landmark } from "lucide-react";
import { PortalNavList } from "@/components/portal/portal-nav-list";
import { Scrollable } from "@/components/ui/scrollable";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSidebarStore } from "@/stores/sidebar-store";

interface PortalMobileSidebarProps {
  brandName: string;
}

export function PortalMobileSidebar({
  brandName,
}: PortalMobileSidebarProps): React.JSX.Element {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="flex w-60 flex-col gap-0 bg-white p-0">
        <SheetHeader className="flex h-14 flex-row items-center gap-2.5 border-b border-slate-100 px-4 text-left">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-white">
            <Landmark className="size-4" />
          </span>
          <SheetTitle className="truncate text-sm font-bold text-slate-900">
            {brandName}
          </SheetTitle>
        </SheetHeader>
        <Scrollable className="min-h-0 flex-1">
          <PortalNavList
            onNavigate={() => {
              setMobileOpen(false);
            }}
          />
        </Scrollable>
      </SheetContent>
    </Sheet>
  );
}
