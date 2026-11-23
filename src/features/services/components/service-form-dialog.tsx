"use client";

import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormFeatureList } from "@/components/forms/form-feature-list";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormRichText } from "@/components/forms/form-rich-text";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveServiceAction } from "@/features/services/actions/services.actions";
import type { ServiceFormValues } from "@/features/services/schemas/service.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ServiceItem, ServiceType } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

interface ServiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceItem | null;
  types: ServiceType[];
}

function buildServiceFormData(values: ServiceFormValues): FormData {
  const cleanedFeatures = values.features
    .map((item) => item.trim())
    .filter(Boolean);

  return new FormDataBuilder()
    .appendText("name", values.name.trim())
    .appendText("slug", values.slug.trim())
    .appendText("service_type_id", values.service_type_id)
    .appendText("short_desc", values.short_desc.trim())
    .appendText("body", values.body.trim())
    .appendNumber("order", values.order)
    .appendBoolean("is_active", values.is_active)
    .appendBoolean("is_featured", values.is_featured)
    .appendNested("features", cleanedFeatures)
    .appendFile("thumbnail", values.thumbnail)
    .appendFile("icon", values.icon)
    .build();
}

function getInitialValues(
  service: ServiceItem | null,
  types: ServiceType[]
): ServiceFormValues {
  const fallbackTypeId = types[0] ? String(types[0].id) : "";
  return {
    name: service?.name ?? "",
    slug: service?.slug ?? "",
    service_type_id: service ? String(service.service_type_id) : fallbackTypeId,
    short_desc: service?.short_desc ?? "",
    body: service?.body ?? "",
    features: service?.features ?? [],
    order: service?.order ?? 1,
    is_active: service?.is_active ?? true,
    is_featured: service?.is_featured ?? false,
    thumbnail: null,
    icon: null,
  };
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
  types,
}: ServiceFormDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<ServiceFormValues>({
    values: getInitialValues(service, types),
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: ServiceFormValues) =>
      saveServiceAction(service?.id ?? null, buildServiceFormData(values)),
    invalidateKeys: [queryKeys.services.all(siteKey)],
    onSuccess: () => {
      methods.reset();
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const typeOptions = types.map((typeItem) => ({
    value: String(typeItem.id),
    label: typeItem.name,
  }));

  const handleSubmit = methods.handleSubmit((values) => {
    if (!values.service_type_id) {
      methods.setError("service_type_id", {
        message: "Pilih tipe layanan terlebih dahulu.",
      });
      return;
    }
    mutation.mutate(values);
  });

  const handleDialogOpenChange = (isOpen: boolean): void => {
    if (!isOpen) methods.reset();
    onOpenChange(isOpen);
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={handleDialogOpenChange}
      title={service ? "Edit Layanan" : "Tambah Layanan Baru"}
      description="Lengkapi informasi layanan, fitur keunggulan, serta media pendukung."
      size="2xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={(event) => { void handleSubmit(event); }} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<ServiceFormValues> name="name" label="Nama Layanan" placeholder="Simpanan Berjangka Prima" containerClassName="sm:col-span-2" required />
            <FormInputStepper<ServiceFormValues> name="order" label="Urutan Tampil" min={0} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputOption<ServiceFormValues> name="service_type_id" label="Tipe Layanan" placeholder="Pilih tipe layanan..." options={typeOptions} required />
            <FormInput<ServiceFormValues> name="slug" label="Slug URL (Opsional)" placeholder="Otomatis dari nama layanan" />
          </div>

          <FormTextarea<ServiceFormValues> name="short_desc" label="Ringkasan Singkat" placeholder="Deskripsi 1-2 kalimat untuk kartu layanan..." rows={2} maxLength={300} required />
          <FormRichText<ServiceFormValues> name="body" label="Deskripsi Lengkap" placeholder="Jelaskan detail produk/layanan secara komprehensif..." />
          <FormFeatureList<ServiceFormValues> name="features" label="Fitur & Keunggulan Layanan" helperText="Tekan Enter atau klik Tambah Poin untuk menambahkan daftar fitur." />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormImageUpload<ServiceFormValues>
              name="thumbnail"
              label="Foto Thumbnail"
              initialUrl={service?.thumbnail_url ?? service?.thumbnail_path}
              aspectHint="16:9"
            />
            <FormImageUpload<ServiceFormValues>
              name="icon"
              label="File Ikon (Opsional)"
              initialUrl={service?.icon_url ?? service?.icon_path}
              aspectHint="1:1"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormSwitch<ServiceFormValues>
              name="is_active"
              label="Aktif di Website"
              description="Tampilkan layanan di publik."
            />
            <FormSwitch<ServiceFormValues>
              name="is_featured"
              label="Layanan Unggulan"
              description="Sorot di halaman beranda."
            />
          </div>

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={service ? "Simpan Perubahan" : "Simpan Layanan"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
