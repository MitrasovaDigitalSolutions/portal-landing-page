"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveFaqAction } from "@/features/faqs/actions/faqs.actions";
import {
  faqSchema,
  type FaqFormValues,
} from "@/features/faqs/schemas/faq.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { FaqCategory, FaqItem } from "@/types/cms.types";

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: FaqItem | null;
  categories: FaqCategory[];
}

export function FaqDialog({
  open,
  onOpenChange,
  faq,
  categories,
}: FaqDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const fallbackCatId = categories[0] ? String(categories[0].id) : "";

  const methods = useForm<FaqFormValues>({
    resolver: zodResolver(faqSchema),
    values: {
      question: faq?.question ?? "",
      faq_category_id: faq?.faq_category_id
        ? String(faq.faq_category_id)
        : fallbackCatId,
      order: faq?.order ?? 1,
      answer: faq?.answer ?? "",
      is_active: faq?.is_active ?? true,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: FaqFormValues) =>
      saveFaqAction(faq?.id ?? null, values),
    invalidateKeys: [queryKeys.faqs.all(siteKey)],
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const catOptions = [
    { value: "", label: "Umum" },
    ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
  ];

  const handleSubmit = methods.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={onOpenChange}
      title={faq ? "Edit Tanya Jawab (FAQ)" : "Tambah FAQ Baru"}
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <FormInput<FaqFormValues>
            name="question"
            label="Pertanyaan"
            placeholder="Bagaimana cara mendaftar keanggotaan?"
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormInputOption<FaqFormValues>
              name="faq_category_id"
              label="Kategori"
              options={catOptions}
              containerClassName="sm:col-span-2"
            />
            <FormInputStepper<FaqFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <FormTextarea<FaqFormValues>
            name="answer"
            label="Jawaban Lengkap"
            placeholder="Tuliskan penjelasan jawaban secara ringkas dan jelas..."
            rows={4}
            required
          />

          <FormSwitch<FaqFormValues>
            name="is_active"
            label="FAQ Aktif"
            description="Tampilkan pertanyaan ini di website publik."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={faq ? "Simpan Perubahan" : "Simpan FAQ"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
