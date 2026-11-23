"use client";

import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ManagedUser } from "@/features/tenants/types/tenants.types";

export function buildUserColumns(): DataTableColumnDef<ManagedUser>[] {
  return [
    {
      accessorKey: "name",
      header: "Pengguna Admin",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {item.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {item.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "level",
      accessorFn: (row) => (row.is_superadmin ? "Superadmin" : "Admin Site"),
      header: "Level Akses",
      cell: ({ row }) =>
        row.original.is_superadmin ? (
          <StatusBadge
            status="superadmin"
            label="Superadmin"
            showDot={false}
          />
        ) : (
          <StatusBadge status="admin" label="Admin Site" showDot={false} />
        ),
    },
    {
      id: "sites",
      header: "Tenant yang Dikelola",
      enableSorting: false,
      cell: ({ row }) => {
        const item = row.original;
        if (item.is_superadmin) {
          return (
            <Badge variant="purple" className="text-[11px]">
              Seluruh Tenant
            </Badge>
          );
        }

        const assigned = item.sites ?? [];
        if (assigned.length === 0) {
          return (
            <span className="text-[11px] text-slate-400">
              Belum ada penugasan tenant
            </span>
          );
        }

        return (
          <div className="flex flex-wrap gap-1.5">
            {assigned.map((site) => (
              <Badge key={site.id} variant="secondary">
                {site.name} ({site.pivot?.role ?? site.role ?? "admin"})
              </Badge>
            ))}
          </div>
        );
      },
    },
  ];
}
