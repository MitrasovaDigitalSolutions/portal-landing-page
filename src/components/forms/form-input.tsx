"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/components/forms/form-utils";

interface FormInputProps<T extends FieldValues>
  extends Omit<ComponentProps<typeof Input>, "name"> {
  name: FieldPath<T>;
  label?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  helperText,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  required,
  ...props
}: FormInputProps<T>): React.JSX.Element {
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

      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </span>
        ) : null}
        <Input
          id={name}
          {...register(name)}
          aria-invalid={hasError}
          className={cn(
            leftIcon && "pl-9",
            rightIcon && "pr-9",
            hasError && "border-rose-500 focus-visible:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {rightIcon ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </span>
        ) : null}
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
    </div>
  );
}
