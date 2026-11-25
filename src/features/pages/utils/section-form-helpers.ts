import {
  saveSectionJsonAction,
  uploadSectionImageAction,
} from "@/features/pages/actions/pages.actions";
import type { SectionFormValues } from "@/features/pages/schemas/page.schemas";
import {
  buildInitialPayloadValues,
  resolveSectionType,
} from "@/features/pages/utils/section-payload";
import type { PageSection, SectionTypeDefinition } from "@/types/cms.types";
import type { ActionResult } from "@/types/http.types";

export function createInitialSectionFormValues(
  section: PageSection | null,
  sectionTypes: readonly SectionTypeDefinition[],
  defaultOrder: number
): SectionFormValues {
  const initialKey = section?.key ?? "";
  const matchedType = resolveSectionType(sectionTypes, initialKey);
  const initialPayload = matchedType
    ? buildInitialPayloadValues(matchedType.fields, section?.payload)
    : {};

  return {
    key: initialKey,
    order: section?.order ?? defaultOrder,
    title: section?.title ?? "",
    subtitle: section?.subtitle ?? "",
    body: section?.body ?? "",
    payload: initialPayload,
    payload_json: section?.payload
      ? JSON.stringify(section.payload, null, 2)
      : "",
    is_active: section ? section.is_active : true,
    image: null,
  };
}

export async function submitSectionWithOptionalImage(
  pageId: number,
  sectionId: number | null,
  values: SectionFormValues,
  mergedPayload: Record<string, unknown> | null
): Promise<ActionResult<PageSection>> {
  const jsonResult = await saveSectionJsonAction(pageId, sectionId, {
    key: values.key.trim(),
    order: values.order,
    title: values.title.trim() || null,
    subtitle: values.subtitle.trim() || null,
    body: values.body.trim() || null,
    payload: mergedPayload,
    is_active: values.is_active,
  });

  if (!jsonResult.success) {
    return jsonResult;
  }

  const imageFile = values.image;
  if (!(imageFile instanceof File) || imageFile.size === 0) {
    return jsonResult;
  }

  const formData = new FormData();
  formData.append("image", imageFile);
  const imageResult = await uploadSectionImageAction(
    pageId,
    jsonResult.data.id,
    formData
  );
  if (!imageResult.success) {
    return imageResult;
  }

  return {
    ...imageResult,
    warnings: [
      ...(jsonResult.warnings ?? []),
      ...(imageResult.warnings ?? []),
    ],
  };
}
