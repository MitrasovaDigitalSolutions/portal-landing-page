"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Images, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { validateImageFile } from "@/components/forms/form-utils";
import { MediaPickerGrid } from "@/components/portal/media-picker-grid";
import { MediaPickerToolbar } from "@/components/portal/media-picker-toolbar";
import { BaseDialog } from "@/components/ui/base-dialog";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { MediaItem, UploadedMediaResult } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPath: string;
  onSelect: (path: string) => void;
  fetchMedia: () => Promise<ActionResult<MediaItem[]>>;
  uploadMedia?: (formData: FormData) => Promise<ActionResult<UploadedMediaResult>>;
  uploadDir?: string;
}

interface UploadPickerParams {
  file: File;
  uploadDir: string;
  uploadMedia: (formData: FormData) => Promise<ActionResult<UploadedMediaResult>>;
}

async function performPickerUpload({
  file,
  uploadDir,
  uploadMedia,
}: UploadPickerParams): Promise<string | null> {
  const validationError = validateImageFile(file, 10);
  if (validationError) {
    toast.error(validationError);
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("dir", uploadDir);

  const result = await uploadMedia(formData);
  if (result.success) {
    toast.success("Gambar berhasil diunggah ke galeri.");
    return result.data.path;
  }

  if (result.status === 404 || result.status === 405) {
    toast.warning(
      "Endpoint upload galeri langsung (POST /admin/media) belum aktif di backend. Silakan pilih gambar yang sudah tersedia."
    );
    return null;
  }

  toast.error(result.message);
  return null;
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  selectedPath,
  onSelect,
  fetchMedia,
  uploadMedia,
  uploadDir,
}: MediaPickerDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const mediaQuery = useQuery({
    queryKey: queryKeys.media.all(siteKey),
    queryFn: async (): Promise<MediaItem[]> => {
      const result = await fetchMedia();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: open,
  });

  const allItems = mediaQuery.data ?? [];
  const cleanSearch = search.trim().toLowerCase();
  const filteredItems = cleanSearch
    ? allItems.filter((item) => item.path.toLowerCase().includes(cleanSearch))
    : allItems;

  const handleUploadChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !uploadMedia) return;

    setUploading(true);
    try {
      const uploadedPath = await performPickerUpload({
        file,
        uploadDir: uploadDir ?? `sections/${siteKey}`,
        uploadMedia,
      });
      if (uploadedPath) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.media.all(siteKey) });
        onSelect(uploadedPath);
        onOpenChange(false);
      }
    } finally {
      setUploading(false);
    }
  };

  let bodyContent: React.ReactNode;
  if (mediaQuery.isLoading) {
    bodyContent = (
      <div className="flex items-center justify-center gap-2 py-12 text-xs text-slate-500">
        <Loader2 className="size-4 animate-spin text-primary" />
        <span>Memuat daftar media...</span>
      </div>
    );
  } else if (filteredItems.length === 0) {
    bodyContent = (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 py-10 text-center">
        <Images className="size-6 text-slate-400" />
        <p className="text-xs font-semibold text-slate-700">
          {cleanSearch
            ? "Tidak ada gambar yang sesuai pencarian."
            : "Belum ada gambar di galeri media tenant ini."}
        </p>
      </div>
    );
  } else {
    bodyContent = (
      <MediaPickerGrid
        items={filteredItems}
        selectedPath={selectedPath}
        onSelect={(path) => {
          onSelect(path);
          onOpenChange(false);
        }}
      />
    );
  }

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Pilih Gambar dari Galeri Media"
      description="Menyimpan path relatif file secara aman agar terhubung dengan Galeri Media."
      size="2xl"
    >
      <div className="space-y-4">
        <MediaPickerToolbar
          search={search}
          onSearchChange={setSearch}
          isFetching={mediaQuery.isFetching}
          onRefresh={() => {
            void mediaQuery.refetch();
          }}
          canUpload={Boolean(uploadMedia)}
          uploading={uploading}
          onUploadFile={(e) => {
            void handleUploadChange(e);
          }}
        />
        {bodyContent}
      </div>
    </BaseDialog>
  );
}
