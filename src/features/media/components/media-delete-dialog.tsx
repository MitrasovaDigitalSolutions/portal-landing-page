"use client";

import * as React from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import { BaseDialog } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";
import { Scrollable } from "@/components/ui/scrollable";
import { deleteMediaAction } from "@/features/media/actions/media.actions";
import {
  extractMediaFilename,
  resolveUsageMeta,
} from "@/features/media/utils/media-format";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { DeleteMediaResult, MediaItem } from "@/types/cms.types";

interface MediaDeleteDialogProps {
  item: MediaItem | null;
  onOpenChange: (open: boolean) => void;
  onSwitchToReplace: (item: MediaItem) => void;
}

export function MediaDeleteDialog({
  item,
  onOpenChange,
  onSwitchToReplace,
}: MediaDeleteDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [confirmForce, setConfirmForce] = React.useState(false);

  const mutation = useCrudMutation<{ path: string; force: boolean }, DeleteMediaResult>({
    mutationFn: ({ path, force }) => deleteMediaAction(path, force),
    invalidateKeys: [queryKeys.media.all(siteKey)],
    onSuccess: () => {
      setConfirmForce(false);
      onOpenChange(false);
    },
  });

  const handleOpenChange = (isOpen: boolean): void => {
    if (!isOpen) {
      setConfirmForce(false);
    }
    onOpenChange(isOpen);
  };

  const isInUse = Boolean(item && item.usage.length > 0);
  const filename = item ? extractMediaFilename(item.path) : "";
  const canConfirm = Boolean(item) && (!isInUse || confirmForce);

  return (
    <BaseDialog
      open={Boolean(item)}
      onOpenChange={handleOpenChange}
      title={isInUse ? "Gambar Masih Dipakai Konten" : "Hapus Gambar"}
      size="md"
    >
      {item ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="size-5" />
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {isInUse ? (
                <>
                  File <span className="font-semibold text-slate-900">{filename}</span>{" "}
                  masih dipakai pada {item.usage.length} konten. Jika ingin
                  memperbarui gambar tanpa merusak halaman, gunakan{" "}
                  <span className="font-semibold text-primary">Ganti Gambar</span>.
                </>
              ) : (
                <>
                  Yakin ingin menghapus{" "}
                  <span className="font-semibold text-slate-900">{filename}</span>{" "}
                  dari storage? Tindakan ini tidak dapat dibatalkan.
                </>
              )}
            </p>
          </div>

          {isInUse ? (
            <>
              <Scrollable className="max-h-36 rounded-xl border border-rose-200/70 bg-rose-50/40 p-2.5">
                <ul className="space-y-1.5 text-[11px] text-slate-700">
                  {item.usage.map((ref, idx) => (
                    <li key={`${ref.type}-${ref.id}-${ref.field}-${idx}`}>
                      <span className="font-semibold">
                        {resolveUsageMeta(ref).typeLabel}:
                      </span>{" "}
                      {ref.label ?? `#${ref.id}`}{" "}
                      <span className="text-slate-400">({ref.field})</span>
                    </li>
                  ))}
                </ul>
              </Scrollable>

              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={confirmForce}
                  onChange={(e) => {
                    setConfirmForce(e.target.checked);
                  }}
                  className="mt-0.5 size-3.5 accent-rose-600"
                />
                <span>
                  Saya mengerti konten di atas akan menjadi gambar rusak jika tetap
                  dihapus paksa.
                </span>
              </label>
            </>
          ) : null}

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
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

            {isInUse ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={mutation.isPending}
                onClick={() => {
                  handleOpenChange(false);
                  onSwitchToReplace(item);
                }}
                className="gap-1.5 rounded-xl border-primary/30 text-xs font-semibold text-primary hover:bg-primary/5"
              >
                <RefreshCw className="size-3.5" />
                <span>Ganti Gambar Saja</span>
              </Button>
            ) : null}

            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={!canConfirm || mutation.isPending}
              onClick={() => {
                mutation.mutate({ path: item.path, force: isInUse });
              }}
              className="gap-1.5 rounded-xl text-xs font-bold"
            >
              {mutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : null}
              <span>{isInUse ? "Tetap Hapus Paksa" : "Hapus Gambar"}</span>
            </Button>
          </div>
        </div>
      ) : null}
    </BaseDialog>
  );
}
