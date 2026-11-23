"use client";

import { Mail, Phone } from "lucide-react";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { InquiryItem } from "@/types/cms.types";
import { formatDateId } from "@/utils/format-date";

export function buildInquiryColumns(): DataTableColumnDef<InquiryItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Pengirim",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-900">{item.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Phone className="size-3" />
                {item.phone}
              </span>
              {item.email ? (
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3" />
                  {item.email}
                </span>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Subjek & Pesan",
      cell: ({ row }) => (
        <div className="max-w-md space-y-0.5">
          <p className="truncate font-semibold text-slate-800">
            {row.original.subject ?? "Konsultasi Layanan"}
          </p>
          <p className="line-clamp-1 text-[11px] text-slate-500">
            {row.original.message}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "created_at",
      header: "Tanggal Masuk",
      meta: { cellClassName: "whitespace-nowrap text-slate-500" },
      cell: ({ row }) => <span>{formatDateId(row.original.created_at)}</span>,
    },
  ];
}
