"use client";

import { AlertTriangle, Layers } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { getFieldError } from "@/components/forms/form-utils";
import { Badge } from "@/components/ui/badge";
import { InputOption, type OptionItem } from "@/components/ui/input-option";
import { resolveSectionType } from "@/features/pages/utils/section-payload";
import type { SectionFormValues } from "@/features/pages/schemas/page.schemas";
import type { SectionTypeDefinition } from "@/types/cms.types";

interface SectionTypeSelectProps {
  sectionTypes: readonly SectionTypeDefinition[];
  isEdit: boolean;
  onSelectType: (nextKey: string) => void;
}

export function SectionTypeSelect({
  sectionTypes,
  isEdit,
  onSelectType,
}: SectionTypeSelectProps): React.JSX.Element {
  const {
    control,
    formState: { errors },
  } = useFormContext<SectionFormValues>();

  const currentKey = useWatch({ control, name: "key" });
  const matchedType = resolveSectionType(sectionTypes, currentKey);
  const isAliasMatch = Boolean(matchedType && matchedType.key !== currentKey);
  const isUnknownExisting = Boolean(isEdit && currentKey && !matchedType);

  const activeTypes = sectionTypes.filter((type) => type.is_active);
  const options: OptionItem[] = activeTypes.map((type) => ({
    value: type.key,
    label: type.name,
    description: type.description
      ? `${type.key} — ${type.description}`
      : `key: ${type.key}`,
    icon: <Layers className="size-3.5 text-primary" />,
  }));

  if (matchedType && !matchedType.is_active) {
    options.push({
      value: matchedType.key,
      label: `${matchedType.name} (Nonaktif)`,
      description: `key: ${matchedType.key}`,
      icon: <Layers className="size-3.5 text-slate-400" />,
    });
  }

  const selectValue = matchedType ? matchedType.key : "";
  const errorMsg = getFieldError(errors, "key");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label
          htmlFor="section-type-select"
          className="block text-xs font-semibold text-slate-700"
        >
          <span>Tipe Section</span>
          <span className="ml-0.5 text-rose-500">*</span>
        </label>

        {isAliasMatch ? (
          <Badge variant="info" className="rounded-md font-mono text-[10px]">
            alias: {currentKey}
          </Badge>
        ) : null}
      </div>

      <InputOption
        id="section-type-select"
        value={selectValue}
        options={options}
        placeholder="Pilih tipe section..."
        searchPlaceholder="Cari tipe section..."
        emptyText="Tipe section tidak ditemukan."
        invalid={Boolean(errorMsg)}
        onValueChange={(nextKey) => {
          if (nextKey) {
            onSelectType(nextKey);
          }
        }}
      />

      {errorMsg ? (
        <p className="text-[11px] font-medium text-rose-500">{errorMsg}</p>
      ) : null}

      {isUnknownExisting ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 text-[11px] text-amber-800">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
          <p>
            Tipe <code className="font-mono font-bold">{currentKey}</code>{" "}
            belum terdaftar di master section. Anda tetap bisa menyimpannya atau
            mengedit lewat panel Advanced (JSON) di bawah.
          </p>
        </div>
      ) : null}
    </div>
  );
}
