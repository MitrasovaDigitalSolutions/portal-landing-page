"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as React from "react";

export type StatusBadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "sky"
  | "purple"
  | "outline";

interface StatusConfig {
  variant: StatusBadgeVariant;
  label?: string;
  dotColor: string;
  pulse?: boolean;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  active: { variant: "success", label: "Aktif", dotColor: "bg-emerald-500", pulse: true },
  aktif: { variant: "success", label: "Aktif", dotColor: "bg-emerald-500", pulse: true },
  published: { variant: "success", label: "Published", dotColor: "bg-emerald-500" },
  inactive: { variant: "danger", label: "Nonaktif", dotColor: "bg-rose-500" },
  nonaktif: { variant: "danger", label: "Nonaktif", dotColor: "bg-rose-500" },
  draft: { variant: "warning", label: "Draft", dotColor: "bg-amber-500" },
  new: { variant: "warning", label: "Baru", dotColor: "bg-amber-500", pulse: true },
  baru: { variant: "warning", label: "Baru", dotColor: "bg-amber-500", pulse: true },
  contacted: { variant: "info", label: "Dihubungi", dotColor: "bg-blue-500" },
  dihubungi: { variant: "info", label: "Dihubungi", dotColor: "bg-blue-500" },
  closed: { variant: "secondary", label: "Selesai", dotColor: "bg-slate-400" },
  selesai: { variant: "secondary", label: "Selesai", dotColor: "bg-slate-400" },
  archived: { variant: "secondary", label: "Diarsipkan", dotColor: "bg-slate-400" },
  diarsipkan: { variant: "secondary", label: "Diarsipkan", dotColor: "bg-slate-400" },
  featured: { variant: "warning", label: "Unggulan", dotColor: "bg-amber-500" },
  unggulan: { variant: "warning", label: "Unggulan", dotColor: "bg-amber-500" },
  superadmin: { variant: "purple", label: "Superadmin", dotColor: "bg-indigo-500" },
  admin: { variant: "info", label: "Admin", dotColor: "bg-blue-500" },
  editor: { variant: "secondary", label: "Editor", dotColor: "bg-slate-500" },
};

interface StatusBadgeProps {
  status?: string | null;
  label?: string;
  showDot?: boolean;
  pulse?: boolean;
  variant?: StatusBadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  pulse,
  variant,
  icon,
  className,
}: StatusBadgeProps): React.JSX.Element {
  const normalized = (status ?? "").toLowerCase().trim();
  const mapped = STATUS_MAP[normalized] as StatusConfig | undefined;

  const resolvedVariant = variant ?? mapped?.variant ?? "secondary";
  const resolvedLabel =
    label ??
    mapped?.label ??
    (status && status.trim().length > 0 ? status : "—");
  const dotColor = mapped?.dotColor ?? "bg-slate-400";
  const shouldPulse = pulse ?? mapped?.pulse ?? false;

  return (
    <Badge
      variant={resolvedVariant}
      className={cn("inline-flex items-center gap-1.5", className)}
    >
      {showDot ? (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            dotColor,
            shouldPulse && "animate-pulse"
          )}
        />
      ) : null}
      {icon}
      <span>{resolvedLabel}</span>
    </Badge>
  );
}
