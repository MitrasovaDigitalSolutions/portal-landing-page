"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Scrollable } from "@/components/ui/scrollable";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "2xl";

const DIALOG_SIZE_CLASSES: Record<DialogSize, string> = {
  sm: "sm:max-w-md w-full",
  md: "sm:max-w-lg w-full",
  lg: "sm:max-w-xl w-full",
  xl: "sm:max-w-2xl w-full",
  "2xl": "sm:max-w-3xl w-full",
};

export interface BaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headerRight?: React.ReactNode;
  size?: DialogSize;
  maxWidth?: string;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  scrollable?: boolean;
  contentId?: string;
}

export function BaseDialog({
  open,
  onOpenChange,
  title,
  description,
  headerRight,
  size = "lg",
  maxWidth,
  className,
  children,
  showCloseButton = true,
  scrollable = true,
  contentId,
}: BaseDialogProps): React.JSX.Element {
  const sizeClass = maxWidth ? cn("w-full", maxWidth) : DIALOG_SIZE_CLASSES[size];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        id={contentId}
        showCloseButton={false}
        className={cn(
          "flex max-h-[90vh] flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl sm:p-6",
          sizeClass,
          className
        )}
      >
        {title ? (
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div className="min-w-0 flex-1">
              <DialogTitle className="flex items-center gap-2 text-sm font-bold text-slate-900 sm:text-base">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="mt-0.5 text-xs text-slate-500">
                  {description}
                </DialogDescription>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {headerRight}
              {showCloseButton ? (
                <DialogClose className="flex size-7 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700">
                  <X className="size-4" />
                  <span className="sr-only">Tutup</span>
                </DialogClose>
              ) : null}
            </div>
          </div>
        ) : null}

        {scrollable ? (
          <Scrollable
            className="max-h-[calc(90vh-110px)] min-h-0 flex-1 pr-1"
            scrollbarClassName="z-40"
          >
            {children}
          </Scrollable>
        ) : (
          children
        )}
      </DialogContent>
    </Dialog>
  );
}
