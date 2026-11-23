"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Scrollable } from "@/components/ui/scrollable";

export interface OptionItem {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface InputOptionProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: OptionItem[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  leftIcon?: React.ReactNode;
  variant?: "default" | "pill";
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
  name?: string;
  invalid?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<InputOptionProps["size"]>, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-3.5 text-xs",
  lg: "h-11 px-4 text-sm",
};

interface InputOptionDropdownProps {
  options: OptionItem[];
  value?: string;
  search: string;
  onSearchChange: (val: string) => void;
  showSearch: boolean;
  searchPlaceholder: string;
  emptyText: string;
  loading: boolean;
  loadingText: string;
  onSelect: (val: string) => void;
}

function InputOptionDropdown({
  options,
  value,
  search,
  onSearchChange,
  showSearch,
  searchPlaceholder,
  emptyText,
  loading,
  loadingText,
  onSelect,
}: InputOptionDropdownProps): React.JSX.Element {
  const normalizedQuery = search.trim().toLowerCase();
  const filtered = normalizedQuery
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(normalizedQuery) ||
          (opt.description?.toLowerCase().includes(normalizedQuery) ?? false) ||
          opt.value.toLowerCase().includes(normalizedQuery)
      )
    : options;

  let listContent: React.ReactNode;
  if (loading) {
    listContent = (
      <div className="flex items-center justify-center gap-2 px-3 py-6 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        <span>{loadingText}</span>
      </div>
    );
  } else if (filtered.length === 0) {
    listContent = (
      <div className="px-3 py-6 text-center text-xs text-slate-400">
        {emptyText}
      </div>
    );
  } else {
    listContent = (
      <div className="space-y-0.5 p-1.5" role="listbox">
        {filtered.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              role="option"
              aria-selected={isSelected}
              onClick={() => {
                if (!opt.disabled) onSelect(opt.value);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors outline-none",
                opt.disabled
                  ? "cursor-not-allowed opacity-45"
                  : "cursor-pointer hover:bg-slate-100/80",
                isSelected &&
                  "bg-primary/10 font-semibold text-primary hover:bg-primary/15"
              )}
            >
              {opt.icon && (
                <span className="shrink-0 text-current">{opt.icon}</span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate">{opt.label}</span>
                {opt.description && (
                  <span className="block truncate text-[11px] font-normal text-slate-400">
                    {opt.description}
                  </span>
                )}
              </span>
              <Check
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-primary transition-opacity",
                  isSelected ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {showSearch && (
        <div className="border-b border-slate-100 p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
              placeholder={searchPlaceholder}
              className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50/70 pr-7 pl-8 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
            />
            {search.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                }}
                aria-label="Hapus pencarian"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      <Scrollable className="max-h-60">{listContent}</Scrollable>
    </div>
  );
}

export function InputOption({
  value,
  onValueChange,
  options,
  placeholder = "Pilih opsi...",
  searchPlaceholder = "Cari opsi...",
  emptyText = "Opsi tidak ditemukan.",
  loading = false,
  loadingText = "Memuat data...",
  disabled = false,
  clearable = false,
  searchable,
  leftIcon,
  variant = "default",
  size = "md",
  className,
  id,
  name,
  invalid,
}: InputOptionProps): React.JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedOption = options.find((opt) => opt.value === value);
  const showSearch = searchable ?? options.length > 5;
  const hasValue = value !== undefined && value !== "";

  const handleOpenChange = (nextOpen: boolean): void => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  };

  const handleSelect = (nextValue: string): void => {
    onValueChange?.(nextValue);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent<HTMLSpanElement>): void => {
    e.stopPropagation();
    onValueChange?.("");
  };

  return (
    <div className="relative w-full">
      {name && <input type="hidden" name={name} value={value ?? ""} />}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger
          disabled={disabled}
          render={
            <button
              id={id}
              type="button"
              disabled={disabled}
              data-invalid={invalid ? "true" : undefined}
              data-open={open || undefined}
              className={cn(
                "flex w-full items-center justify-between gap-2 border border-slate-200 bg-white font-normal text-slate-800 transition-all outline-none select-none",
                "hover:border-slate-300 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
                "data-[open]:border-primary data-[open]:ring-3 data-[open]:ring-primary/20",
                "data-[invalid=true]:border-rose-500 data-[invalid=true]:ring-3 data-[invalid=true]:ring-rose-500/20",
                "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
                variant === "pill" ? "rounded-full" : "rounded-xl",
                SIZE_CLASSES[size],
                className
              )}
            />
          }
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {leftIcon && (
              <span className="shrink-0 text-slate-400">{leftIcon}</span>
            )}
            {selectedOption ? (
              <span className="flex min-w-0 items-center gap-1.5 truncate font-medium text-slate-800">
                {selectedOption.icon && (
                  <span className="shrink-0">{selectedOption.icon}</span>
                )}
                <span className="truncate">{selectedOption.label}</span>
              </span>
            ) : (
              <span className="truncate text-slate-400">{placeholder}</span>
            )}
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {clearable && hasValue && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                aria-label="Hapus pilihan"
                onClick={handleClear}
                className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-150",
                open && "rotate-180 text-primary"
              )}
            />
          </span>
        </PopoverTrigger>

        <PopoverContent
          className="w-(--anchor-width) min-w-[200px] overflow-hidden p-0"
          align="start"
        >
          <InputOptionDropdown
            options={options}
            value={value}
            search={search}
            onSearchChange={setSearch}
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            emptyText={emptyText}
            loading={loading}
            loadingText={loadingText}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { InputOption as CommandSelect };
