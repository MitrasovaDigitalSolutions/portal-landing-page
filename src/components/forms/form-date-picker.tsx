"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import { DatePicker, type DatePickerProps } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";

interface FormDatePickerProps<T extends FieldValues>
  extends Omit<DatePickerProps, "value" | "onChange" | "invalid"> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
  onValueChange?: (val: string) => void;
}

export function FormDatePicker<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  containerClassName,
  onValueChange,
  ...props
}: FormDatePickerProps<T>): React.JSX.Element {
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
          const rawVal: unknown = field.value;
          const val =
            typeof rawVal === "string" || rawVal instanceof Date ? rawVal : "";
          return (
            <DatePicker
              id={name}
              value={val}
              invalid={hasError}
              onChange={(nextVal) => {
                field.onChange(nextVal);
                onValueChange?.(nextVal);
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
