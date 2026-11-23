"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormDialogFooterProps {
  onCancel: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FormDialogFooter({
  onCancel,
  cancelLabel = "Batal",
  submitLabel = "Simpan",
  isSubmitting = false,
  disabled = false,
  className,
}: FormDialogFooterProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "mt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4",
        className
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
        className="h-9 rounded-xl border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting || disabled}
        className="h-9 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : (
          <span>{submitLabel}</span>
        )}
      </Button>
    </div>
  );
}
