"use client";

import { Phone } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormMapsLocationPicker } from "@/components/forms/form-maps-location-picker";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { FormWhatsappInput } from "@/components/forms/form-whatsapp-input";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveBranchAction } from "@/features/branches/actions/branches.actions";
import type { BranchFormValues } from "@/features/branches/schemas/branch.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { BranchItem } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

interface BranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: BranchItem | null;
}

function getBranchFormValues(branch: BranchItem | null): BranchFormValues {
  return {
    name: branch?.name ?? "",
    address: branch?.address ?? "",
    phone: branch?.phone ?? "",
    whatsapp: branch?.whatsapp ?? "",
    maps_embed: branch?.maps_embed ?? "",
    order: branch?.order ?? 0,
    is_primary: branch?.is_primary ?? false,
    images: [],
  };
}

function buildBranchFormData(values: BranchFormValues): FormData {
  return new FormDataBuilder()
    .appendText("name", values.name.trim())
    .appendText("address", values.address.trim())
    .appendOptionalText("phone", values.phone.trim())
    .appendOptionalText("whatsapp", values.whatsapp.trim())
    .appendOptionalText("maps_embed", values.maps_embed.trim())
    .appendNumber("order", values.order)
    .appendBoolean("is_primary", values.is_primary)
    .appendFiles("images", values.images)
    .build();
}

export function BranchDialog({
  open,
  onOpenChange,
  branch,
}: BranchDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<BranchFormValues>({
    values: getBranchFormValues(branch),
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: BranchFormValues) =>
      saveBranchAction(branch?.id ?? null, buildBranchFormData(values)),
    invalidateKeys: [queryKeys.branches.all(siteKey)],
    onSuccess: () => {
      methods.reset();
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const existingImages: ExistingGalleryItem[] = (branch?.image_urls ?? []).map(
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
      title={branch ? "Edit Kantor / Cabang" : "Tambah Kantor / Cabang"}
      description="Lengkapi nama lokasi kantor, alamat, kontak telepon, dan foto galeri cabang."
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
            <FormInput<BranchFormValues>
              name="name"
              label="Nama Kantor / Cabang"
              placeholder="Kantor Cabang Karanganyar"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<BranchFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<BranchFormValues>
              name="phone"
              label="Nomor Telepon (Opsional)"
              placeholder="(0271)-6493247"
              maxLength={40}
              leftIcon={<Phone className="size-4" />}
            />
            <FormWhatsappInput<BranchFormValues>
              name="whatsapp"
              label="Nomor WhatsApp (Opsional)"
              placeholder="82247170756"

            />
          </div>

          <FormTextarea<BranchFormValues>
            name="address"
            label="Alamat Lengkap"
            placeholder="Jl. Raya Solo - Tawangmangu..."
            rows={3}
            required
          />

          <FormMapsLocationPicker<BranchFormValues>
            name="maps_embed"
            addressFieldName="address"
            label="Titik Lokasi Peta Cabang (Opsional)"
            mapHeightClassName="h-[220px]"
          />

          <FormMultiImageUpload<BranchFormValues>
            name="images"
            label="Galeri Foto Lokasi (Opsional)"
            existingImages={existingImages}
            helperText="Unggah beberapa foto tampak depan atau interior kantor cabang."
          />

          <FormSwitch<BranchFormValues>
            name="is_primary"
            label="Tandai sebagai Kantor Pusat"
            description="Menyorot lokasi ini sebagai kantor pusat utama."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={branch ? "Simpan Perubahan" : "Simpan Cabang"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
