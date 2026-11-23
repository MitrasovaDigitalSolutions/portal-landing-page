"use client";

import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
        isSelected
          ? "bg-primary/10 text-primary"
          : "text-slate-700 hover:bg-slate-100"
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{site.name}</span>
        <span className="block truncate text-[10px] text-slate-400">
          /{site.slug}
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1.5">
        <Badge
          variant="secondary"
          className="px-1.5 py-0 text-[10px] capitalize"
        >
          {site.role}
        </Badge>
        {isSelected ? <Check className="size-3.5 shrink-0" /> : null}
      </span>
    </button>
  );
}
