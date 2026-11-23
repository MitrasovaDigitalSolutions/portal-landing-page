import { ArrowRight, Globe, Users } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface SuperadminPlatformBannerProps {
  totalSites: number;
  activeSites: number;
}

export function SuperadminPlatformBanner({
  totalSites,
  activeSites,
}: SuperadminPlatformBannerProps): React.JSX.Element {
  return (
    <Card className="flex flex-col gap-4 border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white shadow-xs sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="text-[10px] font-bold tracking-widest text-sky-300 uppercase">
          Kontrol Platform Superadmin
        </span>
        <p className="mt-1 text-sm font-bold">
          {activeSites} dari {totalSites} tenant aktif terhubung ke portal
        </p>
        <p className="mt-0.5 text-xs text-slate-300">
          Gunakan Tenant Switcher di header untuk berpindah unit usaha secara instan.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/sites"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/20"
        >
          <Globe className="size-3.5" />
          <span>Kelola Tenant</span>
          <ArrowRight className="size-3.5" />
        </Link>
        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-900 transition-colors hover:bg-slate-100"
        >
          <Users className="size-3.5" />
          <span>Manajemen User</span>
        </Link>
      </div>
    </Card>
  );
}
