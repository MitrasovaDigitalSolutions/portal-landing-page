"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteSiteAction } from "@/features/tenants/actions/tenants.actions";
import { buildSiteColumns } from "@/features/tenants/components/site-columns";
import { SiteFormDialog } from "@/features/tenants/components/site-form-dialog";
import type { ManagedSite } from "@/features/tenants/types/tenants.types";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";

interface SitesTableProps {
  sites: ManagedSite[];
}

export function SitesTable({ sites }: SitesTableProps): React.JSX.Element {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<ManagedSite | null>(null);
  const deleteConfirm = useDeleteConfirm<ManagedSite>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: string) => deleteSiteAction(id),
    invalidateKeys: [queryKeys.sites.all],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildSiteColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={sites}
        getRowId={(row) => row.id}
        enableSearch
        searchPlaceholder="Cari nama, slug, atau domain tenant..."
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelectedSite(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Tenant</span>
          </Button>
        }
        onEdit={(item) => {
          setSelectedSite(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada tenant"
        emptyDescription="Tambahkan unit usaha (tenant) baru untuk dikelola dari portal ini."
      />

      <SiteFormDialog
        site={selectedSite}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Unit Usaha?"
        description={`Unit usaha "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen. Tenant yang masih memiliki layanan, artikel, atau portofolio tidak dapat dihapus.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteConfirm.target) {
            deleteMutation.mutate(deleteConfirm.target.id);
          }
        }}
      />
    </div>
  );
}
