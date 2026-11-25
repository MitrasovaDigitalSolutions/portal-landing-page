"use client";

import { Layers } from "lucide-react";
import { FormImageUpload } from "@/components/forms/form-image-upload";
import { FormInputStepper } from "@/components/forms/form-input-stepper";
import { FormSwitch } from "@/components/forms/form-switch";
import { Card } from "@/components/ui/card";
import type { SectionFormValues } from "@/features/pages/schemas/page.schemas";
import type {
  PageDetail,
  PageSection,
  SectionTypeDefinition,
} from "@/types/cms.types";

interface SectionEditorSidebarProps {
  page: PageDetail;
  section: PageSection | null;
  activeType: SectionTypeDefinition | null;
  sticky?: boolean;
}

export function SectionEditorSidebar({
  page,
  section,
  activeType,
  sticky = true,
}: SectionEditorSidebarProps): React.JSX.Element {
  return (
    <aside className={sticky ? "space-y-4 xl:sticky xl:top-20" : "space-y-4"}>
      <Card className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        <h3 className="border-b border-slate-100 pb-2 text-xs font-bold tracking-wide text-slate-800 uppercase">
          Pengaturan Tampil
        </h3>

        <FormInputStepper<SectionFormValues>
          name="order"
          label="Urutan Tampil"
          min={0}
          helperText="Urutan section lebih kecil tampil lebih atas."
        />

        <FormSwitch<SectionFormValues>
          name="is_active"
          label="Section Aktif"
          description="Nonaktifkan untuk menyembunyikan section ini dari halaman publik."
        />
      </Card>

      <Card className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        <h3 className="border-b border-slate-100 pb-2 text-xs font-bold tracking-wide text-slate-800 uppercase">
          Gambar Utama Section
        </h3>

        <FormImageUpload<SectionFormValues>
          name="image"
          initialUrl={section?.image_url ?? section?.image_path}
          maxSizeMB={10}
          helperText="Opsional. Unggah gambar utama kolom section (maks. 10MB)."
        />
      </Card>

      <Card className="space-y-2 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Layers className="size-3.5 text-primary" />
          <span>Ringkasan Section</span>
        </div>

        <dl className="space-y-1.5 text-[11px] text-slate-600">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Halaman</dt>
            <dd className="font-semibold text-slate-700">
              {page.title} (/{page.slug})
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Tipe Dipilih</dt>
            <dd className="font-semibold text-slate-700">
              {activeType ? activeType.name : "Belum dipilih"}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-400">Field Terstruktur</dt>
            <dd className="font-semibold text-slate-700 tabular-nums">
              {activeType ? `${activeType.fields.length} field` : "-"}
            </dd>
          </div>
        </dl>
      </Card>
    </aside>
  );
}
