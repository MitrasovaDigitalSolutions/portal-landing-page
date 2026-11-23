"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { deleteArticleCategoryAction } from "@/features/articles/actions/articles.actions";
import { buildArticleCategoryColumns } from "@/features/articles/components/article-category-columns";
import { ArticleCategoryDialog } from "@/features/articles/components/article-category-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ArticleCategory } from "@/types/cms.types";

interface ArticleCategoriesTableProps {
  categories: ArticleCategory[];
}

export function ArticleCategoriesTable({
  categories,
}: ArticleCategoriesTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<ArticleCategory | null>(null);
  const deleteConfirm = useDeleteConfirm<ArticleCategory>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteArticleCategoryAction(id),
    invalidateKeys: [queryKeys.articles.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(() => buildArticleCategoryColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={categories}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari kategori artikel..."
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
        emptyTitle="Belum ada kategori artikel"
        emptyDescription="Tambahkan kategori untuk mengelompokkan berita dan artikel."
      />

      <ArticleCategoryDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selected}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Kategori Artikel?"
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
