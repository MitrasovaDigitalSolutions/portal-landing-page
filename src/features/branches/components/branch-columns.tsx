"use client";

import { Building, Image as ImageIcon, MapPin, MessageCircle, Phone } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { BranchItem } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

export function buildBranchColumns(): DataTableColumnDef<BranchItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Kantor / Cabang",
      cell: ({ row }) => {
        const item = row.original;
        const thumb = resolveMediaUrl(item.image_urls?.[0] ?? item.images?.[0]);
        return (
          <div className="flex max-w-md items-center gap-3">
            {thumb ? (
              <SmartImage
                src={thumb}
                alt={item.name}
                width={40}
                height={40}
                className="size-10 shrink-0 rounded-xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Building className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="flex items-center gap-1 truncate text-[11px] text-slate-500">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{item.address}</span>
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Kontak",
      cell: ({ row }) => {
        const { phone, whatsapp } = row.original;
        if (!phone && !whatsapp) {
          return <span className="text-slate-400">—</span>;
        }
        return (
          <div className="space-y-0.5 text-xs">
            {whatsapp ? (
              <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                <MessageCircle className="size-3.5 shrink-0 text-emerald-600" />
                {whatsapp}
              </span>
            ) : null}
            {phone ? (
              <span className="flex items-center gap-1.5 text-slate-700">
                <Phone className="size-3.5 shrink-0 text-slate-400" />
                {phone}
              </span>
            ) : null}
          </div>
        );
      },
    },
    {
      id: "type",
      accessorFn: (row) => (row.is_primary ? "pusat" : "cabang"),
      header: "Jenis",
      cell: ({ row }) =>
        row.original.is_primary ? (
          <StatusBadge status="featured" label="Kantor Pusat" showDot={false} />
        ) : (
          <Badge variant="secondary">Cabang</Badge>
        ),
    },
    {
      id: "photos",
      accessorFn: (row) => row.image_urls?.length ?? 0,
      header: "Foto",
      cell: ({ row }) => (
        <Badge variant="info" className="gap-1 tabular-nums">
          <ImageIcon className="size-3" />
          {row.original.image_urls?.length ?? 0}
        </Badge>
      ),
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
  ];
}
