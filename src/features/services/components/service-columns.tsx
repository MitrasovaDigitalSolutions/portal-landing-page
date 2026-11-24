"use client";

import { Layers } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ServiceItem, ServiceType } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

const PRICE_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function formatServicePrice(price: number | null): string | null {
  if (price === null || !Number.isFinite(price)) {
    return null;
  }
  return PRICE_FORMATTER.format(price);
}

export function buildServiceColumns(
  types: ServiceType[]
): DataTableColumnDef<ServiceItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Layanan",
      cell: ({ row }) => {
        const item = row.original;
        const thumbUrl = resolveMediaUrl(
          item.thumbnail_url ?? item.thumbnail_path
        );
        return (
          <div className="flex max-w-md items-center gap-3">
            {thumbUrl ? (
              <SmartImage
                src={thumbUrl}
                alt={item.name}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Layers className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="line-clamp-1 text-[11px] text-slate-500">
                {item.short_desc}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "service_type",
      accessorFn: (row) => row.service_type?.name ?? "-",
      header: "Tipe Layanan",
      cell: ({ row }) => {
        const typeName =
          row.original.service_type?.name ??
          types.find((t) => t.id === row.original.service_type_id)?.name ??
          "—";
        return <Badge variant="secondary">{typeName}</Badge>;
      },
    },
    {
      accessorKey: "price",
      header: "Harga",
      meta: { cellClassName: "tabular-nums whitespace-nowrap" },
      cell: ({ row }) => {
        const formatted = formatServicePrice(row.original.price);
        if (!formatted) {
          return <span className="text-slate-400">—</span>;
        }
        return (
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-slate-900">{formatted}</span>
            {row.original.price_note ? (
              <span className="text-[11px] text-slate-500">
                {row.original.price_note}
              </span>
            ) : null}
          </div>
        );
      },
    },
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
      id: "featured",
      accessorFn: (row) => (row.is_featured ? "unggulan" : "standar"),
      header: "Highlight",
      cell: ({ row }) =>
        row.original.is_featured ? (
          <StatusBadge status="featured" showDot={false} />
        ) : (
          <span className="text-[11px] text-slate-400">Standar</span>
        ),
    },
    {
      id: "status",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_active ? "active" : "inactive"} />
      ),
    },
  ];
}
