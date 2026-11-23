"use client";

import { Building2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ManagedSite } from "@/features/tenants/types/tenants.types";

export function buildSiteColumns(): DataTableColumnDef<ManagedSite>[] {
  return [
    {
      accessorKey: "name",
      header: "Unit Usaha",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <code className="text-[11px] text-slate-500">/{item.slug}</code>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "domain",
      header: "Domain",
      cell: ({ row }) => {
        const domain = row.original.domain;
        if (!domain) {
          return <span className="text-slate-400">—</span>;
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-700">
            <Globe className="size-3.5 text-slate-400" />
            <span>{domain}</span>
          </span>
        );
      },
    },
    {
      id: "stats",
      header: "Ringkasan Data",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="info" className="tabular-nums">
            {row.original.users_count ?? 0} admin
          </Badge>
          <Badge variant="secondary" className="tabular-nums">
            {row.original.services_count ?? 0} layanan
          </Badge>
          <Badge variant="secondary" className="tabular-nums">
            {row.original.articles_count ?? 0} artikel
          </Badge>
        </div>
      ),
    },
    {
      id: "status",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.is_active ? "active" : "inactive"}
        />
      ),
    },
  ];
}
