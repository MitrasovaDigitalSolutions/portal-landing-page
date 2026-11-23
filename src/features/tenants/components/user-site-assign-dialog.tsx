"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInputOption } from "@/components/forms/form-input-option";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  assignUserToSiteAction,
  detachUserFromSiteAction,
} from "@/features/tenants/actions/tenants.actions";
import { UserAssignedSitesList } from "@/features/tenants/components/user-assigned-sites-list";
import {
  assignUserSiteSchema,
  type AssignUserSiteValues,
} from "@/features/tenants/schemas/tenant.schemas";
import type {
  ManagedSite,
  ManagedUser,
} from "@/features/tenants/types/tenants.types";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { queryKeys } from "@/lib/query-keys";

interface UserSiteAssignDialogProps {
  user: ManagedUser | null;
  sites: ManagedSite[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
];

export function UserSiteAssignDialog({
  user,
  sites,
  open,
  onOpenChange,
}: UserSiteAssignDialogProps): React.JSX.Element {
  const fallbackSiteId = sites[0] ? sites[0].id : "";
  const methods = useForm<AssignUserSiteValues>({
    resolver: zodResolver(assignUserSiteSchema),
    values: {
      site_id: fallbackSiteId,
      role: "admin",
    },
  });

  const assignMutation = useCrudMutation({
    mutationFn: async (values: AssignUserSiteValues) => {
      if (!user) {
        return { success: false, message: "Pengguna tidak ditemukan." };
      }
      return assignUserToSiteAction(user.id, values);
    },
    invalidateKeys: [queryKeys.users.all],
  });

  const detachMutation = useCrudMutation({
    mutationFn: async (siteId: string) => {
      if (!user) {
        return { success: false, message: "Pengguna tidak ditemukan." };
      }
      return detachUserFromSiteAction(siteId, user.id);
    },
    invalidateKeys: [queryKeys.users.all],
  });

  const siteOptions = sites.map((site) => ({
    value: site.id,
    label: `${site.name} (/${site.slug})`,
  }));

  const handleAssign = methods.handleSubmit((values) => {
    assignMutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Penugasan Tenant: ${user?.name ?? ""}`}
      description="Atur unit usaha yang dapat dikelola oleh admin atau editor ini."
      size="lg"
    >
      <div className="space-y-4">
        <UserAssignedSitesList
          sites={user?.sites ?? []}
          isBusy={detachMutation.isPending}
          onDetach={(siteId) => {
            detachMutation.mutate(siteId);
          }}
        />

        <FormProvider {...methods}>
          <form
            onSubmit={(event) => {
              void handleAssign(event);
            }}
            className="space-y-4 border-t border-slate-100 pt-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormInputOption<AssignUserSiteValues>
                name="site_id"
                label="Pilih Tenant"
                options={siteOptions}
                containerClassName="sm:col-span-2"
                required
              />
              <FormInputOption<AssignUserSiteValues>
                name="role"
                label="Role Akses"
                searchable={false}
                options={ROLE_OPTIONS}
              />
            </div>

            <FormDialogFooter
              onCancel={() => {
                onOpenChange(false);
              }}
              cancelLabel="Tutup"
              submitLabel="Assign ke Tenant"
              isSubmitting={assignMutation.isPending}
              className="pt-3"
            />
          </form>
        </FormProvider>
      </div>
    </BaseDialog>
  );
}
