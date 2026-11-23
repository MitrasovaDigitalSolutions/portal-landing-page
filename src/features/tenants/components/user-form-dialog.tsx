"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail, User } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  createUserAction,
  updateUserAction,
} from "@/features/tenants/actions/tenants.actions";
import {
  createUserSchema,
  updateUserSchema,
  type UserFormValues,
} from "@/features/tenants/schemas/tenant.schemas";
import type { ManagedUser } from "@/features/tenants/types/tenants.types";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";

interface UserFormDialogProps {
  user: ManagedUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormDialog({
  user,
  open,
  onOpenChange,
}: UserFormDialogProps): React.JSX.Element {
  const methods = useForm<UserFormValues>({
    resolver: zodResolver(user ? updateUserSchema : createUserSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      is_superadmin: user?.is_superadmin ?? false,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: UserFormValues) =>
      user ? updateUserAction(user.id, values) : createUserAction(values),
    invalidateKeys: [queryKeys.users.all],
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={user ? "Edit Pengguna Admin" : "Tambah Admin Baru"}
      description="Kelola profil akses admin dan hak istimewa tingkat platform."
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <FormInput<UserFormValues>
            name="name"
            label="Nama Lengkap"
            placeholder="Budi Santoso"
            leftIcon={<User className="size-4" />}
            required
          />

          <FormInput<UserFormValues>
            name="email"
            label="Alamat Email"
            type="email"
            placeholder="admin@mitrasova.id"
            leftIcon={<Mail className="size-4" />}
            required
          />

          <FormInput<UserFormValues>
            name="password"
            label={user ? "Password Baru (Opsional)" : "Password Akun"}
            type="password"
            placeholder="Minimal 8 karakter"
            leftIcon={<Lock className="size-4" />}
            helperText={
              user
                ? "Kosongkan jika tidak ingin mengganti password."
                : undefined
            }
            required={!user}
          />

          <FormSwitch<UserFormValues>
            name="is_superadmin"
            label="Hak Akses Superadmin"
            description="Mengizinkan akses penuh ke seluruh tenant dan manajemen pengguna."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={user ? "Simpan Perubahan" : "Simpan Admin"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
