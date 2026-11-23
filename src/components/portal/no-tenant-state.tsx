import { Building2, Plus, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NoTenantStateProps {
  isSuperadmin: boolean;
}

export function NoTenantState({
  isSuperadmin,
}: NoTenantStateProps): React.JSX.Element {
  if (isSuperadmin) {
    return (
      <Card className="mx-auto max-w-lg border-dashed border-slate-300 bg-white p-8 text-center shadow-2xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Building2 className="size-6" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Belum Ada Tenant Aktif
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Buat atau aktifkan minimal satu unit usaha (site) terlebih dahulu untuk
          mulai mengelola konten website dari portal ini.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            size="sm"
            className="rounded-xl text-xs font-semibold"
            render={<Link href="/sites" />}
          >
            <Plus className="size-4" />
            <span>Kelola Tenant</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg border-amber-200 bg-amber-50/40 p-8 text-center shadow-2xs">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
        <ShieldAlert className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-900">
        Akun Belum Ditugaskan ke Tenant
      </h2>
      <p className="mt-1.5 text-sm text-slate-600">
        Akun Anda saat ini belum memiliki akses aktif ke unit usaha mana pun.
        Hubungi Superadmin untuk mendapatkan penugasan site.
      </p>
    </Card>
  );
}
