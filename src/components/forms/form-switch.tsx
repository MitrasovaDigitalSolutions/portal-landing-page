"use client";

import {
  Controller,
  useFormContext,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { getFieldError } from "@/components/forms/form-utils";

interface FormSwitchProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  bordered?: boolean;
  size?: "sm" | "default";
  containerClassName?: string;
}

export function FormSwitch<T extends FieldValues>({
  name,
  label,
  description,
  disabled = false,
  bordered = true,
  size = "default",
  containerClassName,
}: FormSwitchProps<T>): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const errorMsg = getFieldError(errors, name);

  return (
    <div className={cn("space-y-1", containerClassName)}>
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          bordered &&
            "rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 transition-colors hover:border-slate-300"
        )}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <label
            htmlFor={name}
            className="block cursor-pointer text-xs font-semibold text-slate-800"
          >
            {label}
          </label>
          {description ? (
            <p className="text-[11px] leading-snug text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Switch
              id={name}
              size={size}
              disabled={disabled}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => {
                field.onChange(checked);
              }}
            />
          )}
        />
      </div>

      {errorMsg ? (
        <p className="text-[11px] font-medium text-rose-500">{errorMsg}</p>
      ) : null}
    </div>
  );
}
