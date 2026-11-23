"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteFaqCategoryAction } from "@/features/faqs/actions/faqs.actions";
import { buildFaqCategoryColumns } from "@/features/faqs/components/faq-category-columns";
import { FaqCategoryDialog } from "@/features/faqs/components/faq-category-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { FaqCategory } from "@/types/cms.types";

interface FaqCategoriesTableProps {
  categories: FaqCategory[];
}

export function FaqCategoriesTable({
  categories,
}: FaqCategoriesTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<FaqCategory | null>(null);
  const deleteConfirm = useDeleteConfirm<FaqCategory>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteFaqCategoryAction(id),
    invalidateKeys: [queryKeys.faqs.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildFaqCategoryColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={categories}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari kategori FAQ..."
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
            <span>Tambah Kategori</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada kategori FAQ"
        emptyDescription="Tambahkan kategori untuk mengelompokkan daftar pertanyaan umum."
      />

      <FaqCategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Kategori FAQ?"
        description={`Kategori "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
