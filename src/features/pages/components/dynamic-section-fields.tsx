"use client";

import { Info } from "lucide-react";
import { SectionFieldControl } from "@/features/pages/components/section-field-control";
import type { SectionTypeDefinition } from "@/types/cms.types";

interface DynamicSectionFieldsProps {
  sectionType: SectionTypeDefinition | null;
  siteSlug: string;
}

export function DynamicSectionFields({
  sectionType,
  siteSlug,
}: DynamicSectionFieldsProps): React.JSX.Element | null {
  if (!sectionType) {
    return null;
  }

  if (sectionType.fields.length === 0) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-blue-200/80 bg-blue-50/70 px-3.5 py-3 text-xs text-blue-900">
        <Info className="mt-0.5 size-4 shrink-0 text-blue-600" />
        <p>
          Tipe <strong>{sectionType.name}</strong> tidak membutuhkan field
          payload tambahan. Silakan isi teks utama pada kolom{" "}
          <strong>Isi / Deskripsi Konten</strong> di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4">
      <div className="border-b border-slate-200/80 pb-2">
        <h4 className="text-xs font-bold tracking-wide text-slate-800 uppercase">
          Konfigurasi Konten — {sectionType.name}
        </h4>
        {sectionType.description ? (
          <p className="mt-0.5 text-[11px] text-slate-500">
            {sectionType.description}
          </p>
        ) : null}
      </div>

      <div className="space-y-3.5">
        {sectionType.fields.map((field) => (
          <SectionFieldControl
            key={field.name}
            field={field}
            fieldPrefix="payload"
            siteSlug={siteSlug}
          />
        ))}
      </div>
    </div>
  );
}
