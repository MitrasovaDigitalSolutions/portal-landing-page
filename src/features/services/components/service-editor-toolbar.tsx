"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

interface ServiceEditorToolbarProps {
  isEdit: boolean;
  isActive: boolean;
  isFeatured: boolean;
  isSubmitting: boolean;
}

export function ServiceEditorToolbar({
  isEdit,
  isActive,
  isFeatured,
  isSubmitting,
}: ServiceEditorToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href="/services"
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali</span>
        </Link>
        <StatusBadge status={isActive ? "active" : "inactive"} />
        {isFeatured ? <StatusBadge status="featured" showDot={false} /> : null}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/services" />}
          className="h-9 rounded-xl border-slate-200 px-3.5 text-xs font-semibold text-slate-700"
        >
          Batal
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-9 gap-1.5 rounded-xl px-4 text-xs font-semibold shadow-xs"
        >
          {isSubmitting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          <span>{isEdit ? "Simpan Perubahan" : "Simpan Layanan"}</span>
        </Button>
      </div>
    </div>
  );
}
