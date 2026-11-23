"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormTextarea } from "@/components/forms/form-textarea";
import { BaseDialog } from "@/components/ui/base-dialog";
import { saveArticleCategoryAction } from "@/features/articles/actions/articles.actions";
import {
  articleCategorySchema,
  type ArticleCategoryFormValues,
} from "@/features/articles/schemas/article.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { ArticleCategory } from "@/types/cms.types";

interface ArticleCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: ArticleCategory | null;
}

export function ArticleCategoryDialog({
  open,
  onOpenChange,
  category,
}: ArticleCategoryDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";

  const methods = useForm<ArticleCategoryFormValues>({
    resolver: zodResolver(articleCategorySchema),
    values: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      order: category?.order ?? 1,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);

  const mutation = useCrudMutation({
    mutationFn: (values: ArticleCategoryFormValues) =>
      saveArticleCategoryAction(category?.id ?? null, values),
    invalidateKeys: [queryKeys.articles.all(siteKey)],
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
      title={category ? "Edit Kategori Artikel" : "Tambah Kategori Artikel"}
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
            <FormInput<ArticleCategoryFormValues>
              name="name"
              label="Nama Kategori"
              placeholder="Edukasi Finansial"
              containerClassName="sm:col-span-2"
              required
            />
            <FormInputStepper<ArticleCategoryFormValues>
              name="order"
              label="Urutan"
              min={0}
            />
          </div>

          <FormInput<ArticleCategoryFormValues>
            name="slug"
            label="Slug URL (Opsional)"
            placeholder="Otomatis dari nama kategori"
          />

          <FormTextarea<ArticleCategoryFormValues>
            name="description"
            label="Deskripsi Kategori (Opsional)"
            placeholder="Deskripsi singkat kategori..."
            rows={3}
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
