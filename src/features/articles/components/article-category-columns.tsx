"use client";

import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type { ArticleCategory } from "@/types/cms.types";

export function buildArticleCategoryColumns(): DataTableColumnDef<ArticleCategory>[] {
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
      header: "Nama Kategori",
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
      id: "articles_count",
      accessorFn: (row) => row.articles_count ?? 0,
      header: "Artikel",
      cell: ({ row }) => (
        <Badge variant="info" className="tabular-nums">
          {row.original.articles_count ?? 0} artikel
        </Badge>
      ),
    },
  ];
}
