"use client";

import type { ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import {
  RichTextEditor,
  type RichTextEditorProps,
} from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

interface FormRichTextProps<T extends FieldValues>
  extends Omit<RichTextEditorProps, "value" | "onChange" | "invalid"> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  helperText?: string;
  topSlot?: ReactNode;
  containerClassName?: string;
}

export function FormRichText<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  topSlot,
  containerClassName,
  ...props
}: FormRichTextProps<T>): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

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

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const val = typeof field.value === "string" ? field.value : "";
          return (
            <RichTextEditor
              value={val}
              invalid={hasError}
              topSlot={topSlot}
              onChange={(html) => {
                field.onChange(html);
              }}
              {...props}
            />
          );
        }}
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
