"use client";

import { ExternalLink, Image as ImageIcon, Store } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type { BusinessUnitItem } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

export function buildBusinessUnitColumns(): DataTableColumnDef<BusinessUnitItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Unit Bisnis",
      cell: ({ row }) => {
        const item = row.original;
        const thumb = resolveMediaUrl(item.image_url ?? item.image_path);
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
                <Store className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="line-clamp-1 text-[11px] text-slate-500">
                {item.address ?? "Alamat belum diisi"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "url",
      header: "Website",
      cell: ({ row }) => {
        const url = row.original.url;
        if (!url) {
          return <span className="text-slate-400">—</span>;
        }
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              event.stopPropagation();
            }}
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <span className="max-w-48 truncate">{url}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        );
      },
    },
    {
      id: "gallery",
      accessorFn: (row) => row.image_urls?.length ?? 0,
      header: "Galeri",
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
