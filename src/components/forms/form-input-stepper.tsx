"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import {
  InputNumberStepper,
  type InputNumberStepperProps,
} from "@/components/ui/input-number";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/components/forms/form-utils";

interface FormInputStepperProps<T extends FieldValues>
  extends Omit<InputNumberStepperProps, "value" | "onValueChange"> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

export function FormInputStepper<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  containerClassName,
  min = 0,
  ...props
}: FormInputStepperProps<T>): React.JSX.Element {
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
          const val =
            typeof field.value === "number" && !Number.isNaN(field.value)
              ? field.value
              : min;
          return (
            <InputNumberStepper
              id={name}
              value={val}
              min={min}
              aria-invalid={hasError}
              onValueChange={(nextVal) => {
                field.onChange(nextVal);
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
