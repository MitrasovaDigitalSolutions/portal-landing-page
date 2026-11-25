"use client";

import * as React from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import { MediaPickerDialog } from "@/components/portal/media-picker-dialog";
import { SmartImage } from "@/components/shared/smart-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MediaItem, UploadedMediaResult } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";

interface FormMediaPickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  helperText?: string;
  fetchMedia: () => Promise<ActionResult<MediaItem[]>>;
  uploadMedia?: (formData: FormData) => Promise<ActionResult<UploadedMediaResult>>;
  uploadDir?: string;
  containerClassName?: string;
}

export function FormMediaPicker<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  fetchMedia,
  uploadMedia,
  uploadDir,
  containerClassName,
}: FormMediaPickerProps<T>): React.JSX.Element {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { field } = useController({ control, name });
  const rawValue: unknown = field.value;
  const pathValue = typeof rawValue === "string" ? rawValue.trim() : "";

  const errorMsg = getFieldError(errors, name);
  const hasError = Boolean(errorMsg);
  const captionText = errorMsg ?? helperText;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <label className="block text-xs font-semibold text-slate-700">
          <span>{label}</span>
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5",
          hasError && "border-rose-500 ring-2 ring-rose-500/15"
        )}
      >
        <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {pathValue ? (
            <SmartImage
              src={null}
              fallbackPath={pathValue}
              alt={label ?? "Preview gambar"}
              fill
              sizes="56px"
              className="object-cover"
            />
          ) : (
            <ImageIcon className="size-5 text-slate-300" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[11px] font-medium text-slate-700">
            {pathValue || "Belum ada gambar dipilih"}
          </p>
          <p className="text-[10px] text-slate-400">
            Menyimpan path relatif di storage (tanpa URL absolut).
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => {
              setPickerOpen(true);
            }}
            className="h-8 rounded-lg px-2.5 text-xs font-semibold"
          >
            Pilih Media
          </Button>
          {pathValue ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label="Hapus pilihan gambar"
              onClick={() => {
                field.onChange("");
              }}
              className="size-8 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 className="size-3.5" />
            </Button>
          ) : null}
        </div>
      </div>

      {captionText ? (
        <p
          className={cn(
            "text-[11px]",
            hasError ? "font-medium text-rose-500" : "text-slate-500"
          )}
        >
          {captionText}
        </p>
      ) : null}

      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        selectedPath={pathValue}
        onSelect={(nextPath) => {
          field.onChange(nextPath);
        }}
        fetchMedia={fetchMedia}
        uploadMedia={uploadMedia}
        uploadDir={uploadDir}
      />
    </div>
  );
}
