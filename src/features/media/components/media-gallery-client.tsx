"use client";

import * as React from "react";
import { Images } from "lucide-react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { EmptyState } from "@/components/feedback/empty-state";
import { MediaCard } from "@/features/media/components/media-card";
import { MediaDeleteDialog } from "@/features/media/components/media-delete-dialog";
import { MediaDetailDialog } from "@/features/media/components/media-detail-dialog";
import { MediaListRow } from "@/features/media/components/media-list-row";
import { MediaReplaceDialog } from "@/features/media/components/media-replace-dialog";
import { MediaStatsBar } from "@/features/media/components/media-stats-bar";
import {
  MediaToolbar,
  type MediaUsageFilter,
  type MediaViewMode,
} from "@/features/media/components/media-toolbar";
import {
  extractMediaDir,
  extractMediaFilename,
  formatMediaDirLabel,
  formatMediaSize,
} from "@/features/media/utils/media-format";
import type { MediaItem } from "@/types/cms.types";
import { resolveMediaUrl } from "@/utils/media";

interface MediaGalleryClientProps {
  items: MediaItem[];
}

function filterMediaItems(
  items: MediaItem[],
  usageFilter: MediaUsageFilter,
  selectedDir: string,
  search: string
): MediaItem[] {
  const query = search.trim().toLowerCase();
  return items.filter((item) => {
    if (usageFilter === "used" && item.usage.length === 0) return false;
    if (usageFilter === "unused" && item.usage.length > 0) return false;
    if (selectedDir !== "all" && extractMediaDir(item.path) !== selectedDir) {
      return false;
    }
    if (!query) return true;
    const inPath = item.path.toLowerCase().includes(query);
    const inUsage = item.usage.some((ref) =>
      (ref.label ?? "").toLowerCase().includes(query)
    );
    return inPath || inUsage;
  });
}

export function MediaGalleryClient({
  items,
}: MediaGalleryClientProps): React.JSX.Element {
  const [usageFilter, setUsageFilter] = React.useState<MediaUsageFilter>("all");
  const [selectedDir, setSelectedDir] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [viewMode, setViewMode] = React.useState<MediaViewMode>("grid");

  const [lightboxIndex, setLightboxIndex] = React.useState<number>(-1);
  const [detailItem, setDetailItem] = React.useState<MediaItem | null>(null);
  const [replaceItem, setReplaceItem] = React.useState<MediaItem | null>(null);
  const [deleteItem, setDeleteItem] = React.useState<MediaItem | null>(null);

  const dirs = React.useMemo(() => {
    const set = new Set(items.map((item) => extractMediaDir(item.path)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const counts = React.useMemo(() => {
    const used = items.filter((item) => item.usage.length > 0).length;
    return { all: items.length, used, unused: items.length - used };
  }, [items]);

  const filteredItems = React.useMemo(
    () => filterMediaItems(items, usageFilter, selectedDir, search),
    [items, usageFilter, selectedDir, search]
  );

  const slides = React.useMemo(
    () =>
      filteredItems.map((item) => ({
        src: resolveMediaUrl(item.url, item.path) ?? item.url,
        title: extractMediaFilename(item.path),
        description: `${formatMediaDirLabel(extractMediaDir(item.path))} · ${formatMediaSize(item.size)} · ${item.path}`,
      })),
    [filteredItems]
  );

  const handlePreview = (item: MediaItem): void => {
    const idx = filteredItems.findIndex((entry) => entry.path === item.path);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const handleCopyUrl = (item: MediaItem): void => {
    void navigator.clipboard
      .writeText(item.url)
      .then(() => toast.success("URL gambar disalin ke clipboard."))
      .catch(() => toast.error("Gagal menyalin URL gambar."));
  };

  let galleryContent: React.ReactNode;
  if (filteredItems.length === 0) {
    galleryContent = (
      <EmptyState
        icon={<Images className="size-6" />}
        title="Belum ada gambar yang cocok"
        description="Coba ubah filter folder atau kata kunci pencarian untuk melihat file media lainnya."
      />
    );
  } else if (viewMode === "grid") {
    galleryContent = (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => (
          <MediaCard
            key={item.path}
            item={item}
            onPreview={handlePreview}
            onDetail={setDetailItem}
            onReplace={setReplaceItem}
            onCopyUrl={handleCopyUrl}
            onDelete={setDeleteItem}
          />
        ))}
      </div>
    );
  } else {
    galleryContent = (
      <div className="space-y-2.5">
        {filteredItems.map((item) => (
          <MediaListRow
            key={item.path}
            item={item}
            onPreview={handlePreview}
            onDetail={setDetailItem}
            onReplace={setReplaceItem}
            onCopyUrl={handleCopyUrl}
            onDelete={setDeleteItem}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MediaStatsBar items={items} />

      <MediaToolbar
        usageFilter={usageFilter}
        onUsageFilterChange={setUsageFilter}
        selectedDir={selectedDir}
        onDirChange={setSelectedDir}
        dirs={dirs}
        search={search}
        onSearchChange={setSearch}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        counts={counts}
      />

      {galleryContent}

      <Lightbox
        open={lightboxIndex >= 0}
        index={Math.max(0, lightboxIndex)}
        close={() => {
          setLightboxIndex(-1);
        }}
        slides={slides}
        plugins={[Zoom, Captions]}
      />

      <MediaDetailDialog
        item={detailItem}
        onOpenChange={(open) => {
          if (!open) setDetailItem(null);
        }}
        onPreview={handlePreview}
        onReplace={setReplaceItem}
        onCopyUrl={handleCopyUrl}
        onDelete={setDeleteItem}
      />

      <MediaReplaceDialog
        item={replaceItem}
        onOpenChange={(open) => {
          if (!open) setReplaceItem(null);
        }}
      />

      <MediaDeleteDialog
        item={deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        onSwitchToReplace={setReplaceItem}
      />
    </div>
  );
}
