"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteBranchAction } from "@/features/branches/actions/branches.actions";
import { BranchDialog } from "@/features/branches/components/branch-dialog";
import { buildBranchColumns } from "@/features/branches/components/branch-columns";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { BranchItem } from "@/types/cms.types";

interface BranchesTableProps {
  branches: BranchItem[];
}

export function BranchesTable({
  branches,
}: BranchesTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<BranchItem | null>(null);
  const deleteConfirm = useDeleteConfirm<BranchItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteBranchAction(id),
    invalidateKeys: [queryKeys.branches.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildBranchColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={branches}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama cabang, alamat, atau telepon..."
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
            <span>Tambah Cabang</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada kantor cabang"
        emptyDescription="Tambahkan lokasi kantor pusat maupun kantor cabang tenant ini."
      />

      <BranchDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        branch={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Kantor Cabang?"
        description={`Cabang "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
