"use client";

import { Badge } from "@/components/ui/badge";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { FaqCategory, FaqItem } from "@/types/cms.types";

export function buildFaqColumns(
  categories: FaqCategory[]
): DataTableColumnDef<FaqItem>[] {
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
      accessorKey: "question",
      header: "Pertanyaan & Jawaban",
      cell: ({ row }) => (
        <div className="max-w-lg space-y-0.5">
          <p className="line-clamp-1 font-semibold text-slate-900">
            {row.original.question}
          </p>
          <p className="line-clamp-1 text-[11px] text-slate-500">
            {row.original.answer}
          </p>
        </div>
      ),
    },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "Umum",
      header: "Kategori",
      cell: ({ row }) => {
        const catName =
          row.original.category?.name ??
          categories.find((c) => c.id === row.original.faq_category_id)?.name ??
          "Umum";
        return <Badge variant="secondary">{catName}</Badge>;
      },
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
