"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormGroupProps {
  label: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormGroup({
  label,
  description,
  children,
  className,
}: FormGroupProps): React.JSX.Element {
  return (
    <fieldset
      className={cn(
        "space-y-3 rounded-xl border border-slate-200 bg-slate-50/40 p-3.5",
        className
      )}
    >
      <div className="border-b border-slate-200/80 pb-2">
        <legend className="text-xs font-bold text-slate-800">{label}</legend>
        {description ? (
          <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
