"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { InputOption } from "@/components/ui/input-option";
import { deleteServiceAction } from "@/features/services/actions/services.actions";
import { buildServiceColumns } from "@/features/services/components/service-columns";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ServiceItem, ServiceType } from "@/types/cms.types";

interface ServicesTableProps {
  services: ServiceItem[];
  types: ServiceType[];
}

export function ServicesTable({
  services,
  types,
}: ServicesTableProps): React.JSX.Element {
  const router = useRouter();
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const deleteConfirm = useDeleteConfirm<ServiceItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteServiceAction(id),
    invalidateKeys: [queryKeys.services.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((srv) => {
      const matchesType =
        typeFilter === "all" || String(srv.service_type_id) === typeFilter;
      const matchesQuery =
        !query ||
        srv.name.toLowerCase().includes(query) ||
        srv.short_desc.toLowerCase().includes(query);
      return matchesType && matchesQuery;
    });
  }, [services, search, typeFilter]);

  const filterOptions = useMemo(
    () => [
      { value: "all", label: "Semua Tipe" },
      ...types.map((t) => ({ value: String(t.id), label: t.name })),
    ],
    [types]
  );

  const columns = useMemo(() => buildServiceColumns(types), [types]);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nama atau ringkasan layanan..."
        onRowClick={(item) => {
          router.push(`/services/${item.id}/edit`);
        }}
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
            nativeButton={false}
            render={<Link href="/services/create" />}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Layanan</span>
          </Button>
        }
        onEdit={(item) => {
          router.push(`/services/${item.id}/edit`);
        }}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada layanan"
        emptyDescription="Tambahkan layanan atau produk baru untuk unit usaha ini."
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Layanan?"
        description={`Layanan "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
