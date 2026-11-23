"use client";

import { FormProvider, useForm } from "react-hook-form";
import { FormDatePicker } from "@/components/forms/form-date-picker";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { savePortfolioAction } from "@/features/portfolios/actions/portfolios.actions";
import type { PortfolioFormValues } from "@/features/portfolios/schemas/portfolio.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PortfolioItem, ServiceType } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

interface PortfolioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio: PortfolioItem | null;
  types: ServiceType[];
}

function buildPortfolioFormData(values: PortfolioFormValues): FormData {
  return new FormDataBuilder()
    .appendText("title", values.title.trim())
    .appendText("slug", values.slug.trim())
    .appendText("service_type_id", values.service_type_id)
    .appendOptionalText("client_name", values.client_name.trim())
    .appendOptionalText("completion_date", values.completion_date.trim())
    .appendOptionalText("description", values.description.trim())
    .appendNumber("order", values.order)
    .appendBoolean("is_featured", values.is_featured)
    .appendFile("thumbnail", values.thumbnail)
    .appendFiles("gallery", values.gallery)
    .build();
}

function getPortfolioFormValues(
  portfolio: PortfolioItem | null
): PortfolioFormValues {
  return {
    title: portfolio?.title ?? "",
    slug: portfolio?.slug ?? "",
    service_type_id: portfolio?.service_type_id
      ? String(portfolio.service_type_id)
      : "",
    client_name: portfolio?.client_name ?? "",
    completion_date: portfolio?.completion_date
      ? portfolio.completion_date.slice(0, 10)
      : "",
    description: portfolio?.description ?? "",
    order: portfolio?.order ?? 1,
    is_featured: portfolio?.is_featured ?? false,
    thumbnail: null,
    gallery: [],
  };
}

export function PortfolioFormDialog({
  open,
  onOpenChange,
  portfolio,
  types,
}: PortfolioFormDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<PortfolioFormValues>({
    values: getPortfolioFormValues(portfolio),
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: PortfolioFormValues) =>
      savePortfolioAction(
        portfolio?.id ?? null,
        buildPortfolioFormData(values)
      ),
    invalidateKeys: [queryKeys.portfolios.all(siteKey)],
    onSuccess: () => {
      methods.reset();
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    if (!portfolio && !(values.thumbnail instanceof File)) {
      methods.setError("thumbnail", {
        type: "manual",
        message: "Foto thumbnail wajib diunggah untuk portofolio baru.",
      });
      return;
    }
    mutation.mutate(values);
  });

  const typeOptions = [
    { value: "", label: "Tanpa Tipe Layanan" },
    ...types.map((t) => ({ value: String(t.id), label: t.name })),
  ];

  const existingGallery: ExistingGalleryItem[] = (
    portfolio?.gallery_image_urls ??
    portfolio?.gallery_images ??
    []
  ).map((url, idx) => ({ id: idx, url }));

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          methods.reset();
        }
        onOpenChange(isOpen);
      }}
      title={portfolio ? "Edit Portofolio" : "Tambah Portofolio Baru"}
      description="Dokumentasikan hasil proyek lengkap dengan thumbnail dan galeri foto."
      size="2xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<PortfolioFormValues>
              name="title"
              label="Judul Proyek"
              placeholder="Implementasi Sistem..."
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<PortfolioFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputOption<PortfolioFormValues>
              name="service_type_id"
              label="Tipe Layanan"
              options={typeOptions}
            />
            <FormInput<PortfolioFormValues>
              name="slug"
              label="Slug URL (Opsional)"
              placeholder="Otomatis dari judul"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<PortfolioFormValues>
              name="client_name"
              label="Nama Klien / Perusahaan"
              placeholder="PT Mitra Sejahtera"
            />
            <FormDatePicker<PortfolioFormValues>
              name="completion_date"
              label="Tanggal Selesai"
              placeholder="Pilih tanggal selesai..."
            />
          </div>

          <FormTextarea<PortfolioFormValues>
            name="description"
            label="Deskripsi Proyek"
            placeholder="Uraikan lingkup pekerjaan dan hasil yang dicapai..."
            rows={3}
          />

          <FormImageUpload<PortfolioFormValues>
            name="thumbnail"
            label="Thumbnail Utama"
            initialUrl={portfolio?.thumbnail_url ?? portfolio?.thumbnail_path}
            aspectHint="16:9"
            required={!portfolio}
          />

          <FormMultiImageUpload<PortfolioFormValues>
            name="gallery"
            label="Galeri Foto Tambahan (Opsional)"
            existingImages={existingGallery}
            helperText="Unggah beberapa foto dokumentasi tambahan."
          />

          <FormSwitch<PortfolioFormValues>
            name="is_featured"
            label="Tandai Portofolio Unggulan"
            description="Prioritaskan proyek ini pada bagian showcase utama."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={portfolio ? "Simpan Perubahan" : "Simpan Portofolio"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
