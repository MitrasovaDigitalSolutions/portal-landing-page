"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormInput } from "@/components/forms/form-input";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Badge } from "@/components/ui/badge";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  createPageAction,
  updatePageAction,
} from "@/features/pages/actions/pages.actions";
import {
  pageFormSchema,
  slugifyPageInput,
  type PageFormValues,
} from "@/features/pages/schemas/page.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PageSummary } from "@/types/cms.types";

interface PageFormDialogProps {
  page: PageSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageFormDialog({
  page,
  open,
  onOpenChange,
}: PageFormDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const isHomeLocked = page?.slug === "home";

  const methods = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    values: {
      title: page?.title ?? "",
      slug: page?.slug ?? "",
      meta_title: page?.meta_title ?? "",
      meta_desc: page?.meta_desc ?? "",
      is_active: page ? page.is_active : true,
    },
  });

  const applyServerErrors = useServerErrors(methods.setError);
  const [watchedTitle, watchedSlug] = useWatch({
    control: methods.control,
    name: ["title", "slug"],
  });

  const previewSlug =
    slugifyPageInput(watchedSlug) || slugifyPageInput(watchedTitle) || "slug";

  const mutation = useCrudMutation({
    mutationFn: (values: PageFormValues) =>
      page
        ? updatePageAction(page.id, page.slug, values)
        : createPageAction(values),
    invalidateKeys: [queryKeys.pages.all(siteKey)],
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
      onOpenChange={onOpenChange}
      title={page ? "Edit Halaman Website" : "Tambah Halaman Baru"}
      description="Konfigurasi judul halaman, slug URL, metadata SEO, dan status aktif."
      size="lg"
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <FormInput<PageFormValues>
            name="title"
            label="Judul Halaman"
            placeholder="Tentang Perusahaan"
            required
          />

          <div className="space-y-1.5">
            <FormInput<PageFormValues>
              name="slug"
              label="Slug URL"
              placeholder="tentang-kami"
              disabled={isHomeLocked}
              helperText={
                isHomeLocked
                  ? "Slug halaman utama (home) dikunci oleh sistem."
                  : `Pratinjau route publik: /${previewSlug}`
              }
            />
            {isHomeLocked ? (
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Lock className="size-3" />
                <span>Halaman Utama Sistem</span>
              </Badge>
            ) : null}
          </div>

          <FormInput<PageFormValues>
            name="meta_title"
            label="Meta Title SEO (Opsional)"
            placeholder="Tentang Kami - Nama Perusahaan"
          />

          <FormTextarea<PageFormValues>
            name="meta_desc"
            label="Meta Description SEO (Opsional)"
            placeholder="Ringkasan deskripsi halaman untuk mesin pencari..."
            rows={3}
          />

          <FormSwitch<PageFormValues>
            name="is_active"
            label="Halaman Aktif"
            description="Nonaktifkan untuk menyembunyikan halaman dari frontend publik."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={page ? "Simpan Perubahan" : "Simpan Halaman"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
