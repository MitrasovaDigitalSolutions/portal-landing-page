"use client";

import { Copy, Expand, Info, RefreshCw, Trash2 } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  extractMediaDir,
  extractMediaFilename,
  formatMediaDirLabel,
  formatMediaSize,
} from "@/features/media/utils/media-format";
import type { MediaItem } from "@/types/cms.types";
import { formatDateId } from "@/utils/format-date";

interface MediaCardProps {
  item: MediaItem;
  onPreview: (item: MediaItem) => void;
  onDetail: (item: MediaItem) => void;
  onReplace: (item: MediaItem) => void;
  onCopyUrl: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaCard({
  item,
  onPreview,
  onDetail,
  onReplace,
  onCopyUrl,
  onDelete,
}: MediaCardProps): React.JSX.Element {
  const filename = extractMediaFilename(item.path);
  const dirLabel = formatMediaDirLabel(extractMediaDir(item.path));
  const usageCount = item.usage.length;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all hover:border-primary/40 hover:shadow-md">
      <div className="relative aspect-4/3 w-full overflow-hidden border-b border-slate-100 bg-slate-100">
        <button
          type="button"
          onClick={() => {
            onPreview(item);
          }}
          className="relative block size-full outline-none"
          aria-label={`Perbesar ${filename}`}
        >
          <SmartImage
            src={item.url}
            fallbackPath={item.path}
            alt={filename}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="pointer-events-none absolute right-2.5 bottom-2.5 flex size-7 items-center justify-center rounded-lg bg-slate-900/65 text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Expand className="size-3.5" />
          </span>
        </button>

        <span className="pointer-events-none absolute top-2.5 left-2.5 max-w-[48%] truncate rounded-lg bg-slate-900/70 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
          {dirLabel}
        </span>

        <Badge
          variant={usageCount > 0 ? "success" : "warning"}
          className="pointer-events-none absolute top-2.5 right-2.5 text-[10px]"
        >
          {usageCount > 0 ? `Dipakai (${usageCount})` : "Tidak terpakai"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <button
          type="button"
          onClick={() => {
            onDetail(item);
          }}
          className="truncate text-left text-xs font-bold text-slate-900 transition-colors hover:text-primary"
          title={item.path}
        >
          {filename}
        </button>

        <p className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-500 tabular-nums">
          <span>{formatMediaSize(item.size)}</span>
          <span className="truncate">{formatDateId(item.modified_at)}</span>
        </p>

        <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onReplace(item);
            }}
            className="h-7 flex-1 gap-1 rounded-lg px-2 text-[11px] font-semibold"
          >
            <RefreshCw className="size-3" />
            <span>Ganti</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Detail pemakaian"
            title="Detail pemakaian"
            onClick={() => {
              onDetail(item);
            }}
            className="size-7 rounded-lg text-slate-600"
          >
            <Info className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Salin URL gambar"
            title="Salin URL gambar"
            onClick={() => {
              onCopyUrl(item);
            }}
            className="size-7 rounded-lg text-slate-600"
          >
            <Copy className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus gambar"
            title="Hapus gambar"
            onClick={() => {
              onDelete(item);
            }}
            className="size-7 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
