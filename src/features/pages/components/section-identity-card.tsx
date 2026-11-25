"use client";

import { FormInput } from "@/components/forms/form-input";
import { FormTextarea } from "@/components/forms/form-textarea";
import { Card } from "@/components/ui/card";
import { SectionTypeSelect } from "@/features/pages/components/section-type-select";
import type { SectionFormValues } from "@/features/pages/schemas/page.schemas";
import type { SectionTypeDefinition } from "@/types/cms.types";

interface SectionIdentityCardProps {
  sectionTypes: readonly SectionTypeDefinition[];
  isEdit: boolean;
  onSelectType: (nextKey: string) => void;
}

export function SectionIdentityCard({
  sectionTypes,
  isEdit,
  onSelectType,
}: SectionIdentityCardProps): React.JSX.Element {
  return (
    <Card className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold tracking-wide text-slate-800 uppercase">
          Identitas &amp; Konten Utama Section
        </h3>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Pilih tipe section terlebih dahulu agar form konfigurasi menyesuaikan
          struktur yang didukung landing page.
        </p>
      </div>

      <SectionTypeSelect
        sectionTypes={sectionTypes}
        isEdit={isEdit}
        onSelectType={onSelectType}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormInput<SectionFormValues>
          name="title"
          label="Judul Section"
          placeholder="Judul utama section"
          maxLength={200}
        />
        <FormInput<SectionFormValues>
          name="subtitle"
          label="Sub Judul / Badge"
          placeholder="Opsional"
          maxLength={255}
        />
      </div>

      <FormTextarea<SectionFormValues>
        name="body"
        label="Isi / Deskripsi Konten"
        placeholder="Teks narasi atau deskripsi section..."
        rows={5}
      />
    </Card>
  );
}
