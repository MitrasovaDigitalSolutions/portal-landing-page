"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceOptionalCardProps {
  title: string;
  description: string;
  badgeLabel: string;
  hasValue?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ServiceOptionalCard({
  title,
  description,
  badgeLabel,
  hasValue = false,
  defaultOpen = false,
  children,
}: ServiceOptionalCardProps): React.JSX.Element {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/70"
      >
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
              hasValue
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-500"
            )}
          >
            {badgeLabel}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-slate-400 transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open ? (
        <div className="border-t border-slate-100 p-5">{children}</div>
      ) : null}
    </section>
  );
}
