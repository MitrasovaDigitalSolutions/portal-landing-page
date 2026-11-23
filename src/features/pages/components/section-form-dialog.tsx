"use client";

import { Layers } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { FormDialogFooter } from "@/components/forms/form-dialog-footer";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Badge } from "@/components/ui/badge";
import { BaseDialog } from "@/components/ui/base-dialog";
import {
  saveSectionJsonAction,
  saveSectionMultipartAction,
} from "@/features/pages/actions/pages.actions";
import { SectionJsonField } from "@/features/pages/components/section-json-field";
import { SectionKeyField } from "@/features/pages/components/section-key-field";
import {
  parseSectionPayloadJson,
  type SectionFormValues,
} from "@/features/pages/schemas/page.schemas";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type { PageSection } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";
import { FormDataBuilder } from "@/utils/form-data";

interface SectionFormDialogProps {
  pageId: number;
  pageSlug: string;
  section: PageSection | null;
  defaultOrder: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getInitialSectionValues(
  section: PageSection | null,
  defaultOrder: number
): SectionFormValues {
  return {
    key: section?.key ?? "",
    order: section?.order ?? defaultOrder,
    title: section?.title ?? "",
    subtitle: section?.subtitle ?? "",
    body: section?.body ?? "",
    payload_json: section?.payload
      ? JSON.stringify(section.payload, null, 2)
      : "",
    is_active: section ? section.is_active : true,
    image: null,
  };
}

function buildSectionMultipart(
  values: SectionFormValues,
  parsedPayload: Record<string, unknown> | null
): FormData {
  const builder = new FormDataBuilder()
    .appendText("key", values.key.trim())
    .appendNumber("order", values.order)
    .appendOptionalText("title", values.title.trim())
    .appendOptionalText("subtitle", values.subtitle.trim())
    .appendOptionalText("body", values.body.trim())
    .appendBoolean("is_active", values.is_active)
    .appendFile("image", values.image);

  if (parsedPayload) {
    builder.appendNested("payload", parsedPayload);
  }
  return builder.build();
}

async function submitSection(
  pageId: number,
  sectionId: number | null,
  values: SectionFormValues,
  parsedPayload: Record<string, unknown> | null
): Promise<ActionResult<PageSection>> {
  const hasNewImage = values.image instanceof File && values.image.size > 0;
  if (hasNewImage) {
    const formData = buildSectionMultipart(values, parsedPayload);
    return saveSectionMultipartAction(pageId, sectionId, formData);
  }

  return saveSectionJsonAction(pageId, sectionId, {
    key: values.key.trim(),
    order: values.order,
    title: values.title.trim() || null,
    subtitle: values.subtitle.trim() || null,
    body: values.body.trim() || null,
    payload: parsedPayload,
    is_active: values.is_active,
  });
}

export function SectionFormDialog({
  pageId,
  pageSlug,
  section,
  defaultOrder,
  open,
  onOpenChange,
}: SectionFormDialogProps): React.JSX.Element {
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const isEdit = Boolean(section);

  const methods = useForm<SectionFormValues>({
    values: getInitialSectionValues(section, defaultOrder),
  });

  const applyServerErrors = useServerErrors(methods.setError);
  const watchedKey = useWatch({
    control: methods.control,
    name: "key",
  });

  const mutation = useCrudMutation({
    mutationFn: (input: {
      values: SectionFormValues;
      parsedPayload: Record<string, unknown> | null;
    }) =>
      submitSection(
        pageId,
        section?.id ?? null,
        input.values,
        input.parsedPayload
      ),
    invalidateKeys: [queryKeys.pages.detail(siteKey, pageId)],
    onSuccess: () => {
      methods.reset();
      onOpenChange(false);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSubmit = methods.handleSubmit((values) => {
    const parsed = parseSectionPayloadJson(values.payload_json);
    if (!parsed.ok) {
      methods.setError("payload_json", { message: parsed.error });
      return;
    }
    mutation.mutate({ values, parsedPayload: parsed.value });
  });

  return (
    <BaseDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          methods.reset();
        }
        onOpenChange(nextOpen);
      }}
      title={isEdit ? "Edit Section Halaman" : "Tambah Section Baru"}
      description={`Kelola isi konten section untuk halaman /${pageSlug}.`}
      size="xl"
      headerRight={
        <Badge
          variant="secondary"
          className="gap-1 rounded-md font-mono text-[11px]"
        >
          <Layers className="size-3" />
          key: {watchedKey || "-"}
        </Badge>
      }
    >
      <FormProvider {...methods}>
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SectionKeyField showPresets={!isEdit} />
            <FormInputStepper<SectionFormValues>
              name="order"
              label="Urutan Tampil"
              min={0}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput<SectionFormValues>
              name="title"
              label="Judul Section"
              placeholder="Judul utama section"
              maxLength={200}
            />
            <FormInput<SectionFormValues>
              name="subtitle"
              label="Sub Judul / Badge"
              placeholder="Opsional"
              maxLength={255}
            />
          </div>

          <FormTextarea<SectionFormValues>
            name="body"
            label="Isi / Deskripsi Konten"
            placeholder="Teks narasi atau deskripsi section..."
            rows={4}
          />

          <FormImageUpload<SectionFormValues>
            name="image"
            label="Gambar Section (Opsional)"
            initialUrl={section?.image_url ?? section?.image_path}
            maxSizeMB={10}
            helperText="Unggah gambar baru untuk mengganti media utama section ini (maks. 10MB)."
          />

          <SectionJsonField />

          <FormSwitch<SectionFormValues>
            name="is_active"
            label="Section Aktif"
            description="Nonaktifkan untuk menyembunyikan section ini dari halaman publik."
          />

          <FormDialogFooter
            onCancel={() => {
              onOpenChange(false);
            }}
            submitLabel={isEdit ? "Simpan Perubahan" : "Tambah Section"}
            isSubmitting={mutation.isPending}
          />
        </form>
      </FormProvider>
    </BaseDialog>
  );
}
