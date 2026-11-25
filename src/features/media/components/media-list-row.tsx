"use client";

import { Copy, Info, RefreshCw, Trash2 } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  extractMediaDir,
  extractMediaFilename,
  formatMediaDirLabel,
  formatMediaSize,
  toMediaProxyPath,
} from "@/features/media/utils/media-format";
import type { MediaItem } from "@/types/cms.types";
import { formatDateId } from "@/utils/format-date";

interface MediaListRowProps {
  item: MediaItem;
  onPreview: (item: MediaItem) => void;
  onDetail: (item: MediaItem) => void;
  onReplace: (item: MediaItem) => void;
  onCopyUrl: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaListRow({
  item,
  onPreview,
  onDetail,
  onReplace,
  onCopyUrl,
  onDelete,
}: MediaListRowProps): React.JSX.Element {
  const filename = extractMediaFilename(item.path);
  const dirLabel = formatMediaDirLabel(extractMediaDir(item.path));
  const usageCount = item.usage.length;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs transition-colors hover:border-primary/35 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => {
            onPreview(item);
          }}
          aria-label={`Perbesar ${filename}`}
          className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
        >
          <SmartImage
            src={toMediaProxyPath(item)}
            fallbackPath={item.path}
            alt={filename}
            fill
            sizes="48px"
            className="object-cover"
          />
        </button>

        <div className="min-w-0">
          <button
            type="button"
            onClick={() => {
              onDetail(item);
            }}
            className="block max-w-full truncate text-left text-xs font-bold text-slate-900 hover:text-primary"
          >
            {filename}
          </button>
          <p className="truncate text-[11px] text-slate-400">{item.path}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {dirLabel}
          </Badge>
          <Badge
            variant={usageCount > 0 ? "success" : "warning"}
            className="text-[10px]"
          >
            {usageCount > 0 ? `Dipakai (${usageCount})` : "Tidak terpakai"}
          </Badge>
        </div>

        <span className="text-[11px] font-medium text-slate-500 tabular-nums">
          {formatMediaSize(item.size)} · {formatDateId(item.modified_at)}
        </span>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onReplace(item);
            }}
            className="h-7 gap-1 rounded-lg px-2.5 text-[11px] font-semibold"
          >
            <RefreshCw className="size-3" />
            <span>Ganti</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Detail pemakaian"
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
            aria-label="Salin URL"
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
