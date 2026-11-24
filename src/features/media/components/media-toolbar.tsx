"use client";

import { Folder, LayoutGrid, List, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InputOption, type OptionItem } from "@/components/ui/input-option";
import { formatMediaDirLabel } from "@/features/media/utils/media-format";
import { cn } from "@/lib/utils";

export type MediaUsageFilter = "all" | "used" | "unused";
export type MediaViewMode = "grid" | "list";

interface MediaToolbarProps {
  usageFilter: MediaUsageFilter;
  onUsageFilterChange: (next: MediaUsageFilter) => void;
  selectedDir: string;
  onDirChange: (next: string) => void;
  dirs: string[];
  search: string;
  onSearchChange: (next: string) => void;
  viewMode: MediaViewMode;
  onViewModeChange: (next: MediaViewMode) => void;
  counts: { all: number; used: number; unused: number };
}

export function MediaToolbar({
  usageFilter,
  onUsageFilterChange,
  selectedDir,
  onDirChange,
  dirs,
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  counts,
}: MediaToolbarProps): React.JSX.Element {
  const filterTabs: { key: MediaUsageFilter; label: string; count: number }[] = [
    { key: "all", label: "Semua", count: counts.all },
    { key: "used", label: "Dipakai", count: counts.used },
    { key: "unused", label: "Tidak Terpakai", count: counts.unused },
  ];

  const dirOptions: OptionItem[] = [
    { value: "all", label: "Semua Folder" },
    ...dirs.map((dir) => ({ value: dir, label: formatMediaDirLabel(dir) })),
  ];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-2xs lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100/80 p-1">
        {filterTabs.map((tab) => {
          const active = usageFilter === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                onUsageFilterChange(tab.key);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                active
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                  active
                    ? "bg-primary/10 text-primary"
                    : "bg-slate-200/70 text-slate-600"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 lg:flex-nowrap">
        <div className="w-full sm:w-48">
          <InputOption
            value={selectedDir}
            onValueChange={(val) => {
              onDirChange(val || "all");
            }}
            options={dirOptions}
            searchable={dirs.length > 5}
            leftIcon={<Folder className="size-3.5" />}
            size="sm"
          />
        </div>

        <div className="relative min-w-0 flex-1 sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            placeholder="Cari file atau pemakai..."
            className="h-9 rounded-xl pr-8 pl-8 text-xs"
          />
          {search.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
              }}
              aria-label="Hapus pencarian"
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-700"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/70 p-0.5">
          <button
            type="button"
            aria-label="Tampilan grid"
            onClick={() => {
              onViewModeChange("grid");
            }}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "grid"
                ? "bg-white text-primary shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Tampilan daftar"
            onClick={() => {
              onViewModeChange("list");
            }}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "list"
                ? "bg-white text-primary shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
