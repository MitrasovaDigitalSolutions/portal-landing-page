"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormFeatureList } from "@/components/forms/form-feature-list";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { FormInputNumber } from "@/components/forms/form-input-number";
import {
  FormMultiImageUpload,
  type ExistingGalleryItem,
} from "@/components/forms/form-multi-image-upload";
import { FormRichText } from "@/components/forms/form-rich-text";
import { FormTextarea } from "@/components/forms/form-textarea";
import { ServiceOptionalCard } from "@/features/services/components/service-optional-card";
import type { ServiceFormValues } from "@/features/services/schemas/service.schemas";
import {
  formatServiceCurrencyPreview,
  hasOptionalServiceExtras,
  hasServiceBodyContent,
} from "@/features/services/utils/service-form";
import type { ServiceItem } from "@/types/cms.types";

interface ServiceEditorMainFieldsProps {
  service: ServiceItem | null;
}

export function ServiceEditorMainFields({
  service,
}: ServiceEditorMainFieldsProps): React.JSX.Element {
  const { control } = useFormContext<ServiceFormValues>();
  const [body, price, priceNote, slug, icon] = useWatch({
    control,
    name: ["body", "price", "price_note", "slug", "icon"],
  });

  const hasBody = hasServiceBodyContent(body);
  const pricePreview = formatServiceCurrencyPreview(price, priceNote);
  const existingIcon = service?.icon_url ?? service?.icon_path ?? null;
  const hasExtras =
    Boolean(pricePreview) ||
    slug.trim().length > 0 ||
    icon instanceof File ||
    Boolean(existingIcon);

  let extrasBadge = "Opsional";
  if (pricePreview) {
    extrasBadge = pricePreview;
  } else if (hasExtras) {
    extrasBadge = "Terisi";
  }

  const savedGallery =
    service?.image_urls && service.image_urls.length > 0
      ? service.image_urls
      : (service?.images ?? []);
  const existingGallery: ExistingGalleryItem[] = savedGallery.map(
    (url, idx) => ({ id: idx, url })
  );

  return (
    <div className="space-y-5">
      <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Informasi Utama & Keunggulan
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Identitas inti produk/layanan beserta poin nilai tambah yang langsung tampil pada kartu dan rincian.
          </p>
        </div>

        <FormInput<ServiceFormValues>
          name="name"
          label="Nama Layanan"
          placeholder="Simpanan Berjangka Prima"
          required
        />

        <FormTextarea<ServiceFormValues>
          name="short_desc"
          label="Ringkasan Singkat"
          placeholder="Deskripsi 1-2 kalimat untuk kartu layanan..."
          rows={3}
          maxLength={300}
          required
        />

        <FormFeatureList<ServiceFormValues>
          name="features"
          label="Fitur & Keunggulan Layanan"
          helperText="Tekan Enter atau klik Tambah Poin untuk menambahkan daftar fitur."
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Foto Utama & Galeri Layanan
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-500">
            Foto thumbnail tampil pada kartu katalog; galeri tambahan ditampilkan pada halaman detail layanan.
          </p>
        </div>

        <FormImageUpload<ServiceFormValues>
          name="thumbnail"
          label="Foto Thumbnail"
          initialUrl={service?.thumbnail_url ?? service?.thumbnail_path}
          aspectHint="16:9"
        />

        <FormMultiImageUpload<ServiceFormValues>
          name="images"
          label="Galeri Foto Tambahan (Opsional)"
          existingImages={existingGallery}
          maxFiles={12}
          maxSizeMB={10}
          helperText="Maks. 10 MB per foto (JPG, PNG, WEBP). Mengunggah foto baru akan menggantikan seluruh galeri tersimpan saat ini."
        />
      </section>

      <ServiceOptionalCard
        title="Deskripsi Lengkap (Opsional)"
        description="Penjelasan mendalam, syarat layanan, atau informasi detail di halaman produk."
        badgeLabel={hasBody ? "Terisi" : "Opsional"}
        hasValue={hasBody}
        defaultOpen={hasServiceBodyContent(service?.body)}
      >
        <FormRichText<ServiceFormValues>
          name="body"
          placeholder="Jelaskan detail produk/layanan secara komprehensif..."
        />
      </ServiceOptionalCard>

      <ServiceOptionalCard
        title="Harga, Ikon & Slug URL (Opsional)"
        description="Tambahkan estimasi harga mulai, slug khusus, atau ikon pendukung bila diperlukan."
        badgeLabel={extrasBadge}
        hasValue={hasExtras}
        defaultOpen={hasOptionalServiceExtras(service)}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInputNumber<ServiceFormValues>
              name="price"
              label="Harga (Opsional)"
              leftAddon="Rp"
              thousandSeparator
              min={0}
              fallbackValue={null}
              placeholder="75.000"
              helperText="Kosongkan bila tanpa harga."
            />
            <FormInput<ServiceFormValues>
              name="price_note"
              label="Keterangan Harga"
              placeholder="/pcs"
              maxLength={30}
              helperText="Contoh: /pcs, per lusin, mulai dari."
            />
          </div>

          <FormInput<ServiceFormValues>
            name="slug"
            label="Slug URL (Opsional)"
            placeholder="Otomatis dari nama layanan"
          />

          <FormImageUpload<ServiceFormValues>
            name="icon"
            label="File Ikon (Opsional)"
            initialUrl={service?.icon_url ?? service?.icon_path}
            aspectHint="1:1"
          />
        </div>
      </ServiceOptionalCard>
    </div>
  );
}
