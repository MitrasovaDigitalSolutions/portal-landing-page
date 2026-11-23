"use client";

import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { deletePortfolioAction } from "@/features/portfolios/actions/portfolios.actions";
import { buildPortfolioColumns } from "@/features/portfolios/components/portfolio-columns";
import { PortfolioFormDialog } from "@/features/portfolios/components/portfolio-form-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PortfolioItem, ServiceType } from "@/types/cms.types";

interface PortfoliosTableProps {
  portfolios: PortfolioItem[];
  types: ServiceType[];
}

export function PortfoliosTable({
  portfolios,
  types,
}: PortfoliosTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PortfolioItem | null>(null);
  const deleteConfirm = useDeleteConfirm<PortfolioItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deletePortfolioAction(id),
    invalidateKeys: [queryKeys.portfolios.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return portfolios.filter((item) => {
      const matchesType =
        typeFilter === "all" ||
        String(item.service_type_id ?? "") === typeFilter;
      const matchesQuery =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.client_name?.toLowerCase().includes(query) ?? false);
      return matchesType && matchesQuery;
    });
  }, [portfolios, search, typeFilter]);

  const filterOptions = useMemo(
    () => [
      { value: "all", label: "Semua Tipe" },
      ...types.map((t) => ({ value: String(t.id), label: t.name })),
    ],
    [types]
  );

  const columns = useMemo(() => buildPortfolioColumns(types), [types]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari judul proyek atau nama klien..."
        filterContent={
          <div className="w-44">
            <InputOption
              value={typeFilter}
              onValueChange={setTypeFilter}
              options={filterOptions}
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
            <span>Tambah Portofolio</span>
          </Button>
        }
        onEdit={(item) => {
          setSelected(item);
          setFormOpen(true);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada portofolio"
        emptyDescription="Dokumentasikan proyek dan studi kasus terbaik untuk unit usaha ini."
      />

      <PortfolioFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        portfolio={selected}
        types={types}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Portofolio?"
        description={`Portofolio "${deleteConfirm.target?.title ?? ""}" akan dihapus permanen.`}
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
