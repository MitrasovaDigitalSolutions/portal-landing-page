"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveServiceTypeAction } from "@/features/services/actions/services.actions";
import {
  serviceTypeSchema,
  type ServiceTypeFormValues,
} from "@/features/services/schemas/service.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ServiceType } from "@/types/cms.types";

interface ServiceTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceType: ServiceType | null;
}

export function ServiceTypeDialog({
  open,
  onOpenChange,
  serviceType,
}: ServiceTypeDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<ServiceTypeFormValues>({
    resolver: zodResolver(serviceTypeSchema),
    values: {
      name: serviceType?.name ?? "",
      slug: serviceType?.slug ?? "",
      description: serviceType?.description ?? "",
      icon: serviceType?.icon ?? "piggy-bank",
      order: serviceType?.order ?? 1,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: ServiceTypeFormValues) =>
      saveServiceTypeAction(serviceType?.id ?? null, values),
    invalidateKeys: [queryKeys.services.all(siteKey)],
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
      title={serviceType ? "Edit Tipe Layanan" : "Tambah Tipe Layanan Baru"}
      description="Kelompokkan produk atau layanan ke dalam kategori tipe layanan."
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<ServiceTypeFormValues>
              name="name"
              label="Nama Tipe Layanan"
              placeholder="Simpanan Berjangka"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<ServiceTypeFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<ServiceTypeFormValues>
              name="slug"
              label="Slug URL (Opsional)"
              placeholder="Otomatis dari nama"
            />
            <FormInput<ServiceTypeFormValues>
              name="icon"
              label="Nama Ikon Lucide"
              placeholder="piggy-bank"
            />
          </div>

          <FormTextarea<ServiceTypeFormValues>
            name="description"
            label="Deskripsi Singkat"
            placeholder="Deskripsi kategori tipe layanan..."
            rows={3}
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={serviceType ? "Simpan Perubahan" : "Simpan Tipe"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
