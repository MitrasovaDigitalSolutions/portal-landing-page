"use client";

import * as React from "react";
import { format, isValid, parse } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface DatePickerProps {
  value?: string | Date | null;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  clearable?: boolean;
  size?: "sm" | "md" | "lg";
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years";
  startMonth?: Date;
  endMonth?: Date;
  reverseYears?: boolean;
  id?: string;
  invalid?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
}

const SIZE_CLASSES: Record<NonNullable<DatePickerProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-3.5 text-xs",
  lg: "h-11 px-4 text-sm",
};

function parseDateValue(value: string | Date | null | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  if (isValid(parsed)) return parsed;
  const fallback = new Date(value);
  return isValid(fallback) ? fallback : undefined;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Pilih tanggal...",
      disabled = false,
      className,
      buttonClassName,
      clearable = true,
      size = "md",
      captionLayout = "dropdown",
      startMonth,
      endMonth,
      reverseYears,
      id,
      invalid = false,
      onKeyDown,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedDate = React.useMemo(() => parseDateValue(value), [value]);
    const [month, setMonth] = React.useState<Date>(
      () => selectedDate ?? new Date()
    );

    const defaultStartMonth = React.useMemo(
      () => new Date(new Date().getFullYear() - 50, 0),
      []
    );
    const defaultEndMonth = React.useMemo(
      () => new Date(new Date().getFullYear() + 10, 11),
      []
    );

    const handleOpenChange = (nextOpen: boolean): void => {
      if (nextOpen) {
        setMonth(selectedDate ?? new Date());
      }
      setOpen(nextOpen);
    };

    const handleSelect = (date: Date | undefined): void => {
      if (!date) {
        onChange?.("");
      } else {
        onChange?.(format(date, "yyyy-MM-dd"));
      }
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      onChange?.("");
    };

    return (
      <div className={cn("relative w-full", className)}>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger
            disabled={disabled}
            render={
              <button
                ref={ref}
                id={id}
                type="button"
                disabled={disabled}
                onKeyDown={onKeyDown}
                data-open={open || undefined}
                data-invalid={invalid ? "true" : undefined}
                className={cn(
                  "flex w-full items-center justify-start rounded-xl border border-slate-200 bg-white pr-9 text-left font-normal text-slate-800 transition-all outline-none select-none",
                  "hover:border-slate-300 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
                  "data-[open]:border-primary data-[open]:ring-3 data-[open]:ring-primary/20",
                  "data-[invalid=true]:border-rose-500 data-[invalid=true]:ring-3 data-[invalid=true]:ring-rose-500/20",
                  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
                  SIZE_CLASSES[size],
                  !selectedDate && "text-slate-400",
                  buttonClassName
                )}
              />
            }
          >
            <CalendarIcon
              className={cn(
                "mr-2 size-4 shrink-0 text-slate-400 transition-colors",
                selectedDate && "text-primary"
              )}
            />
            <span className="truncate font-medium">
              {selectedDate ? (
                format(selectedDate, "dd MMMM yyyy", { locale: idLocale })
              ) : (
                <span className="font-normal text-slate-400">{placeholder}</span>
              )}
            </span>
          </PopoverTrigger>

          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              locale={idLocale}
              selected={selectedDate}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              className="p-3"
              captionLayout={captionLayout}
              startMonth={startMonth ?? defaultStartMonth}
              endMonth={endMonth ?? defaultEndMonth}
              reverseYears={reverseYears}
            />
          </PopoverContent>
        </Popover>

        {clearable && selectedDate && !disabled ? (
          <button
            type="button"
            aria-label="Hapus tanggal"
            onClick={handleClear}
            className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
