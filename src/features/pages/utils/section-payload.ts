import type { SectionFieldSchema, SectionTypeDefinition } from "@/types/cms.types";

const URL_PATTERN = /^(https?:\/\/|\/|#)/;

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function resolveSectionType(
  types: readonly SectionTypeDefinition[],
  key: string
): SectionTypeDefinition | null {
  const cleanKey = key.trim();
  if (!cleanKey) {
    return null;
  }
  return (
    types.find(
      (type) =>
        type.key === cleanKey || (type.aliases?.includes(cleanKey) ?? false)
    ) ?? null
  );
}

export function buildDefaultFieldValue(field: SectionFieldSchema): unknown {
  if (field.type === "boolean") return false;
  if (field.type === "number") return null;
  if (field.type === "list" || field.type === "repeater") return [];
  if (field.type === "group") {
    return buildDefaultObjectFromFields(field.fields ?? []);
  }
  return "";
}

export function buildDefaultObjectFromFields(
  fields: readonly SectionFieldSchema[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    out[field.name] = buildDefaultFieldValue(field);
  }
  return out;
}

function hydrateFieldValue(
  field: SectionFieldSchema,
  existingValue: unknown
): unknown {
  if (field.type === "group") {
    const src = isRecord(existingValue) ? existingValue : {};
    const out: Record<string, unknown> = {};
    for (const subField of field.fields ?? []) {
      out[subField.name] = hydrateFieldValue(subField, src[subField.name]);
    }
    return out;
  }

  if (field.type === "repeater") {
    if (!Array.isArray(existingValue)) return [];
    const subFields = field.fields ?? [];
    return existingValue.filter(isRecord).map((row) => {
      const item: Record<string, unknown> = {};
      for (const subField of subFields) {
        item[subField.name] = hydrateFieldValue(subField, row[subField.name]);
      }
      return item;
    });
  }

  if (field.type === "list") {
    return Array.isArray(existingValue)
      ? existingValue.filter((entry): entry is string => typeof entry === "string")
      : [];
  }

  if (field.type === "boolean") {
    return typeof existingValue === "boolean" ? existingValue : false;
  }

  if (field.type === "number") {
    return typeof existingValue === "number" && !Number.isNaN(existingValue)
      ? existingValue
      : null;
  }

  return typeof existingValue === "string" ? existingValue : "";
}

export function buildInitialPayloadValues(
  fields: readonly SectionFieldSchema[],
  existingPayload: Record<string, unknown> | null | undefined
): Record<string, unknown> {
  const source = existingPayload ?? {};
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    out[field.name] = hydrateFieldValue(field, source[field.name]);
  }
  return out;
}

export function extractNonSchemaKeys(
  existingPayload: Record<string, unknown> | null | undefined,
  fields: readonly SectionFieldSchema[]
): Record<string, unknown> {
  if (!existingPayload) {
    return {};
  }
  const knownNames = new Set(fields.map((field) => field.name));
  const extras: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(existingPayload)) {
    if (!knownNames.has(key)) {
      extras[key] = value;
    }
  }
  return extras;
}

function pruneFieldValue(
  field: SectionFieldSchema,
  rawValue: unknown,
  enforceRequired: boolean
): unknown {
  if (field.type === "group") {
    if (!isRecord(rawValue)) return undefined;
    const cleaned = pruneEmptyOptionalFields(rawValue, field.fields ?? [], true);
    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  if (field.type === "repeater") {
    if (!Array.isArray(rawValue)) return undefined;
    const subFields = field.fields ?? [];
    const cleanedItems = rawValue
      .filter(isRecord)
      .map((item) => pruneEmptyOptionalFields(item, subFields, true));
    return cleanedItems.length > 0 ? cleanedItems : undefined;
  }

  if (field.type === "list") {
    if (!Array.isArray(rawValue)) return undefined;
    const cleanList = rawValue
      .filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    return cleanList.length > 0 ? cleanList : undefined;
  }

  if (field.type === "number") {
    return typeof rawValue === "number" && !Number.isNaN(rawValue)
      ? rawValue
      : undefined;
  }

  if (field.type === "boolean") {
    return typeof rawValue === "boolean" ? rawValue : undefined;
  }

  const textVal = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!textVal) {
    return enforceRequired && field.required ? "" : undefined;
  }
  return textVal;
}

export function pruneEmptyOptionalFields(
  payload: Record<string, unknown>,
  fields: readonly SectionFieldSchema[],
  enforceRequired = false
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    const cleaned = pruneFieldValue(field, payload[field.name], enforceRequired);
    if (cleaned !== undefined) {
      out[field.name] = cleaned;
    }
  }
  return out;
}

export function mergeSectionPayload(
  extraKeys: Record<string, unknown>,
  formPayload: Record<string, unknown>,
  fields: readonly SectionFieldSchema[] | null
): Record<string, unknown> | null {
  if (!fields) {
    return Object.keys(extraKeys).length > 0 ? extraKeys : null;
  }
  const prunedSchema = pruneEmptyOptionalFields(formPayload, fields, false);
  const merged = { ...extraKeys, ...prunedSchema };
  return Object.keys(merged).length > 0 ? merged : null;
}

function validateLeafValue(
  field: SectionFieldSchema,
  value: unknown,
  path: string,
  errors: Record<string, string>
): void {
  if (value === undefined) {
    if (field.required) {
      errors[path] = `${field.label} wajib diisi.`;
    }
    return;
  }

  if (typeof value === "string") {
    if (field.required && value.trim().length === 0) {
      errors[path] = `${field.label} wajib diisi.`;
      return;
    }
    if (field.max && value.length > field.max) {
      errors[path] = `Maksimal ${field.max} karakter.`;
      return;
    }
    if (field.type === "url" && value.trim() && !URL_PATTERN.test(value.trim())) {
      errors[path] = "URL harus diawali http://, https://, /, atau #.";
    }
  }
}

export function validatePayloadClient(
  mergedPayload: Record<string, unknown> | null,
  fields: readonly SectionFieldSchema[] | null
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!mergedPayload || !fields) {
    return errors;
  }

  for (const field of fields) {
    const val = mergedPayload[field.name];
    if (val === undefined) continue;
    const basePath = `payload.${field.name}`;

    if (field.type === "group" && isRecord(val)) {
      for (const sub of field.fields ?? []) {
        validateLeafValue(sub, val[sub.name], `${basePath}.${sub.name}`, errors);
      }
      continue;
    }

    if (field.type === "repeater" && Array.isArray(val)) {
      val.forEach((row, idx) => {
        if (!isRecord(row)) return;
        for (const sub of field.fields ?? []) {
          validateLeafValue(
            sub,
            row[sub.name],
            `${basePath}.${idx}.${sub.name}`,
            errors
          );
        }
      });
      continue;
    }

    validateLeafValue(field, val, basePath, errors);
  }
  return errors;
}
