"use client";

import { Controller, useFormContext } from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import {
  ServiceLayoutRadioCard,
  type ServiceLayoutOptionDef,
} from "@/features/settings/components/service-layout-radio-card";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

const SERVICE_LAYOUT_OPTIONS: readonly ServiceLayoutOptionDef[] = [
  {
    value: "accordion",
    title: "Accordion Teks",
    badge: "Default",
    description:
      "Daftar teks terkelompok per tipe layanan. Cocok untuk produk keuangan atau jasa berbasis ketentuan.",
    homeBehavior: "Accordion per tipe",
    catalogBehavior: "Accordion lengkap",
  },
  {
    value: "carousel",
    title: "Carousel Produk",
    badge: "Katalog",
    description:
      "Beranda menyorot produk unggulan dalam slider horizontal dengan foto & harga mulai dari.",
    homeBehavior: "Carousel unggulan",
    catalogBehavior: "Grid semua produk",
  },
  {
    value: "grid",
    title: "Grid Produk",
    badge: "Katalog",
    description:
      "Beranda dan halaman katalog sama-sama menampilkan seluruh kartu produk bergambar dalam grid rapi.",
    homeBehavior: "Grid unggulan",
    catalogBehavior: "Grid semua produk",
  },
];

export function SettingsDisplayTab(): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<SettingsFormValues>();

  const errorMsg = getFieldError(errors, "services_layout");

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-slate-700">
          Mode Tampilan Produk & Layanan
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Pilih bagaimana produk dan layanan ditampilkan pada beranda dan halaman{" "}
          <span className="font-semibold text-slate-700">/produk</span> website
          publik tenant ini.
        </p>
      </div>

      <Controller
        control={control}
        name="services_layout"
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-label="Mode tampilan produk dan layanan"
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            {SERVICE_LAYOUT_OPTIONS.map((option) => (
              <ServiceLayoutRadioCard
                key={option.value}
                option={option}
                selected={field.value === option.value}
                onSelect={(nextVal) => {
                  field.onChange(nextVal);
                }}
              />
            ))}
          </div>
        )}
      />

      {errorMsg ? (
        <p className="text-[11px] font-medium text-rose-500">{errorMsg}</p>
      ) : null}
    </div>
  );
}
