"use client";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";
import { useState } from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

interface FormFileUploadProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  accept?: string;
  maxSizeMb?: number;
}

export function FormFileUpload<T extends FieldValues>({
  name,
  label,
  accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx",
  maxSizeMb = 10,
}: FormFileUploadProps<T>): React.JSX.Element {
  const {
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<T>();

  const [fileName, setFileName] = useState<string | null>(null);
  const error = errors[name]?.message as string | undefined;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(name, {
        type: "manual",
        message: `Ukuran file melebihi batas maksimal ${maxSizeMb}MB`,
      });
      return;
    }

    clearErrors(name);
    setFileName(file.name);
    setValue(name, file as never, { shouldValidate: true });
  };

  const handleRemove = (): void => {
    setFileName(null);
    clearErrors(name);
    setValue(name, null as never, { shouldValidate: true });
  };

  return (
    <FormField id={name} label={label} error={error}>
      {!fileName ? (
        <label
          htmlFor={name}
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-5 transition-colors hover:border-primary/50 hover:bg-slate-100/50"
        >
          <Upload className="size-6 text-slate-400" />
          <span className="mt-2 text-xs font-semibold text-slate-700">
            Pilih dokumen / gambar lampiran
          </span>
          <span className="mt-0.5 text-[11px] text-slate-400">
            PDF, JPG, PNG, DOC (Maks. {maxSizeMb}MB)
          </span>
          <input
            id={name}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <FileText className="size-5 shrink-0 text-primary" />
            <span className="truncate text-xs font-medium text-slate-800">
              {fileName}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleRemove}
            className="size-7 rounded-full text-slate-400 hover:text-rose-500"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
    </FormField>
  );
}
