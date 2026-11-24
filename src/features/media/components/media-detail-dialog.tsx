"use client";

import { Copy, Expand, ExternalLink, RefreshCw, Trash2 } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { BaseDialog } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";
import { MediaUsageList } from "@/features/media/components/media-usage-list";
import {
  extractMediaFilename,
  formatMediaSize,
} from "@/features/media/utils/media-format";
import type { MediaItem } from "@/types/cms.types";
import { formatDateId } from "@/utils/format-date";
import { resolveMediaUrl } from "@/utils/media";

interface MediaDetailDialogProps {
  item: MediaItem | null;
  onOpenChange: (open: boolean) => void;
  onPreview: (item: MediaItem) => void;
  onReplace: (item: MediaItem) => void;
  onCopyUrl: (item: MediaItem) => void;
  onDelete: (item: MediaItem) => void;
}

export function MediaDetailDialog({
  item,
  onOpenChange,
  onPreview,
  onReplace,
  onCopyUrl,
  onDelete,
}: MediaDetailDialogProps): React.JSX.Element {
  const filename = item ? extractMediaFilename(item.path) : "";
  const previewUrl = item ? resolveMediaUrl(item.url, item.path) : null;

  return (
    <BaseDialog
      open={Boolean(item)}
      onOpenChange={onOpenChange}
      title={filename || "Detail Gambar"}
      description="Informasi file storage dan daftar konten yang memakainya."
      size="xl"
    >
      {item ? (
        <div className="space-y-5">
          <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100/80 sm:h-64">
            <SmartImage
              src={item.url}
              fallbackPath={item.path}
              alt={filename}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-contain p-2"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                onPreview(item);
              }}
              className="absolute right-3 bottom-3 h-8 gap-1.5 rounded-lg bg-white/95 px-3 text-xs font-semibold shadow-sm"
            >
              <Expand className="size-3.5" />
              <span>Layar Penuh</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs sm:grid-cols-3">
            <div className="sm:col-span-2">
              <p className="text-[11px] font-medium text-slate-500">Path Storage</p>
              <p className="mt-0.5 font-mono text-[11px] font-semibold break-all text-slate-800">
                {item.path}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-500">Ukuran & Update</p>
              <p className="mt-0.5 font-semibold text-slate-800 tabular-nums">
                {formatMediaSize(item.size)} · {formatDateId(item.modified_at)}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-800">
                Dipakai di Konten ({item.usage.length})
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onCopyUrl(item);
                  }}
                  className="h-7 gap-1 rounded-lg px-2.5 text-[11px]"
                >
                  <Copy className="size-3" />
                  <span>Salin URL</span>
                </Button>
                {previewUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    className="h-7 gap-1 rounded-lg px-2.5 text-[11px]"
                    render={
                      <a
                        href={previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <span>Buka</span>
                    <ExternalLink className="size-3" />
                  </Button>
                ) : null}
              </div>
            </div>

            <MediaUsageList
              usage={item.usage}
              onNavigate={() => {
                onOpenChange(false);
              }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onDelete(item);
              }}
              className="gap-1.5 rounded-xl border-rose-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            >
              <Trash2 className="size-3.5" />
              <span>Hapus Gambar</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onReplace(item);
              }}
              className="gap-1.5 rounded-xl text-xs font-semibold"
            >
              <RefreshCw className="size-3.5" />
              <span>Ganti Gambar</span>
            </Button>
          </div>
        </div>
      ) : null}
    </BaseDialog>
  );
}
