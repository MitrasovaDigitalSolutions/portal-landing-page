"use client";

import { ChevronDown, Loader2, LogOut, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { logoutPortalAction } from "@/lib/auth/auth-actions";
import { useTenant } from "@/providers/tenant-provider";

interface PortalUserMenuProps {
  userName: string;
  userEmail: string;
  isSuperadmin: boolean;
}

export function PortalUserMenu({
  userName,
  userEmail,
  isSuperadmin,
}: PortalUserMenuProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const roleLabel = isSuperadmin
    ? "Superadmin"
    : (activeSite?.role ?? "member");

  const handleLogout = (): void => {
    startTransition(async () => {
      await logoutPortalAction();
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-9 gap-2 rounded-xl px-2 text-xs hover:bg-slate-100"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">
            {initials || "AD"}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[130px] truncate font-semibold text-slate-700 sm:inline">
          {userName}
        </span>
        <ChevronDown className="size-3.5 text-slate-400" />
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-2">
        <div className="border-b border-slate-100 px-2.5 py-2">
          <p className="truncate text-xs font-bold text-slate-900">
            {userName}
          </p>
          <p className="truncate text-[11px] text-slate-500">{userEmail}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <Badge variant="secondary" className="gap-1 text-[10px] capitalize">
              <ShieldCheck className="size-3 text-primary" />
              <span>{roleLabel}</span>
            </Badge>
          </div>
        </div>

        {isSuperadmin ? (
          <div className="space-y-0.5 border-b border-slate-100 py-1.5">
            <Link
              href="/users"
              onClick={() => {
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100"
            >
              <Network className="size-3.5 text-slate-500" />
              <span>Situs & Pengguna</span>
            </Link>
          </div>
        ) : null}

        <div className="pt-1.5">
          <button
            type="button"
            disabled={isPending}
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <LogOut className="size-3.5" />
            )}
            <span>{isPending ? "Keluar..." : "Keluar dari Portal"}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
