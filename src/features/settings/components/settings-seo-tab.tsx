"use client";

import { FormInput } from "@/components/forms/form-input";
import { FormInputOption } from "@/components/forms/form-input-option";
import { FormSwitch } from "@/components/forms/form-switch";
import { FormTextarea } from "@/components/forms/form-textarea";
import type { OptionItem } from "@/components/ui/input-option";
import type { SettingsFormValues } from "@/features/settings/schemas/settings.schema";

const SCHEMA_TYPE_OPTIONS: OptionItem[] = [
  { value: "Organization", label: "Organization (Umum / Perusahaan)" },
  { value: "FinancialService", label: "FinancialService (Koperasi / Keuangan)" },
  { value: "LocalBusiness", label: "LocalBusiness (Usaha Lokal)" },
  { value: "ProfessionalService", label: "ProfessionalService (Jasa Profesional)" },
  { value: "Store", label: "Store (Toko / Ritel / Konveksi)" },
];

export function SettingsSeoTab(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput<SettingsFormValues>
          name="seo_meta_title"
          label="Judul SEO Utama (Meta Title)"
          placeholder="Mitra Sejati Persada — Koperasi Simpan Pinjam Terpercaya"
          helperText="Idealnya 50-60 karakter dan memuat nama brand utama di depan."
        />
        <FormInput<SettingsFormValues>
          name="seo_canonical_domain"
          label="Domain Resmi Situs (Canonical)"
          placeholder="https://mitrasejatipersada.co.id"
          helperText="Digunakan untuk canonical URL, sitemap.xml, robots.txt, dan OpenGraph."
        />
      </div>

      <FormTextarea<SettingsFormValues>
        name="seo_meta_description"
        label="Deskripsi SEO (Meta Description)"
        rows={3}
        placeholder="Deskripsi singkat organisasi, layanan unggulan, dan wilayah layanan..."
        helperText="Idealnya 120-160 karakter yang tampil di cuplikan hasil Google Search."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput<SettingsFormValues>
          name="meta_keywords"
          label="Kata Kunci SEO (Meta Keywords)"
          placeholder="mitra sejati persada, ksp mitra sejati, simpan pinjam"
          helperText="Pisahkan setiap kata kunci dengan tanda koma."
        />
        <FormInput<SettingsFormValues>
          name="seo_alternate_names"
          label="Nama Alternatif / Alias Brand"
          placeholder="Mitra Sejati Persada, KSP Mitra Sejati, MSP"
          helperText="Pisahkan dengan koma agar Google mengenali variasi pencarian brand."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInputOption<SettingsFormValues>
          name="seo_schema_type"
          label="Tipe Entitas Structured Data (JSON-LD)"
          placeholder="Pilih tipe schema..."
          options={SCHEMA_TYPE_OPTIONS}
          searchable={false}
          helperText="Menentukan jenis skema Schema.org pada hasil pencarian Google."
        />
        <FormInput<SettingsFormValues>
          name="seo_google_verification"
          label="Kode Verifikasi Google Search Console"
          placeholder="Tempel nilai content dari meta google-site-verification"
          helperText="Opsional. Hanya isi kode token verifikasi (bukan seluruh tag HTML)."
        />
      </div>

      <FormSwitch<SettingsFormValues>
        name="seo_robots_index"
        label="Izinkan Indeksasi Google Search"
        description="Aktifkan agar mesin pencari dapat mengindeks situs, sitemap.xml, dan halaman publik tenant ini."
      />
    </div>
  );
}
