"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveFaqCategoryAction } from "@/features/faqs/actions/faqs.actions";
import {
  faqCategorySchema,
  type FaqCategoryFormValues,
} from "@/features/faqs/schemas/faq.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { FaqCategory } from "@/types/cms.types";

interface FaqCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: FaqCategory | null;
}

export function FaqCategoryDialog({
  open,
  onOpenChange,
  category,
}: FaqCategoryDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<FaqCategoryFormValues>({
    resolver: zodResolver(faqCategorySchema),
    values: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      order: category?.order ?? 1,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: FaqCategoryFormValues) =>
      saveFaqCategoryAction(category?.id ?? null, values),
    invalidateKeys: [queryKeys.faqs.all(siteKey)],
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
      title={category ? "Edit Kategori FAQ" : "Tambah Kategori FAQ"}
      size="md"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInput<FaqCategoryFormValues>
              name="name"
              label="Nama Kategori"
              placeholder="Keanggotaan"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<FaqCategoryFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <FormInput<FaqCategoryFormValues>
            name="slug"
            label="Slug URL (Opsional)"
            placeholder="Otomatis dari nama kategori"
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={category ? "Simpan Perubahan" : "Simpan Kategori"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
