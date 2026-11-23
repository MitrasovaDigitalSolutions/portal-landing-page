"use client";

import * as React from "react";
import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";

interface FormImageUploadProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  initialUrl?: string | null;
  accept?: string;
  maxSizeMB?: number;
  aspectHint?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  previewClassName?: string;
  containerClassName?: string;
}

export function FormImageUpload<T extends FieldValues>({
  name,
  label,
  initialUrl,
  accept,
  maxSizeMB = 5,
  aspectHint,
  helperText,
  required,
  disabled = false,
  previewClassName,
  containerClassName,
}: FormImageUploadProps<T>): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { field } = useController({ control, name });
  const [localError, setLocalError] = React.useState<string | null>(null);

  const rawValue: unknown = field.value;
  const selectedFile = rawValue instanceof File ? rawValue : null;

  const fieldError = getFieldError(errors, name);
  const displayError = localError ?? fieldError;
  const captionText = displayError ?? helperText;
  const hasError = Boolean(displayError);

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <label className="block text-xs font-semibold text-slate-700">
          <span>{label}</span>
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}

      <ImageUpload
        value={selectedFile}
        onChange={(file) => {
          field.onChange(file);
        }}
        initialUrl={initialUrl}
        label={label}
        accept={accept}
        maxSizeMB={maxSizeMB}
        aspectHint={aspectHint}
        disabled={disabled}
        invalid={hasError}
        previewClassName={previewClassName}
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
