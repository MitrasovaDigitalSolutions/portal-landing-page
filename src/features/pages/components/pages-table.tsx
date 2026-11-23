"use client";

import { Layers, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActionButton } from "@/components/ui/data-table-actions";
import { InputOption, type OptionItem } from "@/components/ui/input-option";
import { deletePageAction } from "@/features/pages/actions/pages.actions";
import { buildPageColumns } from "@/features/pages/components/page-columns";
import { PageFormDialog } from "@/features/pages/components/page-form-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PageSummary } from "@/types/cms.types";

interface PagesTableProps {
  pages: PageSummary[];
}

const STATUS_FILTER_OPTIONS: OptionItem[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

export function PagesTable({ pages }: PagesTableProps): React.JSX.Element {
  const router = useRouter();
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageSummary | null>(null);
  const deleteConfirm = useDeleteConfirm<PageSummary>();

  const filteredPages = useMemo(() => {
    if (statusFilter === "all") {
      return pages;
    }
    return pages.filter((page) =>
      statusFilter === "active" ? page.is_active : !page.is_active
    );
  }, [pages, statusFilter]);

  const deleteMutation = useCrudMutation({
    mutationFn: (target: PageSummary) =>
      deletePageAction(target.id, target.slug),
    invalidateKeys: [queryKeys.pages.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const columns = useMemo(
    () =>
      buildPageColumns((page) => {
        router.push(`/pages/${page.id}`);
      }),
    [router]
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filteredPages}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari judul halaman, slug, atau SEO..."
        onRowClick={(row) => {
          router.push(`/pages/${row.id}`);
        }}
        filterContent={
          <div className="w-40">
            <InputOption
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
              searchable={false}
              size="sm"
            />
          </div>
        }
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelectedPage(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Halaman</span>
          </Button>
        }
        onEdit={(item) => {
          setSelectedPage(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        renderActions={(item) => (
          <DataTableActionButton
            variant="primary"
            label="Kelola Section"
            icon={<Layers className="size-4" />}
            onClick={() => {
              router.push(`/pages/${item.id}`);
            }}
          />
        )}
        emptyTitle="Belum ada halaman"
        emptyDescription="Tambahkan halaman dan susun konten section untuk tenant ini."
      />

      <PageFormDialog
        page={selectedPage}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Halaman?"
        description={`Halaman "${deleteConfirm.target?.title ?? ""}" beserta seluruh section di dalamnya akan dihapus permanen.`}
        isLoading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteConfirm.target) {
            deleteMutation.mutate(deleteConfirm.target);
          }
        }}
      />
    </div>
  );
}
