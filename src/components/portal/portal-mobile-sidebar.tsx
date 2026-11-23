"use client";

import { ShieldCheck } from "lucide-react";
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
      <SheetContent side="left" className="w-72 gap-0 bg-white p-0">
        <SheetHeader className="border-b border-slate-100 px-4 py-3.5">
          <SheetTitle className="flex items-center gap-2.5 text-left text-sm font-bold text-slate-900">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
              <ShieldCheck className="size-4" />
            </span>
            <span className="truncate">{brandName}</span>
          </SheetTitle>
        </SheetHeader>
        <Scrollable className="flex-1">
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
