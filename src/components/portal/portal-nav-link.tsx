"use client";

import Link from "next/link";
import type { PortalNavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface PortalNavLinkProps {
  item: PortalNavItem;
  active: boolean;
  rail: boolean;
  moduleActive: boolean;
  onNavigate?: () => void;
}

export function PortalNavLink({
  item,
  active,
  rail,
  moduleActive,
  onNavigate,
}: PortalNavLinkProps): React.JSX.Element {
  const Icon = item.icon;
  const linkTitle = rail ? item.label : undefined;

  return (
    <Link
      href={item.href}
      title={linkTitle}
      onClick={onNavigate}
      className={cn(
        "flex items-center rounded-lg text-xs font-semibold transition-colors",
        rail ? "relative justify-center p-2.5" : "justify-between gap-2 px-3 py-2",
        active
          ? "bg-primary text-primary-foreground shadow-2xs"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <Icon className="size-4 shrink-0" />
        {rail ? null : <span className="truncate">{item.label}</span>}
      </span>

      {!rail && !moduleActive ? (
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase",
            active
              ? "bg-white/20 text-white"
              : "bg-amber-100 text-amber-700"
          )}
        >
          Off
        </span>
      ) : null}

      {rail && !moduleActive ? (
        <span
          aria-label="Modul nonaktif"
          className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-amber-500"
        />
      ) : null}
    </Link>
  );
}
