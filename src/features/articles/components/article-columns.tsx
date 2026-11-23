"use client";

import { Newspaper } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { ArticleCategory, ArticleItem } from "@/types/cms.types";
import { formatDateId } from "@/utils/format-date";
import { resolveMediaUrl } from "@/utils/media";

export function buildArticleColumns(
  categories: ArticleCategory[]
): DataTableColumnDef<ArticleItem>[] {
  return [
    {
      accessorKey: "title",
      header: "Artikel",
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
                <Newspaper className="size-4" />
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {item.title}
              </p>
              {item.excerpt ? (
                <p className="line-clamp-1 text-[11px] text-slate-500">
                  {item.excerpt}
                </p>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "Umum",
      header: "Kategori",
      cell: ({ row }) => {
        const catName =
          row.original.category?.name ??
          categories.find((c) => c.id === row.original.article_category_id)
            ?.name ??
          "Umum";
        return <Badge variant="secondary">{catName}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "published_at",
      header: "Terbit",
      meta: { cellClassName: "whitespace-nowrap text-slate-500" },
      cell: ({ row }) => (
        <span>
          {row.original.published_at
            ? formatDateId(row.original.published_at)
            : "—"}
        </span>
      ),
    },
  ];
}
