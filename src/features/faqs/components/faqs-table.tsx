"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { deleteFaqAction } from "@/features/faqs/actions/faqs.actions";
import { buildFaqColumns } from "@/features/faqs/components/faq-columns";
import { FaqDialog } from "@/features/faqs/components/faq-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { FaqCategory, FaqItem } from "@/types/cms.types";

interface FaqsTableProps {
  faqs: FaqItem[];
  categories: FaqCategory[];
}

export function FaqsTable({
  faqs,
  categories,
}: FaqsTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<FaqItem | null>(null);
  const deleteConfirm = useDeleteConfirm<FaqItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteFaqAction(id),
    invalidateKeys: [queryKeys.faqs.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return faqs.filter((item) => {
      const matchesCat =
        categoryFilter === "all" ||
        String(item.faq_category_id ?? "") === categoryFilter;
      const matchesQuery =
        !query ||
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });
  }, [faqs, search, categoryFilter]);

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Semua Kategori" },
      ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
    ],
    [categories]
  );

  const columns = useMemo(() => buildFaqColumns(categories), [categories]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari pertanyaan atau jawaban FAQ..."
        filterContent={
          <div className="w-44">
            <InputOption
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              options={categoryOptions}
              searchable={false}
              size="sm"
            />
          </div>
        }
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
            <span>Tambah FAQ</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada FAQ"
        emptyDescription="Tambahkan daftar tanya jawab umum untuk membantu pengunjung."
      />

      <FaqDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        faq={selected}
        categories={categories}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus FAQ?"
        description="Pertanyaan FAQ yang dipilih akan dihapus permanen."
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
