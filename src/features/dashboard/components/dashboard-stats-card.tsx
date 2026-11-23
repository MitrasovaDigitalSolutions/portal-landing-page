import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface DashboardStatsCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon: LucideIcon;
  href: string;
  badge?: string;
  moduleDisabled?: boolean;
}

export function DashboardStatsCard({
  label,
  value,
  sublabel,
  icon: Icon,
  href,
  badge,
  moduleDisabled = false,
}: DashboardStatsCardProps): React.JSX.Element {
  return (
    <Link href={href} className="group block">
      <Card className="flex flex-row items-center justify-between gap-3.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all duration-150 group-hover:border-primary/40 group-hover:shadow-sm">
        <div className="flex min-w-0 items-center gap-3.5">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-2xs">
            <Icon className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-slate-500">
              {label}
            </p>
            <p className="mt-0.5 truncate text-base font-extrabold tracking-tight text-slate-900">
              {value}
            </p>
            {sublabel ? (
              <p className="truncate text-[11px] font-medium text-slate-400">
                {sublabel}
              </p>
            ) : null}
          </div>
        </div>

        {badge ? (
          <span className="shrink-0 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-600">
            {badge}
          </span>
        ) : null}

        {!badge && moduleDisabled ? (
          <span className="shrink-0 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            Nonaktif
          </span>
        ) : null}

        {!badge && !moduleDisabled ? (
          <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-primary" />
        ) : null}
      </Card>
    </Link>
  );
}
