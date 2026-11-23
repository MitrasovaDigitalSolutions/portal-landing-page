"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Table({
  className,
  ...props
}: React.ComponentProps<"table">): React.JSX.Element {
  return (
    <table
      data-slot="table"
      className={cn("w-full caption-bottom border-collapse text-xs", className)}
      {...props}
    />
  );
}

function TableHeader({
  className,
  ...props
}: React.ComponentProps<"thead">): React.JSX.Element {
  return (
    <thead
      data-slot="table-header"
      className={cn("border-b border-slate-200 bg-slate-50/90", className)}
      {...props}
    />
  );
}

function TableBody({
  className,
  ...props
}: React.ComponentProps<"tbody">): React.JSX.Element {
  return (
    <tbody
      data-slot="table-body"
      className={cn("divide-y divide-slate-100 bg-white [&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({
  className,
  ...props
}: React.ComponentProps<"tfoot">): React.JSX.Element {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t border-slate-200 bg-slate-50/70 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({
  className,
  ...props
}: React.ComponentProps<"tr">): React.JSX.Element {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-primary/5",
        className
      )}
      {...props}
    />
  );
}

function TableHead({
  className,
  ...props
}: React.ComponentProps<"th">): React.JSX.Element {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-4 text-left align-middle text-[11px] font-bold tracking-wider whitespace-nowrap text-slate-500 uppercase",
        className
      )}
      {...props}
    />
  );
}

function TableCell({
  className,
  ...props
}: React.ComponentProps<"td">): React.JSX.Element {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-4 py-3 align-middle text-xs text-slate-700", className)}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">): React.JSX.Element {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-3 text-xs text-slate-500", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
