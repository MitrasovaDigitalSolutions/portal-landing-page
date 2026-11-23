"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteBusinessUnitAction } from "@/features/business-units/actions/business-units.actions";
import { buildBusinessUnitColumns } from "@/features/business-units/components/business-unit-columns";
import { BusinessUnitDialog } from "@/features/business-units/components/business-unit-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { BusinessUnitItem } from "@/types/cms.types";

interface BusinessUnitsTableProps {
  units: BusinessUnitItem[];
}

export function BusinessUnitsTable({
  units,
}: BusinessUnitsTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<BusinessUnitItem | null>(null);
  const deleteConfirm = useDeleteConfirm<BusinessUnitItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteBusinessUnitAction(id),
    invalidateKeys: [queryKeys.businessUnits.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildBusinessUnitColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={units}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama atau alamat unit bisnis..."
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
            <span>Tambah Unit Bisnis</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada unit bisnis"
        emptyDescription="Tambahkan daftar unit bisnis yang berafiliasi dengan tenant ini."
      />

      <BusinessUnitDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        unit={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Unit Bisnis?"
        description={`Unit "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
