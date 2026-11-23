"use client";

import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type { ServiceType } from "@/types/cms.types";

export function buildServiceTypeColumns(): DataTableColumnDef<ServiceType>[] {
  return [
    {
      accessorKey: "order",
      header: "Urutan",
      meta: { headerClassName: "w-24", cellClassName: "tabular-nums" },
      cell: ({ row }) => (
        <span className="font-semibold text-slate-600">
          #{row.original.order}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Nama Tipe Layanan",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-semibold text-slate-900">{row.original.name}</p>
          {row.original.description ? (
            <p className="line-clamp-1 text-[11px] text-slate-500">
              {row.original.description}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ row }) => (
        <code className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
          {row.original.slug}
        </code>
      ),
    },
    {
      id: "services_count",
      accessorFn: (row) => row.services_count ?? 0,
      header: "Layanan Terhubung",
      cell: ({ row }) => (
        <Badge variant="info" className="tabular-nums">
          {row.original.services_count ?? 0} layanan
        </Badge>
      ),
    },
  ];
}
