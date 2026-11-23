"use client";

import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type { FaqCategory } from "@/types/cms.types";

export function buildFaqCategoryColumns(): DataTableColumnDef<FaqCategory>[] {
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
      header: "Nama Kategori FAQ",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">
          {row.original.name}
        </span>
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
      id: "faqs_count",
      accessorFn: (row) => row.faqs?.length ?? 0,
      header: "Jumlah FAQ",
      cell: ({ row }) => (
        <Badge variant="info" className="tabular-nums">
          {row.original.faqs?.length ?? 0} item
        </Badge>
      ),
    },
  ];
}
