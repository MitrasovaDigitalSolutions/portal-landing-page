"use client";

import { Globe } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveBusinessUnitAction } from "@/features/business-units/actions/business-units.actions";
import type { BusinessUnitFormValues } from "@/features/business-units/schemas/business-unit.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { BusinessUnitItem } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

interface BusinessUnitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: BusinessUnitItem | null;
}

function getUnitFormValues(unit: BusinessUnitItem | null): BusinessUnitFormValues {
  return {
    name: unit?.name ?? "",
    address: unit?.address ?? "",
    url: unit?.url ?? "",
    order: unit?.order ?? 0,
    image: null,
    images: [],
  };
}

function buildUnitFormData(values: BusinessUnitFormValues): FormData {
  return new FormDataBuilder()
    .appendText("name", values.name.trim())
    .appendOptionalText("address", values.address.trim())
    .appendOptionalText("url", values.url.trim())
    .appendNumber("order", values.order)
    .appendFile("image", values.image)
    .appendFiles("images", values.images)
    .build();
}

export function BusinessUnitDialog({
  open,
  onOpenChange,
  unit,
}: BusinessUnitDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<BusinessUnitFormValues>({
    values: getUnitFormValues(unit),
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: BusinessUnitFormValues) =>
      saveBusinessUnitAction(unit?.id ?? null, buildUnitFormData(values)),
    invalidateKeys: [queryKeys.businessUnits.all(siteKey)],
    onSuccess: () => {
      methods.reset();
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const existingImages: ExistingGalleryItem[] = (unit?.image_urls ?? []).map(
    (url, idx) => ({ id: idx, url })
  );

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          methods.reset();
        }
        onOpenChange(isOpen);
      }}
      title={unit ? "Edit Unit Bisnis" : "Tambah Unit Bisnis Baru"}
      description="Kelola profil unit bisnis di bawah naungan perusahaan."
      size="xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<BusinessUnitFormValues>
              name="name"
              label="Nama Unit Bisnis"
              placeholder="Mitrasova Digital Solutions"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<BusinessUnitFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <FormInput<BusinessUnitFormValues>
            name="url"
            label="Website / Tautan (Opsional)"
            type="url"
            placeholder="https://unit.mitrasova.id"
            leftIcon={<Globe className="size-4" />}
          />

          <FormTextarea<BusinessUnitFormValues>
            name="address"
            label="Alamat Unit (Opsional)"
            placeholder="Alamat operasional unit bisnis..."
            rows={2}
          />

          <FormImageUpload<BusinessUnitFormValues>
            name="image"
            label="Foto Sampul / Logo Unit"
            initialUrl={unit?.image_url ?? unit?.image_path}
            aspectHint="16:9"
          />

          <FormMultiImageUpload<BusinessUnitFormValues>
            name="images"
            label="Galeri Foto Tambahan (Opsional)"
            existingImages={existingImages}
            helperText="Unggah beberapa foto kegiatan atau fasilitas unit bisnis."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={unit ? "Simpan Perubahan" : "Simpan Unit"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
