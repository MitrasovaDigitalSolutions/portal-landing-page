"use client";

import type { ComponentProps } from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/components/forms/form-utils";

interface FormTextareaProps<T extends FieldValues>
  extends Omit<ComponentProps<typeof Textarea>, "name"> {
  name: FieldPath<T>;
  label?: string;
  helperText?: string;
  containerClassName?: string;
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  helperText,
  containerClassName,
  className,
  required,
  ...props
}: FormTextareaProps<T>): React.JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const errorMsg = getFieldError(errors, name);
  const hasError = Boolean(errorMsg);

  const captionText = errorMsg ?? helperText;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <label
          htmlFor={name}
          className="block text-xs font-semibold text-slate-700"
        >
          <span>{label}</span>
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}

      <Textarea
        id={name}
        {...register(name)}
        aria-invalid={hasError}
        className={cn(
          hasError && "border-rose-500 focus-visible:ring-rose-500/20",
          className
        )}
        {...props}
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
