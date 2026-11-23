"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { deleteArticleAction } from "@/features/articles/actions/articles.actions";
import { buildArticleColumns } from "@/features/articles/components/article-columns";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ArticleCategory, ArticleItem } from "@/types/cms.types";

interface ArticlesTableProps {
  articles: ArticleItem[];
  categories: ArticleCategory[];
}

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "published", label: "Dipublikasikan" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Diarsipkan" },
];

export function ArticlesTable({
  articles,
  categories,
}: ArticlesTableProps): React.JSX.Element {
  const router = useRouter();
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const deleteConfirm = useDeleteConfirm<ArticleItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteArticleAction(id),
    invalidateKeys: [queryKeys.articles.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return articles.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesCat =
        categoryFilter === "all" ||
        String(item.article_category_id ?? "") === categoryFilter;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.excerpt?.toLowerCase().includes(query) ?? false);
      return matchesStatus && matchesCat && matchesQuery;
    });
  }, [articles, search, statusFilter, categoryFilter]);

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "Semua Kategori" },
      ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
    ],
    [categories]
  );

  const columns = useMemo(
    () => buildArticleColumns(categories),
    [categories]
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul atau ringkasan artikel..."
        onRowClick={(item) => {
          router.push(`/articles/${item.id}/edit`);
        }}
        filterContent={
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-40">
              <InputOption
                value={statusFilter}
                onValueChange={setStatusFilter}
                options={STATUS_FILTER_OPTIONS}
                searchable={false}
                size="sm"
              />
            </div>
            <div className="w-44">
              <InputOption
                value={categoryFilter}
                onValueChange={setCategoryFilter}
                options={categoryOptions}
                searchable={false}
                size="sm"
              />
            </div>
          </div>
        }
        toolbarRight={
          <Button
            size="sm"
            nativeButton={false}
            render={<Link href="/articles/create" />}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tulis Artikel</span>
          </Button>
        }
        onEdit={(item) => {
          router.push(`/articles/${item.id}/edit`);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada artikel"
        emptyDescription="Tulis berita atau artikel edukasi baru untuk unit usaha ini."
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Artikel?"
        description={`Artikel "${deleteConfirm.target?.title ?? ""}" akan dihapus permanen.`}
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
