"use client";

import { Star } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { TestimonialItem } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

export function buildTestimonialColumns(): DataTableColumnDef<TestimonialItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Klien",
      cell: ({ row }) => {
        const item = row.original;
        const avatarUrl = resolveMediaUrl(item.avatar_url ?? item.avatar_path);
        return (
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <SmartImage
                src={avatarUrl}
                alt={item.name}
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {item.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.name}
              </p>
              <p className="truncate text-[11px] text-slate-500">
                {item.title ?? "Klien"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Kutipan Ulasan",
      cell: ({ row }) => (
        <div className="max-w-sm">
          <p className="line-clamp-1 text-slate-600">
            &ldquo;{row.original.message}&rdquo;
          </p>
        </div>
      ),
    },
    {
      id: "evidence",
      header: "Bukti",
      cell: ({ row }) => {
        const proofUrl = resolveMediaUrl(
          row.original.image_url ?? row.original.image_path
        );
        if (!proofUrl) {
          return <span className="text-slate-400">—</span>;
        }
        return (
          <SmartImage
            src={proofUrl}
            alt={`Bukti ${row.original.name}`}
            width={40}
            height={40}
            className="size-10 rounded-lg border border-slate-200 object-cover"
          />
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <Badge variant="warning" className="gap-1 tabular-nums">
          <Star className="size-3 fill-amber-500 text-amber-500" />
          <span>{row.original.rating}/5</span>
        </Badge>
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
