"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Building2, ChevronsUpDown, Globe, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { TenantSwitcherItem } from "@/components/portal/tenant-switcher-item";
import { TenantSwitcherSearch } from "@/components/portal/tenant-switcher-search";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Scrollable } from "@/components/ui/scrollable";
import { switchActiveSiteAction } from "@/lib/tenant/tenant.actions";
import { useTenant } from "@/providers/tenant-provider";
import type { AuthSiteSummary } from "@/types/auth.types";

export function TenantSwitcher(): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { activeSite, availableSites, isSuperadmin } = useTenant();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  if (availableSites.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-500">
        <Building2 className="size-3.5 shrink-0" />
        <span>Belum ada tenant</span>
        {isSuperadmin ? (
          <Link
            href="/users?tab=sites"
            className="font-semibold text-primary hover:underline"
          >
            Kelola
          </Link>
        ) : null}
      </div>
    );
  }

  const normalizedQuery = search.trim().toLowerCase();
  const filteredSites = normalizedQuery
    ? availableSites.filter(
        (site) =>
          site.name.toLowerCase().includes(normalizedQuery) ||
          site.slug.toLowerCase().includes(normalizedQuery)
      )
    : availableSites;

  const handleSelect = (site: AuthSiteSummary): void => {
    if (site.slug === activeSite?.slug) {
      setOpen(false);
      return;
    }

    startTransition(async () => {
      const result = await switchActiveSiteAction(site.slug);
      if (!result.success) {
        toast.error(result.message);
        return;
      }

      setOpen(false);
      setSearch("");
      await queryClient.invalidateQueries();
      router.refresh();
      toast.success(result.message ?? `Beralih ke ${site.name}`);
    });
  };

  const handleOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            className="h-8 max-w-[230px] justify-between gap-2 rounded-lg border-slate-200 bg-white px-2 text-xs shadow-2xs hover:bg-slate-50"
          />
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            {isPending ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Building2 className="size-3" />
            )}
          </span>
          <span className="truncate font-semibold text-slate-800">
            {activeSite?.name ?? "Pilih Tenant"}
          </span>
        </span>
        <ChevronsUpDown className="size-3.5 shrink-0 text-slate-400" />
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 overflow-hidden p-0">
        {availableSites.length > 4 ? (
          <TenantSwitcherSearch value={search} onChange={setSearch} />
        ) : (
          <div className="flex items-center justify-between border-b border-slate-100 px-2.5 py-1.5">
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Pilih Tenant
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              {availableSites.length}
            </span>
          </div>
        )}

        <Scrollable className="max-h-52">
          <div className="space-y-0.5 p-1">
            {filteredSites.length === 0 ? (
              <p className="py-4 text-center text-[11px] text-slate-400">
                Tenant tidak ditemukan.
              </p>
            ) : (
              filteredSites.map((site) => (
                <TenantSwitcherItem
                  key={site.id}
                  site={site}
                  isSelected={site.slug === activeSite?.slug}
                  disabled={isPending}
                  onSelect={handleSelect}
                />
              ))
            )}
          </div>
        </Scrollable>

        {isSuperadmin ? (
          <div className="border-t border-slate-100 p-1">
            <Link
              href="/users?tab=sites"
              onClick={() => {
                setOpen(false);
              }}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary"
            >
              <Globe className="size-3.5 text-primary" />
              <span>Kelola Semua Tenant</span>
            </Link>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
