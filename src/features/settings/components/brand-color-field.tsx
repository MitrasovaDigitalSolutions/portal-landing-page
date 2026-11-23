"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/forms/form-input";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";
import { cn } from "@/lib/utils";

const BRAND_COLOR_PRESETS = [
  { hex: "#059669", name: "Emerald" },
  { hex: "#0284c7", name: "Ocean Blue" },
  { hex: "#1e3a8a", name: "Navy" },
  { hex: "#4f46e5", name: "Indigo" },
  { hex: "#d97706", name: "Amber" },
  { hex: "#e11d48", name: "Crimson" },
];

export function BrandColorField(): React.JSX.Element {
  const { control, setValue } = useFormContext<SettingsFormValues>();
  const watchedColor = useWatch({ control, name: "brand_color" });
  const activeHex = /^#[0-9A-Fa-f]{6}$/.test(watchedColor)
    ? watchedColor
    : "#1E3A8A";

  return (
    <div className="space-y-1.5">
      <span className="block text-xs font-semibold text-slate-700">
        Warna Tema Utama (Brand Color)
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          type="color"
          aria-label="Pemilih warna tema"
          value={activeHex}
          onChange={(event) => {
            setValue("brand_color", event.target.value, { shouldDirty: true });
          }}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-white p-1"
        />
        <FormInput<SettingsFormValues>
          name="brand_color"
          placeholder="#059669"
          containerClassName="w-36"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          {BRAND_COLOR_PRESETS.map((preset) => (
            <button
              key={preset.hex}
              type="button"
              title={preset.name}
              aria-label={`Pilih warna ${preset.name}`}
              onClick={() => {
                setValue("brand_color", preset.hex, { shouldDirty: true });
              }}
              style={{ backgroundColor: preset.hex }}
              className={cn(
                "size-6 rounded-full border-2 border-white shadow-xs ring-1 transition-transform hover:scale-110",
                activeHex.toLowerCase() === preset.hex
                  ? "scale-110 ring-2 ring-slate-900"
                  : "ring-slate-200"
              )}
            />
          ))}
        </div>
      </div>
      <p className="text-[11px] text-slate-500">
        Menentukan warna aksen utama pada website publik dan panel portal tenant ini.
      </p>
    </div>
  );
}
