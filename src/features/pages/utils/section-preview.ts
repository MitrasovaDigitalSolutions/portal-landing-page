import { resolveMediaUrl } from "@/utils/media";

export interface SectionPreviewData {
  key: string;
  title: string;
  subtitle: string;
  body: string;
  isActive: boolean;
  imageSrc: string | null;
  payload: Record<string, unknown>;
  pageSlug: string;
  pageTitle: string;
  siteName: string;
  siteDomain: string;
}

export function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

export function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export function asRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter(
    (entry): entry is Record<string, unknown> =>
      typeof entry === "object" && entry !== null && !Array.isArray(entry)
  );
}

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function resolvePreviewImage(
  source: Record<string, unknown>,
  fallbackImageSrc: string | null = null
): string | null {
  const pathVal = asString(source.image_path);
  if (pathVal) {
    return resolveMediaUrl(undefined, pathVal);
  }
  const urlVal = asString(source.image_url);
  if (urlVal) {
    return resolveMediaUrl(urlVal);
  }
  return fallbackImageSrc;
}
