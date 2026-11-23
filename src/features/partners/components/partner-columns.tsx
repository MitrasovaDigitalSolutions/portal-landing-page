"use client";

import { Building2, ExternalLink } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type { PartnerItem } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

export function buildPartnerColumns(): DataTableColumnDef<PartnerItem>[] {
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
      header: "Mitra / Partner",
      cell: ({ row }) => {
        const item = row.original;
        const logoUrl = resolveMediaUrl(item.logo_url ?? item.logo_path);
        return (
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5">
                <SmartImage
                  src={logoUrl}
                  alt={item.name}
                  width={36}
                  height={36}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                <Building2 className="size-4" />
              </div>
            )}
            <span className="font-semibold text-slate-900">{item.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "website_url",
      header: "Website",
      cell: ({ row }) => {
        const url = row.original.website_url;
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
            <span className="max-w-52 truncate">{url}</span>
            <ExternalLink className="size-3 shrink-0" />
          </a>
        );
      },
    },
  ];
}
