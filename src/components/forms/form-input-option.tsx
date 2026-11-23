"use client";

import type { ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  InputOption,
  type InputOptionProps,
  type OptionItem,
} from "@/components/ui/input-option";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/components/forms/form-utils";

interface FormInputOptionProps<T extends FieldValues>
  extends Omit<InputOptionProps, "value" | "onValueChange" | "invalid" | "name"> {
  name: FieldPath<T>;
  label?: string;
  options: OptionItem[];
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
  leftIcon?: ReactNode;
  onValueChange?: (value: string) => void;
}

export function FormInputOption<T extends FieldValues>({
  name,
  label,
  options,
  required,
  helperText,
  containerClassName,
  onValueChange,
  ...props
}: FormInputOptionProps<T>): React.JSX.Element {
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
          const strVal =
            field.value === undefined || field.value === null
              ? ""
              : String(field.value);
          return (
            <InputOption
              id={name}
              value={strVal}
              options={options}
              invalid={hasError}
              onValueChange={(nextVal) => {
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
