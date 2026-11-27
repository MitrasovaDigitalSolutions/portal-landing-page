"use client";

import { CheckCircle2, CircleDashed } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import type { ServiceFormValues } from "@/features/services/schemas/service.schemas";
import {
  formatServiceCurrencyPreview,
  hasServiceBodyContent,
} from "@/features/services/utils/service-form";
import type { ServiceItem, ServiceType } from "@/types/cms.types";

interface ServiceEditorSidebarProps {
  service: ServiceItem | null;
  types: ServiceType[];
}

export function ServiceEditorSidebar({
  service,
  types,
}: ServiceEditorSidebarProps): React.JSX.Element {
  const { control } = useFormContext<ServiceFormValues>();
  const [name, serviceTypeId, shortDesc, features, body, price, priceNote, thumb, images] =
    useWatch({
      control,
      name: [
        "name",
        "service_type_id",
        "short_desc",
        "features",
        "body",
        "price",
        "price_note",
        "thumbnail",
        "images",
      ],
    });

  const typeOptions = types.map((typeItem) => ({
    value: String(typeItem.id),
    label: typeItem.name,
  }));

  const featureCount = features.filter((item) => item.trim().length > 0).length;
  const existingThumb = service?.thumbnail_url ?? service?.thumbnail_path ?? null;
  const hasThumb = thumb instanceof File || Boolean(existingThumb);
  const hasBody = hasServiceBodyContent(body);
  const pricePreview = formatServiceCurrencyPreview(price, priceNote);

  const existingGalleryCount =
    service?.image_urls && service.image_urls.length > 0
      ? service.image_urls.length
      : (service?.images?.length ?? 0);
  const galleryCount = images.length > 0 ? images.length : existingGalleryCount;

  const checklist = [
    { label: "Nama Layanan", done: name.trim().length > 0, meta: "Wajib" },
    { label: "Tipe Layanan", done: Boolean(serviceTypeId), meta: "Wajib" },
    {
      label: "Ringkasan Singkat",
      done: shortDesc.trim().length > 0,
      meta: "Wajib",
    },
    {
      label: "Fitur Keunggulan",
      done: featureCount > 0,
      meta: `${featureCount} poin`,
    },
    {
      label: "Foto Thumbnail",
      done: hasThumb,
      meta: hasThumb ? "Siap" : "Belum ada",
    },
    {
      label: "Galeri Foto",
      done: galleryCount > 0,
      meta: galleryCount > 0 ? `${galleryCount} foto` : "Opsional",
    },
    {
      label: "Deskripsi Lengkap",
      done: hasBody,
      meta: hasBody ? "Terisi" : "Opsional",
    },
    {
      label: "Harga Mulai",
      done: Boolean(pricePreview),
      meta: pricePreview ?? "Opsional",
    },
  ];

  return (
    <aside className="space-y-4 xl:sticky xl:top-20">
      <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Organisasi & Publikasi
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Atur kategori layanan, visibilitas, dan urutan tampil.
          </p>
        </div>

        <FormInputOption<ServiceFormValues>
          name="service_type_id"
          label="Tipe Layanan"
          placeholder="Pilih tipe layanan..."
          options={typeOptions}
          required
        />

        <FormSwitch<ServiceFormValues>
          name="is_active"
          label="Aktif di Website"
          description="Tampilkan layanan di publik."
        />

        <FormSwitch<ServiceFormValues>
          name="is_featured"
          label="Layanan Unggulan"
          description="Sorot di halaman beranda."
        />

        <FormInputStepper<ServiceFormValues>
          name="order"
          label="Urutan Tampil"
          min={0}
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="border-b border-slate-100 pb-2.5">
          <h2 className="text-xs font-bold tracking-wide text-slate-800 uppercase">
            Kelengkapan Konten
          </h2>
        </div>

        <ul className="space-y-2 text-xs">
          {checklist.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 text-slate-600"
            >
              {item.done ? (
                <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
              ) : (
                <CircleDashed className="size-3.5 shrink-0 text-slate-300" />
              )}
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <span className="max-w-28 shrink-0 truncate text-[11px] font-medium text-slate-500">
                {item.meta}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
