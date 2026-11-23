"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { BaseDialog } from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps): React.JSX.Element {
  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle className="size-5" />
          </div>
          <p className="text-xs leading-relaxed text-slate-600">{description}</p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => {
              onOpenChange(false);
            }}
            className="rounded-lg text-xs"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-lg text-xs font-bold shadow-2xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </BaseDialog>
  );
}
