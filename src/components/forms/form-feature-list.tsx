"use client";

import {
  useController,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import {
  FeatureListInput,
  type FeatureListInputProps,
} from "@/components/ui/feature-list-input";
import { cn } from "@/lib/utils";

interface FormFeatureListProps<T extends FieldValues>
  extends Omit<FeatureListInputProps, "value" | "onChange" | "invalid"> {
  name: FieldPath<T>;
  label?: string;
  required?: boolean;
  helperText?: string;
  containerClassName?: string;
}

export function FormFeatureList<T extends FieldValues>({
  name,
  label,
  required,
  helperText,
  containerClassName,
  ...props
}: FormFeatureListProps<T>): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const { field } = useController({ control, name });
  const rawValue: unknown = field.value;
  const items: string[] = Array.isArray(rawValue)
    ? rawValue.filter((entry: unknown): entry is string => typeof entry === "string")
    : [];

  const errorMsg = getFieldError(errors, name);
  const hasError = Boolean(errorMsg);
  const captionText = errorMsg ?? helperText;

  return (
    <div className={cn("space-y-1.5", containerClassName)}>
      {label ? (
        <div className="flex items-center justify-between gap-2">
          <label className="block text-xs font-semibold text-slate-700">
            <span>{label}</span>
            {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
          </label>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 tabular-nums">
            {items.length} poin
          </span>
        </div>
      ) : null}

      <FeatureListInput
        value={items}
        invalid={hasError}
        onChange={(nextItems) => {
          field.onChange(nextItems);
        }}
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
