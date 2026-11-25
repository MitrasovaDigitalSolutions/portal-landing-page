"use client";

import type { ReactNode } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";

interface FormRepeaterItemProps {
  index: number;
  total: number;
  title: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: ReactNode;
}

export function FormRepeaterItem({
  index,
  total,
  title,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: FormRepeaterItemProps): React.JSX.Element {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary tabular-nums">
            {index + 1}
          </span>
          <span className="truncate text-xs font-bold text-slate-800">
            {title}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            disabled={index === 0}
            aria-label={`Geser item ${index + 1} ke atas`}
            onClick={onMoveUp}
            className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronUp className="size-3.5" />
          </button>
          <button
            type="button"
            disabled={index === total - 1}
            aria-label={`Geser item ${index + 1} ke bawah`}
            onClick={onMoveDown}
            className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronDown className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Hapus item ${index + 1}`}
            onClick={onRemove}
            className="inline-flex size-6 cursor-pointer items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}
