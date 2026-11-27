"use client";

import { MessageCircle } from "lucide-react";
import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import { cn } from "@/lib/utils";
import {
  extractIndonesiaLocalWhatsapp,
  processIndonesiaWhatsappInput,
} from "@/utils/whatsapp-phone";

interface FormWhatsappInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  id?: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  maxTotalDigits?: number;
  containerClassName?: string;
}

export function FormWhatsappInput<T extends FieldValues>({
  name,
  id,
  label,
  placeholder = "81234567890",
  helperText,
  required = false,
  disabled = false,
  maxTotalDigits = 15,
  containerClassName,
}: FormWhatsappInputProps<T>): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { field } = useController({ control, name });
  const rawValue = typeof field.value === "string" ? field.value : "";
  const localNumber = extractIndonesiaLocalWhatsapp(rawValue);

  const errorMsg = getFieldError(errors, name);
  const hasError = Boolean(errorMsg);
  const captionText = errorMsg ?? helperText;
  const inputId = id ?? name;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700"
        >
          <span>{label}</span>
          {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          "flex h-10 w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          hasError &&
            "border-rose-400 focus-within:border-rose-400 focus-within:ring-rose-500/20",
          disabled && "cursor-not-allowed bg-slate-50 opacity-60"
        )}
      >
        <span className="flex h-full shrink-0 items-center gap-1.5 border-r border-slate-200 bg-slate-50/90 px-3 text-xs font-semibold text-slate-600 select-none">
          <MessageCircle className="size-3.5 text-emerald-600" />
          <span>+62</span>
        </span>

        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          disabled={disabled}
          aria-invalid={hasError}
          value={localNumber}
          onChange={(e) => {
            const next = processIndonesiaWhatsappInput(
              e.target.value,
              maxTotalDigits
            );
            field.onChange(next.fullValue);
          }}
          onBlur={field.onBlur}
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:text-slate-400"
        />
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
