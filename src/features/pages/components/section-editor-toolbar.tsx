"use client";

import { ArrowLeft, Columns2, Eye, Layers, Loader2, PenLine, Save } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

export type SectionEditorViewMode = "split" | "editor" | "preview";

interface SectionEditorToolbarProps {
  pageId: number;
  pageSlug: string;
  sectionKey: string;
  isActive: boolean;
  isEdit: boolean;
  isSubmitting: boolean;
  viewMode: SectionEditorViewMode;
  onViewModeChange: (mode: SectionEditorViewMode) => void;
}

const VIEW_MODES: readonly {
  value: SectionEditorViewMode;
  label: string;
  icon: typeof Columns2;
}[] = [
  { value: "split", label: "Split", icon: Columns2 },
  { value: "editor", label: "Form", icon: PenLine },
  { value: "preview", label: "Preview", icon: Eye },
];

export function SectionEditorToolbar({
  pageId,
  pageSlug,
  sectionKey,
  isActive,
  isEdit,
  isSubmitting,
  viewMode,
  onViewModeChange,
}: SectionEditorToolbarProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href={`/pages/${pageId}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowLeft className="size-3.5" />
          <span>Kembali</span>
        </Link>

        <Badge variant="outline" className="rounded-md font-mono text-[11px]">
          /{pageSlug}
        </Badge>

        <Badge
          variant="secondary"
          className="gap-1 rounded-md font-mono text-[11px]"
        >
          <Layers className="size-3" />
          <span>key: {sectionKey || "-"}</span>
        </Badge>

        <StatusBadge status={isActive ? "active" : "inactive"} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="group"
          aria-label="Mode tampilan editor"
          className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-100/80 p-0.5"
        >
          {VIEW_MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = viewMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => {
                  onViewModeChange(mode.value);
                }}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all",
                  isSelected
                    ? "bg-white text-primary shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Icon className="size-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/pages/${pageId}`} />}
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
          <span>{isEdit ? "Simpan Perubahan" : "Tambah Section"}</span>
        </Button>
      </div>
    </div>
  );
}
