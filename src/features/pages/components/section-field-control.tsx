"use client";

import { FormGroup } from "@/components/forms/form-group";
import { FormRepeater } from "@/components/forms/form-repeater";
import { SectionLeafFieldControl } from "@/features/pages/components/section-leaf-field-control";
import { buildDefaultObjectFromFields } from "@/features/pages/utils/section-payload";
import type { SectionFieldSchema } from "@/types/cms.types";

interface SectionFieldControlProps {
  field: SectionFieldSchema;
  fieldPrefix: string;
  siteSlug: string;
}

export function SectionFieldControl({
  field,
  fieldPrefix,
  siteSlug,
}: SectionFieldControlProps): React.JSX.Element | null {
  const fullName = `${fieldPrefix}.${field.name}`;

  if (field.type === "group") {
    const subFields = field.fields ?? [];
    return (
      <FormGroup label={field.label}>
        {subFields.map((subField) => (
          <SectionLeafFieldControl
            key={subField.name}
            field={subField}
            fieldName={`${fullName}.${subField.name}`}
            siteSlug={siteSlug}
          />
        ))}
      </FormGroup>
    );
  }

  if (field.type === "repeater") {
    const subFields = field.fields ?? [];
    return (
      <FormRepeater
        name={fullName}
        label={field.label}
        addLabel={`Tambah ${field.label}`}
        defaultItem={() => buildDefaultObjectFromFields(subFields)}
        renderItem={(_idx, itemPrefix) => (
          <>
            {subFields.map((subField) => (
              <SectionLeafFieldControl
                key={subField.name}
                field={subField}
                fieldName={`${itemPrefix}.${subField.name}`}
                siteSlug={siteSlug}
              />
            ))}
          </>
        )}
      />
    );
  }

  return (
    <SectionLeafFieldControl
      field={field}
      fieldName={fullName}
      siteSlug={siteSlug}
    />
  );
}
