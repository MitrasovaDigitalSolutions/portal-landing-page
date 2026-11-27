"use client";

import { Globe, Phone } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { BaseDialog } from "@/components/ui/base-dialog";
import { savePartnerAction } from "@/features/partners/actions/partners.actions";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PartnerItem } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

interface PartnerFormValues {
  name: string;
  website_url: string;
  phone: string;
  order: number;
  logo: File | null;
}

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: PartnerItem | null;
}

function buildPartnerFormData(values: PartnerFormValues): FormData {
  return new FormDataBuilder()
    .appendText("name", values.name.trim())
    .appendOptionalText("website_url", values.website_url.trim())
    .appendOptionalText("phone", values.phone.trim())
    .appendNumber("order", values.order)
    .appendFile("logo", values.logo)
    .build();
}

export function PartnerDialog({
  open,
  onOpenChange,
  partner,
}: PartnerDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<PartnerFormValues>({
    values: {
      name: partner?.name ?? "",
      website_url: partner?.website_url ?? "",
      phone: partner?.phone ?? "",
      order: partner?.order ?? 1,
      logo: null,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: PartnerFormValues) =>
      savePartnerAction(partner?.id ?? null, buildPartnerFormData(values)),
    invalidateKeys: [queryKeys.partners.all(siteKey)],
    onSuccess: () => {
      methods.reset();
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    if (!partner && !(values.logo instanceof File)) {
      methods.setError("logo", {
        type: "manual",
        message: "File logo wajib diunggah saat menambahkan partner baru.",
      });
      return;
    }
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
      title={partner ? "Edit Partner / Klien" : "Tambah Logo Partner / Klien"}
      description="Logo mitra dan klien akan ditampilkan pada bagian jaringan kemitraan."
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
            <FormInput<PartnerFormValues>
              name="name"
              label="Nama Mitra / Perusahaan"
              placeholder="Bank Jateng"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<PartnerFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<PartnerFormValues>
              name="website_url"
              label="Website / Instagram (Opsional)"
              type="url"
              placeholder="https://instagram.com/mitra"
              leftIcon={<Globe className="size-4" />}
            />
            <FormInput<PartnerFormValues>
              name="phone"
              label="Nomor HP / WhatsApp (Opsional)"
              placeholder="081234567890"
              maxLength={30}
              leftIcon={<Phone className="size-4" />}
            />
          </div>

          <FormImageUpload<PartnerFormValues>
            name="logo"
            label="Logo Mitra"
            initialUrl={partner?.logo_url ?? partner?.logo_path}
            required={!partner}
            maxSizeMB={5}
            helperText="Mendukung format JPG, PNG, WebP, atau SVG (maks. 5MB)."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={partner ? "Simpan Perubahan" : "Simpan Partner"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
