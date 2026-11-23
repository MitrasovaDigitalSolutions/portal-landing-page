"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  InputNumber,
  type InputNumberProps,
} from "@/components/ui/input-number";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/components/forms/form-utils";

interface FormInputNumberProps<T extends FieldValues>
  extends Omit<InputNumberProps, "value" | "onValueChange" | "name"> {
  name: FieldPath<T>;
  label?: string;
  helperText?: string;
  fallbackValue?: number | null;
}

export function FormInputNumber<T extends FieldValues>({
  name,
  label,
  helperText,
  fallbackValue = 0,
  containerClassName,
  required,
  ...props
}: FormInputNumberProps<T>): React.JSX.Element {
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
        <label
          htmlFor={name}
          className="block text-xs font-semibold text-slate-700"
        >
          <span>{label}</span>
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}

      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const numValue =
            typeof field.value === "number" && !Number.isNaN(field.value)
              ? field.value
              : null;
          return (
            <InputNumber
              id={name}
              value={numValue}
              aria-invalid={hasError}
              onValueChange={(nextVal) => {
                field.onChange(nextVal ?? fallbackValue);
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
