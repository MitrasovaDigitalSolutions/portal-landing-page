"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteTestimonialAction } from "@/features/testimonials/actions/testimonials.actions";
import { buildTestimonialColumns } from "@/features/testimonials/components/testimonial-columns";
import { TestimonialDialog } from "@/features/testimonials/components/testimonial-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { TestimonialItem } from "@/types/cms.types";

interface TestimonialsTableProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsTable({
  testimonials,
}: TestimonialsTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<TestimonialItem | null>(null);
  const deleteConfirm = useDeleteConfirm<TestimonialItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteTestimonialAction(id),
    invalidateKeys: [queryKeys.testimonials.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildTestimonialColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={testimonials}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama klien atau isi testimoni..."
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
            <span>Tambah Testimoni</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada testimoni"
        emptyDescription="Tambahkan testimoni kepuasan pelanggan untuk ditampilkan pada website."
      />

      <TestimonialDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        testimonial={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Testimoni?"
        description={`Testimoni dari "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
