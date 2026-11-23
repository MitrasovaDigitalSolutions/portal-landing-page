"use client";

import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/portal/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActionButton } from "@/components/ui/data-table-actions";
import { InputOption } from "@/components/ui/input-option";
import { deleteInquiryAction } from "@/features/inquiries/actions/inquiries.actions";
import { buildInquiryColumns } from "@/features/inquiries/components/inquiry-columns";
import { InquiryReplyDialog } from "@/features/inquiries/components/inquiry-reply-dialog";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useDeleteConfirm } from "@/hooks/use-delete-confirm";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { InquiryItem } from "@/types/cms.types";

interface InquiriesTableProps {
  inquiries: InquiryItem[];
}

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "Semua Status" },
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "closed", label: "Selesai" },
];

export function InquiriesTable({
  inquiries,
}: InquiriesTableProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<InquiryItem | null>(null);
  const deleteConfirm = useDeleteConfirm<InquiryItem>();

  const deleteMutation = useCrudMutation({
    mutationFn: (id: number) => deleteInquiryAction(id),
    invalidateKeys: [queryKeys.contacts.all(siteKey)],
    onSuccess: () => {
      deleteConfirm.close();
    },
    onError: () => {
      deleteConfirm.close();
    },
  });

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return inquiries.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.phone.toLowerCase().includes(query) ||
        (item.email?.toLowerCase().includes(query) ?? false) ||
        (item.subject?.toLowerCase().includes(query) ?? false) ||
        item.message.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [inquiries, search, statusFilter]);

  const columns = useMemo(() => buildInquiryColumns(), []);

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari pengirim, nomor HP, subjek, atau pesan..."
        onRowClick={(item) => {
          setSelected(item);
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
        renderActions={(item) => (
          <DataTableActionButton
            variant="primary"
            label="Lihat & Tindak Lanjuti"
            icon={<Eye className="size-4" />}
            onClick={() => {
              setSelected(item);
            }}
          />
        )}
        onDelete={(item) => {
          deleteConfirm.requestDelete(item);
        }}
        emptyTitle="Belum ada pesan masuk"
        emptyDescription="Pesan dari formulir kontak website akan muncul di sini."
      />

      <InquiryReplyDialog
        inquiry={selected}
        open={selected !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelected(null);
          }
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setOpen}
        title="Hapus Pesan Masuk?"
        description={`Pesan dari "${deleteConfirm.target?.name ?? ""}" akan dihapus permanen.`}
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
