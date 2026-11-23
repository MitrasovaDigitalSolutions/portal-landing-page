import { Settings } from "lucide-react";
import Link from "next/link";
import {
  TENANT_MODULE_DEFINITIONS,
  isTenantModuleActive,
  type TenantModulesState,
} from "@/config/modules";
import { cn } from "@/lib/utils";

interface CompactModulesBarProps {
  modules: TenantModulesState;
}

export function CompactModulesBar({
  modules,
}: CompactModulesBarProps): React.JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-2xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          Modul Website:
        </span>

        {TENANT_MODULE_DEFINITIONS.map((mod) => {
          const active = isTenantModuleActive(modules, mod.key);
          return (
            <span
              key={mod.key}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
                active
                  ? "border-slate-200 bg-slate-50 text-slate-700"
                  : "border-amber-200 bg-amber-50/80 text-amber-700"
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-emerald-500" : "bg-amber-500"
                )}
              />
              <span>{mod.label}</span>
            </span>
          );
        })}
      </div>

      <Link
        href="/settings"
        className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        <Settings className="size-3.5" />
        <span>Atur</span>
      </Link>
    </div>
  );
}
