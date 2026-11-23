import type { FieldErrors, FieldValues } from "react-hook-form";

export function getFieldError<T extends FieldValues>(
  errors: FieldErrors<T>,
  name: string
): string | undefined {
  const parts = name.split(".");
  let current: unknown = errors;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (
    typeof current === "object" &&
    current !== null &&
    "message" in current &&
    typeof (current as { message?: unknown }).message === "string"
  ) {
    return (current as { message: string }).message;
  }

  return undefined;
}

export function formatFileSizeLabel(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
}

export function validateImageFile(
  file: File,
  maxSizeMB: number
): string | null {
  if (!file.type.startsWith("image/")) {
    return "Format file harus berupa gambar (PNG, JPG, WEBP, SVG).";
  }
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `Ukuran file maksimal ${maxSizeMB} MB.`;
  }
  return null;
}
