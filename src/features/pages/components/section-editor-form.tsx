"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import {
  SectionEditorToolbar,
  type SectionEditorViewMode,
} from "@/features/pages/components/section-editor-toolbar";
import { SectionEditorWorkspace } from "@/features/pages/components/section-editor-workspace";
import { useSectionTypes } from "@/features/pages/hooks/use-section-types";
import type { SectionFormValues } from "@/features/pages/schemas/page.schemas";
import {
  createInitialSectionFormValues,
  submitSectionWithOptionalImage,
} from "@/features/pages/utils/section-form-helpers";
import {
  buildInitialPayloadValues,
  extractNonSchemaKeys,
  mergeSectionPayload,
  resolveSectionType,
  validatePayloadClient,
} from "@/features/pages/utils/section-payload";
import { useCrudMutation } from "@/hooks/use-crud-mutation";
import { useServerErrors } from "@/hooks/use-server-errors";
import { queryKeys } from "@/lib/query-keys";
import { useTenant } from "@/providers/tenant-provider";
import type {
  PageDetail,
  PageSection,
  SectionTypeDefinition,
} from "@/types/cms.types";

interface SectionEditorFormProps {
  page: PageDetail;
  section: PageSection | null;
  initialSectionTypes: SectionTypeDefinition[];
  defaultOrder: number;
}

export function SectionEditorForm({
  page,
  section,
  initialSectionTypes,
  defaultOrder,
}: SectionEditorFormProps): React.JSX.Element {
  const router = useRouter();
  const { activeSite } = useTenant();
  const siteKey = activeSite?.slug ?? "default";
  const isEdit = Boolean(section);

  const [viewMode, setViewMode] =
    React.useState<SectionEditorViewMode>("split");
  const { data: sectionTypes = initialSectionTypes } =
    useSectionTypes(initialSectionTypes);

  const initialMatched = resolveSectionType(sectionTypes, section?.key ?? "");
  const [extraKeys, setExtraKeys] = React.useState<Record<string, unknown>>(() =>
    initialMatched
      ? extractNonSchemaKeys(section?.payload, initialMatched.fields)
      : { ...(section?.payload ?? {}) }
  );

  const methods = useForm<SectionFormValues>({
    defaultValues: createInitialSectionFormValues(
      section,
      sectionTypes,
      defaultOrder
    ),
  });

  const applyServerErrors = useServerErrors(methods.setError);
  const currentKey = useWatch({ control: methods.control, name: "key" });
  const isActive = useWatch({ control: methods.control, name: "is_active" });
  const activeType = resolveSectionType(sectionTypes, currentKey);

  const mutation = useCrudMutation({
    mutationFn: (input: {
      values: SectionFormValues;
      mergedPayload: Record<string, unknown> | null;
    }) =>
      submitSectionWithOptionalImage(
        page.id,
        section?.id ?? null,
        input.values,
        input.mergedPayload
      ),
    invalidateKeys: [
      queryKeys.pages.detail(siteKey, page.id),
      queryKeys.media.all(siteKey),
    ],
    onSuccess: () => {
      router.push(`/pages/${page.id}`);
    },
    onError: (result) => {
      applyServerErrors(result.fieldErrors);
    },
  });

  const handleSelectType = (nextKey: string): void => {
    const cleanNext = nextKey.trim();
    methods.setValue("key", cleanNext, { shouldValidate: true });

    const nextType = resolveSectionType(sectionTypes, cleanNext);
    const sameType =
      Boolean(section) &&
      resolveSectionType(sectionTypes, section?.key ?? "")?.key === nextType?.key;

    if (sameType && nextType) {
      setExtraKeys(extractNonSchemaKeys(section?.payload, nextType.fields));
      methods.setValue(
        "payload",
        buildInitialPayloadValues(nextType.fields, section?.payload)
      );
      return;
    }

    setExtraKeys({});
    methods.setValue(
      "payload",
      nextType ? buildInitialPayloadValues(nextType.fields, {}) : {}
    );
    methods.setValue("payload_json", "");
  };

  const handleSubmit = methods.handleSubmit((values) => {
    if (!values.key.trim()) {
      methods.setError("key", { message: "Tipe section wajib dipilih." });
      return;
    }

    const mergedPayload = mergeSectionPayload(
      extraKeys,
      values.payload,
      activeType?.fields ?? null
    );
    const clientErrors = validatePayloadClient(
      mergedPayload,
      activeType?.fields ?? null
    );
    const entries = Object.entries(clientErrors);
    if (entries.length > 0) {
      for (const [path, message] of entries) {
        methods.setError(path as keyof SectionFormValues, { message });
      }
      return;
    }

    mutation.mutate({ values, mergedPayload });
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="space-y-5"
      >
        <SectionEditorToolbar
          pageId={page.id}
          pageSlug={page.slug}
          sectionKey={currentKey}
          isActive={isActive}
          isEdit={isEdit}
          isSubmitting={mutation.isPending}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <SectionEditorWorkspace
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          page={page}
          section={section}
          sectionTypes={sectionTypes}
          activeType={activeType}
          currentKey={currentKey}
          siteSlug={siteKey}
          extraKeys={extraKeys}
          onExtraKeysChange={setExtraKeys}
          onSelectType={handleSelectType}
        />
      </form>
    </FormProvider>
  );
}
