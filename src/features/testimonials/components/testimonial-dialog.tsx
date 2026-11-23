"use client";

import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveTestimonialAction } from "@/features/testimonials/actions/testimonials.actions";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { TestimonialItem } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

interface TestimonialFormValues {
  name: string;
  title: string;
  rating: number;
  order: number;
  message: string;
  is_active: boolean;
  avatar: File | null;
}

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial: TestimonialItem | null;
}

function buildTestimonialFormData(values: TestimonialFormValues): FormData {
  return new FormDataBuilder()
    .appendText("name", values.name.trim())
    .appendOptionalText("title", values.title.trim())
    .appendNumber("rating", values.rating)
    .appendNumber("order", values.order)
    .appendText("message", values.message.trim())
    .appendBoolean("is_active", values.is_active)
    .appendFile("avatar", values.avatar)
    .build();
}

export function TestimonialDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<TestimonialFormValues>({
    values: {
      name: testimonial?.name ?? "",
      title: testimonial?.title ?? "",
      rating: testimonial?.rating ?? 5,
      order: testimonial?.order ?? 1,
      message: testimonial?.message ?? "",
      is_active: testimonial?.is_active ?? true,
      avatar: null,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: TestimonialFormValues) =>
      saveTestimonialAction(
        testimonial?.id ?? null,
        buildTestimonialFormData(values)
      ),
    invalidateKeys: [queryKeys.testimonials.all(siteKey)],
    onSuccess: () => {
      methods.reset();
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
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          methods.reset();
        }
        onOpenChange(isOpen);
      }}
      title={testimonial ? "Edit Testimoni" : "Tambah Testimoni Baru"}
      description="Tambahkan ulasan dari klien atau mitra untuk membangun kepercayaan publik."
      size="xl"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<TestimonialFormValues>
              name="name"
              label="Nama Lengkap Klien"
              placeholder="Ahmad Hidayat"
              required
            />
            <FormInput<TestimonialFormValues>
              name="title"
              label="Jabatan / Instansi (Opsional)"
              placeholder="CEO PT Maju Bersama"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputStepper<TestimonialFormValues>
              name="rating"
              label="Rating Kepuasan (1-5)"
              min={1}
              max={5}
            />
            <FormInputStepper<TestimonialFormValues>
              name="order"
              label="Urutan Tampil"
              min={0}
            />
          </div>

          <FormTextarea<TestimonialFormValues>
            name="message"
            label="Kutipan Ulasan"
            placeholder="Tuliskan testimoni dari klien..."
            rows={4}
            required
          />

          <FormImageUpload<TestimonialFormValues>
            name="avatar"
            label="Foto Profil Klien (Opsional)"
            initialUrl={testimonial?.avatar_url ?? testimonial?.avatar_path}
            aspectHint="1:1"
          />

          <FormSwitch<TestimonialFormValues>
            name="is_active"
            label="Aktif di Website"
            description="Tampilkan testimoni ini di halaman publik."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={testimonial ? "Simpan Perubahan" : "Simpan Testimoni"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
