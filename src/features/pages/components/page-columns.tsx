"use client";

import { FileText, Home, Layers, Lock } from "lucide-react";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PageSummary } from "@/types/cms.types";

function getSectionsCount(page: PageSummary): number {
  if (typeof page.sections_count === "number") {
    return page.sections_count;
  }
  return Array.isArray(page.sections) ? page.sections.length : 0;
}

export function buildPageColumns(
  onManageSections: (page: PageSummary) => void
): DataTableColumnDef<PageSummary>[] {
  return [
    {
      accessorKey: "title",
      header: "Halaman",
      cell: ({ row }) => {
        const page = row.original;
        const subtitle =
          page.meta_desc ?? page.meta_title ?? "Metadata SEO belum diatur";
        return (
          <div className="flex max-w-md items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-primary">
              {page.slug === "home" ? (
                <Home className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {page.title}
              </p>
              <p className="truncate text-[11px] text-slate-500">{subtitle}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "slug",
      header: "Slug / Route",
      meta: { headerClassName: "w-44" },
      cell: ({ row }) => {
        const page = row.original;
        const isHome = page.slug === "home";
        const routeLabel = isHome ? "/" : `/${page.slug}`;
        return (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-slate-700">
            {isHome ? <Lock className="size-3 text-slate-400" /> : null}
            <span>{routeLabel}</span>
          </span>
        );
      },
    },
    {
      id: "sections_count",
      accessorFn: (row) => getSectionsCount(row),
      header: "Section",
      meta: { headerClassName: "w-36" },
      cell: ({ row }) => {
        const count = getSectionsCount(row.original);
        return (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onManageSections(row.original);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <Layers className="size-3.5 text-primary" />
            <span>{count} section</span>
          </button>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => (row.is_active ? "active" : "inactive"),
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.is_active ? "active" : "inactive"}
        />
      ),
    },
  ];
}
