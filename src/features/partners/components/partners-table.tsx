"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deletePartnerAction } from "@/features/partners/actions/partners.actions";
import { buildPartnerColumns } from "@/features/partners/components/partner-columns";
import { PartnerDialog } from "@/features/partners/components/partner-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PartnerItem } from "@/types/cms.types";

interface PartnersTableProps {
  partners: PartnerItem[];
}

export function PartnersTable({
  partners,
}: PartnersTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PartnerItem | null>(null);
  const deleteConfirm = useDeleteConfirm<PartnerItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deletePartnerAction(id),
    invalidateKeys: [queryKeys.partners.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildPartnerColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={partners}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama atau website partner..."
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
            <span>Tambah Partner</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada logo partner"
        emptyDescription="Tambahkan daftar logo mitra dan klien terpercaya."
      />

      <PartnerDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        partner={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Partner?"
        description={`Partner "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
