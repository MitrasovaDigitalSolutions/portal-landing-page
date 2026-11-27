import type { ServiceFormValues } from "@/features/services/schemas/service.schemas";
import type { ServiceItem, ServiceType } from "@/types/cms.types";
import { FormDataBuilder } from "@/utils/form-data";

const CURRENCY_FORMATTER = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function normalizeOptionalRichText(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  const textOnly = trimmed
    .replaceAll(/<br\s*\/?>/gi, "")
    .replaceAll(/<\/?p>/gi, "")
    .replaceAll(/&nbsp;/gi, " ")
    .trim();
  return textOnly.length > 0 ? trimmed : "";
}

export function hasServiceBodyContent(body?: string | null): boolean {
  return normalizeOptionalRichText(body ?? "").length > 0;
}

export function hasOptionalServiceExtras(service: ServiceItem | null): boolean {
  if (!service) {
    return false;
  }
  return (
    service.price !== null ||
    Boolean(service.price_note?.trim()) ||
    Boolean(service.icon_url ?? service.icon_path)
  );
}

export function formatServiceCurrencyPreview(
  price: number | null,
  priceNote: string
): string | null {
  if (price === null || !Number.isFinite(price)) {
    return null;
  }
  const formatted = CURRENCY_FORMATTER.format(price);
  const note = priceNote.trim();
  return note ? `${formatted} ${note}` : formatted;
}

export function getInitialServiceFormValues(
  service: ServiceItem | null,
  types: ServiceType[]
): ServiceFormValues {
  const fallbackTypeId = types[0] ? String(types[0].id) : "";
  return {
    name: service?.name ?? "",
    slug: service?.slug ?? "",
    service_type_id: service ? String(service.service_type_id) : fallbackTypeId,
    short_desc: service?.short_desc ?? "",
    price: service?.price ?? null,
    price_note: service?.price_note ?? "",
    body: service?.body ?? "",
    features: service?.features ?? [],
    order: service?.order ?? 1,
    is_active: service?.is_active ?? true,
    is_featured: service?.is_featured ?? false,
    thumbnail: null,
    icon: null,
    images: [],
  };
}

export function buildServiceFormData(values: ServiceFormValues): FormData {
  const cleanedFeatures = values.features
    .map((item) => item.trim())
    .filter(Boolean);
  const priceText =
    values.price !== null && Number.isFinite(values.price)
      ? String(Math.trunc(values.price))
      : "";

  return new FormDataBuilder()
    .appendText("name", values.name.trim())
    .appendText("slug", values.slug.trim())
    .appendText("service_type_id", values.service_type_id)
    .appendText("short_desc", values.short_desc.trim())
    .appendOptionalText("price", priceText)
    .appendOptionalText("price_note", values.price_note.trim())
    .appendOptionalText("body", normalizeOptionalRichText(values.body))
    .appendNumber("order", values.order)
    .appendBoolean("is_active", values.is_active)
    .appendBoolean("is_featured", values.is_featured)
    .appendNested("features", cleanedFeatures)
    .appendFile("thumbnail", values.thumbnail)
    .appendFile("icon", values.icon)
    .appendFiles("images", values.images)
    .build();
}
