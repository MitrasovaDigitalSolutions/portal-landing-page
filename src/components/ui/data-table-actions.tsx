"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type DataTableActionVariant =
  | "edit"
  | "delete"
  | "view"
  | "approve"
  | "reject"
  | "neutral"
  | "primary";

const VARIANT_CLASSES: Record<DataTableActionVariant, string> = {
  edit: "text-amber-600 hover:bg-amber-50 hover:text-amber-700",
  delete: "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
  view: "text-sky-600 hover:bg-sky-50 hover:text-sky-700",
  approve: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
  reject: "text-rose-600 hover:bg-rose-50 hover:text-rose-700",
  neutral: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  primary: "text-primary hover:bg-primary/10 hover:text-primary",
};

export interface DataTableActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: DataTableActionVariant;
  disabled?: boolean;
  className?: string;
}

export function DataTableActionButton({
  icon,
  label,
  onClick,
  variant = "neutral",
  disabled = false,
  className,
}: DataTableActionButtonProps): React.JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger
        disabled={disabled}
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label={label}
            onClick={(e) => {
              e.stopPropagation();
              onClick(e);
            }}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-lg transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-40",
              VARIANT_CLASSES[variant],
              className
            )}
          />
        }
      >
        {icon}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export interface DataTableTextActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  tooltip?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: DataTableActionVariant;
  disabled?: boolean;
  className?: string;
}

export function DataTableTextActionButton({
  icon,
  label,
  tooltip,
  onClick,
  variant = "neutral",
  disabled = false,
  className,
}: DataTableTextActionButtonProps): React.JSX.Element {
  const button = (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-40",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger disabled={disabled} render={button} />
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}
