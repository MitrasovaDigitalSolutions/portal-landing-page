"use client";

import { Building2, Trash2 } from "lucide-react";
import { DataTableActionButton } from "@/components/ui/data-table-actions";
import { Scrollable } from "@/components/ui/scrollable";
import { StatusBadge } from "@/components/ui/status-badge";
import type { UserAssignedSite } from "@/features/tenants/types/tenants.types";

interface UserAssignedSitesListProps {
  sites: UserAssignedSite[];
  isBusy: boolean;
  onDetach: (siteId: string) => void;
}

export function UserAssignedSitesList({
  sites,
  isBusy,
  onDetach,
}: UserAssignedSitesListProps): React.JSX.Element {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-700">
        Tenant yang Dipegang Saat Ini ({sites.length})
      </p>
      {sites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-xs text-slate-400">
          Belum ditugaskan ke tenant mana pun.
        </div>
      ) : (
        <Scrollable className="max-h-44">
          <div className="space-y-2 pr-1">
            {sites.map((site) => {
              const role = site.pivot?.role ?? site.role ?? "admin";
              return (
                <div
                  key={site.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Building2 className="size-4 shrink-0 text-primary" />
                    <span className="truncate font-semibold text-slate-800">
                      {site.name}
                    </span>
                    <StatusBadge status={role} showDot={false} />
                  </div>
                  <DataTableActionButton
                    variant="delete"
                    label="Cabut Akses Tenant"
                    disabled={isBusy}
                    icon={<Trash2 className="size-4" />}
                    onClick={() => {
                      onDetach(site.id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </Scrollable>
      )}
    </div>
  );
}
