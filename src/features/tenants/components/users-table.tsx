"use client";

import { Building2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { DataTableActionButton } from "@/components/ui/data-table-actions";
import { buildUserColumns } from "@/features/tenants/components/user-columns";
import { UserFormDialog } from "@/features/tenants/components/user-form-dialog";
import { UserSiteAssignDialog } from "@/features/tenants/components/user-site-assign-dialog";
import type {
  ManagedSite,
  ManagedUser,
} from "@/features/tenants/types/tenants.types";

interface UsersTableProps {
  users: ManagedUser[];
  sites: ManagedSite[];
}

export function UsersTable({
  users,
  sites,
}: UsersTableProps): React.JSX.Element {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [assignUserId, setAssignUserId] = useState<number | null>(null);

  const columns = useMemo(() => buildUserColumns(), []);
  const activeAssignUser = useMemo(
    () => users.find((user) => user.id === assignUserId) ?? null,
    [users, assignUserId]
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={users}
        getRowId={(row) => String(row.id)}
        enableSearch
        searchPlaceholder="Cari nama atau email admin..."
        toolbarRight={
          <Button
            size="sm"
            onClick={() => {
              setSelectedUser(null);
              setFormOpen(true);
            }}
            className="h-9 gap-1.5 rounded-xl px-3.5 text-xs font-semibold shadow-xs"
          >
            <Plus className="size-4" />
            <span>Tambah Admin</span>
          </Button>
        }
        onEdit={(item) => {
          setSelectedUser(item);
          setFormOpen(true);
        }}
        renderActions={(item) => (
          <DataTableActionButton
            variant="primary"
            label="Atur Penugasan Tenant"
            icon={<Building2 className="h-4 w-4" />}
            onClick={() => {
              setAssignUserId(item.id);
            }}
          />
        )}
        emptyTitle="Belum ada pengguna admin"
        emptyDescription="Tambahkan akun admin atau editor untuk mengelola unit usaha."
      />

      <UserFormDialog
        user={selectedUser}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      <UserSiteAssignDialog
        user={activeAssignUser}
        sites={sites}
        open={activeAssignUser !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setAssignUserId(null);
          }
        }}
      />
    </div>
  );
}
