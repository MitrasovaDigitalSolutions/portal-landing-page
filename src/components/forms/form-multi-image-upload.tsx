"use client";

import * as React from "react";
import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import {
  MultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";

export type { ExistingGalleryItem };

interface FormMultiImageUploadProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  existingImages?: ExistingGalleryItem[];
  maxFiles?: number;
  maxSizeMB?: number;
  helperText?: string;
  disabled?: boolean;
  containerClassName?: string;
}

export function FormMultiImageUpload<T extends FieldValues>({
  name,
  label,
  existingImages = [],
  maxFiles = 8,
  maxSizeMB = 5,
  helperText,
  disabled = false,
  containerClassName,
}: FormMultiImageUploadProps<T>): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { field } = useController({ control, name });
  const [localError, setLocalError] = React.useState<string | null>(null);

  const rawValue: unknown = field.value;
  const files: File[] = Array.isArray(rawValue)
    ? rawValue.filter((item: unknown): item is File => item instanceof File)
    : [];

  const fieldError = getFieldError(errors, name);
  const displayError = localError ?? fieldError;
  const captionText = displayError ?? helperText;
  const hasError = Boolean(displayError);

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      ) : null}

      <MultiImageUpload
        files={files}
        onChange={(nextFiles) => {
          field.onChange(nextFiles);
        }}
        existingImages={existingImages}
        maxFiles={maxFiles}
        maxSizeMB={maxSizeMB}
        disabled={disabled}
        invalid={hasError}
        onErrorChange={setLocalError}
      />

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
    </div>
  );
}
