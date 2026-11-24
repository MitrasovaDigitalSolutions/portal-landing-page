"use client";

import { FormInputOption } from "@/components/forms/form-input-option";
import type { OptionItem } from "@/components/ui/input-option";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

const SERVICES_LAYOUT_OPTIONS: OptionItem[] = [
  {
    value: "accordion",
    label: "Accordion Teks (Default — KSP)",
  },
  {
    value: "carousel",
    label: "Carousel Kartu Produk (Beranda Carousel, Katalog Grid)",
  },
  {
    value: "grid",
    label: "Grid Kartu Produk (Beranda & Katalog Grid)",
  },
];

export function SettingsDisplayTab(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        Atur cara menampilkan daftar produk dan layanan di halaman beranda serta
        halaman katalog <span className="font-semibold text-slate-700">/produk</span>{" "}
        website publik tenant ini.
      </p>

      <div className="max-w-xl">
        <FormInputOption<SettingsFormValues>
          name="services_layout"
          label="Mode Tampilan Produk & Layanan"
          placeholder="Pilih mode tampilan..."
          options={SERVICES_LAYOUT_OPTIONS}
          searchable={false}
          helperText="Nilai selain carousel atau grid otomatis memakai mode accordion."
        />
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-slate-600 md:grid-cols-3">
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">Accordion Teks</p>
          <p>
            Beranda dan halaman katalog menampilkan daftar teks terkelompok
            per tipe layanan. Cocok untuk layanan finansial atau jasa berbasis
            ketentuan.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">Carousel Kartu Produk</p>
          <p>
            Beranda menampilkan carousel kartu produk unggulan (is_featured),
            sedangkan halaman katalog menampilkan seluruh produk dalam grid.
          </p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900">Grid Kartu Produk</p>
          <p>
            Beranda menampilkan grid kartu produk unggulan dan halaman katalog
            menampilkan seluruh produk dengan kartu bergambar dan harga.
          </p>
        </div>
      </div>
    </div>
  );
}
