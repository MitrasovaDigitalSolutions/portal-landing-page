"use client";

import type { FieldValues } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import { FormInputNumber } from "@/components/forms/form-input-number";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormMediaPicker } from "@/components/forms/form-media-picker";
import { FormRichText } from "@/components/forms/form-rich-text";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextList } from "@/components/forms/form-text-list";
import { FormTextarea } from "@/components/forms/form-textarea";
import {
  listPickerMediaAction,
  uploadPickerMediaAction,
} from "@/features/pages/actions/section-types.actions";
import type { SectionFieldSchema } from "@/types/cms.types";

interface SectionLeafFieldControlProps {
  field: SectionFieldSchema;
  fieldName: string;
  siteSlug: string;
}

export function SectionLeafFieldControl({
  field,
  fieldName,
  siteSlug,
}: SectionLeafFieldControlProps): React.JSX.Element | null {
  switch (field.type) {
    case "text":
      return (
        <FormInput<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
          maxLength={field.max}
          placeholder={`Isi ${field.label.toLowerCase()}...`}
        />
      );
    case "url":
      return (
        <FormInput<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
          maxLength={field.max}
          placeholder="https://..., /halaman, atau #bagian"
          helperText="Awali dengan https://, http://, /, atau #."
        />
      );
    case "textarea":
      return (
        <FormTextarea<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
          rows={field.rows ?? 3}
          maxLength={field.max}
          placeholder={`Isi ${field.label.toLowerCase()}...`}
        />
      );
    case "richtext":
      return (
        <FormRichText<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
        />
      );
    case "image":
      return (
        <FormMediaPicker<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
          fetchMedia={listPickerMediaAction}
          uploadMedia={uploadPickerMediaAction}
          uploadDir={`sections/${siteSlug}`}
        />
      );
    case "number":
      return (
        <FormInputNumber<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
          fallbackValue={null}
        />
      );
    case "boolean":
      return <FormSwitch<FieldValues> name={fieldName} label={field.label} />;
    case "select":
      return (
        <FormInputOption<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
          clearable={!field.required}
          options={(field.options ?? []).map((opt) => ({
            value: opt,
            label: opt,
          }))}
        />
      );
    case "list":
      return (
        <FormTextList<FieldValues>
          name={fieldName}
          label={field.label}
          required={field.required}
        />
      );
    default:
      return null;
  }
}
