"use client";

import * as React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { SmartImage } from "@/components/shared/smart-image";
import { BaseDialog } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { replaceMediaAction } from "@/features/media/actions/media.actions";
import { extractMediaFilename } from "@/features/media/utils/media-format";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { MediaItem, ReplaceMediaResult } from "@/types/cms.types";

interface MediaReplaceDialogProps {
  item: MediaItem | null;
  onOpenChange: (open: boolean) => void;
}

export function MediaReplaceDialog({
  item,
  onOpenChange,
}: MediaReplaceDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [file, setFile] = React.useState<File | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const mutation = useCrudMutation<{ path: string; file: File }, ReplaceMediaResult>({
    mutationFn: ({ path, file: nextFile }) => {
      const formData = new FormData();
      formData.append("path", path);
      formData.append("file", nextFile);
      return replaceMediaAction(formData);
    },
    invalidateKeys: [queryKeys.media.all(siteKey)],
    onSuccess: () => {
      setFile(null);
      setUploadError(null);
      onOpenChange(false);
    },
  });

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      setFile(null);
      setUploadError(null);
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!item || !file || uploadError) {
      return;
    }
    mutation.mutate({ path: item.path, file });
  };

  return (
    <BaseDialog
      open={Boolean(item)}
      onOpenChange={handleOpenChange}
      title="Ganti Gambar"
      description="File baru disimpan sebagai path baru dan seluruh referensi konten otomatis diperbarui."
      size="lg"
    >
      {item ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <SmartImage
                src={item.url}
                fallbackPath={item.path}
                alt={extractMediaFilename(item.path)}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900">
                {extractMediaFilename(item.path)}
              </p>
              <p className="truncate font-mono text-[11px] text-slate-500">
                {item.path}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-primary">
                {item.usage.length > 0
                  ? `${item.usage.length} referensi konten akan diperbarui otomatis.`
                  : "Gambar belum dipakai konten mana pun."}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Pilih Gambar Pengganti <span className="text-rose-500">*</span>
            </label>
            <ImageUpload
              value={file}
              onChange={setFile}
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              maxSizeMB={10}
              disabled={mutation.isPending}
              invalid={Boolean(uploadError)}
              onErrorChange={setUploadError}
            />
            {uploadError ? (
              <p className="text-[11px] font-medium text-rose-500">{uploadError}</p>
            ) : (
              <p className="text-[11px] text-slate-500">
                Mendukung JPG, JPEG, PNG, WEBP, GIF, dan SVG maksimal 10 MB.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={mutation.isPending}
              onClick={() => {
                handleOpenChange(false);
              }}
              className="rounded-xl text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!file || Boolean(uploadError) || mutation.isPending}
              className="gap-1.5 rounded-xl text-xs font-semibold"
            >
              {mutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
              <span>{mutation.isPending ? "Mengunggah..." : "Simpan Pengganti"}</span>
            </Button>
          </div>
        </form>
      ) : null}
    </BaseDialog>
  );
}
