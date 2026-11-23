import { Settings } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  TENANT_MODULE_DEFINITIONS,
  isTenantModuleActive,
  type TenantModulesState,
} from "@/config/modules";

interface TenantModulesStatusProps {
  modules: TenantModulesState;
  siteName: string;
}

export function TenantModulesStatus({
  modules,
  siteName,
}: TenantModulesStatusProps): React.JSX.Element {
  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Status Modul Frontend ({siteName})
          </h2>
          <p className="text-[11px] text-slate-500">
            Kontrol visibilitas menu dan halaman pada landing page publik.
          </p>
        </div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <Settings className="size-3.5" />
          <span>Atur</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
        {TENANT_MODULE_DEFINITIONS.map((mod) => {
          const active = isTenantModuleActive(modules, mod.key);
          return (
            <div
              key={mod.key}
              className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2"
            >
              <span className="truncate text-xs font-medium text-slate-700">
                {mod.label}
              </span>
              <Badge
                variant={active ? "secondary" : "outline"}
                className={
                  active
                    ? "bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                }
              >
                {active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
