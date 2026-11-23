"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteServiceTypeAction } from "@/features/services/actions/services.actions";
import { buildServiceTypeColumns } from "@/features/services/components/service-type-columns";
import { ServiceTypeDialog } from "@/features/services/components/service-type-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ServiceType } from "@/types/cms.types";

interface ServiceTypesTableProps {
  types: ServiceType[];
}

export function ServiceTypesTable({
  types,
}: ServiceTypesTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ServiceType | null>(null);
  const deleteConfirm = useDeleteConfirm<ServiceType>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteServiceTypeAction(id),
    invalidateKeys: [queryKeys.services.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildServiceTypeColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={types}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari tipe layanan..."
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelected(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Tipe</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada tipe layanan"
        emptyDescription="Tambahkan tipe layanan untuk mengelompokkan layanan unit usaha."
      />

      <ServiceTypeDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        serviceType={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Tipe Layanan?"
        description={`Tipe "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen. Tipe yang masih memiliki layanan aktif tidak dapat dihapus.`}
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
