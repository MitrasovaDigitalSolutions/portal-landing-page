import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { PortalPageHeader } from "@/components/portal/portal-page-header";
import { Button } from "@/components/ui/button";

interface SuperadminGuardProps {
  title: string;
  description: string;
}

export function SuperadminGuard({
  title,
  description,
}: SuperadminGuardProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <PortalPageHeader title={title} description={description} />
      <div className="mx-auto max-w-lg space-y-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <ShieldAlert className="size-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">
          Akses Khusus Superadmin
        </h2>
        <p className="text-sm text-slate-600">
          Akun Anda tidak memiliki hak akses Superadmin untuk mengelola konfigurasi
          global tenant dan pengguna.
        </p>
        <div className="pt-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl text-xs font-semibold"
            render={<Link href="/" />}
          >
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
