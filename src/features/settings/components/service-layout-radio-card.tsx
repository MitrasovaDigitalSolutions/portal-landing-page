"use client";

import { ServiceLayoutWireframe } from "@/features/settings/components/service-layout-wireframe";
import type { ServicesLayoutOption } from "@/features/settings/schemas/settings.schema";
import { cn } from "@/lib/utils";

export interface ServiceLayoutOptionDef {
  value: ServicesLayoutOption;
  title: string;
  badge?: string;
  description: string;
  homeBehavior: string;
  catalogBehavior: string;
}

interface ServiceLayoutRadioCardProps {
  option: ServiceLayoutOptionDef;
  selected: boolean;
  onSelect: (value: ServicesLayoutOption) => void;
}

export function ServiceLayoutRadioCard({
  option,
  selected,
  onSelect,
}: ServiceLayoutRadioCardProps): React.JSX.Element {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => {
        onSelect(option.value);
      }}
      className={cn(
        "group flex h-full cursor-pointer flex-col rounded-2xl border p-4 text-left transition-all outline-none",
        "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
        selected
          ? "border-primary bg-primary/[0.03] shadow-sm ring-2 ring-primary/15"
          : "border-slate-200/90 bg-white hover:border-primary/40 hover:bg-slate-50/60"
      )}
    >
      <ServiceLayoutWireframe layout={option.value} selected={selected} />

      <div className="mt-3.5 flex items-start justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "text-sm font-bold tracking-tight",
              selected ? "text-primary" : "text-slate-900"
            )}
          >
            {option.title}
          </span>
          {option.badge ? (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {option.badge}
            </span>
          ) : null}
        </div>

        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
            selected
              ? "border-primary bg-primary"
              : "border-slate-300 bg-white group-hover:border-primary/60"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full bg-white transition-transform",
              selected ? "scale-100" : "scale-0"
            )}
          />
        </span>
      </div>

      <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
        {option.description}
      </p>

      <div className="mt-auto space-y-1 border-t border-slate-100 pt-3 text-[11px] text-slate-600">
        <p className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-slate-400">Beranda:</span>
          <span className="font-semibold text-slate-700">{option.homeBehavior}</span>
        </p>
        <p className="flex items-center justify-between gap-2">
          <span className="text-slate-400">Halaman /produk:</span>
          <span className="font-semibold text-slate-700">{option.catalogBehavior}</span>
        </p>
      </div>
    </button>
  );
}
