"use client";

import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInput } from "@/components/forms/form-input";
import { BrandColorField } from "@/features/settings/components/brand-color-field";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

interface SettingsGeneralTabProps {
  logoUrl?: string;
}

export function SettingsGeneralTab({
  logoUrl,
}: SettingsGeneralTabProps): React.JSX.Element {
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

        <FormImageUpload<SettingsFormValues>
          name="logo"
          label="Logo Tenant"
          initialUrl={logoUrl}
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          maxSizeMB={5}
          previewClassName="h-32 bg-white"
          helperText="Format JPG, PNG, WebP, atau SVG (maks. 5 MB). Disimpan saat klik Simpan Semua Pengaturan."
        />
      </div>

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
