"use client";

import { Building2 } from "lucide-react";
import { FormInput } from "@/components/forms/form-input";
import { SmartImage } from "@/components/shared/smart-image";
import { BrandColorField } from "@/features/settings/components/brand-color-field";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";
import { resolveMediaUrl } from "@/utils/media";

interface SettingsGeneralTabProps {
  logoUrl?: string;
}

export function SettingsGeneralTab({
  logoUrl,
}: SettingsGeneralTabProps): React.JSX.Element {
  const resolvedLogo = resolveMediaUrl(logoUrl);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput<SettingsFormValues>
          name="site_title"
          label="Nama Situs / Unit Usaha"
          placeholder="KSP Mitra Sejati Persada"
        />
        <FormInput<SettingsFormValues>
          name="tagline"
          label="Tagline Perusahaan"
          placeholder="Solusi Kemitraan Terpercaya untuk Kemajuan Bersama"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <BrandColorField />

        <div className="space-y-1.5">
          <span className="block text-xs font-semibold text-slate-700">
            Logo Tenant Saat Ini
          </span>
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5">
            {resolvedLogo ? (
              <SmartImage
                src={resolvedLogo}
                alt="Logo Tenant"
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-lg border border-slate-200 bg-white object-contain p-1"
              />
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                <Building2 className="size-5" />
              </div>
            )}
            <div className="min-w-0 text-xs">
              <p className="truncate font-semibold text-slate-700">
                {logoUrl ? "Terhubung ke storage backend" : "Belum ada logo"}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {logoUrl ?? "Logo dikelola oleh aset penyimpanan backend"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <FormInput<SettingsFormValues>
        name="meta_keywords"
        label="Kata Kunci SEO (Meta Keywords)"
        placeholder="koperasi, layanan keuangan, simpan pinjam, konsultasi bisnis"
        helperText="Pisahkan setiap kata kunci dengan tanda koma."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput<SettingsFormValues>
          name="badan_hukum"
          label="Nomor Badan Hukum"
          placeholder="AHU-0003640.AH.38.TAHUN 2025"
        />
        <FormInput<SettingsFormValues>
          name="copyright"
          label="Teks Hak Cipta (Footer)"
          placeholder="© 2026 Mitra Sejati Persada. Seluruh hak cipta dilindungi."
        />
      </div>
    </div>
  );
}
