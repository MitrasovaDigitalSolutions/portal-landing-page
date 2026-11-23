"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FeatureListInputProps {
  value: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addButtonLabel?: string;
  emptyHint?: string;
  disabled?: boolean;
  invalid?: boolean;
  maxItems?: number;
  className?: string;
}

function parsePastedLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

export function FeatureListInput({
  value,
  onChange,
  placeholder = "Ketik poin keunggulan lalu tekan Enter...",
  addButtonLabel = "Tambah Poin",
  emptyHint = "Belum ada poin keunggulan. Tambahkan poin di bawah agar keunggulan layanan mudah dibaca calon klien.",
  disabled = false,
  invalid = false,
  maxItems = 20,
  className,
}: FeatureListInputProps): React.JSX.Element {
  const [draft, setDraft] = React.useState("");
  const canAddMore = !disabled && value.length < maxItems;

  const handleAddDraft = (): void => {
    const trimmed = draft.trim();
    if (!trimmed || !canAddMore) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  const handleUpdateItem = (index: number, nextText: string): void => {
    const next = [...value];
    next[index] = nextText;
    onChange(next);
  };

  const handleRemoveItem = (index: number): void => {
    onChange(value.filter((_, idx) => idx !== index));
  };

  const handleMoveItem = (index: number, direction: -1 | 1): void => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    const current = next[index] ?? "";
    next[index] = next[target] ?? "";
    next[target] = current;
    onChange(next);
  };

  const handleDraftPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ): void => {
    const text = e.clipboardData.getData("text");
    if (!text.includes("\n")) return;
    const parsed = parsePastedLines(text);
    if (parsed.length === 0) return;
    e.preventDefault();
    const available = maxItems - value.length;
    if (available > 0) {
      onChange([...value, ...parsed.slice(0, available)]);
    }
    setDraft("");
  };

  return (
    <div
      data-invalid={invalid ? "true" : undefined}
      className={cn(
        "space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/50 p-3 transition-colors",
        "data-[invalid=true]:border-rose-500 data-[invalid=true]:ring-3 data-[invalid=true]:ring-rose-500/20",
        disabled && "opacity-60",
        className
      )}
    >
      {value.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white/80 px-3.5 py-3 text-center text-xs text-slate-500">
          {emptyHint}
        </div>
      ) : (
        <div className="space-y-1.5">
          {value.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary tabular-nums">
                {idx + 1}
              </span>

              <input
                type="text"
                value={item}
                disabled={disabled}
                placeholder={`Poin keunggulan #${idx + 1}`}
                onChange={(e) => {
                  handleUpdateItem(idx, e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && item === "" && !disabled) {
                    e.preventDefault();
                    handleRemoveItem(idx);
                  }
                }}
                className="h-7 min-w-0 flex-1 bg-transparent text-xs font-medium text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  disabled={disabled || idx === 0}
                  aria-label={`Geser poin ${idx + 1} ke atas`}
                  onClick={() => {
                    handleMoveItem(idx, -1);
                  }}
                  className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  disabled={disabled || idx === value.length - 1}
                  aria-label={`Geser poin ${idx + 1} ke bawah`}
                  onClick={() => {
                    handleMoveItem(idx, 1);
                  }}
                  className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronDown className="size-3.5" />
                </button>
                <button
                  type="button"
                  disabled={disabled}
                  aria-label={`Hapus poin ${idx + 1}`}
                  onClick={() => {
                    handleRemoveItem(idx);
                  }}
                  className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:pointer-events-none disabled:opacity-30"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Plus className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={draft}
            disabled={!canAddMore}
            placeholder={
              value.length >= maxItems
                ? `Maksimal ${maxItems} poin tercapai`
                : placeholder
            }
            onChange={(e) => {
              setDraft(e.target.value);
            }}
            onPaste={handleDraftPaste}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddDraft();
              }
            }}
            className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-3 pl-8.5 text-xs text-slate-800 transition-all outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </div>
        <button
          type="button"
          disabled={!canAddMore || draft.trim().length === 0}
          onClick={handleAddDraft}
          className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-primary/10 px-3.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Plus className="size-3.5" />
          <span>{addButtonLabel}</span>
        </button>
      </div>
    </div>
  );
}
