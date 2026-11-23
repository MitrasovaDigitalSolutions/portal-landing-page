"use client";

import { ArrowLeft, Edit2, Lock, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PageDetail } from "@/types/cms.types";

interface PageSectionsHeaderProps {
  page: PageDetail;
  onEditPage: () => void;
  onAddSection: () => void;
}

export function PageSectionsHeader({
  page,
  onEditPage,
  onAddSection,
}: PageSectionsHeaderProps): React.JSX.Element {
  return (
    <>
      <div className="space-y-3 border-b border-slate-200 pb-4">
        <Link
          href="/pages"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali ke Daftar Halaman</span>
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                {page.title}
              </h1>
              <Badge
                variant="secondary"
                className="gap-1 rounded-md font-mono text-[11px]"
              >
                {page.slug === "home" ? <Lock className="size-3" /> : null}
                /{page.slug}
              </Badge>
              <StatusBadge status={page.is_active ? "active" : "inactive"} />
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              Kelola susunan section, visibilitas, dan metadata SEO untuk halaman /
              {page.slug}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditPage}
              className="h-9 gap-1.5 rounded-xl border-slate-200 text-xs font-semibold"
            >
              <Edit2 className="size-3.5" />
              <span>Edit Halaman</span>
            </Button>

            <Button
              size="sm"
              onClick={onAddSection}
              className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
            >
              <Plus className="size-4" />
              <span>Tambah Section</span>
            </Button>
          </div>
        </div>
      </div>

      <Card className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:grid-cols-2">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Meta Title SEO
          </span>
          <p className="mt-0.5 text-xs font-medium text-slate-700">
            {page.meta_title ?? "Belum diatur"}
          </p>
        </div>
        <div>
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Meta Description SEO
          </span>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">
            {page.meta_desc ?? "Belum diatur"}
          </p>
        </div>
      </Card>
    </>
  );
}
