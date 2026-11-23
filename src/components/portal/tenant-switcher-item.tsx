"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthSiteSummary } from "@/types/auth.types";

interface TenantSwitcherItemProps {
  site: AuthSiteSummary;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (site: AuthSiteSummary) => void;
}

export function TenantSwitcherItem({
  site,
  isSelected,
  disabled,
  onSelect,
}: TenantSwitcherItemProps): React.JSX.Element {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        onSelect(site);
      }}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition-colors disabled:opacity-50",
        isSelected
          ? "bg-primary/8 text-primary"
          : "text-slate-700 hover:bg-slate-100/80"
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col">
        <span
          className={cn(
            "truncate text-xs leading-tight",
            isSelected ? "font-semibold" : "font-medium"
          )}
        >
          {site.name}
        </span>
        <span className="truncate text-[10px] leading-tight text-slate-400">
          /{site.slug}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1.5">
        <span
          className={cn(
            "inline-flex h-4 items-center rounded px-1.5 text-[10px] font-medium capitalize",
            isSelected
              ? "bg-primary/15 text-primary"
              : "bg-slate-100 text-slate-500"
          )}
        >
          {site.role}
        </span>
        <Check
          className={cn(
            "size-3.5 shrink-0 text-primary transition-opacity",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      </span>
    </button>
  );
}
