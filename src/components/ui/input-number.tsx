"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function formatNumberDisplay(
  value: number,
  allowDecimal: boolean,
  thousandSeparator: boolean
): string {
  if (!thousandSeparator) {
    return String(value);
  }
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: allowDecimal ? 6 : 0,
  }).format(value);
}

function resolveDisplayValue(
  isFocused: boolean,
  draft: string,
  value: number | null | undefined,
  allowDecimal: boolean,
  thousandSeparator: boolean
): string {
  if (isFocused) {
    return draft;
  }
  if (value !== undefined && value !== null && !Number.isNaN(value)) {
    return formatNumberDisplay(value, allowDecimal, thousandSeparator);
  }
  return "";
}

function getNumericPattern(allowNegative: boolean, allowDecimal: boolean): RegExp {
  if (allowNegative) {
    return allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
  }
  return allowDecimal ? /^\d*\.?\d*$/ : /^\d*$/;
}

function parseNumericDraft(
  raw: string,
  allowDecimal: boolean,
  allowNegative: boolean
): number | null {
  if (!raw || raw === "-" || raw === "." || raw === "-.") {
    return null;
  }
  const normalized = raw.replace(",", ".");
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return null;
  }
  if (!allowNegative && parsed < 0) {
    return Math.abs(parsed);
  }
  return allowDecimal ? parsed : Math.trunc(parsed);
}

function clampValue(val: number, min?: number, max?: number): number {
  let next = val;
  if (min !== undefined && next < min) next = min;
  if (max !== undefined && next > max) next = max;
  return next;
}

export interface InputNumberProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange" | "size"
  > {
  value?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  thousandSeparator?: boolean;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

const INPUT_SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "h-9 text-xs",
  md: "h-10 text-xs",
  lg: "h-11 text-sm",
};

export const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  (
    {
      value,
      onValueChange,
      min,
      max,
      allowDecimal = false,
      allowNegative = false,
      thousandSeparator = true,
      leftAddon,
      rightAddon,
      size = "md",
      className,
      containerClassName,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [draft, setDraft] = React.useState("");

    const displayValue = resolveDisplayValue(
      isFocused,
      draft,
      value,
      allowDecimal,
      thousandSeparator
    );

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>): void => {
      setIsFocused(true);
      setDraft(
        value !== undefined && value !== null && !Number.isNaN(value)
          ? String(value)
          : ""
      );
      onFocus?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      let raw = e.target.value;
      if (allowDecimal) {
        raw = raw.replace(/,/g, ".");
      }
      const pattern = getNumericPattern(allowNegative, allowDecimal);
      if (!pattern.test(raw)) {
        return;
      }

      setDraft(raw);
      const parsed = parseNumericDraft(raw, allowDecimal, allowNegative);
      onValueChange?.(parsed);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
      const parsed = parseNumericDraft(draft, allowDecimal, allowNegative);
      if (parsed !== null) {
        const clamped = clampValue(parsed, min, max);
        if (clamped !== value) {
          onValueChange?.(clamped);
        }
      } else if (draft.trim() === "" && value !== null && value !== undefined) {
        onValueChange?.(null);
      }
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div
        className={cn(
          "flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all",
          "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
          "has-[input[aria-invalid=true]]:border-rose-500 has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-rose-500/20",
          disabled && "cursor-not-allowed bg-slate-50 opacity-60",
          INPUT_SIZE_CLASSES[size],
          containerClassName
        )}
      >
        {leftAddon && (
          <div className="flex h-full shrink-0 items-center border-r border-slate-200 bg-slate-50/80 px-3 text-xs font-medium text-slate-500 select-none">
            {leftAddon}
          </div>
        )}
        <input
          ref={ref}
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          value={displayValue}
          disabled={disabled}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "h-full w-full min-w-0 bg-transparent px-3.5 font-medium text-slate-800 tabular-nums outline-none placeholder:font-normal placeholder:text-slate-400 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        {rightAddon && (
          <div className="flex h-full shrink-0 items-center border-l border-slate-200 bg-slate-50/80 px-3 text-xs font-medium text-slate-500 select-none">
            {rightAddon}
          </div>
        )}
      </div>
    );
  }
);
InputNumber.displayName = "InputNumber";

export interface InputNumberStepperProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
}

const STEPPER_HEIGHTS: Record<"sm" | "md" | "lg", string> = {
  sm: "h-9",
  md: "h-10",
  lg: "h-11",
};

const STEPPER_BTN_SIZES: Record<"sm" | "md" | "lg", string> = {
  sm: "w-8",
  md: "w-10",
  lg: "w-11",
};

export function InputNumberStepper({
  value,
  onValueChange,
  min = 0,
  max,
  step = 1,
  unit,
  size = "md",
  disabled = false,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: InputNumberStepperProps): React.JSX.Element {
  const [isFocused, setIsFocused] = React.useState(false);
  const [draft, setDraft] = React.useState("");

  const displayValue = isFocused ? draft : String(value);

  const commit = (rawVal: number): void => {
    const clamped = clampValue(rawVal, min, max);
    onValueChange(clamped);
  };

  const handleDecrement = (): void => {
    if (disabled) return;
    commit(value - step);
  };

  const handleIncrement = (): void => {
    if (disabled) return;
    commit(value + step);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      handleDecrement();
    }
  };

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && (max === undefined || value < max);

  return (
    <div
      className={cn(
        "flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-white transition-all",
        "focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
        ariaInvalid && "border-rose-500 ring-3 ring-rose-500/20",
        disabled && "cursor-not-allowed bg-slate-50 opacity-60",
        STEPPER_HEIGHTS[size],
        className
      )}
    >
      <button
        type="button"
        disabled={!canDecrement}
        onClick={handleDecrement}
        aria-label="Kurangi nilai"
        className={cn(
          "flex h-full shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50/70 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-40",
          STEPPER_BTN_SIZES[size]
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-2">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          onFocus={() => {
            setIsFocused(true);
            setDraft(String(value));
          }}
          onChange={(e) => {
            const raw = e.target.value;
            if (!/^-?\d*$/.test(raw)) return;
            setDraft(raw);
            if (raw !== "" && raw !== "-") {
              const parsed = Number.parseInt(raw, 10);
              if (!Number.isNaN(parsed)) {
                commit(parsed);
              }
            }
          }}
          onBlur={() => {
            if (draft === "" || draft === "-") {
              commit(min);
            } else {
              const parsed = Number.parseInt(draft, 10);
              commit(Number.isNaN(parsed) ? min : parsed);
            }
            setIsFocused(false);
          }}
          onKeyDown={handleKeyDown}
          className="w-full min-w-0 bg-transparent text-center text-xs font-semibold text-slate-800 tabular-nums outline-none disabled:cursor-not-allowed"
        />
        {unit && (
          <span className="shrink-0 text-[11px] font-medium text-slate-400 select-none">
            {unit}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={!canIncrement}
        onClick={handleIncrement}
        aria-label="Tambah nilai"
        className={cn(
          "flex h-full shrink-0 items-center justify-center border-l border-slate-200 bg-slate-50/70 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-40",
          STEPPER_BTN_SIZES[size]
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
