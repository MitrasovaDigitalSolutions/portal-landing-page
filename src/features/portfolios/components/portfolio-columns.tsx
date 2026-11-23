"use client";

import { Briefcase } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PortfolioItem, ServiceType } from "@/types/cms.types";
import { formatDateId } from "@/utils/format-date";
import { resolveMediaUrl } from "@/utils/media";

export function buildPortfolioColumns(
  types: ServiceType[]
): DataTableColumnDef<PortfolioItem>[] {
  return [
    {
      accessorKey: "title",
      header: "Proyek",
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
                alt={item.title}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Briefcase className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.title}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {item.client_name ?? "Klien Internal"}
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
        const name =
          row.original.service_type?.name ??
          types.find((t) => t.id === row.original.service_type_id)?.name ??
          "—";
        return <Badge variant="secondary">{name}</Badge>;
      },
    },
    {
      accessorKey: "completion_date",
      header: "Selesai",
      meta: { cellClassName: "whitespace-nowrap text-slate-500" },
      cell: ({ row }) => (
        <span>
          {row.original.completion_date
            ? formatDateId(row.original.completion_date)
            : "—"}
        </span>
      ),
    },
    {
      id: "featured",
      accessorFn: (row) => (row.is_featured ? "featured" : "normal"),
      header: "Sorotan",
      cell: ({ row }) =>
        row.original.is_featured ? (
          <StatusBadge status="featured" showDot={false} />
        ) : (
          <span className="text-[11px] text-slate-400">Standar</span>
        ),
    },
  ];
}
